import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { codeToHTML, lexicalToHTML } from '../src/components/rich-text/to-html';
import { htmlToLexical } from '../src/migration/html-to-lexical';
import { normalizeHtml } from '../src/migration/normalize-html';

const roundTrip = (html: string) => {
  const { content, stats } = htmlToLexical(html);
  return { html: lexicalToHTML(content), content, stats };
};

const topTypes = (html: string) =>
  (
    htmlToLexical(html).content.root.children as {
      type: string;
      fields?: { blockType: string };
    }[]
  ).map((n) => (n.type === 'block' ? n.fields!.blockType : n.type));

describe('legacy HTML → Lexical → HTML', () => {
  it('maps Markdown-like markup to native nodes', () => {
    const html = [
      '<p>Hello <strong>bold <span><code class="language-text">x</code></span> text</strong> and <a href="https://x.com">a <em>link</em></a>.</p>',
      '<h2 id="a-title">A title</h2>',
      '<h2 id="a-title-1">A title</h2>',
      '<ul>\n<li>one</li>\n<li>two\n<ul>\n<li>nested</li>\n</ul>\n</li>\n</ul>',
      '<ol start="3">\n<li>three</li>\n</ol>',
      '<blockquote>\n<p>Quote</p>\n</blockquote>',
      '<hr>',
    ].join('\n');
    expect(topTypes(html)).toEqual([
      'paragraph',
      'heading',
      'heading',
      'list',
      'list',
      'quote',
      'horizontalrule',
    ]);
    expect(normalizeHtml(roundTrip(html).html)).toBe(normalizeHtml(html));
  });

  it('turns code wrappers, bare images and other markup into blocks', () => {
    const code =
      '<span><div class="code-highlight" data-language="js"><pre class="language-js" data-language="js"><code class="language-js"><span class="token keyword">const</span> a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></code></pre></div></span>';
    const html = [
      code,
      '<img src="/images/a.png" alt="A">',
      '<p style="text-align:center">styled</p>',
      '<iframe src="https://www.youtube.com/embed/x"></iframe>',
      '<p>after</p>',
    ].join('\n');
    // The styled <p> and the iframe are merged into one embed.
    expect(topTypes(html)).toEqual([
      'code',
      'imageGallery',
      'htmlEmbed',
      'paragraph',
    ]);
    expect(normalizeHtml(roundTrip(html).html)).toBe(normalizeHtml(html));
  });

  it('keeps leading newlines of code blocks behind an empty <span>', () => {
    expect(codeToHTML({ language: 'text', code: '\n\nfoo' })).toBe(
      '<span><div class="code-highlight" data-language="text"><pre class="language-text" data-language="text"><code class="language-text"><span></span>\n\nfoo</code></pre></div></span>'
    );
  });

  it('reproduces every legacy post body exactly (after whitespace normalization)', () => {
    const dir = join(__dirname, '../migration/legacy/bodies');
    const files = readdirSync(dir).filter((f) => f.endsWith('.html'));
    expect(files).toHaveLength(175);
    const mismatched = files.filter((file) => {
      const legacy = readFileSync(join(dir, file), 'utf8');
      return normalizeHtml(roundTrip(legacy).html) !== normalizeHtml(legacy);
    });
    expect(mismatched).toEqual([]);
  }, 120_000);
});
