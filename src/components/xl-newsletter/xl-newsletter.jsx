import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby";

import { CloseIcon } from "../icons"

const XlNewsletter = () => (
  <div 
    className="
      flex flex-row w-[55rem] h-[17rem] bg-blue-one opacity-90 mb-20rounded-lg py-0 pr-8 pl-16
      shadow-[0px_7.07671px_24.7685px_-5.30753px_#18274b1e,0px_15.9226px_77.8438px_-3.53836px_#18274b1e]
      max-sm:flex max-sm:flex-col max-sm:items-center max-sm:w-[22rem] max-sm:h-[33rem] max-sm:p-0
    "
  >
    <div className="flex flex-col items-center justify-center h-full w-[6.3rem] max-sm:h-[33%]">
      <Link to="/" className="bg-neutral100 max-h-[99px] max-w-[97px]">
        <StaticImage    
          src="../../../static/images/newsletter-xl/logo-xl.png"
          alt="Xmartlabs logo"
          layout="fixed"
          width={100}
          height={100}
        />
      </Link>
    </div>
    <div className="flex flex-col ml-16 max-sm:max-w-[19rem] max-sm:ml-0">
      <h2 className="text-heading-two text-neutral-100">Xmartlabs´ Newsletter</h2>
      <p className="text-paragraph-two text-default-gray w-[32rem] max-sm:w-full max-sm:text-center max-sm:text-base">Subscribe to our newsletter and get updates on AI, Computer Vision as well as mobile and web development.</p>
      <div className="flex flex-row items-center justify-center mt-4 max-sm:flex max-sm:flex-col max-sm:w-full max-sm:self-center">
        <input
          placeholder="Type your email..."
          className="
            text-placeholder text-gray-three h-10 w-[19rem] border-transparent rounded-tl-[0.2rem] rounded-bl-[0.2rem] outline-none placeholder:pl-[1rem]
            max-sm:mb-[1rem] max-sm:rounded-[0.2rem] max-sm:w-full"
        />
        <button
          className="
            text-paragraph-small text-neutral-100 w-[12.7rem] h-[2.5rem] bg-xl-pink border-transparent cursor-pointer
            max-sm:w-full
          "
          onClick={() => {}}
        >
          SUBSCRIBE
        </button>
      </div>
    </div>
    <CloseIcon className="mt-8 w-[20px] h-[21px] fill-white-two max-sm:absolute max-sm:left-[16rem] max-sm:mt-[1.5rem]" />
  </div>
);

export { XlNewsletter };
