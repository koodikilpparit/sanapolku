import React, { useContext, useEffect, useState } from 'react';
import QrScannerComponent from '../QrScannerComponent';
import { PathContext } from './PathContext';
import { connectToPeerAndReceive, QRCODE_PREFIX } from '../../utils/ShareUtils';
import { importPath } from '../../utils/PathUtils';

import PropTypes from 'prop-types';

const ReceivePathModal = ({ onClose }) => {
  const { peer, setPaths, openSharingFailedModal } = useContext(PathContext);
  const [isScanning, setIsScanning] = useState(false);
  const [isReceiveStarted, setIsReceiveStarted] = useState(false);
  const [receiveSucceeded, setReceiveSucceeded] = useState(false);

  const [targetPeerIDInput, setTargetPeerIDInput] = useState('');

  const receivePath = async (targetPeerId) => {
    // Receive path from target
    if (!peer) return;
    try {
      const importedPath = await connectToPeerAndReceive(
        peer,
        targetPeerId,
        importPath
      );
      console.log('Imported path in receive modal', importedPath);
      const pathId = importedPath.id;
      const pathName = importedPath.name;
      setPaths((prevPaths) => [...prevPaths, { id: pathId, name: pathName }]);
      setReceiveSucceeded(true);
    } catch (e) {
      closeReceivePathModal();
      openSharingFailedModal();
      console.error('Connection failed:', e);
    } finally {
      setIsReceiveStarted(false);
    }
  };

  const handleShareClick = () => {
    receivePath(targetPeerIDInput);
  };

  const handleQRScan = async (scanResult) => {
    const result = scanResult.data;
    if (result.startsWith(QRCODE_PREFIX) && !isReceiveStarted) {
      console.log('Starting receive');
      setIsReceiveStarted(true);
      result.substring();
      const id = result.slice(QRCODE_PREFIX.length);
      setIsScanning(false);
      await receivePath(id);
    } else {
      console.warn('Unknown QR code');
    }
  };

  // Function to close the modal for sharing a path
  const closeReceivePathModal = () => {
    setReceiveSucceeded(false);
    onClose();
  };

  useEffect(() => {
    setIsScanning(true);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Polun vastaanottaminen</h2>
        {isReceiveStarted ? (
          <label>Yhdistetään...</label>
        ) : (
          <div>
            {receiveSucceeded ? (
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
