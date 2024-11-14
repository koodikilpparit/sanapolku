import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase2 from './Phase2';

describe('Phase2 Component', () => {
  const mockWord = {
    word: 'apple',
    imageData: { src: 'apple.jpg', author: 'Unknown' },
  };
  const mockShuffledWord = 'ELPPA';
  const mockHandleSubmit = jest.fn();
  const mockSetPlayerInput = jest.fn();
  const mockPlayerInput = ['A', '', '', '', ''];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Phase2 component correctly', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const header = screen.getByRole('heading', { name: /järjestä kirjaimet/i });
    expect(header).toBeInTheDocument();
  });

  it('disables the VALMIS button when player input is incomplete', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const button = screen.getByRole('button', { name: /valmis/i });
    expect(button).toBeDisabled();
  });

  it('displays the shuffled word correctly', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const displayLetterBoxes = screen.getAllByTestId(
      'display-shuffled-letter-box'
    );
    const shuffledLetters = mockShuffledWord.split('');
    shuffledLetters.forEach((letter, index) => {
      expect(displayLetterBoxes[index]).toHaveTextContent(letter.toUpperCase());
    });
  });

  it('calls handleSubmit when VALMIS button is clicked and input is complete', () => {
    render(
      <Phase2
        currentWord={mockWord}
        shuffledWord={mockShuffledWord}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const button = screen.getByRole('button', { name: /valmis/i });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
