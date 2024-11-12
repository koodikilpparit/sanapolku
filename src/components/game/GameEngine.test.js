import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GameEngine from '../../components/game/GameEngine';
import { openDB } from '../../db/db';

// Polyfill for structuredClone if missing
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

afterAll(() => {
  jest.clearAllMocks();
});

describe('GameEngine Component Integration', () => {
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

  beforeEach(async () => {
    await initializeTestDB();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('shows loading message while fetching words', () => {
    render(
      <MemoryRouter>
        <GameEngine pathName="test-path" />
      </MemoryRouter>
    );

    expect(screen.getByText('Ladataan sanoja...')).toBeInTheDocument();
  });

  it('renders first word when loaded', async () => {
    render(
      <MemoryRouter>
        <GameEngine pathName="test-path" />
      </MemoryRouter>
    );

    await waitFor(() =>
      screen.getByRole('heading', { name: /Kirjoita sana/i })
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', 'apple.jpg');
  });

  it('transitions to Phase 2 on incorrect input', async () => {
    render(
      <MemoryRouter>
        <GameEngine pathName="test-path" />
      </MemoryRouter>
    );

    await waitFor(() =>
      screen.getByRole('heading', { name: /Kirjoita sana/i })
    );

    // Simulate incorrect input using hidden input for each character
    const hiddenInput = screen.getByTestId('hidden-input');
    'wrong'.split('').forEach((letter) => {
      fireEvent.change(hiddenInput, { target: { value: letter } });
    });
    fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

    // Verify transition to Phase 2
    await waitFor(() =>
      screen.getByRole('heading', { name: /Järjestä kirjaimet/i })
    );
  });

  it('advances to next word on correct input in Phase 1', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <GameEngine pathName="test-path" />
      </MemoryRouter>
    );

    await waitFor(() =>
      screen.getByRole('heading', { name: /Kirjoita sana/i })
    );

    // Simulate correct input using hidden input for each character
    const hiddenInput = screen.getByTestId('hidden-input');
    'apple'.split('').forEach((letter) => {
      fireEvent.change(hiddenInput, { target: { value: letter } });
    });
    fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

    // Advance time to allow success indicator
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Verify second word is loaded
    expect(screen.getByRole('img')).toHaveAttribute('src', 'banana.jpg');
  });

  it('shows game over message after all words are completed', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <GameEngine pathName="test-path" />
      </MemoryRouter>
    );

    await waitFor(() =>
      screen.getByRole('heading', { name: /Kirjoita sana/i })
    );

    // Complete first word
    const hiddenInput = screen.getByTestId('hidden-input');
    'apple'.split('').forEach((letter) => {
      fireEvent.change(hiddenInput, { target: { value: letter } });
    });
    fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('src', 'banana.jpg');
    });

    // Complete second word
    'banana'.split('').forEach((letter) => {
      fireEvent.change(hiddenInput, { target: { value: letter } });
    });
    fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Verify game over message is displayed
    await waitFor(() =>
      expect(screen.getByText('Peli ohi!')).toBeInTheDocument()
    );
  });

  it('shows success indicator on correct input and hides it after delay', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <GameEngine pathName="test-path" />
      </MemoryRouter>
    );

    await waitFor(() =>
      screen.getByRole('heading', { name: /Kirjoita sana/i })
    );

    // Simulate correct input using hidden input for each character
    const hiddenInput = screen.getByTestId('hidden-input');
    'apple'.split('').forEach((letter) => {
      fireEvent.change(hiddenInput, { target: { value: letter } });
    });
    fireEvent.click(screen.getByRole('button', { name: /VALMIS/i }));

    await act(async () => {
      await waitFor(() => screen.getByTestId('success-indicator'));
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify success indicator is hidden
    expect(screen.queryByTestId('success-indicator')).toBeNull();
  });
});
