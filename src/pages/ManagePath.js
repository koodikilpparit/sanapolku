import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWordsForPath, getPathById, editPathName } from '../db/db';
import WordRow from '../components/create/WordRow';
import DeleteWordModal from '../components/DeleteWordModal'; // Import the DeleteWordModal component
import '../styles/ManagePath.css';
import Header from '../components/universal/Header';

const ManagePath = () => {
  const pathId = Number(useParams().pathId);
  const [pathName, setPathName] = useState(null);
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);
  const [newPathName, setNewPathName] = useState('');
  const [isEditPathNameModalOpen, setIsEditPathNameModalOpen] = useState(false);
  const [isDeleteWordModalOpen, setIsDeleteWordModalOpen] = useState(false); // State to control the DeleteWordModal
  const [wordToDelete, setWordToDelete] = useState(null); // State to store the word to be deleted

  // Function to fetch words for the path when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [path, words] = await Promise.all([
          getPathById(pathId),
          getWordsForPath(pathId),
        ]);
        setPathName(path.name);
        setWords(words);
      } catch (error) {
        setError(`Path with the ID "${pathId}" was not found.`);
      }
    };
    fetchData();
  }, [pathId]);

  const handleEditPathNameClick = () => {
    if (newPathName.trim()) {
      editPathName(pathId, newPathName)
        .then((path) => {
          setPathName(path.name);
          setNewPathName('');
          console.log('Path name changed:', path.name);
          closeEditPathNameModal();
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message);
        });
    } else {
      alert('Anna polulle nimi');
    }
  };

  const openEditPathNameModal = () => {
    setIsEditPathNameModalOpen(true);
  };

  const closeEditPathNameModal = () => {
    setIsEditPathNameModalOpen(false);
  };

  const openDeleteWordModal = (wordId) => {
    setWordToDelete(wordId);
    setIsDeleteWordModalOpen(true);
  };

  const closeDeleteWordModal = () => {
    setIsDeleteWordModalOpen(false);
    setWordToDelete(null);
  };

  const EditWord = (wordEntry) => {
    navigate(`/uusisana/${wordEntry.pathId}`, { state: { wordEntry } });
  };

  return (
    <div className="manage-page">
      {/* Header */}
      <Header
        title={pathName}
        onCenterClick={openEditPathNameModal}
        onRightClick={() => navigate(`/uusisana/${pathId}`)}
        backButtonUrl={'/omatpolut'}
      />

      {/* Word List */}
      <div className="word-entry-container">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="word-list">
          {words.length > 0 ? (
            words.map((wordEntry, index) => (
              <WordRow
                key={index}
                word={wordEntry.word}
                imgSrc={wordEntry.imageData.src}
                onDelete={() => openDeleteWordModal(wordEntry.id)} // Open the delete modal
                onEdit={() => EditWord(wordEntry)}
              />
            ))
          ) : (
            <p className="no-words">Ei lisättyjä sanoja.</p>
          )}
        </div>
      </div>
      {isEditPathNameModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Vaihda polun nimi</h2>
            <input
              type="text"
              value={newPathName}
              onChange={(e) => setNewPathName(e.target.value)}
              placeholder="Anna uusi polun nimi"
              className="modal-input"
            />
            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={closeEditPathNameModal}
              >
                Peruuta
              </button>
              <button className="save-button" onClick={handleEditPathNameClick}>
                Tallenna
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteWordModalOpen && (
        <DeleteWordModal
          onClose={closeDeleteWordModal}
          wordId={wordToDelete}
          setWords={setWords} // Pass the setWords function as a prop
        />
      )}
    </div>
  );
};

export default ManagePath;
