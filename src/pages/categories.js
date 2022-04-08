import React from "react"
import PropTypes from "prop-types"

// Utilities
import kebabCase from "lodash/kebabCase"

// Components
// import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"

const CategoriesPage = ({ data }) => (
  <div>
    <div>
      <h1>CategoriesPage</h1>
      <ul>
        {data.allMdx.group.map(category => (
          <li key={category.fieldValue}>
            <Link to={`/categories/${kebabCase(category.fieldValue)}/`}>
              {category.fieldValue} ({category.totalCount})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

CategoriesPage.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
  }),
}

export default CategoriesPage

export const pageQuery = graphql`
  query {
    allMdx(limit: 2000) {
      group(field: frontmatter___category) {
        fieldValue
        totalCount
      }
    }
  }
`