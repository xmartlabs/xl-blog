import * as React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../layouts/layout'

const IndexPage = ({ data }) => {
  return (
    <Layout pageTitle="My Blog Posts">
      <ul>
      {
        data.allMdx.nodes.map(node => (
          <article key={node.id}>
            <h2>
              <Link to={`${ node.slug }`}>
                {node.frontmatter.title}
              </Link>
              <p>Posted: {node.frontmatter.date}</p>
            </h2>
          </article>
        ))
      }
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(sort: {fields: frontmatter___date, order: DESC})  {
      nodes {
        id
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          author
          category
          tags
        }
        body
        slug
      }
    }
  }
`

export default IndexPage