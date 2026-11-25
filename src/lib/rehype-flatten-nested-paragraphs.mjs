// MDX turns `<p>\n  text\n</p>` into a <p> inside a <p>. React (the old Gatsby site) kept
// that nesting in the DOM, but browsers parsing static HTML split it into extra empty
// paragraphs, each adding margins. When a <p> holds nothing but one inner <p>, unwrap the
// inner one so the outer paragraph (and its attributes) holds the text directly.
const isP = (node) =>
  (node.type === 'element' && node.tagName === 'p') ||
  (node.type === 'mdxJsxFlowElement' && node.name === 'p');
const isBlank = (node) => node.type === 'text' && !node.value.trim();

export default function rehypeFlattenNestedParagraphs() {
  const walk = (node) => {
    node.children?.forEach(walk);
    if (!isP(node)) return;
    const content = node.children.filter((child) => !isBlank(child));
    if (content.length === 1 && isP(content[0])) {
      node.children = content[0].children;
    }
  };
  return walk;
}
