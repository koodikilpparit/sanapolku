import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './SuccessIndicator.css';

const SuccessIndicator = () => {
  return (
    <div className="success-indicator" data-testid="success-indicator">
      <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
      <p className="success-text">Oikein!</p>
    </div>
  );
};

export default SuccessIndicator;
