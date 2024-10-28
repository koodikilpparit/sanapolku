import React, { useEffect, useState } from 'react';
import serializePath from '../utils/SerializePath';
import {
  connectToPeerAndReceive,
  initializePeer,
  sendDataOnConnection,
} from '../utils/ShareUtils';

const Share = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [targetPeerID, setTargetPeerID] = useState('');
  const [selectedPathName, setSelectedPathName] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);

  const handleShareClick = async () => {
    await connectToPeerAndReceive(peer, targetPeerID, (data) => {
      console.log('Received data', data);
    });
  };

  const handlePathSelectionClick = async () => {
    serializePath(selectedPathName).then((serializedPath) => {
      setSelectedPath(serializedPath);
    });
  };

  useEffect(() => {
    const initPeer = async () => {
      const { id: newId, peer: newPeer } = await initializePeer();
      setPeerId(newId);
      setPeer(newPeer);
    };
    initPeer();

    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleNewConnection = async () => {
      console.log('Setting up onConnection with', peer, selectedPath);
      sendDataOnConnection(peer, selectedPath)
        .then(() => console.log('Successfully sent path', selectedPath))
        .catch((e) => {
          console.log('Error while connecting and sending path', e);
        });
    };

    if (!(peer && selectedPath)) {
      return;
    }

    handleNewConnection();
  }, [peer, selectedPath]);

  return (
    <div>
      <div className="sender-container">
        <div className="path-selection">
          <label>
            Jaettavan polun nimi
            <input
              type="text"
              value={selectedPathName}
              onChange={(e) => setSelectedPathName(e.target.value)}
            />
          </label>
          <button onClick={handlePathSelectionClick}>Valitse polku</button>
        </div>
        {peerId ? (
          <label>
            Jakajan ID:
            <span style={{ marginLeft: '10px' }}>{peerId}</span>
          </label>
        ) : (
          <label>Yhdistetään...</label>
        )}
      </div>

      <div style={{ marginTop: '100px' }} className="receiver-container">
        <label>
          Syötä jakajan ID
          <input
            style={{ marginLeft: '10px' }}
            type="text"
            value={targetPeerID}
            onChange={(e) => setTargetPeerID(e.target.value)}
          />
        </label>
        <button onClick={handleShareClick}>Hae jaettava polku</button>
      </div>
    </div>
  );
};

export default Share;
