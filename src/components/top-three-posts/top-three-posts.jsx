import React from "react";
import _ from "lodash";

import { Category } from "../category/category";
import { Link } from "@reach/router";

const urlImages = () => {
  if (typeof window !== 'undefined') {
    const imageUrl = window.location.origin;
    return `${imageUrl}/${data.frontmatter.thumbnail}`;
  }
  return data.frontmatter.thumbnail;
}

const TopThreePosts = ({ posts }) => {

  return (
    <div>
      {posts.map(post => 
        <article>
          <img alt="Blog Cover" src={urlImages()} onError={(event) => event.target.src = '../../images/generic.jpg'} />
          <div>
            <Link to={`/${_.kebabCase(post.frontmatter.permalink)}`}>{post.title}</Link>
            <Category data={post.category} />
          </div>
        </article>
      )}
    </div>
  );
};

export { TopThreePosts };
