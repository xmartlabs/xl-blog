import { describe, expect, it } from 'vitest';

import { safeInternalPath } from '../src/lib/redirects';

describe('safeInternalPath', () => {
  it.each([
    ['/', '/'],
    ['/admin', '/admin'],
    ['/blog/some-post/', '/blog/some-post/'],
    [
      '/admin/collections/posts?limit=10&page=2',
      '/admin/collections/posts?limit=10&page=2',
    ],
    ['/blog/post/#comments', '/blog/post/#comments'],
    ['/tags/c%23/', '/tags/c%23/'],
    // Dot segments are resolved; the result stays on the site.
    ['/blog/../admin', '/admin'],
    ['/a/./b', '/a/b'],
    ['/../../etc', '/etc'],
    // An encoded slash inside the path is just a path character.
    ['/blog/a%2Fb/', '/blog/a%2Fb/'],
    // Text that looks like a URL further along the path is harmless.
    ['/redirect?to=https://evil.com', '/redirect?to=https://evil.com'],
  ])('keeps the same-site path %s', (input, expected) => {
    expect(safeInternalPath(input, '/fallback')).toBe(expected);
  });

  it.each([
    // Missing / not a string.
    [null],
    [undefined],
    [''],
    [42 as unknown as string],
    // Absolute URLs and schemes.
    ['https://evil.com'],
    ['http://evil.com/admin'],
    ['HTTPS://evil.com'],
    ['javascript:alert(1)'],
    ['data:text/html,<script>alert(1)</script>'],
    ['mailto:a@b.c'],
    // Relative paths.
    ['admin'],
    ['evil.com'],
    ['./admin'],
    ['../admin'],
    ['?a=b'],
    ['#x'],
    // Protocol-relative and backslash tricks.
    ['//evil.com'],
    ['///evil.com'],
    ['//evil.com/admin'],
    ['/\\evil.com'],
    ['\\\\evil.com'],
    ['/\\/evil.com'],
    ['/admin\\..\\..\\evil'],
    // Control characters (browsers strip them: "/\t/evil.com" would become "//evil.com").
    ['/\t/evil.com'],
    ['/\n/evil.com'],
    ['/\r\n/evil.com'],
    ['/\u0000/evil.com'],
    ['/admin\u007f'],
    // Percent-encoded slash, backslash or control character right after the first slash.
    ['/%2Fevil.com'],
    ['/%2fevil.com'],
    ['/%5Cevil.com'],
    ['/%252Fevil.com'],
    ['/%09/evil.com'],
    ['/%0a/evil.com'],
    // Normalizes to a protocol-relative URL.
    ['/..//evil.com'],
    ['/.//evil.com'],
    ['/a/..//evil.com'],
    ['/a/../..//evil.com'],
  ])('rejects %j', (input) => {
    expect(safeInternalPath(input, '/fallback')).toBe('/fallback');
  });

  it('defaults the fallback to /', () => {
    expect(safeInternalPath('https://evil.com')).toBe('/');
  });

  it('never throws on malformed percent-encoding', () => {
    expect(safeInternalPath('/%E0%A4%A', '/fallback')).toBe('/%E0%A4%A');
    expect(safeInternalPath('/%zz', '/fallback')).toBe('/%zz');
  });
});
