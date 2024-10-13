import React from "react";
import BackButton from "../components/universal/BackButton";
import "../styles/Settings.css";
import { SettingsContext } from "../contexts/SettingsContext";

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
  // const avatar = "https://placehold.co/150x150";
  const name = "Matti Meikäläinen";
  const id = "12345";

  return (
    <div className="settings-container">
      <header className="settings-header">
        <BackButton />
        <span className="logout">Kirjaudu ulos</span>
      </header>

      <div className="user-info">
        {/* <img src={avatar} alt="avatar" className="avatar" /> */}
        <div className="user-details">
          <h3>{name}</h3>
          <p>{id}</p>
        </div>
      </div>

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
            Kiviluoma, Tuuli Järvimaa, Juho Rantala, Onni Salomaa, Risto "Reine"
            Majakangas{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;