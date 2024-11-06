import React from 'react';
import InstructionsText from './InstructionsText';
import InstructionsImage from './InstructionsImage';
import PropTypes from 'prop-types';

const InstructionsStep = ({ title, text, image }) => {
  return (
    <div>
      <strong>{title}</strong>
      <InstructionsImage image={image} />
      <InstructionsText text={text} />
    </div>
  );
};

InstructionsStep.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default InstructionsStep;
