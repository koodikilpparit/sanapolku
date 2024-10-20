import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPathByName, getWordsForPath } from '../../db/db';
import './GameEngine.css';

const GameEngine = ({ pathName }) => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [playerInput, setPlayerInput] = useState('');
  const [shuffledWord, setShuffledWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [pathId, setPathId] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    getPathByName(pathName)
      .then((path) => {
        if (path) {
          setPathId(path.id);
          return getWordsForPath(path.id);
        } else {
          console.error('Path not found');
          return null;
        }
      })
      .then((fetchedWords) => {
        if (fetchedWords && fetchedWords.length > 0) {
          setWords(fetchedWords);
          setCurrentWord(fetchedWords[0]);
        } else {
          console.error('No words found for this path', pathId);
        }
      })
      .catch((error) => console.error('Error fetching path/words:', error));
  }, [pathName, pathId]);

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

    if (wordIndex + 1 < words.length) {
      setWordIndex(wordIndex + 1);
      setCurrentWord(words[wordIndex + 1]);
    } else {
      setGameOver(true);
    }
  };

  const shuffleWord = (word) => {
    return word
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  };

  return (
    <div className="game-engine">
      {gameOver ? (
        <div>
          <h2>Peli ohi!</h2>
        </div>
      ) : currentWord ? (
        <div>
          {currentPhase === 1 && <h1>Kirjoita sana</h1>}
          {currentPhase === 2 && <h1>Järjestä kirjaimet</h1>}
          {currentPhase === 3 && <h1>Kopioi sana</h1>}

          <img src={currentWord.img} />
          <div className="submit-word-div">
            {currentPhase === 2 && <p>{shuffledWord}</p>}
            {currentPhase === 3 && <p>{currentWord.word}</p>}

            <input
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
};

export default GameEngine;
