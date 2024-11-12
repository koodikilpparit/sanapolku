import React, { useContext, useEffect } from 'react';
import { PathContext } from './PathContext';
import { QRCode } from 'react-qrcode-logo';
import { sendDataOnConnection } from '../../utils/ShareUtils';

const SharePathModal = ({ onClose }) => {
  const {
    peer,
    currentPath,
    setCurrentPath,
    QRCODE_PREFIX,
    peerId,
    sharingSucceeded,
    setSharingSucceeded,
    openSharingFailedModal,
  } = useContext(PathContext);
  useEffect(() => {
    // Set up path to share
    const handleNewConnection = async () => {
      console.log('Setting up onConnection with', peer, currentPath);
      sendDataOnConnection(peer, currentPath)
        .then(() => {
          setSharingSucceeded(true);
          console.log('Successfully sent path', currentPath);
        })
        .catch((e) => {
          closeShareModal();
          openSharingFailedModal();
          console.error('Connection failed', e);
        });
    };

    if (!(peer && currentPath)) {
      return;
    }

    handleNewConnection();
  }, [peer, currentPath]);

  // Function to close the modal for sharing a path
  const closeShareModal = () => {
    setCurrentPath(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Polun jakaminen</h2>
        {sharingSucceeded ? (
          <label>Polun jakaminen onnistui!</label>
        ) : (
          <div>
            <p>
              Näytä alla oleva QR-koodi polun vastaanottajalle. Jos kamera ei
              ole käytettävissä, polun jakaminen onnistuu QR-koodin alta
              löytyvän tunnisteen avulla.
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

export default SharePathModal;
