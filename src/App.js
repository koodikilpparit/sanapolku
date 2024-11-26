import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Start from './pages/Start';
import Settings from './pages/Settings';
import Instructions from './pages/Instructions';
import GameMenu from './pages/GameMenu';
import PathSelection from './pages/PathSelection';
import ManagePath from './pages/ManagePath';
import NewWord from './pages/NewWord';
import GamePage from './pages/GamePage';
import { PathProvider } from './components/pathSelection/PathContext';
import BackgroundMusic from './components/sounds/BackgroundMusic';

function App() {
  return (
    <Router>
      <div className="App">
        <BackgroundMusicWrapper />
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/asetukset" element={<Settings />} />
          <Route path="/ohjeet" element={<Instructions />} />
          <Route path="/polut" element={<GameMenu />} />
          <Route
            path="/omatpolut"
            element={
              <PathProvider>
                <PathSelection />
              </PathProvider>
            }
          />
          <Route path="/muokkaapolkua/:pathId" element={<ManagePath />} />
          <Route path="/uusisana/:pathId" element={<NewWord />} />
          <Route path="/peli/:pathId" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

const BackgroundMusicWrapper = () => {
  return <BackgroundMusic />;
};

export default App;
