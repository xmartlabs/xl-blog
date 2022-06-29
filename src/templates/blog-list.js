import React from "react"
import styled from "styled-components"
import Card from "../components/card"

import { graphql, Link } from "gatsby"

export const ListRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4.4rem;
`

export const ListContainer = styled.div`
  justify-content: center;
  margin: 0 18%;

  @media ${props => props.theme.breakpoints.mobile} {
    margin: 0 1.5rem;
  }
`

const BlogList = ({ pageContext, data }) => {
    const _ = require("lodash")    
    const { edges, totalCount } = data.allMdx
    const { limit, skip, numPages,  currentPage} = pageContext

    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? "/" : `/page/${(currentPage - 1)}`.toString()
    const nextPage = `/page/${(currentPage + 1)}`.toString()
    return (
        <>
          <ListContainer>
            <ListRow>
              {edges.map(({ node }) => {
                  return (
                    <Card data={node}/>
                  )
              })}
            </ListRow>
          </ListContainer>
          <>
          {!isFirst && (
              <Link to={prevPage} rel="prev">
              ← Previous Page
              </Link>
          )}
          {!isLast && (
              <Link to={nextPage} rel="next">
              Next Page →
              </Link>
          )}
          </>
        </>
    )
}

export default BlogList

export const blogListQuery = graphql`
    query blogListQuery($skip: Int!, $limit: Int!) {
        allMdx(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: $limit
        skip: $skip
        ) {
            totalCount
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
                    body
                    slug
                }
            }
        }
    }
`
