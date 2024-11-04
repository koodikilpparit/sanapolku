import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareShareNodes } from '@fortawesome/free-solid-svg-icons';
import './ShareButton.css';

const ShareButton = ({ onClick }) => {
  return (
    <button className="share-button" onClick={onClick}>
      <FontAwesomeIcon icon={faSquareShareNodes} className="share-icon" />
    </button>
  );
};

ShareButton.propTypes = {
  onClick: PropTypes.func.isRequired, // onClick is required
};

export default ShareButton;
