import React from "react";

import { Link } from "gatsby";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

import { Card } from "../card";

import * as styles from './more-blogs-section.module.scss';

const MoreBlogsSection = ({ relatedPosts, refMoreFrom, title }) => (
  <div className={styles.moreFromXlContainer} ref={refMoreFrom} >
    <div className={styles.titleContainer}>
      <Link to={`/categories/${title}`} className={classnames("text__heading__three__blueTwo", styles.titleStyle)}>More from <span>{title}</span>→</Link>
    </div>
    <div className={styles.blogsContainer}>
      {relatedPosts.slice(0, 3).map((post) => <Card data={post} key={post.frontmatter.title} className={styles.cardStyles} />)}
    </div>
  </div>
);

export { MoreBlogsSection };

MoreBlogsSection.propTypes = {
  refMoreFrom: PropTypes.object,
  title: PropTypes.string,
  refMoreFrom: PropTypes.shape({
    current: PropTypes.object,
  }),
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string,
          body: PropTypes.string,
          frontmatter: PropTypes.shape({
            author: PropTypes.string,
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
        date: PropTypes.string,
        tags: PropTypes.array,
        title: PropTypes.string,
      })
    })
  })
};

MoreBlogsSection.defaultProps = {
  refMoreFrom: {current: null},
  title: '',
};
