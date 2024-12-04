import React from 'react';
import { useState } from 'react';
import '../styles/Settings.css';
import { SettingsContext } from '../contexts/SettingsContext';
import { resetDB } from '../db/db';
import Header from '../components/universal/Header';

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
      <Header title="Asetukset" backButtonUrl={'/'} />
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
            <h2>Tietojen tallennus</h2>
            <p>
              Sovellukseen luotujen omien polkujen data on tallennettu
              selaimeen. Pelien dataa ei tallenneta millään tavalla.
            </p>
            <p>
              Polkujen jakaminen toimii salatulla yhteydellä suoraan laitteelta
              laitteelle, eikä dataa tallenneta palvelimille.
            </p>
          </div>
          <div className="soft-box">
            <h2>Sovelluksen idean kehittäjät:</h2>
            <p>Nita Sorsa</p>
            <p>Karri Kauppila</p>
          </div>
          <div className="soft-box">
            <h2>Sovelluksen kehitystiimi:</h2>
            <p>Anni Nieminen</p>
            <p>Eveliina Sundberg</p>
            <p>Neera Kiviluoma</p>
            <p>Tuuli Järvimaa</p>
            <p>Juho Rantala</p>
            <p>Onni Salomaa</p>
            <p>Risto &quot;Reine&quot; Majakangas</p>
          </div>
          <div className="soft-box">
            <h2>Lisenssi:</h2>
            <p>
              Tämä sovellus on avoimen lähdekoodin ohjelmisto ja lisensoitu
              AGPL-3.0-lisenssillä. Voit käyttää, muokata ja jakaa ohjelmaa
              lisenssiehtojen mukaisesti.{' '}
              <a
                href="https://github.com/koodikilpparit/sanapolku"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                Lähdekoodi saatavilla
              </a>
              .
            </p>
          </div>
        </div>
      </div>

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
