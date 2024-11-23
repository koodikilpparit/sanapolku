import { useEffect, useRef, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SettingsContext } from '../../contexts/SettingsContext';

const BackgroundMusic = () => {
  const { music, volume = 0.25 } = useContext(SettingsContext);
  const location = useLocation();
  const audioRef = useRef(null);
  const [isAudioReady, setAudioReady] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const fadeIntervalRef = useRef(null);

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
      clearInterval(fadeIntervalRef.current);
    };
  }, [isAudioReady]);

  useEffect(() => {
    const audio = audioRef.current;

    if (isAudioReady && music) {
      audio.loop = true;

      if (location.pathname.startsWith('/peli')) {
        // Fade out the audio over 2.5 seconds when entering the game
        fadeAudio(audio, currentVolume, 0, 1250);
      } else {
        // Fade in the audio over 2.5 seconds when leaving the game
        fadeAudio(audio, audio.volume, volume, 2500);
      }

      audio.play().catch((err) => {
        console.error('Audio playback failed:', err);
      });
    } else if (isAudioReady) {
      // Fade out the audio if music is disabled
      fadeAudio(audio, currentVolume, 0, 0);
    }
  }, [music, volume, location.pathname, isAudioReady, currentVolume]);

  const fadeAudio = (audio, fromVolume, toVolume, duration) => {
    clearInterval(fadeIntervalRef.current);
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = (toVolume - fromVolume) / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = fromVolume + volumeStep * currentStep;
      audio.volume = Math.max(0, Math.min(newVolume, 1));
      setCurrentVolume(audio.volume);

      if (currentStep >= steps) {
        clearInterval(fadeIntervalRef.current);
        if (toVolume === 0) {
          audio.pause();
        }
      }
    }, stepDuration);
  };

  return null;
};

export default BackgroundMusic;
