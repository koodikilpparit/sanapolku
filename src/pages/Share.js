import React, { useEffect, useState } from 'react';
import { importPath, exportPath } from '../utils/PathUtils';
import { QRCode } from 'react-qrcode-logo';
import {
  connectToPeerAndReceive,
  initializePeer,
  sendDataOnConnection,
} from '../utils/ShareUtils';
import QrSCannerComponent from '../components/QRScanner';

const Share = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [targetPeerIDInput, setTargetPeerIDInput] = useState('');
  const [targetPeerID, setTargetPeerID] = useState(null);
  const [selectedPathName, setSelectedPathName] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  const QRCODE_PREFIX = 'sanapolku:';

  const handleShareClick = () => {
    setTargetPeerID(targetPeerIDInput);
  };

  const handlePathSelectionClick = async () => {
    exportPath(selectedPathName).then((serializedPath) => {
      setSelectedPath(serializedPath);
    });
  };

  const handleQRScan = async (scanResult) => {
    const result = scanResult.data;
    if (result.startsWith(QRCODE_PREFIX)) {
      result.substring();
      const id = result.slice(QRCODE_PREFIX.length);
      setTargetPeerID(id);
      setIsScanning(false);
    } else {
      console.warn('Unknown QR code');
    }
  };

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

  useEffect(() => {
    // Set up path to share
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

  useEffect(() => {
    // Receive path from target
    if (!(peer && targetPeerID)) return;
    connectToPeerAndReceive(peer, targetPeerID, importPath);
  }, [peer, targetPeerID]);

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
            value={targetPeerIDInput}
            onChange={(e) => setTargetPeerIDInput(e.target.value)}
          />
          <button onClick={handleShareClick}>Hae jaettava polku</button>

          {isScanning && <QrSCannerComponent onSuccess={handleQRScan} />}
        </div>
      </div>
    </div>
  );
};

export default Share;
