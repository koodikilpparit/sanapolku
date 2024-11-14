import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getWordsForPath } from '../../db/db';
import { getAdultPath, getKidPath } from '../../db/StockPathHelper';
import shuffleArray from 'lodash.shuffle';
import SuccessIndicator from './SuccessIndicator';
import './GameEngine.css';
import PhaseController from './PhaseController';
import BackButton from '../universal/BackButton';

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
    }
  }, [currentWord]);

  // Handle submission based on the phase
  const handleSubmit = () => {
    if (!currentWord) return;

    // Ensure all inputs are filled
    if (playerInput.some((char) => char === '')) {
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
      } else {
        setCurrentPhase(3);
      }
    }
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

  const triggerSuccessIndicator = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen p-2 pb-10 sm:p-2 md:p-4">
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
          <>
            {showSuccess && <SuccessIndicator />}
            <PhaseController
              currentPhase={currentPhase}
              currentWord={currentWord}
              playerInput={playerInput}
              setPlayerInput={setPlayerInput}
              handleSubmit={handleSubmit}
              shuffledWord={shuffledWord}
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
