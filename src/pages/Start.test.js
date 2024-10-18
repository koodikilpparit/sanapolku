import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Start from './Start';
import Settings from './Settings';
import Instructions from './Instructions';
import GameMenu from './GameMenu';
import { SettingsProvider } from '../contexts/SettingsContext';

describe('StartPage', () => {
  // Rendering the start page
  it('checks if Start-page renders', () => {
    render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );
  });

  it('checks if settings-button brings you to /asetukset', () => {
    // Rendering the required pages
    const { container } = render(
      <SettingsProvider>
        <BrowserRouter>
          <Start />
          <Settings />
        </BrowserRouter>
      </SettingsProvider>
    );

    // Checking that the settings-button is on the start page
    const settingsButton = container.querySelector('.settings-button');
    expect(settingsButton).toBeInTheDocument();

    // Checking that by clicking the settings-button you can navigate to /asetukset
    fireEvent.click(settingsButton);
    expect(screen.getByText(/Asetukset/i)).toBeInTheDocument();
  });

  it('checks if help-button brings you to /ohjeet', () => {
    // Rendering the required pages
    const { container } = render(
      <BrowserRouter>
        <Start />
        <Instructions />
      </BrowserRouter>
    );

    // Checking that the help-button is on the start page
    const helpButton = container.querySelector('.help-button');
    expect(helpButton).toBeInTheDocument();

    // Checking that by clicking the help-button you can navigate to /ohjeet
    fireEvent.click(helpButton);
    expect(screen.getByText(/Pelin ohjeet/i)).toBeInTheDocument();
  });

  it('checks if start-button brings you to /polut', () => {
    // Rendering the required pages
    const { container } = render(
      <BrowserRouter>
        <Start />
        <GameMenu />
      </BrowserRouter>
    );

    // Checking that the start-button is on the start page
    const startButton = container.querySelector('.start-button');
    expect(startButton).toBeInTheDocument();

    // Checking that by clicking the start-button you can navigate to /polut
    fireEvent.click(startButton);
    expect(screen.getByText(/Valitse polku/i)).toBeInTheDocument();
  });
});
