import React from 'react';
import { string } from 'prop-types';
import {classnames} from "../../helpers";
import styles from './loading-dots.module.scss';

const LoadingDots = ({ className }) => (
  <div className={classnames(styles.spinner, className)}>
    <div className={classnames(styles.dotColor, styles.bounce1)} />
    <div className={classnames(styles.dotColor, styles.bounce2)} />
    <div className={classnames(styles.dotColor, styles.bounce3)} />
  </div>
);

LoadingDots.propTypes = {
  className: string,
};

LoadingDots.defaultProps = {
  className: '',
};

export { LoadingDots };
