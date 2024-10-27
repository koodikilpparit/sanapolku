import React from 'react';
import { useParams } from 'react-router-dom';
import GameEngine from '../components/game/GameEngine';

const GamePage = () => {
  const { pathName, levelIndex } = useParams();
  return (
    <div className="game-page">
      {/* Pass the pathName prop to GameEngine */}
      <GameEngine pathName={pathName} levelIndex={parseInt(levelIndex, 10)} />
    </div>
  );
};

export default GamePage;
