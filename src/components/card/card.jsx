/* eslint-disable @next/next/no-img-element -- Plain <img> on purpose: the markup must match the old site exactly (pixel-parity tests), and images are served from /images or external URLs as before. */
import React from 'react';

import { classnames } from '../../helpers';

export const CARD_FALLBACK_IMAGE = '/images/generic.jpg';

// `data`: { id, title, slug, thumbnail } (plain, serializable).
const Card = ({ data, className = '' }) => (
  <a
    className={classnames(
      `no-underline transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] 
         hover:translate-y-[-15px] hover:[&_h1]:text-xl-pink
         max-sm:flex max-sm:items-center max-sm:justify-center`,
      className
    )}
    href={`/blog/${data.slug}/`}
  >
    <article className="w-full flex flex-col flex-wrap max-sm:w-[90%]">
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
          src={data.thumbnail || CARD_FALLBACK_IMAGE}
          data-fallback={CARD_FALLBACK_IMAGE}
          // The fallback script may swap `src` before hydration.
          suppressHydrationWarning
        />
      </div>
      <h1 className="text-heading-two-separated text-blue-one font-link max-sm:text-[1.4rem]">
        {data.title}
      </h1>
    </article>
  </a>
);

export { Card };
