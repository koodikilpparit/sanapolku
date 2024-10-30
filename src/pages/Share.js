import React, { useEffect, useState } from 'react';
import { importPath, exportPath } from '../utils/PathUtils';
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
  const [targetPeerIDInput, setTargetPeerIDInput] = useState('');
  const [targetPeerID, setTargetPeerID] = useState(null);
  const [selectedPathName, setSelectedPathName] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);

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
    const result = scanResult[0].rawValue;
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
    // Check for camera availability
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setIsCameraAvailable(true);
      })
      .catch((err) => {
        console.error('Camera not available:', err);
      });
  }, []);

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
          {isCameraAvailable ? (
            <Scanner
              onScan={handleQRScan}
              onError={handleQRScanError}
              constraints={{
                height: { min: 480, ideal: 1080 },
                width: { min: 600, ideal: 1080 },
                facingMode: { ideal: 'environment' },
              }}
            />
          ) : (
            <p>Kameraa ei ole saatavilla QR koodin skannaamiseen</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Share;
