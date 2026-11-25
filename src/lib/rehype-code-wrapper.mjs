// Reproduces the markup gatsby-remark-prismjs produced, so the existing post styles
// (and prism-okaidia) apply exactly as before:
// - code blocks: <span><div class="code-highlight" data-language="…"><pre>…</pre></div></span>
//   (the <span> keeps them out of `.bodyPostContainer > div` rules);
// - blocks without a language get `language-text` (Astro's Prism uses `plaintext`);
// - inline code: <span><code class="language-text">…</code></span>.
const renameLanguage = (node, from, to) => {
  const className = [].concat(node.properties?.className ?? []);
  node.properties.className = className.map((c) =>
    c === `language-${from}` ? `language-${to}` : c
  );
  if (node.properties.dataLanguage === from) node.properties.dataLanguage = to;
};

// mdast-util-to-hast appends "\n" to every code block; gatsby-remark-prismjs didn't. One
// trailing newline is invisible, but a block whose source ends with a blank line would
// render one line taller than before, so drop that extra newline.
const trimAppendedNewline = (node) => {
  let last = node;
  while (last.children?.length) last = last.children[last.children.length - 1];
  if (last.type === 'text' && last.value.endsWith('\n')) {
    last.value = last.value.slice(0, -1);
  }
};

// Puts back the leading blank lines recorded by remark-code-leading-newlines, guarded by an
// empty <span> so the final HTML serialization can't drop them again. Highlighted blocks
// (a <pre data-language>) are matched to fenced blocks by order.
const restoreLeadingNewlines = (tree, expected) => {
  const blocks = [];
  const find = (node) => {
    node.children?.forEach((child) => {
      if (
        child.type === 'element' &&
        child.tagName === 'pre' &&
        child.properties?.dataLanguage !== undefined
      ) {
        const code = child.children.find(
          (c) => c.type === 'element' && c.tagName === 'code'
        );
        if (code) blocks.push(code);
      } else find(child);
    });
  };
  find(tree);
  if (!expected || blocks.length !== expected.length) return;
  blocks.forEach((code, i) => {
    if (!expected[i]) return;
    const first = code.children[0];
    const current =
      first?.type === 'text' ? /^\n*/.exec(first.value)[0].length : 0;
    const missing = Math.max(0, expected[i] - current);
    code.children.unshift(
      { type: 'element', tagName: 'span', properties: {}, children: [] },
      ...(missing ? [{ type: 'text', value: '\n'.repeat(missing) }] : [])
    );
  });
};

export default function rehypeCodeWrapper() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'pre') {
        child.children.forEach((code) => {
          if (code.type === 'element' && code.tagName === 'code')
            trimAppendedNewline(code);
        });
        const className = [].concat(child.properties?.className ?? []);
        const langClass = className.find((c) =>
          String(c).startsWith('language-')
        );
        let lang = langClass
          ? String(langClass).slice('language-'.length)
          : 'text';
        if (lang === 'plaintext') {
          lang = 'text';
          renameLanguage(child, 'plaintext', 'text');
          child.children.forEach((code) => {
            if (code.type === 'element' && code.tagName === 'code')
              renameLanguage(code, 'plaintext', 'text');
          });
        }
        return {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['code-highlight'], dataLanguage: lang },
              children: [child],
            },
          ],
        };
      }
      if (child.type === 'element' && child.tagName === 'code') {
        child.properties.className = ['language-text'];
        return {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [child],
        };
      }
      walk(child);
      return child;
    });
  };
  return (tree, file) => {
    restoreLeadingNewlines(tree, file.data.codeLeadingNewlines);
    walk(tree);
  };
}
