import React from 'react';
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
  return (
    <div className="settings-container">
      <header className="settings-header">
        <BackButton />
      </header>

      <div className="settings-about-container">
        <div className="settings">
          <h3> Asetukset </h3>
          <div className="setting-item">
            <label htmlFor="sounds-checkbox">Äänet</label>
            <input
              id="sounds-checkbox"
              type="checkbox"
              checked={sounds}
              onChange={() => setSounds(!sounds)}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="music-checkbox">Musiikki</label>
            <input
              id="music-checkbox"
              type="checkbox"
              checked={music}
              onChange={() => setMusic(!music)}
            />
          </div>
        </div>

        <div className="about-info">
          <h3>Tietoa sovelluksesta</h3>
          <p>Kuvat: Papunetin kuvapankki,</p>
          <p>
            Sovelluksen kehittäjät: Anni Nieminen, Eveliina Sundberg, Neera
            Kiviluoma, Tuuli Järvimaa, Juho Rantala, Onni Salomaa, Risto
            &quot;Reine&quot; Majakangas
          </p>
        </div>

        <div className="reset-button">
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Haluatko varmasti palauttaa sovelluksen oletusasetuksiin? Tämä poistaa kaikki omat polut ja sanat!'
                )
              ) {
                resetDB()
                  .then(() => {
                    localStorage.clear();
                    window.location.reload();
                  })
                  .catch((error) => {
                    console.error('Failed to reset the database:', error);
                  });
              }
            }}
          >
            Palauta sovellus oletusasetuksiin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
