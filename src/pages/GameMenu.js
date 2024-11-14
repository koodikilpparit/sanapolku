import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GameMenu.css';
import BackButton from '../components/universal/BackButton';

function GameMenu() {
  const navigate = useNavigate();

  return (
    <div className="game-menu-container">
      {/* Header */}
      <div className="header">
        <BackButton className="gm-back-button" />
        <h2 className="title">Valitse polku</h2>
      </div>

      {/* Buttons for paths */}
      <div className="button-container">
        <button
          className="path-button"
          onClick={() => navigate('/peli/aikuistenpolku')}
        >
          Aikuisten polku
        </button>

        <button
          className="path-button"
          onClick={() => navigate('/peli/lastenpolku')}
        >
          Lasten polku
        </button>

        <button className="path-button" onClick={() => navigate('/omatpolut')}>
          Omat polut
        </button>
      </div>
    </div>
  );
}

export default GameMenu;
