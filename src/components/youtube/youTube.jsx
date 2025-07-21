import React from 'react';
import PropTypes from 'prop-types';

const YouTube = ({ id, width, height, title }) => {
  return (
    <iframe width={width} height={height} src={`https://www.youtube.com/embed/${id}`} title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>);
};

YouTube.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
};

YouTube.defaultProps = {
  width: '100%',
  height: '560px',
  title: 'Xmartlabs',
};

export { YouTube };