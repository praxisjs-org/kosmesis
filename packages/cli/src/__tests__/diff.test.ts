import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("picocolors", () => ({
  default: new Proxy({} as Record<string, (input: unknown) => string>, {
    get: () => (input: unknown) => String(input),
  }),
}));

const { diffLines, formatUnifiedDiff, summarizeDiff } = await import("../utils/diff");
const { isInteractive } = await import("../utils/interactive");

function apply(ops: ReturnType<typeof diffLines>): { before: string[]; after: string[] } {
  return {
    before: ops.filter((op) => op.type !== "insert").map((op) => op.line),
    after: ops.filter((op) => op.type !== "delete").map((op) => op.line),
  };
}

describe("diffLines", () => {
  it("produces a minimal edit script that reproduces both sides", () => {
    const before = "a\nb\nc\nd\ne\n";
    const after = "a\nc\nd\nX\ne\nf\n";
    const ops = diffLines(before, after);
    expect(apply(ops)).toEqual({ before: ["a", "b", "c", "d", "e"], after: ["a", "c", "d", "X", "e", "f"] });
    expect(summarizeDiff(ops)).toEqual({ added: 2, removed: 1 });
  });

  it("handles empty sides and CRLF input", () => {
    expect(diffLines("", "")).toEqual([]);
    expect(diffLines("", "a\n")).toEqual([{ type: "insert", line: "a" }]);
    expect(diffLines("a\r\nb\r\n", "a\nb\n").every((op) => op.type === "equal")).toBe(true);
  });

  it("falls back to replacing everything for very different large files", () => {
    const before = Array.from({ length: 1500 }, (_, i) => `old ${String(i)}`).join("\n");
    const after = Array.from({ length: 1500 }, (_, i) => `new ${String(i)}`).join("\n");
    const ops = diffLines(before, after);
    expect(summarizeDiff(ops)).toEqual({ added: 1500, removed: 1500 });
  });
});

describe("formatUnifiedDiff", () => {
  const labels = { before: "button.tsx (yours)", after: "button.tsx (1.1.0)" };

  it("prints hunks with context and line numbers", () => {
    const before = Array.from({ length: 20 }, (_, i) => `line ${String(i + 1)}`).join("\n");
    const after = before.replace("line 2\n", "line two\n").replace("line 18\n", "");
    const out = formatUnifiedDiff(diffLines(before, after), labels).split("\n");

    expect(out.slice(0, 2)).toEqual(["--- button.tsx (yours)", "+++ button.tsx (1.1.0)"]);
    expect(out).toContain("@@ -1,5 +1,5 @@");
    expect(out).toContain("- line 2");
    expect(out).toContain("+ line two");
    expect(out).toContain("@@ -15,6 +15,5 @@");
    expect(out).toContain("- line 18");
    expect(out).not.toContain("  line 10");
  });

  it("returns nothing for identical input and truncates long diffs", () => {
    expect(formatUnifiedDiff(diffLines("a\n", "a\n"), labels)).toBe("");
    const long = formatUnifiedDiff(diffLines("", Array.from({ length: 50 }, (_, i) => String(i)).join("\n")), labels, { maxLines: 10 });
    expect(long.split("\n")).toHaveLength(11);
    expect(long).toContain("more diff lines not shown");
  });
});

describe("isInteractive", () => {
  const originalCI = process.env.CI;
  const stdin = Object.getOwnPropertyDescriptor(process.stdin, "isTTY");
  const stdout = Object.getOwnPropertyDescriptor(process.stdout, "isTTY");

  function setTTY(value: boolean | undefined): void {
    Object.defineProperty(process.stdin, "isTTY", { value, configurable: true });
    Object.defineProperty(process.stdout, "isTTY", { value, configurable: true });
  }

  afterEach(() => {
    if (originalCI === undefined) delete process.env.CI;
    else process.env.CI = originalCI;
    for (const [stream, descriptor] of [[process.stdin, stdin], [process.stdout, stdout]] as const) {
      if (descriptor) Object.defineProperty(stream, "isTTY", descriptor);
      else delete (stream as { isTTY?: boolean }).isTTY;
    }
  });

  it("needs a terminal on both ends and no CI", () => {
    setTTY(true);
    delete process.env.CI;
    expect(isInteractive()).toBe(true);

    for (const ci of ["false", "0", ""]) {
      process.env.CI = ci;
      expect(isInteractive()).toBe(true);
    }
    process.env.CI = "true";
    expect(isInteractive()).toBe(false);

    delete process.env.CI;
    setTTY(undefined);
    expect(isInteractive()).toBe(false);
  });
});
