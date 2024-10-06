import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../ImageUploader';

function GameMenu() {
  const navigate = useNavigate();
  
  return (
    <div>
        <h2>Valitse polku</h2>
        <button onClick={() => navigate('/')}>Takaisin</button>
        <button>Omat polut</button>
        <ImageUploader/>
    </div>
  );
}

export default GameMenu;
