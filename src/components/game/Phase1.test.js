import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase1 from '../../components/game/Phase1';

// Clear all mocks after all tests
afterAll(() => {
  jest.clearAllMocks();
});

describe('Phase1 Component', () => {
  const mockWord = {
    id: 1,
    word: 'apple',
    imageData: { src: 'apple.jpg', author: null },
  };
  const mockHandleSubmit = jest.fn();
  const mockHandleInputChange = jest.fn();
  const mockHandleContinueOnWrongAnswer = jest.fn();
  const mockInputRefs = createRef();
  mockInputRefs.current = [];

  // Clear all mocks before each test
  beforeEach(async () => {
    mockHandleSubmit.mockClear();
    mockHandleInputChange.mockClear();
  });

  it('Check that phase 1 is initialized correctly', () => {
    const initialPlayerInput = ['', '', '', '', ''];
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={initialPlayerInput}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    const letterTiles = screen.getAllByRole('textbox');
    letterTiles.forEach((tile, index) => {
      expect(tile.value).toBe(initialPlayerInput[index]);
    });
  });

  it('Check that the correct number of letter tiles are rendered', async () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={[]}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    // Check that the number of letter tiles is the length of the current word
    const letterTiles = screen.getAllByRole('textbox');
    expect(letterTiles.length).toBe(mockWord.word.length);
  });

  it('Check that letter tile is updated when typing', async () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', '', '', '', '']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    const firstInput = screen.getByDisplayValue('A');
    fireEvent.change(firstInput, { target: { value: 'Z' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith(
      0,
      expect.anything(),
      expect.anything()
    );

    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['Z', '', '', '', '']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    expect(screen.getByDisplayValue('Z')).toBeInTheDocument();
  });

  it('Check that clicking the ready-button can be used to submit answer', () => {
    render(
      <Phase1
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        handleInputChange={mockHandleInputChange}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        inputRefs={mockInputRefs}
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    // Check that clicking the ready-button triggers handleSubmit
    fireEvent.click(screen.getByText('VALMIS'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('Check that pressing Enter can be used to submit answer', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[]}
        inputDisabled={false}
        showContinueButton={false}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('checks that continue button renders on wrong input', async () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'X']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[4]}
        inputDisabled={true}
        showContinueButton={true}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    expect(screen.getByText('JATKA')).toBeInTheDocument;
  });

  it('checks that pressing enter can be used to continue game after wrong input', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'X']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[4]}
        inputDisabled={true}
        showContinueButton={true}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockHandleContinueOnWrongAnswer).toHaveBeenCalled();
  });

  it('checks that continue button can be used to continue game after wrong input', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'X']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[4]}
        inputDisabled={true}
        showContinueButton={true}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    fireEvent.click(screen.getByText('JATKA'));
    expect(mockHandleContinueOnWrongAnswer).toHaveBeenCalled();
  });

  it('checks that input fields are disabled when inputDisabled is true', () => {
    render(
      <Phase1
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'X']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
        incorrectIndices={[4]}
        inputDisabled={true}
        showContinueButton={true}
        handleContinueOnWrongAnswer={mockHandleContinueOnWrongAnswer}
      />
    );

    const letterInputs = screen.getAllByRole('textbox');
    letterInputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
