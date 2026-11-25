import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

// Silence Prism's "language not found" logging; unknown languages render as plain text.
(loadLanguages as unknown as { silent: boolean }).silent = true;

const PLAIN = new Set(['', 'text', 'plaintext', 'plain', 'txt']);

const escapeCode = (code: string) =>
  code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let templatingLoaded = false;

/**
 * Highlights `code` the way the Astro build did (@astrojs/prism): load the grammar on demand
 * (plus markup-templating, which some grammars extend), and fall back to escaped plain text
 * for unknown languages. Returns HTML for the inside of <code>.
 */
export function highlightCode(code: string, language: string): string {
  const lang = language.toLowerCase();
  if (PLAIN.has(lang)) return escapeCode(code);
  const grammarName = lang === 'ts' ? 'typescript' : lang;
  if (!templatingLoaded) {
    loadLanguages(['markup-templating']);
    templatingLoaded = true;
  }
  if (!Prism.languages[grammarName]) {
    try {
      loadLanguages([grammarName]);
    } catch {
      // Unknown language: plain text below.
    }
  }
  const grammar = Prism.languages[lang];
  return grammar ? Prism.highlight(code, grammar, lang) : escapeCode(code);
}
