import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPathByName, getWordsForPath } from '../db/db';
import PawButton from '../components/levels/PawButton';
import RunButton from '../components/levels/RunButton';
import TreeButton from '../components/levels/TreeButton';
import HouseButton from '../components/levels/HouseButton';
import BriefCaseButton from '../components/levels/BriefCaseButton';
import TrophyButton from '../components/levels/TrophyButton';
import BackButton from '../components/universal/BackButton';
import Path from '../components/levels/Path';
import wordsIntoLevels from '../components/game/WordsIntoLevels';
import './LevelsPage.css';

const levelButtons = [
  PawButton,
  RunButton,
  TreeButton,
  BriefCaseButton,
  HouseButton,
];
const finalButton = TrophyButton;
const positions = [
  [130, 180],
  [240, 360],
  [340, 580],
  [240, 780],
  [130, 980],
];

const LevelsPage = () => {
  const { pathName } = useParams();
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLevels = async () => {
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
        setLoading(false);
      } catch (error) {
        setError('Error fetching path or levels');
        console.error(error);
        setLoading(false);
      }
    };

    fetchLevels();
  }, [pathName]);

  if (loading) return <p>Loading levels...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="levels-page">
      <div className="levels-top-bar">
        <BackButton className="levels-back-button" />
      </div>
      <div className="path-container">
        <Path className="path" />
        {levels.map((level, index) => {
          const ButtonComponent =
            index === levels.length - 1
              ? finalButton
              : levelButtons[Math.floor(Math.random() * levelButtons.length)];

          const position = positions[index];

          return (
            <ButtonComponent
              key={index}
              onClick={() => navigate(`/peli/${pathName}/taso/${index + 1}`)}
              style={{
                position: 'absolute',
                top: `${position[0]}px`,
                left: `${position[1]}px`,
                zIndex: '1',
                width: '131.579px',
                height: '141.228px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                background: '#72A895',
                color: '#06705b',
                border: 'none',
                boxShadow: '0 10px 0 rgba(0, 0, 0, 0.3)',
                transition: 'box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LevelsPage;
