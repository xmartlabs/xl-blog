import React from "react";

import { HeaderCircleIcon } from "../icons";

const HeaderBanner = () => {
  const reuseCat = (
    <>
      <span>Development</span>
      <span>•</span>
      <span>Design</span>
      <span>•</span>
      <span>Machine Learning</span>
      <span>•</span>
      <span>Strategy</span>
      <span>•</span>
      <span>People</span>
      <span>•</span>
      <span>QA</span>
      <span>•</span>
    </>
  );

  return (
    <div className="bg-blue-six h-[80vh] max-h-[47rem] pt-[6rem] flex flex-col max-xs:h-auto">
      <div
        className="
          flex flex-row w-full h-full bg-no-repeat
          bg-[radial-gradient(circle_at_right,_rgb(219,255,0)_-15%,_rgb(244,247,252)_25%)]
          max-xs:bg-[radial-gradient(circle_at_right,_rgb(219,255,0)_-60%,_rgb(244,247,252)_50%)]
        "
      >
        <div
          className="
            flex flex-col items-start justify-center h-full pl-[16%] 
            max-md:pl-[15%] max-xs:pl-[5%] max-xs:my-28
          "
        >
          <h1
            className="
              text-heading-one-big text-xl-pink w-[60%] mb-6 font-link 
              max-xs:text-[2.875rem] max-xs:leading-[3rem] max-xs:w-full
            "
          >
            Expertise at your fingertips
          </h1>
          <p
            className="
              font-normal uppercase text-heading-two text-xl-pink font-primary
              max-xs:text-[1.125rem] max-xs:leading-[1.625rem] max-xs:w-full
            "
          >
            Access our Insights on Technology, Product, Design, & more
          </p>
        </div>
        <div className="block absolute h-fit w-fit top-[20%] left-[58%] animate-pink-circle-move max-xs:hidden">
          <HeaderCircleIcon/>
        </div>
      </div>
      <div className="bg-[#DBFF00] h-[3.125rem] overflow-hidden max-w-full max-xs:h-[2.75rem]">
        <div
          className="
            w-min mt[0.1rem] animate-style-move
            [&_span]:text-header-categories [&_span]:max-xs:text-[1.125rem]
            [&_span]:max:xs-leading-[1.625rem] [&_span]:max:xs-tracking[0.0675rem]
          "
        >
          <div 
            className="
              tracking-[0.11rem] uppercase inline-flex whitespace-nowrap font-title text-blue-one 
              max-xs:text-[1.125rem] max-xs:leading-[1.625rem] max-xs:tracking-[0.0675rem]
            "
          >
            {reuseCat}
          </div>
          <div className="absolute cursor-default inline-flex whitespace-nowrap font-title tracking-[0.11rem] uppercase">
            {reuseCat}
            {reuseCat}
          </div>
        </div>
      </div>
    </div>
  );
}

export { HeaderBanner };
