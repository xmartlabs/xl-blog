import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Category from "./category"

import { Link } from "gatsby"

export const ListNode = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-width: 22.4rem;
    flex-basis: 33.333333%
`

export const StyledImage = styled.img`
  border-radius: 3%;
  margin-bottom: 25px;
  width: 100%;
  height: 15.3rem;
`

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: 1.875em;
`

export const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: .5rem;
  color: #F6C14D;
`

export const StyledIcon = styled(FontAwesomeIcon)`
  position: relative;
  top: 0.4em;
`

const Card = ({ data }) => {
  return (
    <article key={data.id}>
      <ListNode>
        <StyledImage src={data.frontmatter.thumbnail}/>
        <Category data={data.frontmatter.category}/>
        <StyledLink to={`/${_.kebabCase(data.frontmatter.permalink)}`}>
            {data.frontmatter.title}
        </StyledLink>
      </ListNode>
    </article>
  )
}

export default Card