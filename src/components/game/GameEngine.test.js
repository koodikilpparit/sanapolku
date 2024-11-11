import { React, act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import GameEngine from '../../components/game/GameEngine';
import PathsPage from '../../pages/PathSelection';
import { addPath, addWord, resetDB } from '../../db/db';

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

afterAll(() => {
  jest.clearAllMocks();
});

describe('GameEngine Component with IndexedDB', () => {
  const mockWords = [
    { word: 'apple', img: 'apple.jpg' },
    { word: 'banana', img: 'banana.jpg' },
  ];

  let pathId;

  // Utility function to set up the test DB
  const initializeTestDB = async () => {
    await resetDB();
    pathId = await addPath('test-path');
    await addWord(mockWords[0].word, pathId, mockWords[0].img);
    await addWord(mockWords[1].word, pathId, mockWords[1].img);
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

  it('renders the first word when loaded', async () => {
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
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
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Wait for the words to load
    await waitFor(() => screen.getByText('Kirjoita sana'));

    // Simulate entering wrong input and submitting
    'wrong'.split('').forEach((letter, index) => {
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: letter },
      });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    // Check if it moves to the second phase (letter shuffling)
    await waitFor(() =>
      expect(screen.getByText('Järjestä kirjaimet')).toBeInTheDocument()
    );
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

    // Simulate entering correct input and submitting
    'apple'.split('').forEach((letter, index) => {
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: letter },
      });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Check that it moves to the next word and displays the correct image
    const nextImgElement = screen.getByRole('img');
    expect(nextImgElement).toHaveAttribute('src', 'banana.jpg');
  });

  it('displays game over when all words are completed', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Complete the first word
    await waitFor(() => screen.getByText('Kirjoita sana'));
    'apple'.split('').forEach((letter, index) => {
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: letter },
      });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Check the second word (banana) is displayed by its image source
    await waitFor(() => {
      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('src', 'banana.jpg');
    });

    // Complete the second word
    'banana'.split('').forEach((letter, index) => {
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: letter },
      });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Check if the game over message is displayed
    await waitFor(() =>
      expect(screen.getByText('Peli ohi!')).toBeInTheDocument()
    );
  });

  it('displays success indicator after correct input and hides it after timeout', async () => {
    jest.useFakeTimers();

    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Kirjoita sana'));
    'apple'.split('').forEach((letter, index) => {
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: letter },
      });
    });
    fireEvent.click(screen.getByText('VALMIS'));

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
        <PathsPage />
      </BrowserRouter>
    );

    // Checking that the back-button is on the game page
    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(screen.getByText('Polut')).toBeInTheDocument();
  });
});
