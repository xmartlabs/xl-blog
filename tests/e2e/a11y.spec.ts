import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { CACHE_DIR, SEED } from './lib/env';

/**
 * Accessibility scan (axe-core) of the main page types. The public markup must stay identical
 * to the old site for now, so the legacy design's existing issues are recorded in a committed
 * baseline (a11y-baseline.json: per page, each failing rule with its impact and node count)
 * and the test only fails on regressions:
 * - a rule that isn't in the page's baseline, or
 * - more failing nodes than the baseline for a serious or critical rule.
 * Fixing an issue never fails the test; refresh the baseline then to lock the improvement in:
 *   A11Y_UPDATE_BASELINE=1 npm run test:e2e -- a11y.spec.ts
 * Current findings and suggested fixes: A11Y-FINDINGS.md.
 */

const BASELINE_FILE = path.join(import.meta.dirname, 'a11y-baseline.json');
/** Full details (elements, failure summaries) of the last run, for fixing (git-ignored). */
const REPORT_FILE = path.join(CACHE_DIR, 'a11y-report.json');
const UPDATE = process.env.A11Y_UPDATE_BASELINE === '1';
const TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
  'best-practice',
];

const PAGES = {
  home: '/',
  category: `/categories/${SEED.categories[0].slug}/`,
  post: `/blog/${SEED.legacyPosts[1].slug}/`,
  notFound: '/blog/does-not-exist/',
  adminLogin: '/admin/login/',
} as const;
type PageName = keyof typeof PAGES;

type RuleEntry = { impact: string; nodes: number; help: string };
type Baseline = Record<
  string,
  { url: string; rules: Record<string, RuleEntry> }
>;

const readBaseline = (): Baseline =>
  existsSync(BASELINE_FILE)
    ? (JSON.parse(readFileSync(BASELINE_FILE, 'utf8')) as Baseline)
    : {};

const collected: Baseline = {};
const report: Record<string, unknown> = {};

test.describe.configure({ mode: 'serial' });

for (const [name, url] of Object.entries(PAGES) as [PageName, string][]) {
  test(`a11y: ${name} (${url}) has no new violations`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState('load');
    const results = await new AxeBuilder({ page })
      .withTags(TAGS)
      // Third-party embeds are out of our hands.
      .exclude('iframe[src^="https://"]')
      .analyze();

    const rules: Record<string, RuleEntry> = {};
    for (const v of results.violations) {
      rules[v.id] = {
        impact: v.impact ?? 'unknown',
        nodes: v.nodes.length,
        help: v.help,
      };
    }
    collected[name] = { url, rules };
    report[name] = {
      url,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => ({
          target: n.target.join(' '),
          html: n.html.slice(0, 300),
          summary: n.failureSummary,
        })),
      })),
    };
    if (UPDATE) return;

    const baseline = readBaseline()[name]?.rules ?? {};
    const regressions: string[] = [];
    for (const [id, entry] of Object.entries(rules)) {
      const known = baseline[id];
      if (!known) {
        regressions.push(
          `new rule ${id} (${entry.impact}, ${entry.nodes} nodes): ${entry.help}`
        );
      } else if (
        ['serious', 'critical'].includes(entry.impact) &&
        entry.nodes > known.nodes
      ) {
        regressions.push(
          `${id} (${entry.impact}): ${entry.nodes} nodes, baseline ${known.nodes}`
        );
      }
    }
    expect(regressions, `accessibility regressions on ${url}`).toEqual([]);
  });
}

test.afterAll(() => {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`);
  if (!UPDATE) return;
  const sorted: Baseline = {};
  for (const name of Object.keys(PAGES)) {
    const entry = collected[name];
    if (!entry) continue;
    sorted[name] = {
      url: entry.url,
      rules: Object.fromEntries(
        Object.entries(entry.rules).sort(([a], [b]) => a.localeCompare(b))
      ),
    };
  }
  writeFileSync(BASELINE_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
});
