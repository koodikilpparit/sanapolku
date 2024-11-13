import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWordsForPath, deleteWord, getPathById } from '../db/db';
import WordRow from '../components/create/WordRow';
import BackButton from '../components/universal/BackButton';
import '../styles/ManagePath.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ManagePath = () => {
  const pathId = Number(useParams().pathId);
  const [pathName, setPathName] = useState(null);
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);

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
        <h2>{pathName}</h2>
        <FontAwesomeIcon
          icon={faPlus}
          className="add-path-icon"
          onClick={() => navigate(`/uusisana/${pathId}`)}
          aria-label="Lisää uusi sana"
        />
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
                imgSrc={wordEntry.imageData.src}
                onDelete={() => handleDelete(wordEntry.id)}
              />
            ))
          ) : (
            <p className="no-words">Ei lisättyjä sanoja.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePath;
