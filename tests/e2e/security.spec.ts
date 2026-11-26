import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

import { apiAs, json } from './lib/api';
import { cspViolations, recordCspViolations, scrollThrough } from './lib/csp';
import {
  ADMIN_STATE,
  CREDENTIALS_FILE,
  type Credentials,
  SEED,
} from './lib/env';
/**
 * Security headers and robots.txt: the report-only Content Security Policy (src/lib/csp.mjs)
 * and its report endpoint, the payload-token cookie attributes, and /robots.txt.
 */

const embedsPost = `/blog/${SEED.legacyPosts[0].slug}/`;

test('robots.txt allows the site, not the CMS, and lists the sitemap', async () => {
  const api = await apiAs('anonymous');
  try {
    const response = await api.get('/robots.txt');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain(
      'Sitemap: https://blog.xmartlabs.com/sitemap-index.xml'
    );
    expect(text).toMatch(/^Disallow: \/admin$/m);
    expect(text).toMatch(/^Disallow: \/api$/m);
    expect(text).toMatch(/^Allow: \/$/m);
    // Not a preview deployment: no noindex header.
    expect((await api.get('/')).headers()['x-robots-tag']).toBeUndefined();
  } finally {
    await api.dispose();
  }
});

test('pages send a report-only CSP; the admin panel its own', async () => {
  const api = await apiAs('anonymous');
  try {
    const home = (await api.get('/')).headers();
    const policy = home['content-security-policy-report-only'];
    expect(policy).toMatch(/^default-src 'self'; /);
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain('report-uri /next/csp-report/');
    expect(policy).toContain('report-to csp-endpoint');
    expect(home['content-security-policy']).toBeUndefined();
    // YouTube embeds need the origin as referrer (Error 153 with `same-origin`).
    expect(home['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(home['reporting-endpoints']).toBe(
      'csp-endpoint="/next/csp-report/"'
    );

    const admin = (await api.get('/admin/login/')).headers()[
      'content-security-policy-report-only'
    ];
    expect(admin).toContain('https://cdn.jsdelivr.net');
    expect(admin).toContain("frame-ancestors 'none'");
  } finally {
    await api.dispose();
  }
});

test('the CSP report endpoint logs reports and returns 204', async () => {
  const api = await apiAs('anonymous');
  try {
    const legacy = await api.post('/next/csp-report/', {
      headers: { 'content-type': 'application/csp-report' },
      data: JSON.stringify({
        'csp-report': {
          'document-uri': 'http://localhost/',
          'effective-directive': 'script-src-elem',
          'blocked-uri': 'https://example.com/e2e.js',
        },
      }),
    });
    expect(legacy.status()).toBe(204);
    const reportingApi = await api.post('/next/csp-report/', {
      headers: { 'content-type': 'application/reports+json' },
      data: JSON.stringify([
        {
          type: 'csp-violation',
          body: {
            documentURL: 'http://localhost/',
            effectiveDirective: 'frame-src',
            blockedURL: 'https://example.com/',
          },
        },
      ]),
    });
    expect(reportingApi.status()).toBe(204);
    const wrongType = await api.post('/next/csp-report/', {
      headers: { 'content-type': 'text/plain' },
      data: 'hello',
    });
    expect(wrongType.status()).toBe(415);
    const tooLarge = await api.post('/next/csp-report/', {
      headers: { 'content-type': 'application/csp-report' },
      data: JSON.stringify({ 'csp-report': { x: 'y'.repeat(32 * 1024) } }),
    });
    expect(tooLarge.status()).toBe(413);
  } finally {
    await api.dispose();
  }
});

for (const path of ['/', embedsPost]) {
  test(`${path} loads without CSP violations`, async ({ page }) => {
    await recordCspViolations(page);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await scrollThrough(page);
    if (path === embedsPost) {
      // YouTube iframes and the tweet (Twitter's widgets.js) are in the page.
      await expect(
        page.locator('iframe[src*="youtube-nocookie.com/embed/"]').first()
      ).toBeAttached();
      await expect(
        page
          .locator('script[src="https://platform.twitter.com/widgets.js"]')
          .first()
      ).toBeAttached();
      await page.waitForTimeout(2_000);
    }
    expect(await cspViolations(page)).toEqual([]);
  });
}

test.describe('admin panel', () => {
  test.use({ storageState: ADMIN_STATE });

  test('the post editor (code fields: Monaco) loads without CSP violations', async ({
    page,
  }) => {
    const admin = await apiAs('admin');
    let id: number;
    try {
      const { docs } = await json<{ docs: { id: number }[] }>(
        await admin.get('/api/posts/', {
          params: {
            'where[slug][equals]': SEED.legacyPosts[1].slug,
            depth: 0,
            limit: 1,
          },
        })
      );
      id = docs[0].id;
    } finally {
      await admin.dispose();
    }
    await recordCspViolations(page);
    await page.goto(`/admin/collections/posts/${id}/`);
    await expect(page.locator('.monaco-editor').first()).toBeVisible({
      timeout: 20_000,
    });
    await page.waitForTimeout(1_000);
    expect(await cspViolations(page)).toEqual([]);
  });
});

test('the payload-token cookie is HttpOnly, SameSite=Lax and, on http, not Secure', async () => {
  const credentials = JSON.parse(
    readFileSync(CREDENTIALS_FILE, 'utf8')
  ) as Credentials;
  const api = await apiAs('anonymous');
  try {
    const response = await api.post('/api/users/login/', {
      data: credentials.editor,
    });
    expect(response.ok()).toBe(true);
    const cookie = response
      .headersArray()
      .find(
        (h) =>
          h.name.toLowerCase() === 'set-cookie' &&
          h.value.startsWith('payload-token=')
      )?.value;
    expect(cookie).toBeTruthy();
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    // The e2e server runs on http://localhost; on https it's Secure (tests/auth-cookies.test.ts).
    expect(cookie).not.toContain('Secure');
  } finally {
    await api.dispose();
  }
});
