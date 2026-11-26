import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';

import { type Capture, capturePage } from './lib/capture';
import { compareCaptures } from './lib/compare';
import { classify, knownFor, rewriteLiveMeta } from './lib/known';
import {
  BASE_LIVE,
  BASE_NEW,
  CACHE_DIR,
  CAPTURE_VERSION,
  LIVE_DELAY_MS,
  pathKey,
  REFRESH,
  REPORT_DIR,
  RESULTS_DIR,
  type ViewportName,
} from './lib/settings';
import type { PageResult } from './lib/report';
import { selectedPaths } from './lib/urls';

test.describe.configure({ mode: 'parallel' });

for (const urlPath of selectedPaths()) {
  test(urlPath, async ({ browser }, testInfo) => {
    const viewport = testInfo.project.name as ViewportName;
    const key = pathKey(urlPath);
    const imgDir = path.join(REPORT_DIR, 'img', viewport);
    fs.mkdirSync(imgDir, { recursive: true });

    const live = await liveCapture(browser, urlPath, viewport, key);
    const neu = await capturePage(
      browser,
      BASE_NEW + urlPath,
      viewport,
      path.join(CACHE_DIR, 'new', viewport, `${key}.png`)
    );

    const entries = knownFor(urlPath, viewport);
    const result: PageResult = {
      path: urlPath,
      viewport,
      result: 'pass',
      live: summary(live),
      new: summary(neu),
      failing: [],
      unexpected: [],
      known: [],
      normalized: [],
      stale: [],
      images: {},
    };

    if (live.error || neu.error) {
      result.result = 'error';
      result.error = [
        live.error && `live: ${live.error}`,
        neu.error && `new: ${neu.error}`,
      ]
        .filter(Boolean)
        .join('; ');
    } else {
      const diffPath = path.join(imgDir, `${key}-diff.png`);
      const rewritten = rewriteLiveMeta(live.meta, entries);
      const cmp = compareCaptures(live, neu, diffPath);
      result.comparison = cmp;
      Object.assign(result, classify(cmp, entries, rewritten));
      if (cmp.checks.pixels.ok) {
        fs.rmSync(diffPath, { force: true });
      } else {
        // Keep the screenshots for the report (clone: free on APFS, a copy elsewhere).
        const livePng = path.join(imgDir, `${key}-live.png`);
        const newPng = path.join(imgDir, `${key}-new.png`);
        fs.copyFileSync(
          live.screenshot!,
          livePng,
          fs.constants.COPYFILE_FICLONE
        );
        fs.copyFileSync(neu.screenshot!, newPng, fs.constants.COPYFILE_FICLONE);
        result.images = {
          live: path.relative(REPORT_DIR, livePng),
          new: path.relative(REPORT_DIR, newPng),
          diff: fs.existsSync(diffPath)
            ? path.relative(REPORT_DIR, diffPath)
            : undefined,
        };
      }
    }

    const out = path.join(RESULTS_DIR, viewport, `${key}.json`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(result, null, 2));

    testInfo.annotations.push({ type: 'result', description: result.result });
    if (result.known.length) {
      testInfo.annotations.push({
        type: 'known',
        description: result.known.join(' / '),
      });
    }
    expect(result.error ?? '', `capture failed`).toBe('');
    expect(
      result.unexpected.map(
        (c) => `${c}: ${result.comparison!.checks[c].detail ?? ''}`
      ),
      `unexpected differences on ${urlPath} (${viewport})`
    ).toEqual([]);
  });
}

/** The live page's capture from `.cache/`, or captured now (politely) and cached. */
async function liveCapture(
  browser: import('@playwright/test').Browser,
  urlPath: string,
  viewport: ViewportName,
  key: string
): Promise<Capture> {
  const dir = path.join(CACHE_DIR, 'live', viewport);
  const json = path.join(dir, `${key}.json`);
  const png = path.join(dir, `${key}.png`);
  if (!REFRESH && fs.existsSync(json) && fs.existsSync(png)) {
    const cached: Capture = JSON.parse(fs.readFileSync(json, 'utf8'));
    if (cached.version === CAPTURE_VERSION)
      return { ...cached, screenshot: png };
  }
  await new Promise((r) => setTimeout(r, LIVE_DELAY_MS));
  const capture = await capturePage(
    browser,
    BASE_LIVE + urlPath,
    viewport,
    png
  );
  if (!capture.error && capture.status !== null && capture.status < 500) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(json, JSON.stringify(capture));
  }
  return capture;
}

function summary(c: Capture) {
  return { url: c.url, status: c.status, height: c.height, width: c.width };
}
