import React from 'react';
import BackButton from '../components/universal/BackButton';
import InstructionsStep from '../components/instructions/InstructionsStep';
import '../styles/Instructions.css';
import mrBean from '../assets/instruction-images/mrBean.png';

function Instructions() {
  return (
    <div className="instructions-page">
      <div className="ins-top-bar">
        <BackButton className="ins-back-button" />
      </div>

      <div className="ins-center-area">
        <header className="ins-header">
          <h2>Pelin ohjeet</h2>
        </header>

        <InstructionsStep
          stepNumber={1}
          title="Vaihe 1 – KUVA"
          text="Ensin koitetaan muodostaa sana pelkän kuvan perusteella. Jos onnistut ensimmäisellä, niin etenet suoraan seuraavaan kuvaan. Jos sana ei muistu mieleen, niin mennään toiseen vaiheeseen, eli JÄRJESTÄ-osuuteen."
          image={mrBean}
        />

        <InstructionsStep
          stepNumber={2}
          title="Vaihe 2 – JÄRJESTÄ"
          text="Kuvan alle ilmestyy kirjaimia, jotka tulee järjestää oikeaan järjestykseen. Saat hahmotella sanaa niin pitkään, kuin tarvitsee ja painamalla VALMIS saat selville oikean vastauksen."
          image={mrBean}
        />

        <InstructionsStep
          stepNumber={3}
          title="Vaihe 3 – KOPIOI"
          text="Kun oikea kirjoitusasu on näkyvissä, kopioi kirjaimista muodostunut sana."
          image={mrBean}
        />

        <InstructionsStep
          stepNumber={4}
          title="Vaihe 4 – TOISTA"
          text="Muistatko vielä vastauksen? Nyt TOISTA vaiheessa kirjoitetaan sana uudelleen. Oikeasta vastauksesta pääset seuraavaan sanaan ja väärästä vastauksesta palataan pelin JÄRJESTÄ-vaiheeseen."
          image={mrBean}
        />
      </div>
    </div>
  );
}

export default Instructions;
