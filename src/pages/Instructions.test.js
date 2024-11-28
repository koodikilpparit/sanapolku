import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Start from './Start';
import Instructions from './Instructions';
import SettingsProvider from '../contexts/SettingsContext';

describe('StartPage', () => {
  it('checks if Instructions-page renders', () => {
    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <SettingsProvider>
          <Instructions />
        </SettingsProvider>
      </BrowserRouter>
    );

    expect(getByText('Pelin ohjeet')).toBeInTheDocument();
    expect(
      getByText(
        'Pelissä edetään polulla, jossa tulee eteen kuvia. Tavoitteena on ratkaista kuvassa esiintyvä sana ja kirjoittaa se onnistuneesti. Pelissä on neljä vaihetta: KUVA, JÄRJESTÄ, KOPIOI ja TOISTA. Kun sana on ratkaistu, niin polulla edetään seuraavaan kuvaan. Sanan mennessä väärin, korostuvat väärät kirjaimet punaisella. Tästä seuraavaan vaiheeseen pääsee painamalla JATKA-nappia. Jos sana tuntuu todella haastavalta eikä se mene oikein, se on ensimmäisten neljän vaiheen jälkeen mahdollista ohittaa OHITA-napista.'
      )
    ).toBeInTheDocument();
    expect(getByText('Vaihe 1 – KUVA')).toBeInTheDocument();
    expect(getByText('Vaihe 2 – JÄRJESTÄ')).toBeInTheDocument();
    expect(getByText('Vaihe 3 – KOPIOI')).toBeInTheDocument();
    expect(getByText('Vaihe 4 – TOISTA')).toBeInTheDocument();

    expect(getByAltText('Vaihe 1 – KUVA')).toBeInTheDocument();
    expect(getByAltText('Vaihe 2 – JÄRJESTÄ')).toBeInTheDocument();
    expect(getByAltText('Vaihe 3 – KOPIOI')).toBeInTheDocument();
    expect(getByAltText('Vaihe 4 – TOISTA')).toBeInTheDocument();
  });

  it('checks if back-button brings you to the start page', () => {
    const { container } = render(
      <BrowserRouter>
        <SettingsProvider>
          <Instructions />
          <Start />
        </SettingsProvider>
      </BrowserRouter>
    );

    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(window.location.pathname).toBe('/');
  });
});
