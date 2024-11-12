import { React, act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import GameEngine from '../../components/game/GameEngine';
import PathsPage from '../../pages/PathSelection';
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

  // Reset timer after each test
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders loading message initially', () => {
    render(
      <MemoryRouter>
        <GameEngine pathName="test-path" />
      </MemoryRouter>
    );

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
    fireEvent.click(screen.getByText('VALMIS'));

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
        <GameEngine pathName="test-path" />
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
        <GameEngine pathName="test-path" />
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
        <GameEngine pathName="test-path" />
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
        <GameEngine pathName="test-path" />
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
