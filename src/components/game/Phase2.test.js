import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase2 from './Phase2';

describe('Phase2 Component', () => {
  const mockHandleSubmit = jest.fn();
  const mockSetPlayerInput = jest.fn();
  const mockHandleContinueOnWrongAnswer = jest.fn();
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
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    expect(screen.getByText(/klikkaa ja järjestä/i)).toBeInTheDocument();
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
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
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
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
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
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
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
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
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
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
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
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
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
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    const submitButton = screen.getByRole('button', { name: /valmis/i });
    fireEvent.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalledWith('TEST');
  });

  it('checks that continue button renders on wrong input', async () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['T', 'E', 'S', 'X']}
        setPlayerInput={mockSetPlayerInput}
        incorrectIndices={[3]}
        inputDisabled={true}
        showContinueButton={true}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    expect(screen.getByText('JATKA')).toBeInTheDocument;
  });

  test('checks that pressing enter can be used to continue game after wrong input', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['T', 'E', 'S', 'X']}
        setPlayerInput={mockSetPlayerInput}
        incorrectIndices={[]}
        inputDisabled={true}
        showContinueButton={true}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockHandleContinueOnWrongAnswer).toHaveBeenCalled();
  });

  test('checks that continue button can be used to continue game after wrong input', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['T', 'E', 'S', 'X']}
        setPlayerInput={mockSetPlayerInput}
        incorrectIndices={[]}
        inputDisabled={true}
        showContinueButton={true}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    fireEvent.click(screen.getByText('JATKA'));
    expect(mockHandleContinueOnWrongAnswer).toHaveBeenCalled();
  });

  test('checks that player input is not updated when inputDisabled is true', () => {
    render(
      <Phase2
        currentWord={mockCurrentWord}
        shuffledWord={mockShuffledWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['T', 'E', 'S', 'X']}
        setPlayerInput={mockSetPlayerInput}
        incorrectIndices={[]}
        inputDisabled={true}
        showContinueButton={true}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    const shuffledLetters = screen.getAllByTestId('shuffled-letter');
    const inputBoxes = screen.getAllByTestId('input-box');

    // Click on a shuffled letter and input box
    fireEvent.click(shuffledLetters[0]);
    fireEvent.click(inputBoxes[0]);

    // Ensure that setPlayerInput is only called once in the beginning
    // of phase 2 but not through the clicks
    expect(mockSetPlayerInput).toHaveBeenCalledTimes(1);
  });
});
