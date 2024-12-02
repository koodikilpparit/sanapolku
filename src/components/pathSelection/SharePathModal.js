import React, { useCallback, useContext, useEffect, useState } from 'react';
import { PathContext } from './PathContext';
import { QRCode } from 'react-qrcode-logo';
import { sendDataOnConnection, QRCODE_PREFIX } from '../../utils/ShareUtils';
import { exportPath } from '../../utils/PathUtils';

import PropTypes from 'prop-types';
import { SettingsContext } from '../../contexts/SettingsContext';

const SharePathModal = ({ onClose }) => {
  const { currentPath, openSharingFailedModal } = useContext(PathContext);
  const { peer, peerId } = useContext(SettingsContext);

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
        <h2>Polun jakaminen</h2>
        {sharingSucceeded ? (
          <label>Polun jakaminen onnistui!</label>
        ) : (
          <div>
            <p>
              Näytä alla oleva QR-koodi polun vastaanottajalle. QR-koodi tulee
              lukea Sanapolku-sovelluksen avulla. Jos kamera ei ole
              käytettävissä, polun jakaminen onnistuu QR-koodin alta löytyvän
              tunnisteen avulla.
            </p>
            <QRCode value={QRCODE_PREFIX + peerId} />
            <span>Lähettäjän tunniste:</span>
            <p>{peerId}</p>
          </div>
        )}
        <button className="save-button" onClick={closeShareModal}>
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
