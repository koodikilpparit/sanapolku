import React from 'react';
import PropTypes from 'prop-types';

const ImageContainer = ({ src, alt }) => (
  <div className="">
    <img
      className="w-full max-w-[60vw] sm:max-w-[40vw] aspect-square"
      src={src}
      alt={alt}
    />
  </div>
);

ImageContainer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ImageContainer;
