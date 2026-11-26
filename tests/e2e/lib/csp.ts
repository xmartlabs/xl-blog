import type { Page } from '@playwright/test';

export type CspViolation = {
  directive: string;
  blocked: string;
  source: string;
  sample: string;
};

/**
 * Collects the page's `securitypolicyviolation` events (fired for report-only policies too)
 * from the very first script on; read them with `cspViolations(page)`.
 */
export async function recordCspViolations(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __cspViolations: unknown[] };
    w.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', (event) => {
      w.__cspViolations.push({
        directive: event.effectiveDirective,
        blocked: event.blockedURI,
        source: `${event.sourceFile}:${event.lineNumber}`,
        sample: event.sample,
      });
    });
  });
}

export const cspViolations = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __cspViolations?: CspViolation[] })
        .__cspViolations ?? []
  );

/** Scrolls to the bottom in steps, so lazy images and iframes load. */
export async function scrollThrough(page: Page) {
  for (let step = 0; step < 40; step++) {
    const atBottom = await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      return (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      );
    });
    await page.waitForTimeout(100);
    if (atBottom) break;
  }
}
