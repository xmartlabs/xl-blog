import { describe, expect, it } from 'vitest';

import {
  adminDirectives,
  cspHeaders,
  originOf,
  publicDirectives,
  serializeCsp,
} from '../src/lib/csp.mjs';
import {
  formatCspViolation,
  parseCspReport,
  readLimitedText,
  stripUrl,
} from '../src/lib/csp-report';

describe('publicDirectives', () => {
  it('allows the embeds, but not GTM or a form host unless configured', () => {
    const d = publicDirectives({});
    expect(d['default-src']).toEqual(["'self'"]);
    expect(d['script-src']).toContain('https://platform.twitter.com');
    expect(d['script-src']).toContain('https://www.instagram.com');
    expect(d['script-src'].join(' ')).not.toContain('googletagmanager');
    expect(d['frame-src']).toEqual(
      expect.arrayContaining([
        'https://www.youtube.com',
        'https://www.youtube-nocookie.com',
        'https://platform.twitter.com',
        'https://www.instagram.com',
      ])
    );
    expect(d['frame-src'].join(' ')).not.toContain('typeform');
    expect(d['img-src']).toContain('https:');
    expect(d['object-src']).toEqual(["'none'"]);
    expect(d['frame-ancestors']).toEqual(["'self'"]);
  });

  it('adds GTM/GA, the form host and the media host from the environment', () => {
    const d = publicDirectives({
      NEXT_PUBLIC_GTM_ID: 'GTM-TEST',
      NEXT_PUBLIC_FORM_URL: 'https://form.typeform.com/to/abc?x=1',
      NEXT_PUBLIC_MEDIA_BASE_URL: 'https://media.example.com/videos/',
    });
    expect(d['script-src']).toContain('https://www.googletagmanager.com');
    expect(d['connect-src']).toContain('https://*.google-analytics.com');
    expect(d['frame-src']).toContain('https://form.typeform.com');
    expect(d['media-src']).toContain('https://media.example.com');
  });
});

describe('originOf', () => {
  it('returns the origin of http(s) URLs only', () => {
    expect(originOf('https://form.typeform.com/to/x')).toBe(
      'https://form.typeform.com'
    );
    expect(originOf('')).toBeNull();
    expect(originOf(undefined)).toBeNull();
    expect(originOf('not a url')).toBeNull();
    expect(originOf('javascript:alert(1)')).toBeNull();
  });
});

describe('cspHeaders', () => {
  it('is report-only by default, with report-uri and report-to', () => {
    const headers = cspHeaders('public', {});
    expect(headers.map((h) => h.key)).toEqual([
      'Content-Security-Policy-Report-Only',
      'Reporting-Endpoints',
    ]);
    expect(headers[0].value).toMatch(/^default-src 'self'; /);
    expect(headers[0].value).toContain('report-uri /next/csp-report/');
    expect(headers[0].value).toMatch(/report-to csp-endpoint$/);
    expect(headers[1].value).toBe('csp-endpoint="/next/csp-report/"');
  });

  it('enforces with CSP_ENFORCE=true', () => {
    expect(cspHeaders('public', { CSP_ENFORCE: 'true' })[0].key).toBe(
      'Content-Security-Policy'
    );
    expect(cspHeaders('admin', { CSP_ENFORCE: 'false' })[0].key).toBe(
      'Content-Security-Policy-Report-Only'
    );
  });

  it('gives the admin panel its own policy (Monaco, blob workers, no framing)', () => {
    const admin = serializeCsp(adminDirectives());
    expect(admin).toContain('https://cdn.jsdelivr.net');
    expect(admin).toContain("worker-src 'self' blob:");
    expect(admin).toContain("frame-ancestors 'none'");
    expect(cspHeaders('admin', {})[0].value).toBe(admin);
  });
});

describe('parseCspReport', () => {
  it('reads the report-uri format', () => {
    const [v] = parseCspReport({
      'csp-report': {
        'document-uri': 'https://blog.xmartlabs.com/blog/x/?token=secret#a',
        'violated-directive': 'script-src-elem',
        'effective-directive': 'script-src-elem',
        'blocked-uri': 'https://evil.example/x.js?q=1',
        'source-file': 'https://blog.xmartlabs.com/_next/a.js',
        'line-number': 12,
        disposition: 'report',
      },
    });
    expect(v).toEqual({
      disposition: 'report',
      directive: 'script-src-elem',
      blocked: 'https://evil.example/x.js',
      document: 'https://blog.xmartlabs.com/blog/x/',
      source: 'https://blog.xmartlabs.com/_next/a.js:12',
      sample: '',
    });
    expect(formatCspViolation(v)).toBe(
      '[csp] report script-src-elem blocked=https://evil.example/x.js document=https://blog.xmartlabs.com/blog/x/ source=https://blog.xmartlabs.com/_next/a.js:12'
    );
  });

  it('reads Reporting API batches and ignores other report types', () => {
    const violations = parseCspReport([
      {
        type: 'csp-violation',
        body: {
          documentURL: 'https://blog.xmartlabs.com/',
          effectiveDirective: 'frame-src',
          blockedURL: 'https://example.com/embed',
          disposition: 'report',
          sample: '',
        },
      },
      { type: 'deprecation', body: { id: 'x' } },
    ]);
    expect(violations).toHaveLength(1);
    expect(violations[0].directive).toBe('frame-src');
    expect(violations[0].blocked).toBe('https://example.com/embed');
  });

  it('returns nothing for unknown payloads', () => {
    expect(parseCspReport(null)).toEqual([]);
    expect(parseCspReport({ foo: 1 })).toEqual([]);
    expect(parseCspReport('x')).toEqual([]);
  });

  it('keeps keywords and truncates long values', () => {
    expect(stripUrl('inline')).toBe('inline');
    expect(stripUrl('x'.repeat(500))).toHaveLength(201);
  });
});

describe('readLimitedText', () => {
  const post = (body: string, headers: Record<string, string> = {}) =>
    new Request('http://localhost/next/csp-report/', {
      method: 'POST',
      body,
      headers,
    });

  it('reads small bodies and refuses large ones', async () => {
    expect(await readLimitedText(post('{"a":1}'))).toBe('{"a":1}');
    expect(await readLimitedText(post('x'.repeat(20)), 10)).toBeNull();
    expect(
      await readLimitedText(post('x', { 'content-length': '999999' }))
    ).toBeNull();
  });
});
