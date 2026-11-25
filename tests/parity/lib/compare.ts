import fs from 'node:fs';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import type { Block, Capture, PageMeta } from './capture';
import {
  HEIGHT_TOLERANCE,
  PIXEL_NOISE,
  PIXEL_TOLERANCE,
  PIXELMATCH_THRESHOLD,
} from './settings';

export const CHECKS = [
  'status',
  'height',
  'width',
  'meta',
  'text',
  'blocks',
  'pixels',
] as const;
export type CheckName = (typeof CHECKS)[number];

export interface CheckResult {
  ok: boolean;
  /** Short human-readable description of the difference. */
  detail?: string;
}

export interface Comparison {
  checks: Record<CheckName, CheckResult>;
  heightDelta: number;
  widthDelta: number;
  pixelDiffPct: number | null;
  pixelDiffCount: number | null;
  metaDiffs: { key: string; live: string; new: string }[];
  textDiff: { live: string; new: string } | null;
  blocksDiff: { index: number; live: string; new: string } | null;
}

export function compareCaptures(
  live: Capture,
  neu: Capture,
  diffPath: string
): Comparison {
  const heightDelta = neu.height - live.height;
  const widthDelta = neu.width - live.width;

  const metaDiffs = (Object.keys(live.meta) as (keyof PageMeta)[])
    .filter((key) => live.meta[key] !== neu.meta[key])
    .map((key) => ({ key, live: live.meta[key], new: neu.meta[key] }));

  // Ignore whitespace (incl. zero-width): innerText spacing depends on markup (table cells,
  // line breaks) without a visible difference; real spacing changes show up in the pixels.
  const squash = (s: string) =>
    s.replace(/[\s\u200b-\u200d\u2060\ufeff]+/g, '');
  const textDiff =
    squash(live.text) === squash(neu.text)
      ? null
      : diffText(live.text, neu.text);
  const blocksDiff = diffBlocks(live.blocks, neu.blocks);

  let pixelDiffPct: number | null = null;
  let pixelDiffCount: number | null = null;
  if (live.screenshot && neu.screenshot) {
    const d = diffImages(live.screenshot, neu.screenshot, diffPath);
    pixelDiffPct = d.pct;
    pixelDiffCount = d.count;
  }

  return {
    checks: {
      status: {
        ok: live.status === neu.status,
        detail:
          live.status === neu.status
            ? undefined
            : `${live.status} → ${neu.status}`,
      },
      height: {
        ok: Math.abs(heightDelta) <= HEIGHT_TOLERANCE,
        detail: heightDelta
          ? `${live.height} → ${neu.height} (${signed(heightDelta)}px)`
          : undefined,
      },
      width: {
        ok: widthDelta === 0,
        detail: widthDelta
          ? `${live.width} → ${neu.width} (${signed(widthDelta)}px)`
          : undefined,
      },
      meta: {
        ok: metaDiffs.length === 0,
        detail: metaDiffs.length
          ? metaDiffs.map((d) => d.key).join(', ')
          : undefined,
      },
      text: {
        ok: !textDiff,
        detail: textDiff ? 'visible text differs' : undefined,
      },
      blocks: {
        ok: !blocksDiff,
        detail: blocksDiff
          ? `#${blocksDiff.index}: ${blocksDiff.live} → ${blocksDiff.new}`
          : undefined,
      },
      pixels: {
        ok:
          pixelDiffPct !== null &&
          (pixelDiffPct <= PIXEL_TOLERANCE ||
            (pixelDiffCount ?? 0) <= PIXEL_NOISE),
        detail:
          pixelDiffPct === null
            ? 'no screenshot'
            : pixelDiffCount
              ? `${pixelDiffPct.toFixed(3)}% (${pixelDiffCount} px)`
              : undefined,
      },
    },
    heightDelta,
    widthDelta,
    pixelDiffPct,
    pixelDiffCount,
    metaDiffs,
    textDiff,
    blocksDiff,
  };
}

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

/** The differing middle of two strings, with a little context on each side. */
function diffText(a: string, b: string): { live: string; new: string } {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }
  const from = Math.max(0, start - 80);
  const clip = (s: string, end: number) => {
    const middle = s.slice(start, end);
    const shown =
      middle.length > 400
        ? `${middle.slice(0, 400)}… [+${middle.length - 400} chars]`
        : middle;
    return `${from > 0 ? '…' : ''}${s.slice(from, start)}⟦${shown}⟧${s.slice(end, end + 80)}${end + 80 < s.length ? '…' : ''}`;
  };
  return { live: clip(a, endA), new: clip(b, endB) };
}

function diffBlocks(
  live: Block[] | null,
  neu: Block[] | null
): { index: number; live: string; new: string } | null {
  if (!live && !neu) return null;
  const fmt = (b?: Block) => (b ? `${b.tag}:${b.h}` : '∅');
  if (!live || !neu)
    return {
      index: 0,
      live: live ? `${live.length} blocks` : 'no .bodyPostContainer',
      new: neu ? `${neu.length} blocks` : 'no .bodyPostContainer',
    };
  const n = Math.max(live.length, neu.length);
  for (let i = 0; i < n; i++) {
    const a = live[i];
    const b = neu[i];
    if (!a || !b || a.tag !== b.tag || Math.abs(a.h - b.h) > 1) {
      return { index: i, live: fmt(a), new: fmt(b) };
    }
  }
  return null;
}

/**
 * pixelmatch both full-page screenshots (padded to the same size with white) and returns the
 * share of differing pixels in percent. Writes the diff PNG only when something differs.
 */
function diffImages(
  livePath: string,
  newPath: string,
  diffPath: string
): { pct: number; count: number } {
  let a: PNG = PNG.sync.read(fs.readFileSync(livePath));
  let b: PNG = PNG.sync.read(fs.readFileSync(newPath));
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  a = pad(a, width, height);
  b = pad(b, width, height);
  const diff = new PNG({ width, height });
  const count = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: PIXELMATCH_THRESHOLD,
    alpha: 0.2,
  });
  if (count > 0) fs.writeFileSync(diffPath, PNG.sync.write(diff));
  else fs.rmSync(diffPath, { force: true });
  return { pct: (count / (width * height)) * 100, count };
}

function pad(img: PNG, width: number, height: number): PNG {
  if (img.width === width && img.height === height) return img;
  const out = new PNG({ width, height, fill: true });
  out.data.fill(255);
  PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
}
