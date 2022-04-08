import React from "react"
import PropTypes from "prop-types"

// Components
import { Link, graphql } from "gatsby"

const Authors = ({ pageContext, data }) => {
  const { author } = pageContext
  const { edges, totalCount } = data.allMdx
  const authorHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } written by "${author}"`

  return (
    <div>
      <h1>{authorHeader}</h1>
      <ul>
        {edges.map(({ node }) => {
          const { title } = node.frontmatter
          return (
            <li key={node.slug}>
              <Link to={node.slug}>{title}</Link>
            </li>
          )
        })}
      </ul>
      {/*
              This links to a page that does not yet exist.
              You'll come back to it!
            */}
      <Link to="/">back to home</Link>
    </div>
  )
}

Authors.propTypes = {
  pageContext: PropTypes.shape({
    category: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            })
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Authors

export const pageQuery = graphql`
  query($author: String) {
    allMdx(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { author: { eq: $author } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
          }
        }
      }
    }
  }
`