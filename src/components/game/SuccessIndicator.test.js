import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessIndicator from './SuccessIndicator';
import { SettingsContext } from '../../contexts/SettingsContext';

describe('SuccessIndicator', () => {
  // Mock context values
  const mockSettings = {
    sounds: true,
    setSounds: jest.fn(),
    music: true,
    setMusic: jest.fn(),
  };

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

  test('renders success indicator with icon and text', () => {
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
});
