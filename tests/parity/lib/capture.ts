import fs from 'node:fs';
import path from 'node:path';

import type { Browser, Page } from '@playwright/test';

import { CAPTURE_VERSION, type ViewportName, VIEWPORTS } from './settings';

export interface PageMeta {
  title: string;
  canonical: string;
  description: string;
  'og:title': string;
  'og:description': string;
  'og:image': string;
  'og:url': string;
}

export interface Block {
  tag: string;
  h: number;
}

export interface Capture {
  version: number;
  url: string;
  capturedAt: string;
  status: number | null;
  height: number;
  width: number;
  meta: PageMeta;
  text: string;
  blocks: Block[] | null;
  screenshot: string | null;
  error?: string;
}

/** Analytics and ad hosts: blocked on both sites so they neither add noise nor count visits. */
const BLOCKED = new RegExp(
  [
    'googletagmanager\\.com',
    'google-analytics\\.com',
    'analytics\\.google\\.com',
    'doubleclick\\.net',
    'googleadservices\\.com',
    '//www\\.google\\.[a-z.]+/(ads|pagead)',
    'facebook\\.(net|com)/(tr|signals)',
    'connect\\.facebook\\.net',
    'hotjar\\.(com|io)',
    'clarity\\.ms',
    'hs-(scripts|analytics|banner)\\.com',
    'snap\\.licdn\\.com',
    'px\\.ads\\.linkedin\\.com',
  ].join('|')
);

/** Freezes the header marquee, the pink circle and any transition on both sites. */
const FREEZE_CSS = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}`;
/** Third-party embeds change over time; hide them (keeping their box) before the screenshot. */
const HIDE_EMBEDS_CSS = `iframe,video,.instagram-media,.twitter-tweet,blockquote[class*="instagram"],blockquote[class*="twitter"]{visibility:hidden!important}`;

export async function capturePage(
  browser: Browser,
  url: string,
  viewport: ViewportName,
  screenshotPath: string
): Promise<Capture> {
  const context = await browser.newContext({
    viewport: VIEWPORTS[viewport],
    deviceScaleFactor: 1,
    serviceWorkers: 'block',
    locale: 'en-US',
    timezoneId: 'America/Montevideo',
  });
  await context.route(BLOCKED, (route) => route.abort());
  const page = await context.newPage();
  const base: Omit<
    Capture,
    'status' | 'height' | 'width' | 'meta' | 'text' | 'blocks'
  > = {
    version: CAPTURE_VERSION,
    url,
    capturedAt: new Date().toISOString(),
    screenshot: null,
  };
  try {
    // Not `load`: a few live pages reference a relative image (`images/generic.jpg`) whose
    // request never finishes, so `load` would never fire.
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 90_000,
    });
    const status = response?.status() ?? null;
    await page
      .waitForLoadState('load', { timeout: 30_000 })
      .catch(() => undefined);
    await page.addStyleTag({ content: FREEZE_CSS });
    await settle(page);
    const data = await page.evaluate(collect);
    await page.addStyleTag({ content: HIDE_EMBEDS_CSS });
    // Animated GIFs show a different frame on every load: hide them too (keeping their box).
    await page.evaluate(() => {
      for (const img of document.images) {
        if (/\.gif($|[?#])/i.test(img.currentSrc || img.src))
          img.style.visibility = 'hidden';
      }
    });
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    // Clip to the viewport width: the header marquee overflows the page horizontally on both
    // sites, and that blank overflow would only dilute the pixel diff (the width check covers it).
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      clip: {
        x: 0,
        y: 0,
        width: VIEWPORTS[viewport].width,
        height: data.height,
      },
      animations: 'disabled',
      caret: 'hide',
      timeout: 120_000,
    });
    return { ...base, status, ...data, screenshot: screenshotPath };
  } catch (error) {
    return {
      ...base,
      status: null,
      height: 0,
      width: 0,
      meta: emptyMeta(),
      text: '',
      blocks: null,
      error: String((error as Error)?.message ?? error).split('\n')[0],
    };
  } finally {
    await context.close();
  }
}

/** Loads lazy content (scrolls through the page), then waits for fonts, images and the network. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      (img as HTMLImageElement).loading = 'eager';
    });
    const step = Math.max(200, window.innerHeight);
    for (
      let y = 0, i = 0;
      y < document.documentElement.scrollHeight && i < 400;
      y += step, i++
    ) {
      window.scrollTo(0, y);
      await sleep(60);
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(200);
    window.scrollTo(0, 0);
  });
  await page
    .waitForLoadState('networkidle', { timeout: 20_000 })
    .catch(() => undefined);
  await page.evaluate(async () => {
    await document.fonts.ready;
    const pending = [...document.images].filter((img) => !img.complete);
    await Promise.race([
      Promise.all(
        pending.map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            })
        )
      ),
      new Promise((r) => setTimeout(r, 15_000)),
    ]);
    // Decode so the screenshot doesn't catch half-painted images (bounded: a request that never
    // finishes would never decode).
    await Promise.race([
      Promise.all(
        [...document.images].map((img) => img.decode().catch(() => undefined))
      ),
      new Promise((r) => setTimeout(r, 5_000)),
    ]);
  });
  await page.waitForTimeout(400);
}

/** Runs in the page. */
function collect() {
  const norm = (s: string | null | undefined) =>
    (s ?? '').replace(/\s+/g, ' ').trim();
  const all = (selector: string, attr: string) =>
    [...document.querySelectorAll(selector)]
      .map((el) => norm(el.getAttribute(attr)))
      .join(' | ');
  return {
    height: document.documentElement.scrollHeight,
    width: document.documentElement.scrollWidth,
    meta: {
      title: norm(document.title),
      canonical: all('link[rel="canonical"]', 'href'),
      description: all('meta[name="description"]', 'content'),
      'og:title': all('meta[property="og:title"]', 'content'),
      'og:description': all('meta[property="og:description"]', 'content'),
      'og:image': all('meta[property="og:image"]', 'content'),
      'og:url': all('meta[property="og:url"]', 'content'),
    },
    text: norm(document.body.innerText),
    blocks: document.querySelector('.bodyPostContainer')
      ? [...document.querySelectorAll('.bodyPostContainer > *')].map((el) => ({
          tag: el.tagName.toLowerCase(),
          h: Math.round(el.getBoundingClientRect().height),
        }))
      : null,
  };
}

function emptyMeta(): PageMeta {
  return {
    title: '',
    canonical: '',
    description: '',
    'og:title': '',
    'og:description': '',
    'og:image': '',
    'og:url': '',
  };
}
