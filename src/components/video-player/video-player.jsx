import React from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ name, id, width, height, title }) => {
  if (id) {
    return (
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }
  return (
    <video
      width={width}
      height={height}
      src={`/images/${name}`}
      title={title}
      allowFullScreen
      controls={true}
    />
  );
};

VideoPlayer.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
};

VideoPlayer.defaultProps = {
  width: '100%',
  height: '560px',
  title: 'Xmartlabs',
};

export { VideoPlayer };
