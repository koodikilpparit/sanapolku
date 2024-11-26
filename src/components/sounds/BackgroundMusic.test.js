// BackgroundMusic.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { SettingsContext } from '../../contexts/SettingsContext';
import BackgroundMusic from './BackgroundMusic';

// Mock useLocation to control the current route
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('BackgroundMusic Component', () => {
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

    // Default mock for useLocation
    useLocation.mockReturnValue({ pathname: '/' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should play audio on user interaction', async () => {
    const mockSettings = { music: true, volume: 0.5 };

    const { container } = render(
      <SettingsContext.Provider value={mockSettings}>
        <BackgroundMusic />
      </SettingsContext.Provider>
    );

    // Simulate user interaction
    fireEvent.click(container);

    // Wait for audio.play() to be called
    await waitFor(() => {
      expect(mockAudioPlay).toHaveBeenCalled();
    });
  });

  it('should mute audio when on "/peli" route', async () => {
    const mockSettings = { music: true, volume: 0.5 };

    useLocation.mockReturnValue({ pathname: '/peli' });

    const { container } = render(
      <SettingsContext.Provider value={mockSettings}>
        <BackgroundMusic />
      </SettingsContext.Provider>
    );

    // Simulate user interaction
    fireEvent.click(container);

    // Wait for audio.play() to be called
    await waitFor(() => {
      expect(mockAudioPlay).toHaveBeenCalled();
    });

    // Check that volume is set to 0
    await waitFor(
      () => {
        expect(mockAudio.volume).toBe(0);
      },
      { timeout: 5000 }
    );
  });

  it('should set volume based on context when not in "/peli"', async () => {
    const mockSettings = { music: true, volume: 0.7 };

    useLocation.mockReturnValue({ pathname: '/' });

    const { container } = render(
      <SettingsContext.Provider value={mockSettings}>
        <BackgroundMusic />
      </SettingsContext.Provider>
    );

    // Simulate user interaction
    fireEvent.click(container);

    // Wait for audio.play() to be called
    await waitFor(() => {
      expect(mockAudioPlay).toHaveBeenCalled();
    });

    // Check that volume is set to the context value
    await waitFor(
      () => {
        expect(mockAudio.volume).toBe(0.7);
      },
      { timeout: 5000 }
    );
  });

  it('should set volume to 0 when music is disabled in settings', async () => {
    const mockSettings = { music: false, volume: 0.5 };

    const { container } = render(
      <SettingsContext.Provider value={mockSettings}>
        <BackgroundMusic />
      </SettingsContext.Provider>
    );

    // Simulate user interaction
    fireEvent.click(container);

    // Wait for audio.play() to be called
    await waitFor(() => {
      expect(mockAudioPlay).toHaveBeenCalled();
    });

    // Check that volume is set to 0
    await waitFor(
      () => {
        expect(mockAudio.volume).toBe(0);
      },
      { timeout: 5000 }
    );
  });

  it('should reset audio when unmounted', () => {
    const mockSettings = { music: true, volume: 0.5 };

    const { unmount, container } = render(
      <SettingsContext.Provider value={mockSettings}>
        <BackgroundMusic />
      </SettingsContext.Provider>
    );

    // Simulate user interaction
    fireEvent.click(container);

    unmount();

    expect(mockAudioPause).toHaveBeenCalled();
    expect(mockAudio.currentTime).toBe(0);
  });
});
