// TrophyButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

const TrophyButton = ({ onClick, style }) => (
  <button className="trophy-button" onClick={onClick} style={style}>
    <FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
  </button>
);

TrophyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default TrophyButton;
