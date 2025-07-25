// Handling multiple layouts
// If you want to use different layouts for different pages, you can pass this information in the context of the pages you create, and then conditionally render in your layout file.
// called after every page is created.

const postsPerPage = 12;

const path = require('path');
const _ = require('lodash');

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Mdx: {
      relatedPosts: {
        type: ['Mdx'],
        resolve: async (source, args, context, info) => {
          const { entries } = await context.nodeModel.findAll({
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
          });
          return entries;
        },
      },
    },
  };
  createResolvers(resolvers);
};

const readingTime = require(`reading-time`);

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `Mdx`) {
    createNodeField({
      node,
      name: `timeToRead`,
      value: readingTime(node.body),
    });
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions;
  const tagTemplate = path.resolve('src/templates/tags.js');
  const categoryTemplate = path.resolve('src/pages/categories.js');
  const authorTemplate = path.resolve('src/templates/authors.js');
  const postTemplate = path.resolve('src/templates/post.js');

  const result = await graphql(`
    {
      tagsGroup: allMdx(limit: 2000) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
      categoriesGroup: allMdx(limit: 2000) {
        group(field: { frontmatter: { category: SELECT } }) {
          fieldValue
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
                thumbnail
              }
            }
          }
        }
      }
      authorsGroup: allMdx(limit: 2000) {
        group(field: { frontmatter: { author: SELECT } }) {
          fieldValue
        }
      }
      posts: allMdx(sort: { frontmatter: { date: DESC } }) {
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
            fields {
              slug
              timeToRead {
                text
              }
            }
            internal {
              contentFilePath
            }
            body
          }
        }
      }
    }
  `);

  // handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Extract tag data from query
  const tags = result.data.tagsGroup.group;
  // Make tag pages
  tags.forEach((tag) => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    });
  });

  // Extract category data from query
  const categories = result.data.categoriesGroup.group;
  categories.forEach((category) => {
    const numPagesCat = Math.ceil(category.edges.length / postsPerPage);
    Array.from({ length: numPagesCat }).forEach((_, index) => {
      createPage({
        path: `/categories/${category.fieldValue}${index === 0 ? `` : `/page/${index + 1}`}`,
        component: categoryTemplate,
        context: {
          limit: postsPerPage,
          numPages: numPagesCat,
          currentPage: index + 1,
          category: category.fieldValue,
          skip: index * postsPerPage,
        },
      });
    });
  });

  // Extract tag data from query
  const authors = result.data.authorsGroup.group;
  // Make tag pages
  authors.forEach((author) => {
    createPage({
      path: `/authors/${_.kebabCase(author.fieldValue)}/`,
      component: authorTemplate,
      context: {
        author: author.fieldValue,
      },
    });
  });

  const posts = result.data.posts.edges;
  const numPages = Math.ceil(posts.length / postsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/page/${i + 1}`,
      component: categoryTemplate,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages: numPages,
        currentPage: i + 1,
      },
    });
  });

  posts.forEach((post) => {
    const permalink = _.kebabCase(post.node.frontmatter.permalink);
    createPage({
      path: permalink.startsWith('/')
        ? `/blog${permalink}`
        : `/blog/${permalink}`,
      component: `${postTemplate}?__contentFilePath=${post.node.internal.contentFilePath}`,
      context: {
        id: post.node.id,
      },
    });
  });
};
