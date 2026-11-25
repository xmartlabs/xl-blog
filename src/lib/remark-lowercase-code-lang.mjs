// gatsby-remark-prismjs lowercased fenced code languages (```Swift → language-swift);
// do the same so those blocks keep their highlighting.
export default function remarkLowercaseCodeLang() {
  const walk = (node) => {
    if (node.type === 'code' && node.lang) node.lang = node.lang.toLowerCase();
    node.children?.forEach(walk);
  };
  return walk;
}
