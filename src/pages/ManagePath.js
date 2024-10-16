import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWordsForPath, getPathByName, deleteWord } from '../db/db';
import WordRow from '../components/create/WordRow';
import BackButton from '../components/universal/BackButton';
import '../styles/ManagePath.css';

const ManagePath = () => {
  const { pathName } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch words for the path when the component loads
  useEffect(() => {
    getPathByName(pathName)
      .then((path) => {
        if (path) {
          return getWordsForPath(path.id);
        } else {
          setError(`Path with the name "${pathName}" was not found.`);
          return [];
        }
      })
      .then((words) => setWords(words))
      .catch(() => setError('Error fetching words'));
  }, [pathName]);

  // Function to delete a word from the database and update the word list
  const handleDelete = (wordId) => {
    deleteWord(wordId)
      .then(() => {
        setWords((prevWords) => prevWords.filter((word) => word.id !== wordId));
        console.log(`Deleted word with id: ${wordId}`);
      })
      .catch((error) => {
        console.error('Error deleting word:', error);
        alert('Error deleting the word.');
      });
  };

  return (
    <div className="manage-page">
      {/* Header */}
      <div className="word-entry-header">
        <BackButton />
        <h2>Lisää sanoja</h2>
      </div>

      {/* Word List */}
      <div className="word-entry-container">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="word-list">
          {words.length > 0 ? (
            words.map((wordEntry, index) => (
              <WordRow
                key={index}
                word={wordEntry.word}
                imgSrc={wordEntry.img}
                onDelete={() => handleDelete(wordEntry.id)}
              />
            ))
          ) : (
            <p className="no-words">Ei lisättyjä sanoja.</p>
          )}
        </div>

        {/* Add new word */}
        <div
          className="add-word"
          onClick={() => navigate(`/uusisana/${pathName}`)}
        >
          <span className="add-icon">+</span>
          <span className="add-text">LISÄÄ UUSI SANA</span>
        </div>
      </div>
    </div>
  );
};

export default ManagePath;
