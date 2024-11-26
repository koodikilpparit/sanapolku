import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getWordsForPath } from '../../db/db';
import { getAdultPath, getKidPath } from '../../db/StockPathHelper';
import shuffleArray from 'lodash.shuffle';
import SuccessIndicator from './SuccessIndicator';
import './GameEngine.css';
import PhaseController from './PhaseController';
import BackButton from '../universal/BackButton';
import ProgressBar from './ProgressBar';
import GameEndingPage from './GameEndingPage';
import GameBreakPage from './GameBreakPage';

const GameEngine = ({ pathId }) => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [playerInput, setPlayerInput] = useState([]);
  const [shuffledWord, setShuffledWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBreakPage, setShowBreakPage] = useState(false);
  const [wordAttempts, setWordAttempts] = useState(0);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      let fetchedWords = [];
      if (pathId === 'aikuistenpolku') {
        fetchedWords = await getAdultPath(10); // Get 10 words
      } else if (pathId === 'lastenpolku') {
        fetchedWords = await getKidPath(10); // Get 10 words
      } else {
        try {
          fetchedWords = await getWordsForPath(Number(pathId));
          if (!fetchedWords || fetchedWords.length === 0) {
            setError('No words found for this path');
            return;
          }
          fetchedWords = shuffleArray(fetchedWords).slice(0, 10);
        } catch (error) {
          setError('Error fetching path or words');
          setLoading(false);
        }
      }
      setWords(fetchedWords);
      setCurrentWord(fetchedWords[0]);
      setLoading(false);
    };

    fetchData();
  }, [pathId]);

  useEffect(() => {
    if (words.length > 0 && wordIndex < words.length) {
      setCurrentWord(words[wordIndex]);
    }
  }, [wordIndex, words]);

  useEffect(() => {
    if (currentWord) {
      setPlayerInput(Array(currentWord.word.length).fill(''));
      inputRefs.current.forEach((input) => input?.blur());
    }
  }, [currentWord]);

  useEffect(() => {
    if (currentPhase === 2 && wordAttempts >= 1) {
      setShowSkipButton(true);
    }
  }, [wordAttempts, currentPhase]);

  const handleInputChange = (index, event) => {
    let value = event.target.value.toUpperCase();
    const oldInput = [...playerInput];

    // If there are more than 1 letter, replace with getNewInputValue logic
    if (value.length > 1) {
      const oldValue = oldInput[index];
      value = getNewInputValue(oldValue, value);
    }

    const newInput = [...oldInput];
    newInput[index] = value;
    setPlayerInput(newInput);

    // Only move to the next input if a new character is entered (not on delete)
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  /**
   * Replace old letter from either side (cursor). Also handle cases where user possibly copy-pastes a longer string.
   * @param {string} oldInputValue The player input in previous state at a specific index
   * @param {string} eventValue The input event value at the same index
   * @returns A single character (new input value) at the same index
   */
  const getNewInputValue = (oldInputValue, eventValue) => {
    const newValue = eventValue.replace(oldInputValue, '');
    if (newValue.length < 1) {
      // If managed to replace all letters with empty strings
      return oldInputValue;
    }
    return newValue[0];
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
      triggerSuccessIndicator();

      // Delay moving to next word/game over, so success indicator has time to be visible
      setTimeout(() => {
        if (currentPhase === 1) {
          moveToNextWord();
        } else if (currentPhase === 2) {
          setCurrentPhase(3);
        } else if (currentPhase === 3) {
          setCurrentPhase(1);
        }
      }, 1500);
    } else {
      if (currentPhase === 1) {
        setCurrentPhase(2);
        setShuffledWord(shuffleWord(currentWord.word));
        while (shuffledWord === currentWord.word) {
          setShuffledWord(shuffleWord(currentWord.word));
        }
      } else {
        setWordAttempts((prev) => prev + 1);
        setCurrentPhase(3);
      }
    }

    setPlayerInput(Array(currentWord.word.length).fill(''));
  };

  // Handle moving to the next word
  const moveToNextWord = () => {
    setCurrentPhase(1);
    setWordAttempts(0);
    setShowSkipButton(false);

    if (wordIndex + 1 < words.length) {
      setProgress((prevProgress) => prevProgress + 100 / words.length);

      if (wordIndex + 1 === 5 && words.length === 10) {
        setShowBreakPage(true);
        return;
      }
      setWordIndex(wordIndex + 1);
    } else {
      setGameOver(true);
      setProgress(100);
    }
  };

  // Handle continuing game after break
  const handleContinueAfterBreak = () => {
    setShowBreakPage(false);
    setWordIndex(wordIndex + 1);
  };

  // Shuffle the word using the Durstenfeld algorithm (Fisher-Yates variant)
  const shuffleWord = (word) => {
    return shuffleArray([...word]).join('');
  };

  const triggerSuccessIndicator = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleSkip = () => {
    moveToNextWord();
  };

  return (
    <div className="flex flex-col  h-screen p-2 pb-10 sm:p-2 md:p-4">
      <div className="top-bar">
        <BackButton url="/polut" />
        <div className="progress-bar-container">
          <ProgressBar progress={progress} />
        </div>
      </div>
      <div className="flex-grow">
        {loading ? (
          <p className="loading-msg"> Ladataan sanoja...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : showBreakPage ? (
          <GameBreakPage onContinue={handleContinueAfterBreak} />
        ) : gameOver ? (
          <>
            <GameEndingPage />
          </>
        ) : currentWord ? (
          <>
            {showSuccess && <SuccessIndicator />}
            <PhaseController
              currentPhase={currentPhase}
              currentWord={currentWord}
              playerInput={playerInput}
              handleInputChange={handleInputChange}
              setPlayerInput={setPlayerInput}
              handleSubmit={handleSubmit}
              inputRefs={inputRefs}
              shuffledWord={shuffledWord}
              showSkipButton={showSkipButton}
              handleSkip={handleSkip}
            />
          </>
        ) : (
          <p className="loading-msg">Ladataan sanoja...</p>
        )}
      </div>
    </div>
  );
};

GameEngine.propTypes = {
  pathId: PropTypes.string.isRequired,
};

export default GameEngine;
