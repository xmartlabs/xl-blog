import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";

import { classnames } from "../helpers";
import { Pager } from '../components/pager';

import * as styles from "./categories.module.scss";

const CategoriesPage = () => {
  const [ category, setCategory ] = useState("all");

  const filterLinks = () => {
    const filters = [
      {name: "all", display_name: "All"},
      {name: "development", display_name: "Development"},
      {name: "product-design", display_name: "Design"},
      {name: "machine-learning", display_name: "Machine Learning"},
      {name: "blockchain", display_name: "Blockchain"},
      {name: "people-events", display_name: "People"},
    ];
    return (
      <div className={styles.filterContainer} >
          {filters.map((filter) =>
            <Link 
              onClick={() => {setCategory(filter.name)}} 
              className={classnames(styles.filterElement, "text__filter__grayFive", filter.name === category && styles.selectedLink)} 
              to={filter.name === 'all' ? '/' : `/categories/${filter.name}/`}>
              {filter.display_name}
            </Link>
          )}
      </div>
    );
  }

  return (
    <>
      <div>
        {filterLinks()}
      </div>
    </>
  )
};

CategoriesPage.propTypes = {
  data: PropTypes.shape({
    allMd: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
  }),
}

export default CategoriesPage;

export const pageQuery = graphql`{
  allMdx(limit: 2000) {
    group(field: {frontmatter: {category: SELECT}}) {
      fieldValue
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
        }
      }
    }
  }
}`
