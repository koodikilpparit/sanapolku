import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Settings from './Settings';
import { SettingsContext } from '../contexts/SettingsContext';

describe('Settings Component', () => {
  const mockSetSounds = jest.fn();
  const mockSetMusic = jest.fn();

  const renderComponent = (sounds = true, music = true) => {
    render(
      <Router>
        <SettingsContext.Provider
          value={{
            sounds,
            setSounds: mockSetSounds,
            music,
            setMusic: mockSetMusic,
          }}
        >
          <Settings />
        </SettingsContext.Provider>
      </Router>
    );
  };

  it('renders sound and music settings', () => {
    renderComponent();
    expect(screen.getByText('Äänet')).toBeInTheDocument();
    expect(screen.getByText('Musiikki')).toBeInTheDocument();
  });

  it('toggles sound setting', () => {
    renderComponent();
    const soundCheckbox = screen.getByLabelText('Äänet');
    fireEvent.click(soundCheckbox);
    expect(mockSetSounds).toHaveBeenCalledWith(false);
  });

  it('toggles music setting', () => {
    renderComponent();
    const musicCheckbox = screen.getByLabelText('Musiikki');
    fireEvent.click(musicCheckbox);
    expect(mockSetMusic).toHaveBeenCalledWith(false);
  });

  it('opens and closes the reset confirmation modal', () => {
    renderComponent();
    const resetButton = screen.getByText('Palauta sovellus oletusasetuksiin');

    // Open modal
    fireEvent.click(resetButton);
    expect(
      screen.getByText('Haluatko varmasti palauttaa oletusasetukset?')
    ).toBeInTheDocument();

    // Close modal
    const cancelButton = screen.getByText('Peruuta');
    fireEvent.click(cancelButton);
    expect(
      screen.queryByText('Haluatko varmasti palauttaa oletusasetukset?')
    ).not.toBeInTheDocument();
  });
});
