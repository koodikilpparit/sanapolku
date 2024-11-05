import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';
import {
  getAllPaths,
  addPath,
  deletePath,
  getPathByName,
  getWordsForPath,
} from '../db/db';
import {
  connectToPeerAndReceive,
  initializePeer,
  sendDataOnConnection,
} from '../utils/ShareUtils';
import { importPath, exportPath } from '../utils/PathUtils';
import '../styles/PathSelection.css';
import BackButton from '../components/universal/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import EditButton from '../components/universal/EditButton';
import DeleteButton from '../components/universal/DeleteButton';
import ShareButton from '../components/universal/ShareButton';
import QrScannerComponent from '../components/QrScannerComponent';

const PathSelection = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  const [isNewPathModalOpen, setIsNewPathModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNoWordsInPathOpen, setIsNoWordsInPathOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReceivePathModalOpen, setIsReceivePathModalOpen] = useState(false);

  const [currentPath, setCurrentPath] = useState(null);

  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [targetPeerIDInput, setTargetPeerIDInput] = useState('');
  const [targetPeerID, setTargetPeerID] = useState(null);
  const QRCODE_PREFIX = 'sanapolku:';

  // Fetch all paths from the database when the component loads
  useEffect(() => {
    getAllPaths()
      .then((paths) =>
        setPaths(Array.isArray(paths) ? paths.map((path) => path.name) : [])
      )
      .catch(() => console.error('Error fetching paths'));
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
      console.log('Setting up onConnection with', peer, currentPath);
      sendDataOnConnection(peer, currentPath)
        .then(() => console.log('Successfully sent path', currentPath))
        .catch((e) => {
          console.log('Error while connecting and sending path', e);
        });
    };

    if (!(peer && currentPath)) {
      return;
    }

    handleNewConnection();
  }, [peer, currentPath]);

  useEffect(() => {
    // Receive path from target
    if (!(peer && targetPeerID)) return;
    connectToPeerAndReceive(peer, targetPeerID, importPath);
  }, [peer, targetPeerID]);

  // Function to add a new path to the database and navigate
  // to path management page
  const handleAddPath = () => {
    if (newPath.trim()) {
      addPath(newPath)
        .then(() => {
          setPaths([...paths, newPath]);
          setNewPath('');
          console.log('Path added:', newPath);
          setIsNewPathModalOpen(false);
          navigate(`/muokkaapolkua/${newPath}`);
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message);
        });
    } else {
      alert('Anna polulle nimi');
    }
  };

  // Function to navigate to the game
  const handlePathClick = async (path) => {
    const pathObject = await getPathByName(path);
    const words = await getWordsForPath(pathObject.id);

    // Navigate to the game only if the path has words
    if (words.length > 0) {
      navigate(`/peli/${path}`);
    } else {
      openNoWordsInPathModal(path);
    }
  };

  // Navigate to path management page
  const handleEditPathClick = (path) => {
    navigate(`/muokkaapolkua/${path}`);
    setIsNoWordsInPathOpen(false);
  };

  // Handle path deletion
  const handlePathDelete = async () => {
    if (!currentPath) return;

    try {
      const pathData = await getPathByName(currentPath); // Wait for getPathByName to resolve
      if (!pathData || !pathData.id) {
        console.error('Path not found:', currentPath);
        alert('Path not found.');
        return;
      }

      await deletePath(pathData.id);
      setPaths((prevPaths) => prevPaths.filter((p) => p !== currentPath));
      console.log(`Deleted path with name: ${currentPath}`);
    } catch (error) {
      console.error('Error deleting path:', error);
      alert('Error deleting the path.');
    }
    setIsDeleteModalOpen(false);
  };

  const handleShareClick = () => {
    setTargetPeerID(targetPeerIDInput);
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

  // Function to open the modal for deleting a path
  const openDeleteModal = (path) => {
    setCurrentPath(path);
    setIsDeleteModalOpen(true);
  };

  // Function to close the modal for deleting a path
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentPath(null);
  };

  // Function to open the modal for creating a new path
  const openNewPathModal = () => {
    setIsNewPathModalOpen(true);
  };

  // Function to close the modal for creating a new path
  const closeNewPathModal = () => {
    setIsNewPathModalOpen(false);
    setNewPath('');
  };

  // Function to open the modal for informing lack of words in path
  const openNoWordsInPathModal = (path) => {
    setCurrentPath(path);
    setIsNoWordsInPathOpen(true);
  };

  // Function to close the modal for informing lack of words in path
  const closeNoWordsInPathModal = () => {
    setIsNoWordsInPathOpen(false);
    setCurrentPath(null);
  };

  // Function to open the modal for sharing a path
  const openShareModal = async (path) => {
    await exportPath(path).then((serializedPath) => {
      setCurrentPath(serializedPath);
    });
    setCurrentPath(path);
    setIsShareModalOpen(true);
  };

  // Function to close the modal for sharing a path
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setCurrentPath(null);
  };

  // Function to open the modal for sharing a path
  const openReceivePathModal = () => {
    setIsNewPathModalOpen(false);
    setIsReceivePathModalOpen(true);
  };

  // Function to close the modal for sharing a path
  const closeReceivePathModal = () => {
    setIsReceivePathModalOpen(false);
  };

  return (
    <div className="paths-page">
      {/* Header */}
      <div className="path-selection-header">
        <BackButton />
        <h2 className="title">Polut</h2>
        <FontAwesomeIcon
          icon={faPlus}
          className="add-path-icon"
          onClick={openNewPathModal}
          aria-label="Lisää uusi polku"
        />
      </div>

      {/* List of paths */}
      <div className="path-list">
        {paths.length > 0 ? (
          paths.map((path, index) => (
            <div
              key={index}
              className="path-item-container"
              onClick={() => handlePathClick(path)}
            >
              <span className="path-item">{path}</span>
              <EditButton path={path} onClick={(e) => e.stopPropagation()} />
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(path);
                }}
              />
              <ShareButton
                onClick={(e) => {
                  e.stopPropagation();
                  openShareModal(path);
                }}
              ></ShareButton>
            </div>
          ))
        ) : (
          <p className="no-paths">Ei polkuja.</p>
        )}
      </div>

      {/* Modal for adding a new path */}
      {isNewPathModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Vastaanota polku</h2>
            <button className="save-button" onClick={openReceivePathModal}>
              Siirry vastaanottamaan polku
            </button>
            <h2>Lisää uusi polku</h2>
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="Anna polun nimi"
              className="modal-input"
            />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={closeNewPathModal}>
                Peruuta
              </button>
              <button className="save-button" onClick={handleAddPath}>
                Tallenna
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for confirming deletion */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Vahvista poisto</h2>
            <p>
              Haluatko varmasti poistaa polun <b>{currentPath}</b>?
            </p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={closeDeleteModal}>
                Peruuta
              </button>
              <button className="save-button" onClick={handlePathDelete}>
                Poista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for informing user of lack of words in path */}
      {isNoWordsInPathOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Polulla ei ole vielä sanoja</h2>
            <div className="modal-buttons">
              <button className="save-button" onClick={closeNoWordsInPathModal}>
                Palaa takaisin
              </button>
              <button
                className="save-button"
                onClick={() => handleEditPathClick(currentPath)}
              >
                Muokkaa polkua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for sharing a path */}
      {isShareModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Polun jakaminen</h2>
            <p>
              Näytä alla oleva QR-koodi polun vastaanottajalle. Jos kamera ei
              ole käytettävissä, polun jakaminen onnistuu QR-koodin alta
              löytyvän tunnisteen avulla.
            </p>
            <QRCode value={QRCODE_PREFIX + peerId} />
            <span>Lähettäjän tunniste:</span>
            <p>{peerId}</p>
            <button className="save-button" onClick={closeShareModal}>
              Palaa takaisin
            </button>
          </div>
        </div>
      )}

      {/* Modal for sharing a path */}
      {isReceivePathModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Polun vastaanottaminen</h2>
            <p>
              Lue lähettäjän QR-koodi. Jos kamera ei ole käytettävissä, polun
              jakaminen onnistuu lähettäjän tunnisteen avulla.
            </p>
            {isScanning && <QrScannerComponent onSuccess={handleQRScan} />}
            <div>
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
            <button className="save-button" onClick={closeReceivePathModal}>
              Palaa takaisin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathSelection;
