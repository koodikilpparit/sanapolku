import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { initializePeer } from '../utils/ShareUtils';

export const SettingsContext = createContext();

/**
 * SettingsProvider component that provides settings context to its children.
 * It manages the state for sounds and music settings, persisting them in localStorage.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will receive the context.
 * @returns {JSX.Element} The SettingsContext provider with the current settings values.
 */
export const SettingsProvider = ({ children }) => {
  const [sounds, setSounds] = useState(() => {
    const savedSounds = localStorage.getItem('sounds');
    return savedSounds !== null ? JSON.parse(savedSounds) : true;
  });

  const [music, setMusic] = useState(() => {
    const savedMusic = localStorage.getItem('music');
    return savedMusic !== null ? JSON.parse(savedMusic) : true;
  });

  const [installEvent, setInstallEvent] = useState(null);
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);

  useEffect(() => {
    localStorage.setItem('sounds', JSON.stringify(sounds));
  }, [sounds]);

  useEffect(() => {
    localStorage.setItem('music', JSON.stringify(music));
  }, [music]);

  useEffect(() => {
    // Initialize WebRTC
    const initPeer = async () => {
      const { id: newId, peer: newPeer } = await initializePeer();
      setPeerId(newId);
      setPeer(newPeer);
    };
    if (!peer) {
      initPeer();
    }

    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, [peer]);

  return (
    <SettingsContext.Provider
      value={{
        sounds,
        setSounds,
        music,
        setMusic,
        installEvent,
        setInstallEvent,
        peer,
        setPeer,
        peerId,
        setPeerId,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SettingsProvider;
