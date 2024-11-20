import { useEffect, useRef, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SettingsContext } from '../../contexts/SettingsContext';

const BackgroundMusic = () => {
  const { music, volume = 0.5 } = useContext(SettingsContext);
  const location = useLocation();
  const audioRef = useRef(null);
  const [isAudioReady, setAudioReady] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('sanapolku/data/audio/hittibiisi.mp3');
    }

    const audio = audioRef.current;

    const handleUserInteraction = () => {
      if (!isAudioReady) {
        audio
          .play()
          .then(() => {
            setAudioReady(true);
          })
          .catch((err) => {
            console.error('Audio playback failed on interaction:', err);
          });
      }
    };

    // Attach user interaction handler to enable audio playback
    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isAudioReady]);

  useEffect(() => {
    const audio = audioRef.current;

    if (isAudioReady && music) {
      audio.loop = true;

      // Mute the sound when the user is in the game
      if (location.pathname.startsWith('/peli')) {
        audio.volume = 0;
      } else {
        audio.volume = volume;
      }

      audio.play().catch((err) => {
        console.error('Audio playback failed:', err);
      });
    } else if (isAudioReady) {
      audio.volume = 0;
    }
  }, [music, volume, location.pathname, isAudioReady]);

  return null;
};

export default BackgroundMusic;
