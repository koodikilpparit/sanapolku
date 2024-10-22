// src/components/start/StartButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';

function ShareButton() {
  const navigate = useNavigate();

  return (
    <button className="start-button" onClick={() => navigate('/jaa')}>
      <FontAwesomeIcon icon={faShare} className="start-icon" />
      Jaa
    </button>
  );
}

export default ShareButton;
