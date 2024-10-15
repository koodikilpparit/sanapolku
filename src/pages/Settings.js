import React from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Asetukset</h2>
      <button onClick={() => navigate('/')}>Takaisin</button>
    </div>
  );
}

export default Settings;
