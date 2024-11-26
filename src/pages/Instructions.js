import React from 'react';
import InstructionsStep from '../components/instructions/InstructionsStep';
import '../styles/Instructions.css';
import Header from '../components/universal/Header';

function Instructions() {
  return (
    <div className="instructions-page">
      <Header title="Pelin ohjeet" backButtonUrl={'/'} />
      <div className="ins-center-area">
        <section className="instructions-intro">
          <p>
            Pelissä edetään polulla, jossa tulee eteen kuvia. Tavoitteena on
            ratkaista kuvassa esiintyvä sana ja kirjoittaa se onnistuneesti.
            Pelissä on neljä vaihetta: KUVA, JÄRJESTÄ, KOPIOI ja TOISTA. Kun
            sana on ratkaistu, niin polulla edetään seuraavaan kuvaan. Sanan
            mennessä väärin, korostuvat väärät kirjaimet punaisella. Tästä
            seuraavaan vaiheeseen pääsee painamalla JATKA-nappia. Jos sana
            tuntuu todella haastavalta eikä se mene oikein, se on ensimmäisten
            neljän vaiheen jälkeen mahdollista ohittaa OHITA-napista.
          </p>
        </section>

        <InstructionsStep
          stepNumber={1}
          title="Vaihe 1 – KUVA"
          text="Ensin yritetään muodostaa sana pelkän kuvan perusteella. Jos onnistut ensimmäisellä kerralla, niin etenet suoraan seuraavaan kuvaan. Jos sana ei muistu mieleen, niin mennään toiseen vaiheeseen, eli JÄRJESTÄ-osuuteen."
          image="/sanapolku/instruction-images/phase1.png"
        />

        <InstructionsStep
          stepNumber={2}
          title="Vaihe 2 – JÄRJESTÄ"
          text="Kuvan viereen ilmestyy kirjaimia, jotka tulee järjestää oikeaan järjestykseen. Klikkaa ensin kirjainta, jonka haluat siirtää ja sen jälkeen laatikkoa, johon kirjaimen haluat laittaa. Painamalla VALMIS pääset eteenpäin."
          image="/sanapolku/instruction-images/phase2.png"
        />

        <InstructionsStep
          stepNumber={3}
          title="Vaihe 3 – KOPIOI"
          text="Kun oikea kirjoitusasu on näkyvissä, kopioi kirjaimista muodostunut sana."
          image="/sanapolku/instruction-images/phase3.png"
        />

        <InstructionsStep
          stepNumber={4}
          title="Vaihe 4 – TOISTA"
          text="Muistatko vielä vastauksen? Nyt TOISTA vaiheessa kirjoitetaan sana uudelleen. Oikeasta vastauksesta pääset seuraavaan sanaan ja väärästä vastauksesta palataan pelin JÄRJESTÄ-vaiheeseen."
          image="/sanapolku/instruction-images/phase1.png"
        />
      </div>
    </div>
  );
}

export default Instructions;
