import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase1 from '../../components/game/Phase1';

describe('Phase1 Component', () => {
  const mockWord = { id: 1, word: 'apple', img: 'apple.jpg' };
  const mockHandleSubmit = jest.fn();
  let mockSetPlayerInput;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetPlayerInput = jest.fn();
  });

  it('initializes correctly with empty input boxes', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['', '', '', '', '']}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const header = screen.getByRole('heading', {
      name: /Kirjoita sana/i,
    });
    expect(header).toBeInTheDocument();

    const inputBoxes = screen.getAllByTestId('input-box');
    expect(inputBoxes).toHaveLength(mockWord.word.length);
    inputBoxes.forEach((box) => {
      expect(box).toHaveTextContent('');
    });

    const button = screen.getByRole('button', { name: /VALMIS/i });
    expect(button).toBeDisabled();
  });

  it('focuses on the first input box on render', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['', '', '', '', '']}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const inputBoxes = screen.getAllByTestId('input-box');
    expect(inputBoxes[0]).toHaveClass('bg-sp-light-yellow');
  });

  it('updates input boxes when typing letters', () => {
    const playerInput = ['', '', '', '', ''];
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={playerInput}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const inputElement = screen.getByTestId('hidden-input');
    fireEvent.change(inputElement, { target: { value: 'A' } });

    expect(mockSetPlayerInput).toHaveBeenCalledWith(['A', '', '', '', '']);
  });

  it('changes active input box when a letter box is clicked', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', '', '', '']}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const inputBoxes = screen.getAllByTestId('input-box');

    // Click on the third input box
    fireEvent.click(inputBoxes[2]);

    expect(inputBoxes[2]).toHaveClass('bg-sp-light-yellow');
  });

  it('enables the VALMIS button when all letters are filled', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const button = screen.getByRole('button', { name: /VALMIS/i });
    expect(button).not.toBeDisabled();
  });

  it('calls handleSubmit when VALMIS button is clicked', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const button = screen.getByRole('button', { name: /VALMIS/i });
    fireEvent.click(button);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('does not move to next input box if at the last index', () => {
    let playerInput = ['', '', '', '', ''];
    const { rerender } = render(
      <Phase1
        currentWord={mockWord}
        playerInput={playerInput}
        setPlayerInput={(input) => {
          playerInput = input;
          mockSetPlayerInput(input);
        }}
        handleSubmit={mockHandleSubmit}
      />
    );

    const inputElement = screen.getByTestId('hidden-input');

    // Fill all input boxes
    const letters = ['A', 'P', 'P', 'L', 'E'];
    letters.forEach((letter) => {
      fireEvent.change(inputElement, { target: { value: letter } });
      rerender(
        <Phase1
          currentWord={mockWord}
          playerInput={playerInput}
          setPlayerInput={(input) => {
            playerInput = input;
            mockSetPlayerInput(input);
          }}
          handleSubmit={mockHandleSubmit}
        />
      );
    });

    // Try to type another letter
    fireEvent.change(inputElement, { target: { value: 'X' } });

    // Ensure that playerInput hasn't changed
    expect(mockSetPlayerInput).not.toHaveBeenCalledWith([
      'A',
      'P',
      'P',
      'L',
      'X',
    ]);
  });

  it('handles unfocusing from the input box correctly', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', '', '', '']}
        setPlayerInput={mockSetPlayerInput}
        handleSubmit={mockHandleSubmit}
      />
    );

    const inputElement = screen.getByTestId('hidden-input');
    fireEvent.blur(inputElement);

    // There should be no active input box
    const inputBoxes = screen.getAllByTestId('input-box');
    inputBoxes.forEach((box) => {
      expect(box).not.toHaveClass('bg-sp-light-yellow');
    });
  });
});
