import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from "../common";

const LAYOUT_TYPES = {
  HOME: 'home',
};

const IPropTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
  layoutType: PropTypes.oneOf(Object.values(LAYOUT_TYPES)).isRequired,
};

const layoutIsValid = (layoutType) => Object.values(LAYOUT_TYPES).includes(layoutType);

const Layout = (props) => {
  if (!layoutIsValid(props.layoutType)) {
    throw new Error(`Invalid value for \`layoutType\`, was "${props.layoutType}"`);
  }
  if (props.layoutType === LAYOUT_TYPES.HOME) {
    return (
      <div>
        <Toolbar withGetStartedButton />
        {props.children}
      </div>
    );
  }

  return (
    <div>
      {props.children}
    </div>
  );
};

Layout.propTypes = IPropTypes;

export { Layout, LAYOUT_TYPES };
