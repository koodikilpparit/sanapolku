import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import'./GameEndingPage.css';

const GameEndingPage = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    // Navigate to the same path to restart the game
    navigate(0);
  };

  return (
    <div className="game-ending-page">
      <div className="ending-content">
        <h2>Onnittelut!</h2>
        <p>Suoritit koko polun ja saavuit määränpäähäsi!</p>
        <img
        className="ending-img"
        src="sanapolku/finish-img.png"
        alt="Cottage in serene lake and mountain view"
        />
        <div className="ending-buttons-container">
          <button className="home-button">
          </button>
          <button className="ready-button">
          </button>
          <button className="restart-button" onClick={handleRestart}>
            <FontAwesomeIcon icon={faArrowRotateLeft} className="restart-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndingPage;
