import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Link } from 'gatsby';

import { Category } from '../category';
import { useCategory, classnames } from '../../helpers';

import * as styles from './card.module.scss';

const Card = ({ data, className, withCategory }) => {
  const categoryBlog = useCategory(data.frontmatter.category);

  const urlImages = () => {
    if (typeof window !== 'undefined') {
      const imageUrl = window.location.origin;
      return `${imageUrl}/${data.frontmatter.thumbnail}`;
    }
    return data.frontmatter.thumbnail;
  };

  return (
    <Link
      className={classnames(styles.styledLink, className)}
      to={`/blog/${_.kebabCase(data.frontmatter.permalink)}`}
    >
      <article key={data.id} className={styles.container}>
        <div className={styles.imageContainer}>
          <img
            alt="Blog Cover"
            className={styles.styledImage}
            src={urlImages()}
            onError={(event) => (event.target.src = '../../images/generic.jpg')}
          />
          {withCategory && (
            <Category
              data={categoryBlog.displayName}
              className={styles.blogListCategory}
            />
          )}
        </div>
        <h1>{data.frontmatter.title}</h1>
      </article>
    </Link>
  );
};

Card.propTypes = {
  data: PropTypes.object.isRequired,
  classNsme: PropTypes.string,
  withCategory: PropTypes.bool,
};

Card.defaultProps = {
  className: '',
  withCategory: false,
};

export { Card };
