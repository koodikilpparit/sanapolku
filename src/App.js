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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/asetukset" element={<Settings />} />
          <Route path="/ohjeet" element={<Instructions />} />
          <Route path="/polut" element={<GameMenu />} />
          <Route path="/omatpolut" element={<PathSelection />} />
          <Route path="/muokaapolkua/:pathName" element={<ManagePath />} />
          <Route path="/uusisana/:pathName" element={<NewWord />} />
          <Route path="/peli/:pathName" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
