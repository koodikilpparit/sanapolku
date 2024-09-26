import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Start from './pages/Start';
import Settings from './pages/Settings';
import Instructions from './pages/Instructions';
import GameMenu from './pages/GameMenu';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/asetukset" element={<Settings />} />
          <Route path="/ohjeet" element={<Instructions />} />
          <Route path="/polut" element={<GameMenu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
