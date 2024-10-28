import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import shuffleArray from 'lodash.shuffle';
import { getPathByName, getWordsForPath } from '../../db/db';
import { useNavigate } from 'react-router-dom';
import './GameEngine.css';
import wordsIntoLevels from './WordsIntoLevels';

const GameEngine = ({ pathName, levelIndex: initialLevelIndex }) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [playerInput, setPlayerInput] = useState('');
  const [shuffledWord, setShuffledWord] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelIndex, setLevelIndex] = useState(initialLevelIndex - 1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const path = await getPathByName(pathName);
        if (!path) {
          setError('Path not found');
          return;
        }

        const fetchedWords = await getWordsForPath(path.id);
        if (!fetchedWords || fetchedWords.length === 0) {
          setError('No words found for this path');
          return;
        }

        const levels = wordsIntoLevels(fetchedWords);

        setLevels(levels);
        setCurrentLevel(levels[levelIndex]);
        setCurrentWord(levels[levelIndex][0]);
        setLoading(false);
      } catch (error) {
        setError('Error fetching path, level or words');
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [levelIndex, pathName]);

  // Sets current level
  useEffect(() => {
    if (levels.length > 0) {
      setCurrentLevel(levels[levelIndex]);
    }
  }, [levelIndex, levels]);

  // Sets current word
  useEffect(() => {
    if (currentLevel.length > 0) {
      setCurrentWord(currentLevel[wordIndex]);
    }
  }, [wordIndex, currentLevel]);

  // Handle input change
  const handleInputChange = (e) => {
    setPlayerInput(e.target.value);
  };

  // Handle submission based on the phase
  const handleSubmit = () => {
    if (!currentWord) return;

    if (currentPhase === 1) {
      if (playerInput.toLowerCase() === currentWord.word.toLowerCase()) {
        moveToNextWord();
      } else {
        setCurrentPhase(2);
        setPlayerInput('');
        setShuffledWord(shuffleWord(currentWord.word));
      }
    } else if (currentPhase === 2) {
      if (playerInput.toLowerCase() === currentWord.word.toLowerCase()) {
        moveToNextWord();
      } else {
        setCurrentPhase(3);
        setPlayerInput('');
      }
    } else if (currentPhase === 3) {
      if (playerInput.toLowerCase() === currentWord.word.toLowerCase()) {
        moveToNextWord();
      }
    }
  };

  const moveToNextWord = () => {
    setCurrentPhase(1);
    setPlayerInput('');

    if (wordIndex + 1 < currentLevel.length) {
      setWordIndex(wordIndex + 1);
    } else if (levelIndex + 1 < levels.length) {
      setLevelIndex(levelIndex + 1);
      navigate(`/peli/${pathName}/taso/${levelIndex + 2}`);
      setWordIndex(0);
    } else {
      setGameOver(true);
    }
  };

  // Shuffle the word using the Durstenfeld algorithm (Fisher-Yates variant)
  const shuffleWord = (word) => {
    return shuffleArray([...word]).join('');
  };

  return (
    <div className="game-engine">
      {loading ? (
        <p>Ladataan sanoja...</p>
      ) : error ? (
        <p>{error}</p>
      ) : gameOver ? (
        <div>
          <h2>Peli ohi!</h2>
        </div>
      ) : currentWord ? (
        <div>
          {currentPhase === 1 && <h1>Kirjoita sana</h1>}
          {currentPhase === 2 && <h1>Järjestä kirjaimet</h1>}
          {currentPhase === 3 && <h1>Kopioi sana</h1>}

          <img src={currentWord.img} alt={`Kuva sanasta ${currentWord.word}`} />
          <div className="submit-word-div">
            {currentPhase === 2 && <p>{shuffledWord}</p>}
            {currentPhase === 3 && <p>{currentWord.word}</p>}

            <label htmlFor="player-input">Syötä sana:</label>
            <input
              id="player-input"
              type="text"
              value={playerInput}
              onChange={handleInputChange}
              placeholder="Syötä sana"
            />
            <button onClick={handleSubmit}>Valmis</button>
          </div>
        </div>
      ) : (
        <p>Ladataan sanoja...</p>
      )}
    </div>
  );
};

GameEngine.propTypes = {
  pathName: PropTypes.string.isRequired,
  levelIndex: PropTypes.number.isRequired,
};

export default GameEngine;
