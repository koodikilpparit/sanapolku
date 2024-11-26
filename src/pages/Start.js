import React, { useEffect, useRef, useState } from 'react';
import SettingsButton from '../components/start/SettingsButton';
import InstallButton from '../components/start/InstallButton';
import StartButton from '../components/start/StartButton';
import HelpButton from '../components/start/HelpButton';
import LetterTile from '../components/start/LetterTile';
import './Start.css';

function Start() {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const installEventRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      installEventRef.current = e;
      setShowInstallButton(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
    });
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = installEventRef.current;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      installEventRef.current = null; // Reset the prompt
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
