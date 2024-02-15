require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: "Xmartlabs | Blog",
    description: "Explore Xmartlabs' blog for the latest in tech and business insights",
    siteUrl: "https://blog.xmartlabs.com",
  },
  flags: {
    PARALLEL_QUERY_RUNNING: true
  },
  plugins: [
    "gatsby-plugin-netlify-cms",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-instagram-embed",
    "gatsby-plugin-slug",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-netlify",
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `xmartlabs`
      }
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "static/favicon.png",
      },
    },
    {
      resolve: `gatsby-transformer-yaml`,
      options: {
        typeName: `Yaml`, // a fixed string
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [`.mdx`,`.md`],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./static/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blogs",
        path: `${__dirname}/blogs/`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-5J7PXXS",
        includeInDevelopment: false,
        routeChangeEventName: "route-change",
      },
    },
    "gatsby-transformer-remark",
    "gatsby-plugin-sass",
  ],
};
