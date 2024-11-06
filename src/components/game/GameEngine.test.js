import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameEngine from '../../components/game/GameEngine';
import { openDB } from '../../db/db';

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

afterAll(() => {
  jest.clearAllMocks();
});

describe('GameEngine Component with IndexedDB', () => {
  const mockWords = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    word: `word${index + 1}`,
    img: `word${index + 1}.jpg`,
    pathId: 1,
  }));

  // Utility function to set up the test DB
  const initializeTestDB = async () => {
    const db = await openDB('pathsDB');
    const transaction = db.transaction(['paths'], 'readwrite');
    const pathsStore = transaction.objectStore('paths');
    await pathsStore.add({ id: 1, name: 'test-path' });
    await transaction.done;

    const wordsDB = await openDB('wordsDB');
    const wordsTransaction = wordsDB.transaction(['words'], 'readwrite');
    const wordsStore = wordsTransaction.objectStore('words');
    for (const word of mockWords) {
      await wordsStore.add(word);
    }
    await wordsTransaction.done;
  };

  // Initialize the fake IndexedDB before each test
  beforeEach(async () => {
    await initializeTestDB();
  });

  it('renders loading message initially', () => {
    render(<GameEngine pathName="test-path" />);

    // Check if the "Ladataan sanoja..." message is displayed initially
    expect(screen.getByText('Ladataan sanoja...')).toBeInTheDocument();
  });

  it('moves to the next word on correct input', async () => {
    render(<GameEngine pathName="test-path" />);

    // Wait for the first word and its image to be displayed
    await waitFor(() => screen.getByRole('img')); // Wait for the image to appear (we don't know which image)

    // Remember the initial image (since the order is random, we store the first one)
    const initialImage = screen.getByRole('img');

    // Enter the correct word for the first phase
    fireEvent.change(screen.getByPlaceholderText('Syötä sana'), {
      target: { value: mockWords[0].word },
    });
    fireEvent.click(screen.getByText('Valmis'));

    // Wait for the game to move to the next word and the image to change
    await waitFor(() => {
      const nextImage = screen.getByRole('img');
      expect(nextImage).not.toBe(initialImage); // Ensure that the image has changed
    });

    // Enter the next correct word
    fireEvent.change(screen.getByPlaceholderText('Syötä sana'), {
      target: { value: mockWords[1].word },
    });
    fireEvent.click(screen.getByText('Valmis'));

    // Wait for the game to move to the next word again and the image to change
    await waitFor(() => {
      const nextImage = screen.getByRole('img');
      expect(nextImage).not.toBe(initialImage); // Ensure that the image has changed again
    });
  });

  it('loads exactly 10 random words', async () => {
    render(<GameEngine pathName="test-path" />);

    await waitFor(() => {
      const wordCountElement = screen.getByTestId('word-count');
      expect(Number(wordCountElement.textContent)).toBe(10);
    });
  });

  it('moves to the second phase on wrong input', async () => {
    render(<GameEngine pathName="test-path" />);

    // Wait for the words to load and phase 1 to be active
    await waitFor(() => screen.getByText('Kirjoita sana'));

    // Simulate entering wrong input and submitting
    fireEvent.change(screen.getByPlaceholderText('Syötä sana'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByText('Valmis'));

    // Check if it moves to the second phase (letter shuffling)
    await waitFor(() =>
      expect(screen.getByText('Järjestä kirjaimet')).toBeInTheDocument()
    );
  });
});
