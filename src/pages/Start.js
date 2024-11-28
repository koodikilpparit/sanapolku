import React, { useContext, useEffect, useState } from 'react';
import SettingsButton from '../components/start/SettingsButton';
import InstallButton from '../components/start/InstallButton';
import StartButton from '../components/start/StartButton';
import HelpButton from '../components/start/HelpButton';
import LetterTile from '../components/start/LetterTile';
import './Start.css';
import { SettingsContext } from '../contexts/SettingsContext';

function Start() {
  const [showInstallButton, setShowInstallButton] = useState(false);

  const { installEvent, setInstallEvent } = useContext(SettingsContext);

  useEffect(() => {
    setShowInstallButton(!!installEvent);
  }, [installEvent]);

  const handleInstallClick = async () => {
    if (installEvent) {
      installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallEvent(null);
    }
  };

  return (
    <div className="start-page">
      <div className="str-top-bar">
        <SettingsButton className="settings-button" />
        {showInstallButton && <InstallButton onClick={handleInstallClick} />}
      </div>
      <div className="str-center-area">
        <div className="logo">
          <div className="logo-upper">
            <LetterTile letter={'S'} />
            <LetterTile letter={'A'} />
            <LetterTile letter={'N'} />
            <LetterTile letter={'A'} />
          </div>
          <div className="logo-lower">
            <LetterTile letter={'P'} />
            <LetterTile letter={'O'} />
            <LetterTile letter={'L'} />
            <LetterTile letter={'K'} />
            <LetterTile letter={'U'} />
          </div>
        </div>
        <div className="start-button">
          <StartButton />
        </div>
        <div className="help-button">
          <HelpButton />
        </div>
      </div>
    </div>
  );
}

export default Start;
