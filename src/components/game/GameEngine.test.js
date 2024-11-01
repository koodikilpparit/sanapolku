import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GameEngine from '../../components/game/GameEngine';
import { openDB } from '../../db/db';

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

afterAll(() => {
  jest.clearAllMocks();
});

describe('GameEngine Component with IndexedDB', () => {
  const mockWords = [
    { id: 1, word: 'apple', img: 'apple.jpg', pathId: 1 },
    { id: 2, word: 'banana', img: 'banana.jpg', pathId: 1 },
  ];

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
    await wordsStore.add(mockWords[0]);
    await wordsStore.add(mockWords[1]);
    await wordsTransaction.done;
  };

  // Initialize the fake IndexedDB before each test
  beforeEach(async () => {
    await initializeTestDB();
  });

  it('renders loading message initially', () => {
    render(<MemoryRouter>
      <GameEngine pathName="test-path" />
    </MemoryRouter>
    );

    // Check if the "Ladataan sanoja..." message is displayed initially
    expect(screen.getByText('Ladataan sanoja...')).toBeInTheDocument();
  });

  it('renders the first word when loaded', async () => {
    render(<MemoryRouter>
      <GameEngine pathName="test-path" />
    </MemoryRouter>
    );

    // Wait for the words to be fetched and rendered
    await waitFor(() =>
      expect(screen.getByText('Kirjoita sana')).toBeInTheDocument()
    );

    // Check that the first word's image is displayed using the src
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', 'apple.jpg');
  });

  it('moves to the second phase on wrong input', async () => {
    render(<MemoryRouter>
      <GameEngine pathName="test-path" />
    </MemoryRouter>
    );

    // Wait for the words to load
    await waitFor(() => screen.getByText('Kirjoita sana'));

    // Simulate entering wrong input and submitting
    'wrong'.split('').forEach((letter) => {
      fireEvent.keyDown(window, { key: letter });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    // Check if it moves to the second phase (letter shuffling)
    await waitFor(() =>
      expect(screen.getByText('Järjestä kirjaimet')).toBeInTheDocument()
    );
  });

  it('moves to the next word on correct input', async () => {
    render(<MemoryRouter>
      <GameEngine pathName="test-path" />
    </MemoryRouter>
    );

    // Wait for the words to load
    await waitFor(() => screen.getByText('Kirjoita sana'));

    // Simulate entering correct input and submitting
    'apple'.split('').forEach((letter) => {
      fireEvent.keyDown(window, { key: letter });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    // Check that it moves to the next word and displays the correct image
    const nextImgElement = screen.getByRole('img');
    expect(nextImgElement).toHaveAttribute('src', 'banana.jpg');
  });

  it('displays game over when all words are completed', async () => {
    render(<MemoryRouter>
      <GameEngine pathName="test-path" />
    </MemoryRouter>
    );

    // Complete the first word
    await waitFor(() => screen.getByText('Kirjoita sana'));
    'apple'.split('').forEach((letter) => {
      fireEvent.keyDown(window, { key: letter });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    // Check the second word (banana) is displayed by its image source
    await waitFor(() => {
      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('src', 'banana.jpg');
    });

    // Complete the second word
    'banana'.split('').forEach((letter) => {
      fireEvent.keyDown(window, { key: letter });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    // Check if the game over message is displayed
    await waitFor(() =>
      expect(screen.getByText('Peli ohi!')).toBeInTheDocument()
    );
  });
});
