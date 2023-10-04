import React from "react";
import _ from "lodash";

import { Link } from "gatsby";

import { Category } from "../category";
import { useCategory } from '../../helpers';

const TopPostHome = ({ data }) => {
  const categoryBlog = useCategory(data.frontmatter.category);

  const urlImages = () => {
    if (typeof window !== 'undefined') {
      const imageUrl = window.location.origin;
      return `${imageUrl}/${data.frontmatter.thumbnail}`;
    }
    return data.frontmatter.thumbnail;
  }

  return (
    <article>
      <img alt="Blog Cover" src={urlImages()} onError={(event) => event.target.src = '../../images/generic.jpg'} />
      <div>
        <Link to={`/${_.kebabCase(data.frontmatter.permalink)}`}></Link>
        <Category data={categoryBlog.displayName} />
      </div>
    </article>
  );
};

export { TopPostHome };
