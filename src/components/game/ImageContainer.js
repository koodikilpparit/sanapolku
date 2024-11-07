import React from 'react';
import PropTypes from 'prop-types';

const ImageContainer = ({ src, alt }) => (
  <div className="flex h-full items-center justify-center sm:items-start p-4">
    <img className="h-full aspect-square" src={src} alt={alt} />
  </div>
);

ImageContainer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ImageContainer;
