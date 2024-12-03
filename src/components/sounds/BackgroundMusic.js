import { useEffect, useRef, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SettingsContext } from '../../contexts/SettingsContext';

const PUBLIC_URL = process.env.PUBLIC_URL;
const BackgroundMusic = () => {
  const { music, volume = 0.1 } = useContext(SettingsContext);
  const location = useLocation();
  const audioRef = useRef(null);
  const [isAudioReady, setAudioReady] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const fadeIntervalRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(PUBLIC_URL + '/data/audio/hittibiisi.mp3');
    }

    const audio = audioRef.current;

    const handleUserInteraction = () => {
      if (!isAudioReady) {
        audio.volume = 0;
        audio
          .play()
          .then(() => {
            setAudioReady(true);
            fadeAudio(audio, 0, volume, 2500);
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
  }, [isAudioReady, volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (isAudioReady && music) {
      audio.loop = true;

      if (location.pathname.startsWith('/peli')) {
        // Fade out the audio over 2.5 seconds when entering the game
        fadeAudio(audio, currentVolume, 0, 2500);
      } else {
        // Fade in the audio over 2.5 seconds when leaving the game
        fadeAudio(audio, audio.volume, volume, 2500);
      }

      audio.play().catch((err) => {
        console.error('Audio playback failed:', err);
      });
    } else if (isAudioReady) {
      // Fade out the audio if music is disabled
      fadeAudio(audio, currentVolume, 0, 2500);
    }
    // If currentVolume is in dependencies, fadeAudio gets invoked infinitely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [music, volume, location.pathname, isAudioReady]);
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
