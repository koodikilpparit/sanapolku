import React from 'react';
import PropTypes from 'prop-types';

const InstructionsImage = ({ image }) => {
  return (
    <div className="">
      <img src={image} alt="Pelin vaihe" />
    </div>
  );
};

InstructionsImage.propTypes = {
  image: PropTypes.string.isRequired,
};

export default InstructionsImage;
