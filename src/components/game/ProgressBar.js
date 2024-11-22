// src/components/ProgressBar.js
import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/ProgressBar.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar" data-testid="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
};

export default ProgressBar;
