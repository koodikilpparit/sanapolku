import React, { useEffect, useState } from 'react';
import serializePath from '../utils/SerializePath';
import { QRCode } from 'react-qrcode-logo';
import { Scanner } from '@yudiel/react-qr-scanner';
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

  const QRCODE_PREFIX = 'sanapolku:';

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

  const handleQRScan = (result) => {
    console.log(result);
    if (result.startsWith(QRCODE_PREFIX)) {
      result.substring();
      const id = result.slice(QRCODE_PREFIX.length);
      setTargetPeerID(id);
    } else {
      console.warn('Unknown QR code');
    }
  };

  const handleQRScanError = (error) => {
    console.error(error);
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
          <div>
            <label>Jakajan ID:</label>
            <span style={{ marginLeft: '10px' }}>{peerId}</span>
            <QRCode value={QRCODE_PREFIX + peerId} />
          </div>
        ) : (
          <label>Yhdistetään...</label>
        )}
      </div>

      <div style={{ marginTop: '100px' }} className="receiver-container">
        <div>
          <label>Syötä jakajan ID</label>
          <input
            style={{ marginLeft: '10px' }}
            type="text"
            value={targetPeerID}
            onChange={(e) => setTargetPeerID(e.target.value)}
          />
          <Scanner onScan={handleQRScan} onError={handleQRScanError} />
        </div>
        <button onClick={handleShareClick}>Hae jaettava polku</button>
      </div>
    </div>
  );
};

export default Share;
