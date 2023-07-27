import React, { useEffect, useState } from "react";

import { classnames, findTitles } from "../../helpers";

import * as styles from "./title-blog-index.module.scss";

const TitleBlogIndex = ({ data, refIndexTitles, disappearIndex }) => {
  const [ titleOnView, setTitleOnView ] = useState('');
  const [ selectLink, setSelectLink ] = useState('');

  useEffect(() => {
    window.addEventListener('scroll', getActiveTitle, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', getActiveTitle);
    };
  }, [])

  const getActiveTitle = () => {
    if (typeof window !== 'undefined') {
      if (refIndexTitles.current) {
        const elementList = Array.from(refIndexTitles.current.childNodes);
        const titles = findTitles(elementList);
        const scrollPosition = window.scrollY;
        let activeTitle = titles[0];
        titles.forEach(title => {
          const titleTop = title.getBoundingClientRect().top + window.scrollY - 500;
          if (scrollPosition >= titleTop) {
            activeTitle = title;
          }
        });
        setTitleOnView(activeTitle?.textContent);
        setSelectLink('');
      }
    }
  };
  console.log(disappearIndex)


  return (
    <div className={classnames({[styles.disappearIndex]: disappearIndex}, styles.indexSubContainer)} >
      {data?.map((title) => 
        <a href={"#" + title.id} key={title.id} onClick={() => setSelectLink(title.id)}
          className={classnames(
            { [styles.selectedLink]: title.id === selectLink || titleOnView === title.id},
            styles.links
          )}
        >
          {title.innerText.length > 55 ? title.innerText.slice(0, 55) + "..." : title.innerText}
        </a>
      )}
    </div>
  );
};

export { TitleBlogIndex };
