import React from 'react';
import { useState } from 'react';
import BackButton from '../components/universal/BackButton';
import '../styles/Settings.css';
import { SettingsContext } from '../contexts/SettingsContext';
import { resetDB } from '../db/db';

/**
 * Settings component renders the settings page of the application.
 * It allows users to toggle sound and music settings, and displays user information.
 *
 * @component
 * @example
 * return (
 *   <Settings />
 * )
 *
 * @returns {JSX.Element} The rendered settings page.
 */
const Settings = () => {
  const { sounds, setSounds, music, setMusic } =
    React.useContext(SettingsContext);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Function to open the modal for reset
  const openResetModal = () => {
    setIsResetModalOpen(true);
  };

  // Function to close the modal for reset
  const closeResetModal = () => {
    setIsResetModalOpen(false);
  };

  const handleReset = () => {
    resetDB()
      .then(() => {
        localStorage.clear();
        window.location.reload();
      })
      .catch((error) => {
        console.error('Failed to reset the database:', error);
      });
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <BackButton />
        <h2> Asetukset </h2>
      </header>

      <div className="settings">
        <div className="setting-item">
          <label htmlFor="sounds-checkbox">Äänet</label>
          <label className="switch">
            <input
              id="sounds-checkbox"
              type="checkbox"
              checked={sounds}
              onChange={() => setSounds(!sounds)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <label htmlFor="music-checkbox">Musiikki</label>
          <label className="switch">
            <input
              id="music-checkbox"
              type="checkbox"
              checked={music}
              onChange={() => setMusic(!music)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="reset-button">
          <button
            onClick={() => {
              openResetModal();
            }}
          >
            Palauta sovellus oletusasetuksiin
          </button>
        </div>
      </div>

      <div className="settings-about-container">
        <h3>Tietoa sovelluksesta</h3>
        <div className="about-info">
          <div className="soft-box">
            <h2>Kuvat:</h2>
            <p>Papunetin kuvapankki</p>
            <h4>Papunet-kuvahaun kuvatyyppien ikonit:</h4>
            <p>Arasaac: Sergio Palao, muokkaus Papunet</p>
            <p>KUVAKO: Kuvako</p>
            <p>Mulberry: Paxtoncrafts Charitable Trust</p>
            <p>Piirroskuva: Elina Vanninen</p>
            <p>Sclera: Sclera</p>
            <p>Toisto: Aleksei Zamiatin</p>
            <p>Valokuva: Annakaisa Ojanen</p>
            <p>Viittomakuva: Elina Vanninen, muokkaus Sari Kivimäki</p>
          </div>
          <div className="soft-box">
            <h2>Sovelluksen idean kehittäjät:</h2>
            <p>Nita Sorsa, Karri Kauppila</p>
          </div>
          <div className="soft-box">
            <h2>Sovelluksen kehitystiimi:</h2>
            <p>
              Anni Nieminen, Eveliina Sundberg, Neera Kiviluoma, Tuuli Järvimaa,
              Juho Rantala, Onni Salomaa, Risto &quot;Reine&quot; Majakangas
            </p>
          </div>
        </div>
      </div>

      <footer>
        <p>
          {' '}
          <a
            href="https://github.com/koodikilpparit/sanapolku"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ohjelma lisenssoitu AGPL-3.0 lisenssillä. Lähdekoodi saatavilla
          </a>
          .
        </p>
      </footer>

      {/* Modal for confirming reset */}
      {isResetModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Haluatko varmasti palauttaa oletusasetukset?</h2>
            <p>Tämä poistaa kaikki omat polut ja sanat!</p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={closeResetModal}>
                Peruuta
              </button>
              <button className="cancel-button" onClick={handleReset}>
                Vahvista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
