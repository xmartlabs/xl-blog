import React, { useState, useRef, useEffect } from "react";

import { ArrowIcon } from '../icons';
import { SeeMoreTitles } from "../see-more-titles/see-more-titles";

import { classnames, findTitles } from "../../helpers";

import * as styles from "./title-blog-index.module.scss";

const TitleBlogIndex = ({ data, refIndexTitles, disappearIndex }) => {
  const [titleOnView, setTitleOnView] = useState('');
  const [selectLink, setSelectLink] = useState('');
  const [isTopArrow, setIsTopArrow] = useState(false);
  const [isBottomArrow, setIsBottomArrow] = useState(false);
  const linksContainerRef = useRef(null);
  const indexContainerRef = useRef(null);
  const [ heightVariation, setHeightVariation ] = useState();

  useEffect(() => {
    window.addEventListener('scroll', getActiveTitle, { passive: true });

    return () => {
      window.removeEventListener('scroll', getActiveTitle);
    };
  }, []);

  useEffect(() => {
    if (linksContainerRef.current && indexContainerRef.current) {
      const indexHeight = indexContainerRef.current.clientHeight;
      const linksHeight = linksContainerRef.current.clientHeight;
  
      const heightDifference = indexHeight - linksHeight;

      if (heightDifference < 650) {
        setHeightVariation(heightDifference);
        setIsTopArrow(heightDifference < 0 || heightDifference > 0);
        setIsBottomArrow(linksContainerRef.current.scrollToTop == 0);
      }
    }
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
  
  const scrollToBottom = () => {    
    linksContainerRef.current.scrollTo({
      top: heightVariation,
      behavior: 'smooth',
    });
  
    setIsTopArrow(false);
    setIsBottomArrow(true);
  };
  
  const scrollToTop = () => {
    linksContainerRef.current.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  
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
      <div className={styles.heightContainer} ref={indexContainerRef}>
        <div className={classnames({[styles.disappearIndex]: disappearIndex}, styles.indexSubContainer)} ref={linksContainerRef}>
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
