// src/components/start/StartButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';

function ShareButton() {
  const navigate = useNavigate();

  return (
    <button className="share-button" onClick={() => navigate('/jakaminen')}>
      <FontAwesomeIcon icon={faShare} className="start-icon" />
      Polun jakaminen
    </button>
  );
}

export default ShareButton;
