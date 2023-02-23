// Handling multiple layouts
// If you want to use different layouts for different pages, you can pass this information in the context of the pages you create, and then conditionally render in your layout file.
// called after every page is created.

const postsPerPage = 9;

const path = require("path")
const _ = require("lodash")

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Mdx: {
      relatedPosts: {
        type: ['Mdx'],
        resolve: (source, args, context, info) => {
          return context.nodeModel.runQuery({
            query: {
              filter: {
                id: {
                  ne: source.id,
                },
                frontmatter: {
                  category: {
                    eq: source.frontmatter.category,
                  },
                },
              },
            },
            type: 'Mdx',
          })
        },
      },
    },
  }
  
  createResolvers(resolvers)
}

exports.createPages = async ({actions, graphql, reporter}) => {
    const {createPage} = actions
    const tagTemplate = path.resolve("src/templates/tags.js")
    const categoryTemplate = path.resolve("src/templates/categories.js")
    const authorTemplate = path.resolve("src/templates/authors.js")
    const postTemplate = path.resolve("src/templates/post.js")

    const result = await graphql(`
    {
      tagsGroup: allMdx(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
      categoriesGroup: allMdx(limit: 2000) {
        group(field: frontmatter___category) {
          fieldValue
        }
      }
      authorsGroup: allMdx(limit: 2000) {
        group(field: frontmatter___author) {
          fieldValue
        }
      }
      posts: allMdx(sort: {fields: frontmatter___date, order: DESC})  {
        edges {
          node {
            id
            frontmatter {
              date(formatString: "MMMM D, YYYY")
              title
              author
              category
              tags
              permalink
            }
            body
            slug
          }
        }
      }
    }
  `)
    // handle errors
    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`)
        return
    }

    // Extract tag data from query
    const tags = result.data.tagsGroup.group
    // Make tag pages
    tags.forEach(tag => {
        createPage({
            path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
            component: tagTemplate,
            context: {
                tag: tag.fieldValue,
            },
        })
    })


    // Extract tag data from query
    const categories = result.data.categoriesGroup.group
    // Make tag pages
    categories.forEach(category => {
        createPage({
            path: `/categories/${_.kebabCase(category.fieldValue)}/`,
            component: categoryTemplate,
            context: {
                category: category.fieldValue,
            },
        })
    })

    // Extract tag data from query
    const authors = result.data.authorsGroup.group
    // Make tag pages
    authors.forEach(author => {
        createPage({
            path: `/authors/${_.kebabCase(author.fieldValue)}/`,
            component: authorTemplate,
            context: {
                author: author.fieldValue,
            },
        })
    })

    const posts = result.data.posts.edges;
    const numPages = Math.ceil(posts.length / postsPerPage);
    Array.from({length: numPages}).forEach((_, i) => {
        createPage({
            path: i === 0 ? `/` : `/page/${i + 1}`,
            component: path.resolve("./src/templates/blog-list.js"),
            context: {
                limit: postsPerPage,
                skip: i * postsPerPage,
                numPages: numPages,
                currentPage: i + 1,
            },
        });
    });

    posts.forEach(post => {
      createPage({
        path: post.node.frontmatter.permalink,
        component: postTemplate,
        context: {
          id: post.node.id,
        }
      })
    })
}


// exports.onCreatePage = ({ page, actions, getNode }) => {
//   const { createPage } = actions

// // Change the node internal type from 'allMarkdownRemark' to 'MarkdownRemark'
// if (node.internal.type === `MarkdownRemark`) {
//   const value = createFilePath({ page, getNode })
//   createNodeField({
//     name: `slug`,
//     node,
//     value,
//   })
// }
// else {
//   createPage(page)
// }

// page.matchPath is a special key that's used for matching pages
// only on the client.
//if (page.path.match(/^\/app/)) {
//  page.matchPath = "/app/*"
//}

// if (page.path.match(/special-page/)) {
//page.context.layout = "main"

// }
// }
