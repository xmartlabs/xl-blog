import React from 'react';

import { classnames } from '../../helpers';

const Category = ({ data, className = '' }) => (
  <p
    className={classnames(
      'border-0 rounded-[6.49875px] h-[1.4rem] mr-8 text-center font-primary',
      className
    )}
  >
    {data}
  </p>
);

export { Category };
