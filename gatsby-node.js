// Handling multiple layouts
// If you want to use different layouts for different pages, you can pass this information in the context of the pages you create, and then conditionally render in your layout file.
// called after every page is created.
exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  //if (page.path.match(/^\/app/)) {
  //  page.matchPath = "/app/*"
  //}

  // if (page.path.match(/special-page/)) {
  //page.context.layout = "main"
  createPage(page)
  // }
}
