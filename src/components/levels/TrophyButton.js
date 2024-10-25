// TrophyButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

const TrophyButton = ({ onClick }) => (
  <button className="trophy-button" onClick={onClick}>
    <FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
  </button>
);

TrophyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default TrophyButton;