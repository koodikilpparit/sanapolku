import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GameMenu.css';
import Header from '../components/universal/Header'

function GameMenu() {
  const navigate = useNavigate();

  return (
    <div className="game-menu-page">
      {/* Header */}
      <Header
          title="Valitse polku"
          onClick={null}
        />

      {/* Buttons for paths */}
      <div className="button-list">

      <div className="button-item-container">
          <button
            className="path-button"
            onClick={() => navigate('/peli/aikuistenpolku')}
          >
            Aikuisten polku
          </button>
        </div>

        <div className="button-item-container">
          <button
            className="path-button"
            onClick={() => navigate('/peli/lastenpolku')}
          >
            Lasten polku
          </button>
        </div>

        <div className="button-item-container">
          <button
            className="path-button"
            onClick={() => navigate('/omatpolut')}
          >
            Omat polut
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameMenu;
