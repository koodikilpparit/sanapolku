import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

function SettingsButton() {
  const navigate = useNavigate();

  return (
    <button className="settings-button" onClick={() => navigate('/asetukset')}>
      <FontAwesomeIcon icon={faCog} className="settings-icon" />
    </button>
  );
}

export default SettingsButton;
