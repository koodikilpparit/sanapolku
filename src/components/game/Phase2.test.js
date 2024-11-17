import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase2 from './Phase2';

describe('Phase2 Component', () => {
  const mockHandleSubmit = jest.fn();
  const mockSetPlayerInput = jest.fn();
  const mockCurrentWord = {
    imageData: { src: 'test-image-src' },
    word: 'test',
  };
  const mockShuffledWord = 'tset';
  const mockPlayerInput = ['', '', '', ''];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the title and image correctly', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
      />
    );

    expect(screen.getByText(/järjestä kirjaimet/i)).toBeInTheDocument();
    expect(screen.getByAltText(/kuva sanasta test/i)).toHaveAttribute(
      'src',
      'test-image-src'
    );
  });

  test('displays shuffled letters correctly', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
      />
    );

    const shuffledLetters = screen.getAllByTestId('shuffled-letter');
    expect(shuffledLetters).toHaveLength(4);
    expect(shuffledLetters[0]).toHaveTextContent('T');
    expect(shuffledLetters[1]).toHaveTextContent('S');
    expect(shuffledLetters[2]).toHaveTextContent('E');
    expect(shuffledLetters[3]).toHaveTextContent('T');
  });

  test('updates player input when a letter is clicked', () => {
    const setPlayerInputMock = jest.fn();
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={mockPlayerInput}
        setPlayerInput={setPlayerInputMock}
      />
    );

    const shuffledLetters = screen.getAllByTestId('shuffled-letter');
    const inputBoxes = screen.getAllByTestId('input-box');

    // Click a shuffled letter
    fireEvent.click(shuffledLetters[0]);

    // Click an input box
    fireEvent.click(inputBoxes[0]);

    expect(setPlayerInputMock).toHaveBeenCalledWith(['T', '', '', '']);
  });

  test('removes letter from input when input box is clicked', () => {
    const setPlayerInputMock = jest.fn();
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['T', '', '', '']}
        setPlayerInput={setPlayerInputMock}
      />
    );

    const inputBoxes = screen.getAllByTestId('input-box');

    // Click on the filled input box
    fireEvent.click(inputBoxes[0]);

    expect(setPlayerInputMock).toHaveBeenCalledWith(['', '', '', '']);
  });

  test('disables the submit button when input is incomplete', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={mockPlayerInput}
        setPlayerInput={mockSetPlayerInput}
      />
    );

    const submitButton = screen.getByRole('button', { name: /valmis/i });
    expect(submitButton).toBeDisabled();
  });

  test('enables the submit button when input is complete', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['T', 'E', 'S', 'T']}
        setPlayerInput={mockSetPlayerInput}
      />
    );

    const submitButton = screen.getByRole('button', { name: /valmis/i });
    expect(submitButton).toBeEnabled();
  });

  test('calls handleSubmit when Enter key is pressed', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['T', 'E', 'S', 'T']}
        setPlayerInput={mockSetPlayerInput}
      />
    );

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });

    expect(mockHandleSubmit).toHaveBeenCalledWith('TEST');
  });

  test('calls handleSubmit when the submit button is clicked', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['T', 'E', 'S', 'T']}
        setPlayerInput={mockSetPlayerInput}
      />
    );

    const submitButton = screen.getByRole('button', { name: /valmis/i });
    fireEvent.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalledWith('TEST');
  });
});
