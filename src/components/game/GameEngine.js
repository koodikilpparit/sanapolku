import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPathByName, getWordsForPath } from '../../db/db';
import shuffleArray from 'lodash.shuffle';
import PhaseController from './PhaseController';
import BackButton from '../universal/BackButton';

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
  const inputRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const path = await getPathByName(pathName);
        if (!path) {
          setError('Path not found');
          setLoading(false);
          return;
        }

        const fetchedWords = await getWordsForPath(path.id);
        if (!fetchedWords || fetchedWords.length === 0) {
          setError('No words found for this path');
          setLoading(false);
          return;
        }

        const limitedWords = fetchedWords.slice(0, 10);

        setWords(limitedWords);
        setCurrentWord(limitedWords[0]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching path or words');
        setLoading(false);
      }
    };

    fetchData();
  }, [pathName]);

  useEffect(() => {
    if (words.length > 0 && wordIndex < words.length) {
      setCurrentWord(words[wordIndex]);
    }
  }, [wordIndex, words]);

  useEffect(() => {
    if (currentWord) {
      setPlayerInput(Array(currentWord.word.length).fill(''));
      inputRefs.current.forEach((input) => input?.blur());
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }, [currentWord]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [currentPhase]);

  const handleInputChange = (index, event) => {
    const value = event.target.value.toUpperCase();

    const newInput = [...playerInput];
    newInput[index] = value;
    setPlayerInput(newInput);

    // Only move to the next input if a new character is entered (not on delete)
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle submission based on the phase
  const handleSubmit = () => {
    if (!currentWord) return;

    // Check that all input fields have been filled before proceeding
    if (
      playerInput.some(
        (element) =>
          element === '' || playerInput.length !== currentWord.word.length
      )
    ) {
      return;
    }

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

  // Handle moving to the next word
  const moveToNextWord = () => {
    setCurrentPhase(1);

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
    <div className="flex flex-col  h-screen p-2 pb-10 sm:p-2 md:p-4">
      <div className="px-2">
        <BackButton />
      </div>
      <div className="flex-grow">
        {loading ? (
          <p className="loading-msg"> Ladataan sanoja...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : gameOver ? (
          <div>
            <h2>Peli ohi!</h2>
          </div>
        ) : currentWord ? (
          <PhaseController
            currentPhase={currentPhase}
            currentWord={currentWord}
            playerInput={playerInput}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            inputRefs={inputRefs}
            shuffledWord={shuffledWord}
          />
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
