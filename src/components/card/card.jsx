import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { Link } from "gatsby";

import { Category } from "../category";
import { useCategory, classnames } from '../../helpers';

const Card = ({ data, className, withCategory }) => {
  const categoryBlog = useCategory(data.frontmatter.category);

  const urlImages = () => {
    if (typeof window !== 'undefined') {
      const imageUrl = window.location.origin;
      return `${imageUrl}/${data.frontmatter.thumbnail}`;
    }
    return data.frontmatter.thumbnail;
  }

  return (
    <Link
      className={classnames(
        `no-underline transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] 
         hover:translate-y-[-15px] hover:[&_h1]:text-xl-pink
         max-sm:flex max-sm:items-center max-sm:justify-center`,
        className)}
      to={`/blog/${_.kebabCase(data.frontmatter.permalink)}`}
    >
      <article key={data.id} className="w-full flex flex-col flex-wrap max-sm:w-[90%]">
        <div
          className="
            block mb-[1.5rem] relative pb-[56.25%]
            max-sm:w-full max-sm:pb-[43%]
            [&_p]:absolute [&_p]:bottom-[1rem] [&_p]:left-[1rem]
          "
        >
          <img
            alt="Blog Cover"
            className="w-full h-full absolute top-0 left-0 rounded-[3%] object-cover object-left"
            src={urlImages()}
            onError={(event) => event.target.src = '../../images/generic.jpg'} 
          />
          {withCategory && 
            <Category
              data={categoryBlog.displayName}
              className="text-category-bold text-blue-one border-[1.5px] border-neutral-100 bg-neutral-100 h-[1.8rem] p-[0_1rem] uppercase tracking-[0.1rem] font-semibold"
            />
          }
        </div>
        <h1 className="text-heading-two-separated text-blue-one font-link max-sm:text-[1.4rem]">
          {data.frontmatter.title}
        </h1>
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
