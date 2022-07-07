import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

export const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  color: #F6C14D;
`

export const StyledIcon = styled(FontAwesomeIcon)`
  position: relative;
  top: 0.4em;
  height: 0.438rem;
  width: 0.438rem;
`

const Category = ({ data }) => (
    <CategoryWrapper>
      <StyledIcon icon={faCircle}></StyledIcon>
      <p className="category">{data}</p>
    </CategoryWrapper>
)

export default Category
