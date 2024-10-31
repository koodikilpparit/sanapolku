import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPathByName, getWordsForPath } from '../../db/db';
import shuffleArray from 'lodash.shuffle';
import Phase1 from './Phase1';
import Phase2 from './Phase2';
import Phase3 from './Phase3';
import BackButton from '../universal/BackButton';
import './GameEngine.css';

const GameEngine = ({ pathName }) => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [playerInput, setPlayerInput] = useState([]);
  const [shuffledWord, setShuffledWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

        setWords(fetchedWords);
        setCurrentWord(fetchedWords[0]);
        setLoading(false);
      } catch (error) {
        setError('Error fetching path or words');
        setLoading(false);
      }
    };

    fetchData();
  }, [pathName]);

  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[wordIndex]);
    }
  }, [wordIndex, words]);

  // Handle input change
  const handleInputChange = (e) => {
    setPlayerInput(e.target.value.split(''));
  };

  // Handle submission based on the phase
  const handleSubmit = () => {
    if (!currentWord) return;

    const normalizedInput = playerInput.join('').toLowerCase();
    const targetWord = currentWord.word.toLowerCase();

    if (normalizedInput === targetWord) {
      if (currentPhase === 1) {
        moveToNextWord();
      } else if (currentPhase === 2) {
        setCurrentPhase(3);
      } else if (currentPhase === 3) {
        setCurrentPhase(1);
      }
    } else {
      if (currentPhase === 1) {
        setCurrentPhase(2);
        setShuffledWord(shuffleWord(currentWord.word));
      } else {
        setCurrentPhase(3);
      }
    }

    setPlayerInput(Array(currentWord.word.length).fill(''));
  };

  const moveToNextWord = () => {
    setCurrentPhase(1);
    setPlayerInput('');

    if (wordIndex + 1 < words.length) {
      setWordIndex(wordIndex + 1);
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
      <div className="game-back-button">
        <BackButton />
      </div>
      <div className="game-content">
        {loading ? (
          <p className="loading-msg"> Ladataan sanoja...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : gameOver ? (
          <div>
            <h2>Peli ohi!</h2>
          </div>
        ) : currentWord ? (
          <>
            {currentPhase === 1 && (
              <Phase1
              currentWord={currentWord}
              playerInput={playerInput}
              setPlayerInput={setPlayerInput}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              handleSubmit={handleSubmit}
              />
            )}
            {currentPhase === 2 && (
              <Phase2
                currentWord={currentWord}
                shuffledWord={shuffledWord}
                playerInput={playerInput}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            )}
            {currentPhase === 3 && (
              <Phase3
                currentWord={currentWord}
                playerInput={playerInput}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            )}
          </>
        ) : (
          <p className="loading-msg">Ladataan sanoja...</p>
        )}
      </div>
    </div>
  );
};

GameEngine.propTypes = {
  pathName: PropTypes.string.isRequired,
};

export default GameEngine;
