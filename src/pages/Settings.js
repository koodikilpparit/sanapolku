import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/universal/BackButton';
import '../styles/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [sounds, setSounds] = useState(true);
  const [music, setMusic] = useState(false);
  const avatar = 'https://placehold.co/150x150';
  const name = 'Matti Meikäläinen';
  const id = '12345';

  return (
    <div className="settings-container">
      <header className="settings-header">
        <BackButton />
        <span className="logout">Kirjaudu ulos</span>
      </header>

      <div className="user-info">
        <img src={avatar} alt="avatar" className="avatar" />
        <div className="user-details">
          <h3>{name}</h3>
          <p>{id}</p>
        </div>
      </div>

      <div className="settings-about-container">
        <div className="settings">
          <h3> Asetukset </h3>
          <div className="setting-item">
            <span>Äänet</span>
            <input
              type="checkbox"
              checked={sounds}
              onChange={() => setSounds(!sounds)}
            />
          </div>
          <div className="setting-item">
            <span>Musiikki</span>
            <input
              type="checkbox"
              checked={music}
              onChange={() => setMusic(!music)}
            />
          </div>
        </div>

        <div className="about-info">
          <h3>Tietoa sovelluksesta</h3>
          <p>
            Kuvat: Papunetin kuvapankki, papunet.net, Elina Vanninen, Sergio
            Palao / ARASAAC ja Sclera.
          </p>
          <p>Tekijät: Matti, Teppo ja Pekka</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;