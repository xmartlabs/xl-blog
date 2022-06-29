import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

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

const Category = ({ data }) => {
  return (
    <CategoryWrapper>
      <StyledIcon icon={faCircle} size="2xs"></StyledIcon>
      <p className="category">{data}</p>
    </CategoryWrapper>
  )
}

export default Category