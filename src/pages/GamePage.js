import React from 'react';
import { useParams } from 'react-router-dom';
import GameEngine from '../components/game/GameEngine';

const GamePage = () => {
  const pathId = Number(useParams().pathId);
  return (
    <div className="min-h-screen min-w-screen">
      {/* Pass the pathName prop to GameEngine */}
      <GameEngine pathId={String(pathId)} />
    </div>
  );
};

export default GamePage;
