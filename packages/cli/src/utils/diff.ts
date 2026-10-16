import pc from "picocolors";

export interface DiffOp {
  type: "equal" | "delete" | "insert";
  line: string;
}

// Beyond this many edits Myers' trace gets expensive; such files are shown as fully replaced.
const MAX_EDIT_DISTANCE = 2000;

function splitLines(text: string): string[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/** Line diff of `before` -> `after` (Myers' O(ND) algorithm), as a list of kept, deleted and inserted lines. */
export function diffLines(before: string, after: string): DiffOp[] {
  const a = splitLines(before);
  const b = splitLines(after);
  const n = a.length;
  const m = b.length;
  const max = Math.min(n + m, MAX_EDIT_DISTANCE);
  const offset = max + 1;
  const v = new Int32Array(2 * max + 3);
  const trace: Int32Array[] = [];

  for (let d = 0; d <= max; d++) {
    trace.push(v.slice());
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1]) ? v[offset + k + 1] : v[offset + k - 1] + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) return backtrack(a, b, trace, offset);
    }
  }

  return [...a.map((line) => ({ type: "delete" as const, line })), ...b.map((line) => ({ type: "insert" as const, line }))];
}

function backtrack(a: string[], b: string[], trace: Int32Array[], offset: number): DiffOp[] {
  const ops: DiffOp[] = [];
  let x = a.length;
  let y = b.length;

  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;
    const prevK = k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1]) ? k + 1 : k - 1;
    const prevX = v[offset + prevK];
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      ops.push({ type: "equal", line: a[x - 1] });
      x--;
      y--;
    }
    if (d > 0) {
      if (x === prevX) {
        ops.push({ type: "insert", line: b[y - 1] });
      } else {
        ops.push({ type: "delete", line: a[x - 1] });
      }
    }
    x = prevX;
    y = prevY;
  }

  return ops.reverse();
}

export interface DiffSummary {
  added: number;
  removed: number;
}

export function summarizeDiff(ops: DiffOp[]): DiffSummary {
  return {
    added: ops.filter((op) => op.type === "insert").length,
    removed: ops.filter((op) => op.type === "delete").length,
  };
}

/**
 * Formats a diff as unified-diff hunks with `context` unchanged lines around each change, colored
 * red/green, under a `--- before` / `+++ after` header. Returns an empty string when nothing changed.
 */
export function formatUnifiedDiff(
  ops: DiffOp[],
  labels: { before: string; after: string },
  options: { context?: number; maxLines?: number } = {},
): string {
  const context = options.context ?? 3;
  const maxLines = options.maxLines ?? 400;
  const changed = ops.flatMap((op, index) => (op.type === "equal" ? [] : [index]));
  if (changed.length === 0) return "";

  // Group change indices into hunks whose context windows overlap.
  const hunks: Array<[number, number]> = [];
  for (const index of changed) {
    const last = hunks.at(-1);
    if (last && index - last[1] <= context * 2 + 1) {
      last[1] = index;
    } else {
      hunks.push([index, index]);
    }
  }

  // Line numbers (1-based) in the old and new file at the start of each op.
  const oldAt: number[] = [];
  const newAt: number[] = [];
  let oldLine = 1;
  let newLine = 1;
  for (const op of ops) {
    oldAt.push(oldLine);
    newAt.push(newLine);
    if (op.type !== "insert") oldLine++;
    if (op.type !== "delete") newLine++;
  }

  const out: string[] = [pc.red(`--- ${labels.before}`), pc.green(`+++ ${labels.after}`)];
  for (const [first, last] of hunks) {
    const start = Math.max(0, first - context);
    const end = Math.min(ops.length - 1, last + context);
    const slice = ops.slice(start, end + 1);
    const oldCount = slice.filter((op) => op.type !== "insert").length;
    const newCount = slice.filter((op) => op.type !== "delete").length;
    out.push(pc.cyan(`@@ -${String(oldAt[start])},${String(oldCount)} +${String(newAt[start])},${String(newCount)} @@`));
    for (const op of slice) {
      if (op.type === "equal") out.push(pc.dim(`  ${op.line}`));
      else if (op.type === "delete") out.push(pc.red(`- ${op.line}`));
      else out.push(pc.green(`+ ${op.line}`));
    }
  }

  if (out.length > maxLines) {
    const hidden = out.length - maxLines;
    return [...out.slice(0, maxLines), pc.dim(`... ${String(hidden)} more diff line${hidden === 1 ? "" : "s"} not shown`)].join("\n");
  }
  return out.join("\n");
}
