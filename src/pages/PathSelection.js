import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPaths, getWordsForPath } from '../db/db';
import '../styles/PathSelection.css';
import EditButton from '../components/universal/EditButton';
import DeleteButton from '../components/universal/DeleteButton';
import ShareButton from '../components/universal/ShareButton';
import { PathContext } from '../components/pathSelection/PathContext';
import AddPathModal from '../components/pathSelection/AddPathModal';
import DeletePathModal from '../components/pathSelection/DeletePathModal';
import PathNoWordsModal from '../components/pathSelection/PathNoWordsModal';
import SharePathModal from '../components/pathSelection/SharePathModal';
import ReceivePathModal from '../components/pathSelection/ReceivePathModal';
import SharePathErrorModal from '../components/pathSelection/SharePathErrorModal';
import Header from '../components/universal/Header';

const PathSelection = () => {
  const navigate = useNavigate();

  const {
    paths,
    setPaths,
    setCurrentPath,
    isSharingFailedModalOpen,
    setIsSharingFailedModalOpen,
  } = useContext(PathContext);

  const [isNewPathModalOpen, setIsNewPathModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNoWordsInPathOpen, setIsNoWordsInPathOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReceivePathModalOpen, setIsReceivePathModalOpen] = useState(false);

  // Fetch all paths from the database when the component loads
  useEffect(() => {
    getAllPaths()
      .then((paths) => {
        setPaths(
          Array.isArray(paths)
            ? paths.map((path) => ({ name: path.name, id: path.id }))
            : []
        );
      })
      .catch(() => console.error('Error fetching paths'));
  }, [setPaths]);

  // Function to navigate to the game
  const handlePathClick = async (path) => {
    const words = await getWordsForPath(path.id);

    // Navigate to the game only if the path has words
    if (words.length > 0) {
      navigate(`/peli/${path.id}`);
    } else {
      openNoWordsInPathModal(path);
    }
  };

  const handleEditPathClick = (pathId) => {
    navigate(`/muokkaapolkua/${pathId}`);
  };

  // Function to open the modal for deleting a path
  const openDeleteModal = (path) => {
    setCurrentPath(path);
    setIsDeleteModalOpen(true);
  };

  // Function to open the modal for creating a new path
  const openNewPathModal = () => {
    setIsNewPathModalOpen(true);
  };

  // Function to open the modal for informing lack of words in path
  const openNoWordsInPathModal = (path) => {
    setCurrentPath(path);
    setIsNoWordsInPathOpen(true);
  };

  // Function to open the modal for sharing a path
  const openShareModal = (path) => {
    setCurrentPath(path);
    setIsShareModalOpen(true);
  };

  return (
    <div className="paths-page">
      {/* Header */}
      <Header
        title="Polut"
        onCenterClick={null}
        onRightClick={openNewPathModal}
      />
      {/* List of paths */}
      <div className="path-list">
        {paths.length > 0 ? (
          paths.map((path, index) => (
            <div
              key={index}
              className="path-item-container"
              onClick={() => handlePathClick(path)}
            >
              <span className="path-item">{path.name}</span>
              <EditButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPathClick(path.id);
                }}
                color="var(--Dark-Blue, #293642)"
              />
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
        <AddPathModal
          onClose={() => setIsNewPathModalOpen(false)}
          onOpenReceive={() => setIsReceivePathModalOpen(true)}
        />
      )}
      {/* Modal for confirming deletion */}
      {isDeleteModalOpen && (
        <DeletePathModal onClose={() => setIsDeleteModalOpen(false)} />
      )}
      {/* Modal for informing user of lack of words in path */}
      {isNoWordsInPathOpen && (
        <PathNoWordsModal onClose={() => setIsNoWordsInPathOpen(false)} />
      )}
      {/* Modal for sharing a path */}
      {isShareModalOpen && (
        <SharePathModal onClose={() => setIsShareModalOpen(false)} />
      )}
      {/* Modal for sharing a path */}
      {isReceivePathModalOpen && (
        <ReceivePathModal onClose={() => setIsReceivePathModalOpen(false)} />
      )}
      {/* Modal for path sharing error and instructions */}
      {isSharingFailedModalOpen && (
        <SharePathErrorModal
          onClose={() => setIsSharingFailedModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PathSelection;
