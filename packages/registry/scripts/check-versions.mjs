// Plain-JS mirror of packages/cli/src/utils/registry-versions.ts (`kosmesis registry build` and the
// CLI's `outdated`/`update` use that one), kept separate because this script runs with plain
// `node` and no build step. packages/cli/src/__tests__/registry-versions.test.ts runs both against
// the real registry and shared fixtures and fails if they disagree, so change them together.
import { createHash } from "node:crypto";

const SEMVER_RE =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export function isValidVersion(value) {
  return typeof value === "string" && SEMVER_RE.test(value);
}

function comparePrerelease(a, b) {
  if (a === b) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  const left = a.split(".");
  const right = b.split(".");
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const x = left[i];
    const y = right[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const xNumeric = /^\d+$/.test(x);
    const yNumeric = /^\d+$/.test(y);
    if (xNumeric && yNumeric) {
      const diff = Number(x) - Number(y);
      if (diff !== 0) return Math.sign(diff);
    } else if (xNumeric !== yNumeric) {
      return xNumeric ? -1 : 1;
    } else if (x !== y) {
      return x < y ? -1 : 1;
    }
  }
  return 0;
}

export function compareVersions(a, b) {
  const left = SEMVER_RE.exec(a);
  const right = SEMVER_RE.exec(b);
  if (!left || !right) throw new Error(`Cannot compare "${a}" with "${b}": not a semver version.`);
  for (let i = 1; i <= 3; i++) {
    const diff = Number(left[i]) - Number(right[i]);
    if (diff !== 0) return Math.sign(diff);
  }
  return comparePrerelease(left[4], right[4]);
}

export function hashContent(content) {
  return `sha256-${createHash("sha256").update(content.replace(/\r\n/g, "\n")).digest("hex")}`;
}

function fileTarget(file) {
  return file.target ?? file.path.split("/").pop() ?? file.path;
}

export function itemContentHash(item, contents) {
  const sorted = (values) => [...(values ?? [])].sort();
  const canonical = JSON.stringify({
    dependencies: sorted(item.dependencies),
    devDependencies: sorted(item.devDependencies),
    registryDependencies: sorted(item.registryDependencies),
    files: item.files.map((file, index) => [fileTarget(file), hashContent(contents[index] ?? "")]),
  });
  return `sha256-${createHash("sha256").update(canonical).digest("hex")}`;
}

export function checkVersions(items, contents, previous, options) {
  const problems = [];
  const warnings = [];
  const locked = {};

  items.forEach((item, index) => {
    if (item.version === undefined) {
      const message = `"${item.name}" has no "version" in ${options.label}.`;
      if (options.requireVersion) {
        problems.push(`${message} Add one, e.g. "version": "1.0.0".`);
      } else {
        warnings.push(`${message} It is served unversioned, so projects that install it can't tell when it changes.`);
      }
      return;
    }
    if (!isValidVersion(item.version)) {
      problems.push(`"${item.name}" has version "${String(item.version)}" in ${options.label}, which isn't valid semver (e.g. "1.0.0").`);
      return;
    }

    const hash = itemContentHash(item, contents[index] ?? []);
    const before = previous?.[item.name];
    if (before) {
      const order = compareVersions(item.version, before.version);
      if (order < 0) {
        problems.push(`"${item.name}" went from version ${before.version} back to ${item.version}. Versions may only go up.`);
      } else if (order === 0 && hash !== before.hash) {
        problems.push(
          `"${item.name}" changed (its files or dependencies) but is still version ${item.version}. Bump its "version" so installed copies can see the update.`,
        );
      }
    }
    locked[item.name] = { version: item.version, hash };
  });

  return { problems, warnings, locked };
}
