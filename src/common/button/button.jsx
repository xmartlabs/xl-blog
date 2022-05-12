import React from 'react';
import {
  node, oneOf, string, bool, func,
} from 'prop-types';

import { LoadingDots } from "../loading";
import { classnames } from "../../helpers";
import styles from './button.module.scss';

const Button = ({
  buttonStyle, className, children, loading, onClick, ...props
}) => {
  const onClickNoop = (event) => event.preventDefault();

  return (
    <button
      className={classnames(className, 'buttonText', styles.button, styles[buttonStyle])}
      type="button"
      onClick={loading ? onClickNoop : onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {
        loading
          ? <LoadingDots className={classnames({ [styles.secondaryLoading]: buttonStyle === 'secondary' })} />
          : children
       }
    </button>
  );
};

Button.propTypes = {
  className: string,
  buttonStyle: oneOf(['primary', 'secondary']),
  children: node,
  loading: bool,
  onClick: func,
};

Button.defaultProps = {
  className: '',
  buttonStyle: 'primary',
  children: null,
  loading: false,
  onClick: null,
};

export { Button };
