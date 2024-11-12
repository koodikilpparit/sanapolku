import React, { createContext, useState, useEffect } from 'react';
import { initializePeer } from '../../utils/ShareUtils';

import PropTypes from 'prop-types';

export const PathContext = createContext();

export const PathProvider = ({ children }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);

  const [sharingStarted, setSharingStarted] = useState(false);
  const [sharingSucceeded, setSharingSucceeded] = useState(false);

  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);

  const [isSharingFailedModalOpen, setIsSharingFailedModalOpen] =
    useState(false);

  const QRCODE_PREFIX = 'sanapolku:';

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

  // Function to open the modal for instructions why path sharing failed
  const openSharingFailedModal = () => {
    setIsSharingFailedModalOpen(true);
  };

  return (
    <PathContext.Provider
      value={{
        paths,
        setPaths,
        currentPath,
        setCurrentPath,
        sharingStarted,
        setSharingStarted,
        sharingSucceeded,
        setSharingSucceeded,
        peer,
        setPeer,
        peerId,
        setPeerId,
        QRCODE_PREFIX,
        isSharingFailedModalOpen,
        setIsSharingFailedModalOpen,
        openSharingFailedModal,
      }}
    >
      {children}
    </PathContext.Provider>
  );
};

PathProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
