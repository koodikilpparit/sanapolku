import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase2 from '../../components/game/Phase2';

// Clear all mocks after all tests
afterAll(() => {
  jest.clearAllMocks();
});

describe('Phase2 Component', () => {
  const mockWord = { id: 1, word: 'apple', img: 'apple.jpg' };
  const mockShuffledWord = 'elppa';
  const mockHandleSubmit = jest.fn();

  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('checks that phase 2 is initialized correctly', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
      />
    );

    const header = screen.getByRole('heading', {
      name: /Järjestä kirjaimet/i,
    });
    expect(header).toBeInTheDocument();
  });

  it('disables the VALMIS button when player input is incomplete', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
      />
    );

    const button = screen.getByRole('button', { name: /VALMIS/i });
    expect(button).toBeDisabled();
  });

  it('allows selecting and unselecting a letter correctly', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
      />
    );

    const letterE = screen.getByText('E');
    fireEvent.click(letterE);
    expect(letterE).toHaveClass('bg-sp-light-yellow');

    // Click again to unselect
    fireEvent.click(letterE);
    expect(letterE).toHaveClass('bg-sp-white');
  });

  it('allows placing a selected letter into an input box', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
      />
    );

    // Select the letter 'E'
    const letterE = screen.getByText('E');
    fireEvent.click(letterE);

    // Click on the first input box
    const inputBoxes = screen.getAllByTestId('input-box');
    fireEvent.click(inputBoxes[0]);

    // Expect the first input box to have the letter 'E'
    expect(inputBoxes[0]).toHaveTextContent('E');

    // The letter 'E' should no longer be available in the shuffled letters
    expect(letterE).toHaveClass(
      'w-full aspect-square rounded-lg font-bold text-center uppercase text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl p-1 flex items-center justify-center cursor-pointer bg-sp-white border-2 border-sp-white'
    );
  });

  it('re-adds a letter to shuffled letters when removed from player input', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
      />
    );

    // Select letter 'E' and place it into the first input box
    const letterE = screen.getByText('E');
    fireEvent.click(letterE);

    const inputBoxes = screen.getAllByTestId('input-box');
    fireEvent.click(inputBoxes[0]);
    expect(inputBoxes[0]).toHaveTextContent('E');

    // Now remove the letter from the input box
    fireEvent.click(inputBoxes[0]);
    expect(inputBoxes[0]).toHaveTextContent('');

    // The letter 'E' should reappear in the shuffled letters
    const shuffledLetterE = screen.getByText('E');
    expect(shuffledLetterE).toBeInTheDocument();
  });

  it('unselects a selected letter when clicking outside', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
      />
    );

    const letterE = screen.getByText('E');
    fireEvent.click(letterE);
    expect(letterE).toHaveClass('bg-sp-light-yellow');

    // Click outside
    fireEvent.click(document.body);
    expect(letterE).toHaveClass('bg-sp-white');
  });
});
