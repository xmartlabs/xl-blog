import React, { useState, useRef, useEffect } from "react";

import { ArrowIcon } from '../icons';
import { SeeMoreTitles } from "../see-more-titles/see-more-titles";

import { classnames, findTitles } from "../../helpers";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (linksContainerRef.current && indexContainerRef.current) {
      const indexHeight = indexContainerRef.current.clientHeight;
      const linksHeight = linksContainerRef.current.clientHeight;
  
      const heightDifference = indexHeight - linksHeight;

      if (heightDifference < 650) {
        setHeightVariation(heightDifference);
        setIsTopArrow(heightDifference < 0 || heightDifference > 0);
        setIsBottomArrow(linksContainerRef.current.scrollToTop === 0);
      }
    }
  }, [linksContainerRef, indexContainerRef]);

  const getActiveTitle = () => {
    if (refIndexTitles.current) {
      const elementList = Array.from(refIndexTitles.current.childNodes);
      const titles = findTitles(elementList);
      const activeTitle = titles.findLast((title) => title.getBoundingClientRect().top <= 500) || titles[0];
      setTitleOnView(activeTitle.textContent);
      setSelectLink('');      

      if (titles.length > 8) {
        if (titles[titles.length -2].textContent === activeTitle.textContent || titles[titles.length -1].textContent === activeTitle.textContent) {
          linksContainerRef.current.scrollTo({
            top: 600,
            behavior: 'smooth',
          });
  
          setIsTopArrow(false);
          setIsBottomArrow(true);
        } else {
          linksContainerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          setIsTopArrow(true);
          setIsBottomArrow(false);
        }
      } 
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
          className={classnames({"hidden": disappearIndex})} 
          children={
            <ArrowIcon 
              className="pt-8 px-4 pb-0 transform rotate-180 w-auto h-auto max-sm:hidden [@media(max-height:_992px)]:mt-[1%]"
            />
          }  
        /> 
      }
      {isBottomArrow && 
        <SeeMoreTitles 
          onClick={scrollToTop} 
          className={classnames({"hidden": disappearIndex})} 
          children={<ArrowIcon className="py-0 px-4 w-auto h-auto max-sm:hidden [@media(max-height:_992px)]:mt-[1%]" />}  
        /> 
      }
      <div className="flex flex-row items-start w-[20%] mr-[5%] scroll-smooth fixed top-[22%] h-[70vh]" ref={indexContainerRef}>
        <div className={classnames({"!hidden": disappearIndex}, "fixed top-22p w-[20%] mr-5p flex flex-row flex-wrap items-start max-h-[76vh] overflow-y-hidden scroll-smooth max-sm:hidden")} ref={linksContainerRef}>
          {data?.map((title) => 
            <a
              href={"#" + title.id}
              key={title.id}
              onClick={() => setSelectLink(title.id)}
              className={classnames({
                "font-black bg-[url('/images/index-blog-dot.png')] bg-[position:0_0.4rem] bg-[background-size:0.5rem_0.5rem] bg-no-repeat": title.id === selectLink || titleOnView === title.id},
                "text-xl text-blue-one no-underline font-primary pb-[2.5rem] h-auto overflow-hidden pl-[1.5rem] w-full"
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
