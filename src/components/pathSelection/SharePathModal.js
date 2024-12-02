import React, { useCallback, useContext, useEffect, useState } from 'react';
import { PathContext } from './PathContext';
import { QRCode } from 'react-qrcode-logo';
import { sendDataOnConnection, QRCODE_PREFIX } from '../../utils/ShareUtils';
import { exportPath } from '../../utils/PathUtils';

import PropTypes from 'prop-types';

const SharePathModal = ({ onClose }) => {
  const { peer, peerId, currentPath, openSharingFailedModal } =
    useContext(PathContext);

  const [exportedPath, setExportedPath] = useState(null);
  const [sharingSucceeded, setSharingSucceeded] = useState(false);

  // Function to close the modal for sharing a path
  const closeShareModal = useCallback(() => {
    setExportedPath(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const initializeExport = async (pathId) => {
      await exportPath(pathId).then((serializedPath) => {
        setExportedPath(serializedPath);
      });
    };

    if (currentPath) {
      initializeExport(currentPath.id);
    }
  }, [currentPath]);

  useEffect(() => {
    setSharingSucceeded(false);
  }, [setSharingSucceeded]);

  useEffect(() => {
    // Set up path to share
    const handleNewConnection = async () => {
      console.log('Setting up onConnection with', peer, exportedPath);
      sendDataOnConnection(peer, exportedPath)
        .then(() => {
          setSharingSucceeded(true);
          console.log('Successfully sent path', exportedPath);
        })
        .catch((e) => {
          closeShareModal();
          openSharingFailedModal();
          console.error('Connection failed', e);
        });
    };

    if (!(peer && exportedPath)) {
      return;
    }

    handleNewConnection();
  }, [
    peer,
    exportedPath,
    closeShareModal,
    openSharingFailedModal,
    setSharingSucceeded,
  ]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl py-2">
          Polun jakaminen
        </h2>
        {sharingSucceeded ? (
          <label className="text-sp-black">Polun jakaminen onnistui!</label>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm smd:text-md md:text-lg lg:text-xl pb-2">
              Näytä alla oleva QR-koodi polun vastaanottajalle. Jos kamera ei
              ole käytettävissä, polun jakaminen onnistuu QR-koodin alta
              löytyvän tunnisteen avulla.
            </p>
            <div className="py-2">
              <QRCode value={QRCODE_PREFIX + peerId} />
            </div>
            <div className="py-2">
              <span className="text-md md:text-lg lg:text-xl font-bold">
                Lähettäjän tunniste:
              </span>
              <p className="text-md md:text-lg lg:text-xl">{peerId}</p>
            </div>
          </div>
        )}
        <button
          className="btn-sp-primary bg-sp-dark-green"
          onClick={closeShareModal}
        >
          Palaa takaisin
        </button>
      </div>
    </div>
  );
};

SharePathModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default SharePathModal;
