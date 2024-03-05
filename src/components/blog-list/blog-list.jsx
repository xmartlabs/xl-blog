import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { Pager } from '../pager';
import { Card } from "../card";
import { ErrorSafeLocalStorage, classnames } from "../../helpers";

import * as styles from "./blog-list.module.scss";

const Categories = {
  all: "All",
  development: "Development",
  "product-design": "Design",
  "machine-learning": "Machine\u00a0Learning",
  blockchain: "Blockchain",
  "people-events": "People",
};

export const BlogList = ({ pageContext, data, location: { pathname } }) => {
  const selectedCategory = pathname.startsWith('/categories/') ? pathname.split('/')[2] : 'all';

  const posts = data?.allMdx?.edges || [];

  // Scroll to desired page height
  const categoryFiltersRef = useRef(null);
  useEffect(() => {
    const scrollTo = ErrorSafeLocalStorage.getItem('scrollTo');
    if (!scrollTo) return;

    ErrorSafeLocalStorage.removeItem('scrollTo');

    const timeout = setTimeout(() => {
    if (scrollTo === 'categories') {
      // Place filters at the top of the viewport and scroll down to account for the navbar
        categoryFiltersRef.current?.scrollIntoView({ behavior: 'instant' });
        window.scrollBy(0,-140);
      } else {
        window.scrollTo(0, Number(scrollTo));
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <div className={styles.filterContainer} ref={categoryFiltersRef}>
        {Object.keys(Categories).map((category) =>
          <Link
            key={category}
            onClick={() => ErrorSafeLocalStorage.setItem('scrollTo', window.scrollY)}
            className={classnames(styles.filterElement, category === selectedCategory && styles.selectedFilterElement)}
            to={category === 'all' ? '/' : `/categories/${category}/`}>
            {Categories[category]}
          </Link>
        )}
      </div>
      <div className={styles.container}>
        {posts.map(({ node }) => <Card data={node} key={node.id} withCategory={false} />)}
      </div>
      <Pager {...pageContext}/>
    </>
  )
};

BlogList.propTypes = {
  data: PropTypes.shape({
    allMdX: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
  }),
}
