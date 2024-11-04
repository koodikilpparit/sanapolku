import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase3 from '../../components/game/Phase3';

// Clear all mocks after all tests
afterAll(() => {
  jest.clearAllMocks();
});

describe('Phase3 Component', () => {
  const mockWord = { id: 1, word: 'apple', img: 'apple.jpg' };
  const mockHandleSubmit = jest.fn();
  const mockHandleInputChange = jest.fn();
  const mockInputRefs = createRef();
  mockInputRefs.current = [];

  // Clear all mocks before each test
  beforeEach(async () => {
    mockHandleSubmit.mockClear();
    mockHandleInputChange.mockClear();
  });

  it('Check that phase 3 is initialized correctly', () => {
    const initialPlayerInput = ['', '', '', '', ''];
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={initialPlayerInput}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    const letterTiles = screen.getAllByRole('textbox');
    letterTiles.forEach((tile, index) => {
      expect(tile.value).toBe(initialPlayerInput[index]);
    });
  });

  it('Check that the correct number of letter tiles are rendered', async () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={[]}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    // Check that the number of letter tiles is the length of the current word
    const letterTiles = screen.getAllByRole('textbox');
    expect(letterTiles.length).toBe(mockWord.word.length);
  });

  it('Check that letter tile is updated when typing', async () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={['A', '', '', '', '']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
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
      <Phase3
        currentWord={mockWord}
        playerInput={['Z', '', '', '', '']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    expect(screen.getByDisplayValue('Z')).toBeInTheDocument();
  });

  it('Check that clicking the ready-button can be used to submit answer', () => {
    render(
      <Phase3
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        handleInputChange={mockHandleInputChange}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        inputRefs={mockInputRefs}
      />
    );

    // Check that clicking the ready-button triggers handleSubmit
    fireEvent.click(screen.getByText('VALMIS'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('Check that pressing Enter can be used to submit answer', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('Check that the current word image is rendered correctly', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={['', '', '', '', '']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    const image = screen.getByAltText(`Kuva sanasta ${mockWord.word}`);
    expect(image).toBeInTheDocument();
    expect(image.src).toContain(mockWord.img);
  });

  it('Check that the ready button is disabled when player input is incomplete', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={['A', 'P', '', 'L', '']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    const readyButton = screen.getByText('VALMIS');
    expect(readyButton).toBeDisabled();
  });

  it('Check that the ready button is enabled when player input is complete', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    const readyButton = screen.getByText('VALMIS');
    expect(readyButton).toBeEnabled();
  });

  it('Check that backspace navigation works correctly', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={['A', 'P', 'P', 'L', '']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    const lastInput = screen.getAllByRole('textbox')[4];
    fireEvent.keyDown(lastInput, { key: 'Backspace' });

    expect(document.activeElement).toBe(screen.getAllByRole('textbox')[3]);
  });

  it('Check that the current word letter tiles are rendered correctly', () => {
    render(
      <Phase3
        currentWord={mockWord}
        playerInput={['', '', '', '', '']}
        handleInputChange={mockHandleInputChange}
        handleSubmit={mockHandleSubmit}
        inputRefs={mockInputRefs}
      />
    );

    const letterTiles = screen.getAllByText((content, element) => {
      return element.className === 'letter-tile' && content.match(/[A-Z]/);
    });

    expect(letterTiles.length).toBe(mockWord.word.length);
    letterTiles.forEach((tile, index) => {
      expect(tile.textContent).toBe(mockWord.word.toUpperCase()[index]);
    });
  });
});
