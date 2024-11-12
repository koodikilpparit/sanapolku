import React, { createContext, useState, useEffect } from 'react';
import { initializePeer } from '../utils/ShareUtils';
import {
  connectToPeerAndReceive,
  sendDataOnConnection,
} from '../utils/ShareUtils';
import { importPath } from '../utils/PathUtils';
import PropTypes from 'prop-types';

const SharingContext = createContext();

export const PathSharingContext = ({ children }) => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [sharingStarted, setSharingStarted] = useState(false);
  const [sharingSucceeded, setSharingSucceeded] = useState(false);
  const [isSharingFailedModalOpen, setIsSharingFailedModalOpen] =
    useState(false);

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

  const sharePath = async (pathData) => {
    if (!peer) return;

    setSharingStarted(true);
    try {
      await sendDataOnConnection(peer, pathData);
      setSharingSucceeded(true);
      setSharingStarted(false);
    } catch (error) {
      console.error('Failed to share path:', error);
      setSharingSucceeded(false);
      setSharingStarted(false);
      setIsSharingFailedModalOpen(true);
    }
  };

  const receivePath = async (targetPeerId) => {
    if (!peer) return undefined;

    setSharingStarted(true);
    try {
      const receivedPath = await connectToPeerAndReceive(
        peer,
        targetPeerId,
        importPath
      );
      setSharingSucceeded(true);
      setSharingStarted(false);
      return receivedPath;
    } catch (error) {
      console.error('Failed to receive path:', error);
      setSharingStarted(false);
      setIsSharingFailedModalOpen(true);
      return undefined;
    }
  };

  const initializeStates = () => {
    setSharingStarted(false);
    setSharingSucceeded(false);
  };

  return (
    <SharingContext.Provider
      value={{
        peerId,
        sharePath,
        receivePath,
        sharingStarted,
        sharingSucceeded,
        isSharingFailedModalOpen,
        setIsSharingFailedModalOpen,
        initializeStates,
      }}
    >
      {children}
    </SharingContext.Provider>
  );
};

PathSharingContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SharingContext;
