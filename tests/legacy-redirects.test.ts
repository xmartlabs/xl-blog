import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  EXTRA_LEGACY_REDIRECTS,
  legacyNameVariants,
  legacyRedirects,
} from '../src/lib/legacy-redirects.mjs';

const posts = JSON.parse(
  readFileSync(
    new URL('../migration/legacy/posts.json', import.meta.url),
    'utf8'
  )
) as { sourceFile: string; date: string; slug: string }[];

const redirects = legacyRedirects(posts);
const destinationOf = (source: string) =>
  redirects.find((r) => r.source === source)?.destination;

describe('legacyNameVariants', () => {
  it('keeps plain names', () => {
    expect(legacyNameVariants('linkedin-for-work')).toEqual([
      'linkedin-for-work',
    ]);
  });

  it('turns spaces into an encoded space and a dash', () => {
    expect(legacyNameVariants('Top EVM-compatible-frameworks')).toEqual([
      'Top%20EVM-compatible-frameworks',
      'Top-EVM-compatible-frameworks',
    ]);
  });

  it.each([['a/b'], ['a?b'], ['a#b'], ['a:b'], ['(x)'], [' leading'], ['']])(
    'skips the unusable name %j',
    (name) => {
      expect(legacyNameVariants(name)).toEqual([]);
    }
  );
});

describe('legacyRedirects', () => {
  it('maps the file-name date and the post date to /blog/<slug>/', () => {
    const result = legacyRedirects(
      [{ sourceFile: '2020-01-01-my-post.md', date: '2020-01-02', slug: 's' }],
      []
    );
    expect(result).toEqual([
      {
        source: '/2020/01/01/my-post/',
        destination: '/blog/s/',
        permanent: true,
      },
      {
        source: '/2020/01/02/my-post/',
        destination: '/blog/s/',
        permanent: true,
      },
    ]);
  });

  it('adds the explicit list without overriding generated entries', () => {
    const result = legacyRedirects(
      [{ sourceFile: '2020-01-01-a.mdx', date: '2020-01-01', slug: 'a' }],
      [
        ['/2020/01/01/a/', 'other'],
        ['/2020/01/01/typo/', 'a'],
      ]
    );
    expect(result.map((r) => [r.source, r.destination])).toEqual([
      ['/2020/01/01/a/', '/blog/a/'],
      ['/2020/01/01/typo/', '/blog/a/'],
    ]);
  });

  it('skips files without a date prefix', () => {
    expect(
      legacyRedirects(
        [{ sourceFile: 'about.md', date: '2020-01-01', slug: 'about' }],
        []
      )
    ).toEqual([]);
  });

  describe('the real post list', () => {
    it('covers an ordinary old URL', () => {
      expect(destinationOf('/2014/12/02/linkedin-for-work/')).toMatch(
        /^\/blog\/[\w-]+\/$/
      );
    });

    it('covers the mistyped Bender link', () => {
      expect(destinationOf('/2021/08/30/Bender-the-best/')).toBe(
        '/blog/how-to-get-the-best-performance-for-ml-models-on-ios/'
      );
      expect(EXTRA_LEGACY_REDIRECTS.length).toBeGreaterThan(0);
    });

    it('covers the file name with a space (encoded and dashed, both dates)', () => {
      for (const source of [
        '/2022/06/27/Top%20EVM-compatible-frameworks/',
        '/2022/06/27/Top-EVM-compatible-frameworks/',
        '/2022/06/28/Top%20EVM-compatible-frameworks/',
        '/2022/06/28/Top-EVM-compatible-frameworks/',
      ]) {
        expect(destinationOf(source), source).toBe(
          '/blog/best-blockchain-development-framework/'
        );
      }
    });

    it('produces valid, unique sources that point at known posts', () => {
      const slugs = new Set(posts.map((p) => p.slug));
      const sources = redirects.map((r) => r.source);
      expect(new Set(sources).size).toBe(sources.length);
      for (const { source, destination, permanent } of redirects) {
        expect(source).toMatch(/^\/\d{4}\/\d{2}\/\d{2}\/[\w.%-]+\/$/);
        expect(permanent).toBe(true);
        expect(slugs.has(destination.slice('/blog/'.length, -1))).toBe(true);
      }
      // Every post with a dated file name gets at least one redirect.
      expect(new Set(redirects.map((r) => r.destination)).size).toBe(
        posts.filter((p) => /^\d{4}-\d{2}-\d{2}-/.test(p.sourceFile)).length
      );
    });
  });
});
