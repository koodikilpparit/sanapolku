import React from 'react';
import PropTypes from 'prop-types';
import './InstructionsStep.css';

const InstructionsStep = ({ title, text, image }) => {
  return (
    <div className="instruction-step">
      <strong className="instruction-title">{title}</strong>
      <div className="instruction-image">
        <img src={image} alt={title} />
      </div>
      <div className="instruction-text">
        <p>{text}</p>
      </div>
    </div>
  );
};

InstructionsStep.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default InstructionsStep;
