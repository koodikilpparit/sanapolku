import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import GameEngine from '../../components/game/GameEngine';
import PathSelection from '../../pages/PathSelection';
import { addPath, addWord, resetDB } from '../../db/db';
import { PathProvider } from '../pathSelection/PathContext';

// Polyfill for structuredClone if missing
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

afterAll(() => {
  jest.clearAllMocks();
});

describe('GameEngine Component with IndexedDB', () => {
  const mockWords = Array.from({ length: 15 }, (_, index) => ({
    word: `word${index + 1}`,
    imageData: { src: `word${index + 1}.jpg`, author: `author${index + 1}` },
  }));

  let pathId;

  // Utility function to set up the test DB
  const initializeTestDB = async () => {
    await resetDB();
    pathId = await addPath('test-path');
    await Promise.all(
      mockWords.map((word) => {
        return addWord(word.word, pathId, word.imageData);
      })
    );
  };

  // Initialize the fake IndexedDB before each test
  beforeEach(async () => {
    await initializeTestDB();
  });

  // Reset timer after each test
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders loading message initially', () => {
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Check if the "Ladataan sanoja..." message is displayed initially
    expect(screen.getByText('Ladataan sanoja...')).toBeInTheDocument();
  });

  it('moves to the next word on correct input', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Wait for the words to load
    await waitFor(() => screen.getByText('Kirjoita sana'));

    // Wait for the first word and its image to be displayed and remember the first image
    const firstImage = await screen.findByRole('img');
    const firstSrc = firstImage.getAttribute('src');

    // Use the first image's src to figure out what is correct word
    const firstWord = firstSrc.replace('.jpg', '');

    // Enter the correct word for the first phase
    const hiddenInput = screen.getByTestId('hidden-input');

    firstWord.split('').forEach((letter) => {
      fireEvent.change(hiddenInput, { target: { value: letter } });
    });
    fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

    // Advance time to allow success indicator
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    const newImage = await screen.findByRole('img');
    const newSrc = newImage.getAttribute('src');
    const secondWord = newSrc.replace('.jpg', '');

    expect(secondWord).not.toBe(firstWord); // Ensure that the image has ch
  });

  it('moves to the second phase on wrong input', async () => {
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Wait for the words to load and phase 1 to be active
    await waitFor(() => screen.getByText('Kirjoita sana'));

    // Wait for the word and its image to be displayed
    const image = await screen.findByRole('img');
    const imageSrc = image.getAttribute('src');

    // Use the first image's src to figure out what is correct word
    const correctWord = imageSrc.replace('.jpg', '');

    // Create wrong word which lenght is same than correct word's
    const wrongWord = 'x'.repeat(correctWord.length);

    // Simulate entering wrong input and submitting
    const hiddenInput = screen.getByTestId('hidden-input');

    wrongWord.split('').forEach((letter) => {
      fireEvent.change(hiddenInput, { target: { value: letter } });
    });
    fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

    // Check if it moves to the second phase (letter shuffling)
    await waitFor(() =>
      expect(screen.getByText('Järjestä kirjaimet')).toBeInTheDocument()
    );
  });

  it('displays game over when all words are completed', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Wait that game begins
    await waitFor(() => screen.getByText('Kirjoita sana'));

    for (let i = 0; i < 10; i++) {
      // Wait for the word and its image to be displayed
      const image = await screen.findByRole('img');
      const imageSrc = image.getAttribute('src');

      // Use the first image's src to figure out what is correct word
      const correctWord = imageSrc.replace('.jpg', '');

      // Simulate entering correct input and submitting
      const hiddenInput = screen.getByTestId('hidden-input');

      correctWord.split('').forEach((letter) => {
        fireEvent.change(hiddenInput, { target: { value: letter } });
      });
      fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

      act(() => {
        jest.advanceTimersByTime(2500);
      });
    }
    // Check if the game over message is displayed
    await waitFor(() => {
      expect(screen.getByText('Peli ohi!')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('displays success indicator after correct input and hides it after timeout', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Kirjoita sana'));

    const image = await screen.findByRole('img');
    const imageSrc = image.getAttribute('src');

    // Use the first image's src to figure out what is correct word
    const correctWord = imageSrc.replace('.jpg', '');

    // Simulate correct input using hidden input for each character
    const hiddenInput = screen.getByTestId('hidden-input');
    correctWord.split('').forEach((letter) => {
      fireEvent.change(hiddenInput, { target: { value: letter } });
    });
    fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

    await act(async () => {
      await waitFor(() =>
        expect(screen.getByTestId('success-indicator')).toBeInTheDocument()
      );
    });

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(screen.queryByTestId('success-indicator')).toBeNull();
  });

  it('checks that the back-button brings you to /omatpolut', () => {
    // Rendering the required pages
    const { container } = render(
      <BrowserRouter>
        <GameEngine pathId={String(pathId)} />
        <PathProvider>
          <PathSelection />
        </PathProvider>
      </BrowserRouter>
    );

    // Checking that the back-button is on the game page
    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(screen.getByText('Polut')).toBeInTheDocument();
  });
});
