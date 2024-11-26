import React, { useCallback, useContext, useEffect, useState } from 'react';
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
  const [targetPeerID, setTargetPeerID] = useState(null);

  const [targetPeerIDInput, setTargetPeerIDInput] = useState('');

  // Function to close the modal for sharing a path
  const closeReceivePathModal = useCallback(() => {
    setReceiveSucceeded(false);
    onClose();
  }, [onClose]);

  const receivePath = useCallback(
    async (targetPeerId) => {
      // Receive path from target
      if (!peer) return;
      try {
        const importedPath = await connectToPeerAndReceive(
          peer,
          targetPeerId,
          importPath
        );
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
    },
    [peer, setPaths, closeReceivePathModal, openSharingFailedModal]
  );

  const handleShareClick = () => {
    if (targetPeerIDInput != '') {
      setTargetPeerID(targetPeerIDInput);
      setIsReceiveStarted(true);
    }
  };

  const handleQRScan = (scanResult) => {
    const result = scanResult.data;
    if (result.startsWith(QRCODE_PREFIX) && !isReceiveStarted) {
      console.log('Starting receive');
      setIsReceiveStarted(true);
      result.substring();
      const id = result.slice(QRCODE_PREFIX.length);
      setIsScanning(false);
      setTargetPeerID(id);
    } else {
      console.warn('Unknown QR code');
    }
  };

  useEffect(() => {
    setIsScanning(true);
  }, []);

  useEffect(() => {
    const receivePathAsync = async (id) => {
      await receivePath(id);
    };

    if (isReceiveStarted) {
      receivePathAsync(targetPeerID);
    }
  }, [isReceiveStarted, targetPeerID, receivePath]);

  return (
    <div className="modal-overlay">
      <div className="modal-content text-sp-black">
        <h2 className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl py-2">
          Polun vastaanottaminen
        </h2>
        {isReceiveStarted ? (
          <label className="text-sp-black text-sm smd:text-md md:text-lg lg:text-xl pb-2">
            Yhdistetään...
          </label>
        ) : (
          <div>
            {receiveSucceeded ? (
              <label className="text-sp-black">Polun jakaminen onnistui!</label>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm smd:text-md md:text-lg lg:text-xl pb-2">
                  Lue lähettäjän QR-koodi. Jos kamera ei ole käytettävissä,
                  polun jakaminen onnistuu lähettäjän tunnisteen avulla.
                </p>
                {isScanning && <QrScannerComponent onSuccess={handleQRScan} />}
                <div className="py-2 flex flex-row w-full justify-between gap-2">
                  <input
                    className="border-2 border-sp-black rounded-lg p-2 w-3/5 text-xs sm:text-sm md:text-md lg:text-lg"
                    type="text"
                    value={targetPeerIDInput}
                    placeholder="Lähettäjän tunniste"
                    onChange={(e) => setTargetPeerIDInput(e.target.value)}
                  />
                  <button
                    className="border-2 border-sp-black rounded-lg p-2 w-2/5"
                    onClick={handleShareClick}
                  >
                    Hae polku
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <button
          className="btn-sp-primary bg-sp-dark-green w-full"
          onClick={closeReceivePathModal}
        >
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
