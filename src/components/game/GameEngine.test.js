import { React, act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import GameEngine from '../../components/game/GameEngine';
import { addPath, addWord, resetDB } from '../../db/db';
import { useNavigate } from 'react-router-dom';

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../components/game/SuccessIndicator', () => ({
  __esModule: true,
  default: () => <div data-testid="success-indicator" />,
}));

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
    firstWord.split('').forEach((letter, index) => {
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: letter },
      });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    const newImage = await screen.findByRole('img');
    const newSrc = newImage.getAttribute('src');
    const secondWord = newSrc.replace('.jpg', '');

    expect(secondWord).not.toBe(firstWord); // Ensure that the image has changed again
  });

  it('replaces the input when player continues to write on the same tile', async () => {
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

    // Enter the incorrect letter and then replace with correct one for the first phase
    firstWord.split('').forEach((letter, index) => {
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: 'o' },
      });
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: 'o' + letter },
      });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    const newImage = await screen.findByRole('img');
    const newSrc = newImage.getAttribute('src');
    const secondWord = newSrc.replace('.jpg', '');

    expect(secondWord).not.toBe(firstWord); // Ensure that the image has changed again
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
    wrongWord.split('').forEach((letter, index) => {
      fireEvent.change(screen.getAllByRole('textbox')[index], {
        target: { value: letter },
      });
    });
    fireEvent.click(screen.getByText('VALMIS'));

    // Check if it moves to the second phase (letter shuffling)
    fireEvent.click(screen.getByText('JATKA'));
    await waitFor(() =>
      expect(screen.getByText('Klikkaa ja järjestä')).toBeInTheDocument()
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

      // Enter the correct word for the first phase
      correctWord.split('').forEach((letter, index) => {
        fireEvent.change(screen.getAllByRole('textbox')[index], {
          target: { value: letter },
        });
      });
      fireEvent.click(screen.getByText('VALMIS'));

      act(() => {
        jest.advanceTimersByTime(2500);
      });

      if (i === 4) {
        fireEvent.click(screen.getByText('JATKA'));
      }
    }

    // Check if the game ending page renders
    await waitFor(() => {
      expect(screen.getByText('Onnittelut!')).toBeInTheDocument();
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

    // Enter the correct word for the first phase
    correctWord.split('').forEach((letter, index) => {
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

  it('checks that the progress-bar renders on game page', async () => {
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Check that the progress bar is in the document
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
  });

  it('checks that the initial progress is 0%', async () => {
    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    const progressBar = screen.getByTestId('progress-bar');
    const progress = progressBar.querySelector('.progress');
    expect(progress).toHaveStyle(`width: ${0}%`);
  });

  it('check that progress is 100% when game is over', async () => {
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

      // Enter the correct word for the first phase
      correctWord.split('').forEach((letter, index) => {
        fireEvent.change(screen.getAllByRole('textbox')[index], {
          target: { value: letter },
        });
      });
      fireEvent.click(screen.getByText('VALMIS'));

      act(() => {
        jest.advanceTimersByTime(2500);
      });

      if (i === 4) {
        fireEvent.click(screen.getByText('JATKA'));
      }
    }

    const progressBar = screen.getByTestId('progress-bar');
    const progress = progressBar.querySelector('.progress');
    expect(progress).toHaveStyle(`width: ${100}%`);

    jest.useRealTimers();
  });

  it('check that progress is 50% when game is half-way done', async () => {
    jest.useFakeTimers();

    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Wait that game begins
    await waitFor(() => screen.getByText('Kirjoita sana'));

    for (let i = 0; i < 5; i++) {
      // Wait for the word and its image to be displayed
      const image = await screen.findByRole('img');
      const imageSrc = image.getAttribute('src');

      // Use the first image's src to figure out what is correct word
      const correctWord = imageSrc.replace('.jpg', '');

      // Enter the correct word for the first phase
      correctWord.split('').forEach((letter, index) => {
        fireEvent.change(screen.getAllByRole('textbox')[index], {
          target: { value: letter },
        });
      });
      fireEvent.click(screen.getByText('VALMIS'));

      act(() => {
        jest.advanceTimersByTime(2500);
      });
    }

    const progressBar = screen.getByTestId('progress-bar');
    const progress = progressBar.querySelector('.progress');
    expect(progress).toHaveStyle(`width: ${50}%`);

    jest.useRealTimers();
  });

  it('checks that break view is rendered when progress is 5 words', async () => {
    jest.useFakeTimers();

    render(
      <MemoryRouter>
        <GameEngine pathId={String(pathId)} />
      </MemoryRouter>
    );

    // Wait that game begins
    await waitFor(() => screen.getByText('Kirjoita sana'));

    for (let i = 0; i < 5; i++) {
      // Wait for the word and its image to be displayed
      const image = await screen.findByRole('img');
      const imageSrc = image.getAttribute('src');

      // Use the first image's src to figure out what is correct word
      const correctWord = imageSrc.replace('.jpg', '');

      // Enter the correct word for the first phase
      correctWord.split('').forEach((letter, index) => {
        fireEvent.change(screen.getAllByRole('textbox')[index], {
          target: { value: letter },
        });
      });
      fireEvent.click(screen.getByText('VALMIS'));

      act(() => {
        jest.advanceTimersByTime(2500);
      });
    }

    const breakHeader = screen.getByText('Hienoa!');
    expect(breakHeader).toBeInTheDocument;
  });

  it('checks that the back-button brings you back one page', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Rendering the required pages
    const { container } = render(
      <BrowserRouter>
        <GameEngine pathId={String(pathId)} />
      </BrowserRouter>
    );

    // Checking that the back-button is on the game page
    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/polut');
  });
});
