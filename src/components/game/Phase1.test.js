import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase1 from './Phase1';

describe('Phase1 Component', () => {
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

  it('renders Phase1 component correctly', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const header = screen.getByRole('heading', { name: /kirjoita sana/i });
    expect(header).toBeInTheDocument();
  });

  it('disables the VALMIS button when player input is incomplete', () => {
    render(
      <Phase1
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
      <Phase1
        currentWord={mockWord}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const image = screen.getByAltText(`Kuva sanasta ${mockWord.word}`);
    expect(image).toHaveAttribute('src', mockWord.imageData.src);
  });

  it('calls handleSubmit when VALMIS button is clicked and input is complete', () => {
    render(
      <Phase1
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
