import React from 'react';
import { useNavigate } from 'react-router-dom';

function Instructions() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Pelin ohjeet</h2>
      <button onClick={() => navigate('/')}>Takaisin</button>
    </div>
  );
}

export default Instructions;
