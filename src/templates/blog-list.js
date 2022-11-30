import React from "react"
import styled from "styled-components"
import Card from "../components/card/card.tsx"
import Pager from "../components/pager/pager.tsx"

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

export const PagerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const BlogList = ({ pageContext, data }) => {
  const _ = require("lodash")    
  const { edges, totalCount } = data.allMdx
  return (
    <>
      <ListContainer>
      <ListRow>
        {edges.map(({ node }) => <Card data={node}/> )}
      </ListRow>
      </ListContainer>
      <Pager pageContext={pageContext}/>
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
