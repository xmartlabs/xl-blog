// Records how many blank lines each fenced code block starts with. Astro re-parses the
// HTML with parse5, which drops a newline right after `<pre><code>`; Gatsby kept it, so
// rehype-code-wrapper puts the recorded newlines back.
export default function remarkCodeLeadingNewlines() {
  return (tree, file) => {
    const counts = [];
    const walk = (node) => {
      if (node.type === 'code')
        counts.push(/^\n*/.exec(node.value ?? '')[0].length);
      node.children?.forEach(walk);
    };
    walk(tree);
    file.data.codeLeadingNewlines = counts;
  };
}
