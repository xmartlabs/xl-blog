import React, { useEffect, useContext, useState } from "react";
import { graphql } from "gatsby";

import { Card } from '../components/card';
import { Pager } from '../components/pager';
import { AppContext, BannerType } from '../config/context';

import { classnames } from "../helpers";

import * as styles from "./blog-list.module.scss";

const BlogList = ({ pageContext, data }) => {
  const _ = require("lodash")    
  const { edges, totalCount } = data.allMdx;
  const { setState } = useContext(AppContext);
  const [ category, setCategory ] = useState("all");

  useEffect(() => {
    setState(BannerType.home);
  }, []);
  
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
          <li onClick={() => {setCategory(filter.name)}} className={classnames(styles.filterElement, "text__filter__grayFive", filter.name === category && styles.selectedLink)}>
            {filter.display_name}
          </li>
          )}
      </div>
    );
  }

  const filters = () => {
    if (category !== "all") {
      const blogsCategory = edges.filter(({ node }) => node.frontmatter.category === category);
      return blogsCategory.map(({ node }) => <Card data={node} key={node.id} withCategory={true} />);
    } else {
      return edges.map(({ node }) => <Card data={node} key={node.id} withCategory={true} />);
    }
  };

  return (
    <>
      {filterLinks()}
      <div className={styles.container} >
        {filters()}
      </div>
      <Pager pageContext={pageContext}/>
    </>
  );
};

export default BlogList;

export const blogListQuery = graphql`query blogListQuery($skip: Int!, $limit: Int!) {
  allMdx(sort: {frontmatter: {date: DESC}}, limit: $limit, skip: $skip) {
    totalCount
    edges {
      node {
        fields {
          slug
        }
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
      }
    }
  }
}`
