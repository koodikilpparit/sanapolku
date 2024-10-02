import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSanatForPolku, getPolkuByName, deleteSana } from '../db/db';
import WordRow from '../components/create/WordRow';
import BackButton from '../components/universal/BackButton';
import '../styles/ManagePath.css';

const ManagePath = () => {
  const { pathName } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [pathId, setPathId] = useState(null);
  const [error, setError] = useState(null);

  // Funktio joka hakee sanat polulle kun komponentti latautuu
  useEffect(() => {
    getPolkuByName(pathName)
      .then((polku) => {
        if (polku) {
          setPathId(polku.id);
          return getSanatForPolku(polku.id);
        } else {
          setError(`Polkua nimellä "${pathName}" ei löytynyt.`);
          return [];
        }
      })
      .then((sanat) => setWords(sanat))
      .catch(() => setError("Virhe sanojen haussa"));
  }, [pathName]);

  // Funktio joka poistaa sanan tietokannasta ja päivittää sanalistan
  const handleDelete = (wordId) => {
    deleteSana(wordId)
      .then(() => {
        setWords((prevWords) => prevWords.filter((word) => word.id !== wordId));
        console.log(`Deleted word with id: ${wordId}`);
      })
      .catch((error) => {
        console.error("Error deleting word:", error);
        alert("Virhe sanan poistamisessa.");
      });
  };

  return (
    <div className="manage-page">

      {/* Header */}
      <div className="word-entry-header">
        <BackButton />
        <h2 className="title">Lisää sanoja</h2>
      </div>

      {/* Sanalista */}
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

        {/* Lisää uusi sana */}
        <div className="add-word" onClick={() => navigate(`/uusisana/${pathName}`)}>
          <span className="add-icon">+</span>
          <span className="add-text">LISÄÄ UUSI SANA</span>
        </div>
      </div>
    </div>
  );
};

export default ManagePath;