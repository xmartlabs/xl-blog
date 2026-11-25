import fs from 'node:fs';
import path from 'node:path';

import type { PageMeta } from './capture';
import { CHECKS, type CheckName, type Comparison } from './compare';
import { PARITY_DIR, type ViewportName } from './settings';

export interface KnownDifference {
  /** Exact path (`/blog/foo/`) … */
  path?: string;
  /** … or a regular expression matched against the path. */
  pattern?: string;
  /** Limit to some viewports; all when omitted. */
  viewports?: ViewportName[];
  /**
   * Checks this difference explains; `["*"]` for all of them. `meta:<key>` (e.g. `meta:canonical`)
   * accepts a difference in that one tag only.
   */
  checks?: (CheckName | `meta:${string}` | '*')[];
  /**
   * Site-wide, intended fixes: the checks they explain count as equal (the page can still be
   * `pass`) instead of making the page `known`.
   */
  normalize?: boolean;
  /** Rewrites applied to the live page's meta values before comparing: `{ key: [regex, replacement] }`. */
  liveMetaRewrite?: Record<string, [string, string]>;
  reason: string;
}

const known: KnownDifference[] = JSON.parse(
  fs.readFileSync(path.join(PARITY_DIR, 'known-differences.json'), 'utf8')
).differences;

/** The known differences that apply to this page. */
export function knownFor(
  urlPath: string,
  viewport: ViewportName
): KnownDifference[] {
  return known.filter(
    (k) =>
      (k.path
        ? k.path === urlPath
        : k.pattern
          ? new RegExp(k.pattern).test(urlPath)
          : false) &&
      (!k.viewports || k.viewports.includes(viewport))
  );
}

/** Applies the entries' `liveMetaRewrite`s to the live meta; returns the entries that changed something. */
export function rewriteLiveMeta(
  meta: PageMeta,
  entries: KnownDifference[]
): KnownDifference[] {
  const used: KnownDifference[] = [];
  for (const e of entries) {
    for (const [key, [re, replacement]] of Object.entries(
      e.liveMetaRewrite ?? {}
    )) {
      const k = key as keyof PageMeta;
      const next = meta[k].replace(new RegExp(re), replacement);
      if (next !== meta[k]) {
        meta[k] = next;
        if (!used.includes(e)) used.push(e);
      }
    }
  }
  return used;
}

function accepts(
  e: KnownDifference,
  check: CheckName,
  metaKeys: string[]
): boolean {
  const checks = e.checks ?? [];
  if (checks.includes('*') || checks.includes(check)) return true;
  return check === 'meta' && metaKeys.some((k) => checks.includes(`meta:${k}`));
}

/** Whether these entries, together, explain a failing check (meta: every differing tag). */
function explained(
  check: CheckName,
  entries: KnownDifference[],
  metaKeys: string[]
): boolean {
  const checks = new Set(entries.flatMap((e) => e.checks ?? []));
  if (checks.has('*') || checks.has(check)) return true;
  return check === 'meta' && metaKeys.every((k) => checks.has(`meta:${k}`));
}

export interface Classification {
  result: 'pass' | 'known' | 'fail';
  /** Failing checks not explained by a `normalize` entry. */
  failing: CheckName[];
  /** Failing checks no known difference explains. */
  unexpected: CheckName[];
  /** Reasons of the known differences that explain a failing check. */
  known: string[];
  /** Reasons of the `normalize` entries that applied. */
  normalized: string[];
  /** Known differences for this exact page that no longer show up. */
  stale: string[];
}

export function classify(
  cmp: Comparison,
  entries: KnownDifference[],
  rewritten: KnownDifference[]
): Classification {
  const metaKeys = cmp.metaDiffs.map((d) => d.key);
  const raw = CHECKS.filter((c) => !cmp.checks[c].ok);
  const normalizers = entries.filter((e) => e.normalize);
  const others = entries.filter((e) => !e.normalize);
  const failing = raw.filter((c) => !explained(c, normalizers, metaKeys));
  const unexpected = failing.filter((c) => !explained(c, entries, metaKeys));
  const usedNormalizers = normalizers.filter(
    (e) => rewritten.includes(e) || raw.some((c) => accepts(e, c, metaKeys))
  );
  return {
    result: !failing.length ? 'pass' : unexpected.length ? 'fail' : 'known',
    failing,
    unexpected,
    known: others
      .filter((e) => failing.some((c) => accepts(e, c, metaKeys)))
      .map((e) => e.reason),
    normalized: usedNormalizers.map((e) => e.reason),
    stale: others
      .filter((e) => e.path && !raw.some((c) => accepts(e, c, metaKeys)))
      .map((e) => e.reason),
  };
}
