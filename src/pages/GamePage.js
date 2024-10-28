import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import GameEngine from '../components/game/GameEngine';

const GamePage = () => {
  const location = useLocation();
  const { pathName } = useParams();
  const { levelIndex } = location.state || {};
  return (
    <div className="game-page">
      {/* Pass the pathName prop to GameEngine */}
      <GameEngine pathName={pathName} levelIndex={levelIndex} />
    </div>
  );
};

export default GamePage;
