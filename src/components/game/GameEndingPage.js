import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import './GameEndingPage.css';

const GameEndingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="ending-content">
      <h2>Onnittelut!</h2>
      <p>Suoritit koko polun ja saavuit määränpäähäsi!</p>
      <img
        className="ending-img"
        src={`${process.env.PUBLIC_URL}/finish-img.png`}
        alt="Cottage in serene lake and mountain view"
      />
      <div className="ending-buttons-container">
        <button
          className="home-button"
          onClick={() => navigate('/')}
          aria-label="Go to Start Page"
        >
          <FontAwesomeIcon icon={faHouse} className="home-icon" />
        </button>
        <button
          className="ready-button"
          onClick={() => navigate('/polut')}
          aria-label="Go to Game Menu"
        >
          VALMIS
        </button>
        <button
          className="restart-button"
          onClick={() => navigate(0)}
          aria-label="Restart Game"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} className="restart-icon" />
        </button>
      </div>
    </div>
  );
};

export default GameEndingPage;
