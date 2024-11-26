import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessIndicator from './SuccessIndicator';
import { SettingsContext } from '../../contexts/SettingsContext';

describe('SuccessIndicator', () => {
  let mockAudioPlay, mockAudioPause, mockAudio;

  beforeEach(() => {
    // Mock HTMLAudioElement methods
    mockAudioPlay = jest.fn(() => Promise.resolve());
    mockAudioPause = jest.fn();
    mockAudio = {
      play: mockAudioPlay,
      pause: mockAudioPause,
      currentTime: 0,
      loop: false,
      volume: 0,
    };

    jest.spyOn(global, 'Audio').mockImplementation(() => mockAudio);
  });

  test('renders success indicator with icon and text with sound effect', () => {
    const mockSettings = {
      sounds: true,
      setSounds: jest.fn(),
      music: true,
      setMusic: jest.fn(),
    };

    render(
      <SettingsContext.Provider value={mockSettings}>
        <SuccessIndicator />
      </SettingsContext.Provider>
    );

    const successIcon = screen.getByTestId('success-indicator');
    expect(successIcon).toBeInTheDocument();
    expect(successIcon).toHaveClass('success-indicator');

    const successText = screen.getByText('Oikein!');
    expect(successText).toBeInTheDocument();
    expect(successText).toHaveClass('success-text');

    expect(mockAudioPlay).toHaveBeenCalledTimes(1);
  });

  test('renders success indicator with icon and text without sound effect', () => {
    const mockSettings = {
      sounds: false,
      setSounds: jest.fn(),
      music: true,
      setMusic: jest.fn(),
    };

    render(
      <SettingsContext.Provider value={mockSettings}>
        <SuccessIndicator />
      </SettingsContext.Provider>
    );

    const successIcon = screen.getByTestId('success-indicator');
    expect(successIcon).toBeInTheDocument();
    expect(successIcon).toHaveClass('success-indicator');

    const successText = screen.getByText('Oikein!');
    expect(successText).toBeInTheDocument();
    expect(successText).toHaveClass('success-text');

    expect(mockAudioPlay).not.toHaveBeenCalled();
  });
});
