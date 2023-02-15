import React from "react";

import { Link } from "gatsby";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

import { Card } from "../card";

import * as styles from './more-blogs-section.module.scss';

const MoreBlogsSection = ({ data, refMoreFrom, title }) => {
  const { edges } = data.allMdx;
  return (
    <div className={styles.moreFromXlContainer} ref={refMoreFrom} >
      <div className={styles.titleContainer}>
        <Link to="/" className={classnames("text__heading__three__blueTwo", styles.titleStyle)}>{`${title} →`}</Link>
      </div>
      <div className={styles.blogsContainer}>
        {edges.map(({node}) => <Card data={node} key={node.id} className={styles.cardStyles} />)}
      </div>
    </div>
  );
}

export { MoreBlogsSection };

MoreBlogsSection.propTypes = {
  refMoreFrom: PropTypes.object,
  title: PropTypes.string,
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string,
          body: PropTypes.string,
          frontmatter: PropTypes.shape({
            author: PropTypes.string,
            category: PropTypes.string.isRequired,
            date: PropTypes.string,
            permalink: PropTypes.string.isRequired,
            tags: PropTypes.array,
            thumbnail: PropTypes.string,
            title: PropTypes.string.isRequired,
          })
        })
      })
    }),
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        author: PropTypes.string,
        category: PropTypes.string,
        date: PropTypes.string,
        tags: PropTypes.array,
        title: PropTypes.string,
      })
    })
  })
};
