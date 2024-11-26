import { React, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './SuccessIndicator.css';
import { SettingsContext } from '../../contexts/SettingsContext';

const SuccessIndicator = () => {
  const { sounds } = useContext(SettingsContext);

  useEffect(() => {
    if (sounds) {
      const audio = new Audio(
        process.env.PUBLIC_URL + '/data/audio/oikein.mp3'
      );
      audio.volume = 0.25;
      audio
        .play()
        .catch((err) => console.error('Failed to play success sound:', err));
    }
  }, [sounds]);

  return (
    <div className="success-indicator" data-testid="success-indicator">
      <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
      <p className="success-text">Oikein!</p>
    </div>
  );
};

export default SuccessIndicator;
