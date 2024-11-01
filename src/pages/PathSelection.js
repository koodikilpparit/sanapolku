import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllPaths,
  addPath,
  deletePath,
  getPathByName,
  getWordsForPath,
} from '../db/db';
import '../styles/PathSelection.css';
import BackButton from '../components/universal/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import EditButton from '../components/universal/EditButton';
import DeleteButton from '../components/universal/DeleteButton';

const PathSelection = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState('');
  const [isNewPathModalOpen, setIsNewPathModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNoWordsInPathOpen, setIsNoWordsInPathOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);

  // Fetch all paths from the database when the component loads
  useEffect(() => {
    getAllPaths()
      .then((paths) =>
        setPaths(Array.isArray(paths) ? paths.map((path) => path.name) : [])
      )
      .catch(() => console.error('Error fetching paths'));
  }, []);

  // Function to add a new path to the database
  const handleAddPath = () => {
    if (newPath.trim()) {
      addPath(newPath)
        .then(() => {
          setPaths([...paths, newPath]);
          setNewPath('');
          console.log('Path added:', newPath);
          setIsNewPathModalOpen(false);
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
    </div>
  );
};

export default PathSelection;
