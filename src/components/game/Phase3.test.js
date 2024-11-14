import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase3 from './Phase3';

describe('Phase3 Component', () => {
  const mockWord = {
    word: 'apple',
    imageData: { src: 'apple.jpg', author: 'Unknown' },
  };
  const mockHandleSubmit = jest.fn();
  const mockSetPlayerInput = jest.fn();
  const mockPlayerInput = ['A', 'P', 'P', '', ''];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Phase3 component correctly', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const header = screen.getByRole('heading', { name: /kopioi sana/i });
    expect(header).toBeInTheDocument();
  });

  it('disables the VALMIS button when player input is incomplete', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const button = screen.getByRole('button', { name: /valmis/i });
    expect(button).toBeDisabled();
  });

  it('renders the correct image in ImageContainer', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const image = screen.getByAltText(`Kuva sanasta ${mockWord.word}`);
    expect(image).toHaveAttribute('src', mockWord.imageData.src);
  });

  it('displays each letter of the current word in display letter boxes', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const displayLetterBoxes = screen.getAllByTestId('display-letter-box');
    mockWord.word.split('').forEach((letter, index) => {
      expect(displayLetterBoxes[index]).toHaveTextContent(letter.toUpperCase());
    });
  });

  it('calls handleSubmit when VALMIS button is clicked and input is complete', () => {
    render(
      <Phase3
        currentWord={mockWord}
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
