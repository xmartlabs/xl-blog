import * as React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { graphql, Link } from 'gatsby'
import AuthorsYAMLData from "../../content/authors.yaml"
import CategoriesYAMLDATA from "../../content/categories.yaml"
const _ = require("lodash")

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(author => { return author.author === data.mdx.frontmatter.author })
  const category = CategoriesYAMLDATA.find(category => { return category.category === data.mdx.frontmatter.category })
  return (
    <>
        <div><Link to={`/categories/${ _.kebabCase(category.category) }`}>{ category.title }</Link></div>
        <div><Link to={`/authors/${ _.kebabCase(author.author) }`}>{ author.display_name }</Link></div>
        <div>{ author.image }</div>
        <div>{ author.profile_url }</div>
        <p>{data.mdx.frontmatter.date}</p>
        <MDXRenderer>
            {data.mdx.body}
        </MDXRenderer>
    </>
  )
}

export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        author
        category
        tags
      }
      body
    }
  }
`

export default BlogPost