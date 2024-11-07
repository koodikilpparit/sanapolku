import React from 'react';
import BackButton from '../components/universal/BackButton';
import InstructionsStep from '../components/instructions/InstructionsStep';
import '../styles/Instructions.css';
import phase1Img from '../assets/instruction-images/phase1.png';
import phase2Img from '../assets/instruction-images/phase2.png';
import phase3Img from '../assets/instruction-images/phase3.png';

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

        <section className="instructions-intro">
          <p>
            Pelissä edetään polulla, jossa tulee eteen kuvia. Tavoitteena on
            ratkaista kuvassa esiintyvä sana ja kirjoittaa se onnistuneesti.
            Pelissä on neljä vaihetta: KUVA, JÄRJESTÄ, KOPIOI ja TOISTA. Kun
            sana on ratkaistu, niin polulla edetään seuraavaan kuvaan.
          </p>
        </section>

        <InstructionsStep
          stepNumber={1}
          title="Vaihe 1 – KUVA"
          text="Ensin yritetään muodostaa sana pelkän kuvan perusteella. Jos onnistut ensimmäisellä kerralla, niin etenet suoraan seuraavaan kuvaan. Jos sana ei muistu mieleen, niin mennään toiseen vaiheeseen, eli JÄRJESTÄ-osuuteen."
          image={phase1Img}
        />

        <InstructionsStep
          stepNumber={2}
          title="Vaihe 2 – JÄRJESTÄ"
          text="Kuvan viereen ilmestyy kirjaimia, jotka tulee järjestää oikeaan järjestykseen. Painamalla VALMIS pääset eteenpäin."
          image={phase2Img}
        />

        <InstructionsStep
          stepNumber={3}
          title="Vaihe 3 – KOPIOI"
          text="Kun oikea kirjoitusasu on näkyvissä, kopioi kirjaimista muodostunut sana."
          image={phase3Img}
        />

        <InstructionsStep
          stepNumber={4}
          title="Vaihe 4 – TOISTA"
          text="Muistatko vielä vastauksen? Nyt TOISTA vaiheessa kirjoitetaan sana uudelleen. Oikeasta vastauksesta pääset seuraavaan sanaan ja väärästä vastauksesta palataan pelin JÄRJESTÄ-vaiheeseen."
          image={phase1Img}
        />
      </div>
    </div>
  );
}

export default Instructions;
