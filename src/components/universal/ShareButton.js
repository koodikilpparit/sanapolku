import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareShareNodes } from '@fortawesome/free-solid-svg-icons';
import './ShareButton.css';

const ShareButton = () => {
  const navigate = useNavigate();

  return (
    <button className="share-button" onClick={() => navigate('/jakaminen')}>
      <FontAwesomeIcon icon={faSquareShareNodes} className="share-icon" />
    </button>
  );
};

ShareButton.propTypes = {
  path: PropTypes.string.isRequired, // path is required
};

export default ShareButton;
