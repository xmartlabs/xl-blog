import * as React from 'react';

import { ErrorImage } from '../components/icons/'

const NotFoundPage = () => {
  return (
    <main 
      className="
        flex flex-row justify-center items-center p-[7rem_0_2rem_2.5rem]
        max-sm:flex max-sm:flex-col max-sm:m-0 max-sm:mt-20
      ">
      <a href='/'>
        <ErrorImage className="w-[31rem] max-sm:max-h-[14rem] max-sm:mb-8" />
      </a>
      <div className="flex flex-col ml-20 max-sm:ml-[1rem]">
        <title>Not found</title>
        <h1 className="text-xl-pink font-link mb-16 tracking-[0.1rem] text-heading-one">You've reached the land of lost URLs.</h1>
        <p className="text-paragraph text-blue-one">
          While we dust off the treasure map,<br /> why not explore some other hidden gems on our blog? 💎
        </p>
        <a
          className="text-paragraph text-xl-pink mt-[2rem] max-xs:mt-12 max-xs:mb-20 max-xs:mx-0"
          href="/"
        >
          Show me those golden insights
        </a>
      </div>
    </main>
  );
};

export default NotFoundPage;
