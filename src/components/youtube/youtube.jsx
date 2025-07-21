import React from 'react';
import PropTypes from 'prop-types';

const Youtube = ({ id, width, height, title }) => {
  return (
    <iframe width={width} height={height} src={`https://www.youtube.com/embed/${id}`} title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>);
};

Youtube.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
};

Youtube.defaultProps = {
  width: '100%',
  height: '560px',
  title: 'Xmartlabs',
};

export { Youtube };