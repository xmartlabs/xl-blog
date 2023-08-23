import React, { useEffect, useState, useRef } from "react";

import { ArrowIcon } from '../icons';
import { SeeMoreTitles } from "../see-more-titles/see-more-titles";

import { classnames, findTitles } from "../../helpers";

import * as styles from "./title-blog-index.module.scss";

const TitleBlogIndex = ({ data, refIndexTitles, disappearIndex }) => {
  const [titleOnView, setTitleOnView] = useState('');
  const [selectLink, setSelectLink] = useState('');
  const [isTopArrow, setIsTopArrow] = useState(false);
  const [isBottomArrow, setIsBottomArrow] = useState(false);
  const subContainerRef = useRef(null);
  const viewContainerRef = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', getActiveTitle, { passive: true });

    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('scroll', getActiveTitle);
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  const getActiveTitle = () => {
    if (refIndexTitles.current) {
      const elementList = Array.from(refIndexTitles.current.childNodes);
      const titles = findTitles(elementList);
      const activeTitle = titles.findLast((title) => title.getBoundingClientRect().top <= 500) || titles[0];
      setTitleOnView(activeTitle.textContent);
      setSelectLink('');
    }
  };

  const checkOverflow = () => {
    if (subContainerRef.current && viewContainerRef.current) {
      const viewContainerHeight = viewContainerRef.current.clientHeight;
      const subContainerHeight = subContainerRef.current.scrollHeight;
      setIsTopArrow(subContainerHeight > viewContainerHeight);
      setIsBottomArrow(subContainerRef.current.scrollTop > 0);

      console.log("Sub" + subContainerHeight)
      console.log("Container" + viewContainerHeight)
    }
  }

  const scrollToBottom = () => {
    if (subContainerRef.current && viewContainerRef.current) {
      const viewContainerHeight = viewContainerRef.current.clientHeight;
      subContainerRef.current.scrollTo({
        top: subContainerRef.current.scrollHeight - viewContainerHeight,
        behavior: 'smooth',
      });
    }
    setIsTopArrow(false);
    setIsBottomArrow(true);
  };

  const scrollToTop = () => {
    if (subContainerRef.current) {
      subContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsTopArrow(true);
    setIsBottomArrow(false);
  };

  return (
    <>
      {isTopArrow && 
        <SeeMoreTitles 
          onClick={scrollToBottom} 
          className={classnames({[styles.disappearIndex]: disappearIndex})} 
          children={<ArrowIcon className={styles.topArrow}/>}  
        /> 
      }
      {isBottomArrow && 
        <SeeMoreTitles 
          onClick={scrollToTop} 
          className={classnames({[styles.disappearIndex]: disappearIndex})} 
          children={<ArrowIcon className={styles.bottomArrow}/>}  
        /> 
      }
      <div className={styles.heightContainer} ref={viewContainerRef}>
        <div className={classnames({[styles.disappearIndex]: disappearIndex}, styles.indexSubContainer)} ref={subContainerRef}>
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
      </div>
    </>
  );
};

export { TitleBlogIndex };
