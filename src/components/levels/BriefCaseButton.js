// BriefCaseButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

const BriefCaseButton = ({ onClick, style }) => (
  <button className="briefcase-button" onClick={onClick} style={style}>
    <FontAwesomeIcon icon={faBriefcase} className="briefcase-icon" />
  </button>
);

BriefCaseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default BriefCaseButton;
