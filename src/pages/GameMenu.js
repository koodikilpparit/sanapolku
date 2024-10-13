import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameMenu() {
  const navigate = useNavigate();
  
  return (
    <div>
        <h2>Valitse polku</h2>
        <button onClick={() => navigate('/')}>Takaisin</button>
        <button onClick={() => navigate('/omatpolut')}>Omat polut</button>
    </div>
  );
}

export default GameMenu;
