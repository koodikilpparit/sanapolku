import React, { useContext, useEffect, useState } from 'react';
import QrScannerComponent from '../QrScannerComponent';
import { PathContext } from './PathContext';
import { connectToPeerAndReceive } from '../../utils/ShareUtils';
import { importPath } from '../../utils/PathUtils';

import PropTypes from 'prop-types';

const ReceivePathModal = ({ onClose }) => {
  const {
    peer,
    setPaths,
    QRCODE_PREFIX,
    sharingSucceeded,
    sharingStarted,
    setSharingStarted,
    setSharingSucceeded,
    openSharingFailedModal,
  } = useContext(PathContext);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanningStarted, setIsScanningStarted] = useState(false);

  const [targetPeerIDInput, setTargetPeerIDInput] = useState('');
  const [targetPeerID, setTargetPeerID] = useState(null);

  const receivePath = async (id) => {
    // Receive path from target
    if (!peer) return;
    try {
      const importedPath = await connectToPeerAndReceive(peer, id, importPath);
      const pathName = importedPath.name;
      setPaths((prevPaths) => [...prevPaths, pathName]);
      setSharingSucceeded(true);
    } catch (e) {
      closeReceivePathModal();
      openSharingFailedModal();
      console.error('Connection failed:', e);
    } finally {
      setSharingStarted(false);
      setIsScanningStarted(false);
    }
  };

  const handleShareClick = () => {
    setTargetPeerID(targetPeerIDInput);
    receivePath(targetPeerIDInput);
  };

  const handleQRScan = async (scanResult) => {
    const result = scanResult.data;
    console.log(isScanningStarted);
    if (result.startsWith(QRCODE_PREFIX) && !isScanningStarted) {
      setIsScanningStarted(true);
      result.substring();
      const id = result.slice(QRCODE_PREFIX.length);
      setTargetPeerID(id);
      setIsScanning(false);
      setSharingStarted(true);
      receivePath(id);
    } else {
      console.warn('Unknown QR code');
      setIsScanningStarted(false);
    }
  };

  // Function to close the modal for sharing a path
  const closeReceivePathModal = () => {
    setSharingSucceeded(false);
    onClose();
  };

  useEffect(() => {
    setIsScanning(true);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Polun vastaanottaminen</h2>
        {!sharingStarted ? (
          <div>
            {sharingSucceeded ? (
              <label>Polun jakaminen onnistui!</label>
            ) : (
              <div>
                <p>
                  Lue lähettäjän QR-koodi. Jos kamera ei ole käytettävissä,
                  polun jakaminen onnistuu lähettäjän tunnisteen avulla.
                </p>
                {isScanning && <QrScannerComponent onSuccess={handleQRScan} />}
                <input
                  className="fetch-input"
                  type="text"
                  value={targetPeerIDInput}
                  placeholder="Lähettäjän tunniste"
                  onChange={(e) => setTargetPeerIDInput(e.target.value)}
                />
                <button className="fetch-button" onClick={handleShareClick}>
                  Hae polku
                </button>
              </div>
            )}
          </div>
        ) : (
          <label>Yhdistetään...</label>
        )}
        <button className="save-button" onClick={closeReceivePathModal}>
          Palaa takaisin
        </button>
      </div>
    </div>
  );
};

ReceivePathModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ReceivePathModal;
