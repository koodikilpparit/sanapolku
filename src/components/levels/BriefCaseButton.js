// BriefCaseButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

const BriefCaseButton = ({ onClick }) => (
  <button className="briefcase-button" onClick={onClick}>
    <FontAwesomeIcon icon={faBriefcase} className="briefcase-icon" />
  </button>
);

BriefCaseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default BriefCaseButton;