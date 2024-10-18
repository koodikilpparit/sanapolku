import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsProvider, SettingsContext } from './SettingsContext';

describe('SettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default values for sounds and music', () => {
    render(
      <SettingsProvider>
        <SettingsContext.Consumer>
          {({ sounds, music }) => (
            <>
              <div data-testid="sounds">{sounds.toString()}</div>
              <div data-testid="music">{music.toString()}</div>
            </>
          )}
        </SettingsContext.Consumer>
      </SettingsProvider>
    );

    expect(screen.getByTestId('sounds')).toHaveTextContent('true');
    expect(screen.getByTestId('music')).toHaveTextContent('true');
  });

  it('persists sounds setting to localStorage', () => {
    render(
      <SettingsProvider>
        <SettingsContext.Consumer>
          {({ sounds, setSounds }) => (
            <>
              <div data-testid="sounds">{sounds.toString()}</div>
              <button onClick={() => setSounds(false)}>Toggle Sounds</button>
            </>
          )}
        </SettingsContext.Consumer>
      </SettingsProvider>
    );

    fireEvent.click(screen.getByText('Toggle Sounds'));
    expect(screen.getByTestId('sounds')).toHaveTextContent('false');
    expect(localStorage.getItem('sounds')).toBe('false');
  });

  it('persists music setting to localStorage', () => {
    render(
      <SettingsProvider>
        <SettingsContext.Consumer>
          {({ music, setMusic }) => (
            <>
              <div data-testid="music">{music.toString()}</div>
              <button onClick={() => setMusic(false)}>Toggle Music</button>
            </>
          )}
        </SettingsContext.Consumer>
      </SettingsProvider>
    );

    fireEvent.click(screen.getByText('Toggle Music'));
    expect(screen.getByTestId('music')).toHaveTextContent('false');
    expect(localStorage.getItem('music')).toBe('false');
  });

  it('loads sounds setting from localStorage', () => {
    localStorage.setItem('sounds', 'false');

    render(
      <SettingsProvider>
        <SettingsContext.Consumer>
          {({ sounds }) => <div data-testid="sounds">{sounds.toString()}</div>}
        </SettingsContext.Consumer>
      </SettingsProvider>
    );

    expect(screen.getByTestId('sounds')).toHaveTextContent('false');
  });

  it('loads music setting from localStorage', () => {
    localStorage.setItem('music', 'false');

    render(
      <SettingsProvider>
        <SettingsContext.Consumer>
          {({ music }) => <div data-testid="music">{music.toString()}</div>}
        </SettingsContext.Consumer>
      </SettingsProvider>
    );

    expect(screen.getByTestId('music')).toHaveTextContent('false');
  });
});
