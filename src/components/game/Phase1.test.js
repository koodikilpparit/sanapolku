import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase1 from '../../components/game/Phase1';

// Clear all mocks after all tests
afterAll(() => {
  jest.clearAllMocks();
});

describe('Phase1 Component', () => {
  const mockWord = { id: 1, word: 'apple', img: 'apple.jpg' };
  const mockHandleSubmit = jest.fn();
  const mockSetPlayerInput = jest.fn();
  const mockSetActiveIndex = jest.fn();

  // Clear all mocks before each test
  beforeEach(async () => {
    mockHandleSubmit.mockClear();
    mockSetPlayerInput.mockClear();
    mockSetActiveIndex.mockClear();
  });

  it('verify correct setup of phase1', async () => {
    render(
      <Phase1
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        playerInput={[]}
        setPlayerInput={mockSetPlayerInput}
        activeIndex={0}
        setActiveIndex={mockSetActiveIndex}
      />
    );

    // Check that the playerInput is set to an array of the correct length
    // and activeIndex is set to 0 in the beginning
    expect(mockSetPlayerInput).toHaveBeenCalledWith(['', '', '', '', '']);
    expect(mockSetActiveIndex).toHaveBeenCalledWith(0);
  });

  it('check that the correct number of letter tiles are rendered', async () => {
    render(
      <Phase1
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['', '', '', '', '']}
        setPlayerInput={mockSetPlayerInput}
        activeIndex={0}
        setActiveIndex={mockSetActiveIndex}
      />
    );

    // Check that the number of letter tiles is the length of the current word
    const letterTiles = screen.getAllByTestId('letter-tile');
    expect(letterTiles.length).toBe(mockWord.word.length);
  });

  it('checks that player input, active index and letter tile are updated on key press', async () => {
    render(
      <Phase1
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['', '', '', '', '']}
        setPlayerInput={mockSetPlayerInput}
        activeIndex={0}
        setActiveIndex={mockSetActiveIndex}
      />
    );

    // Press a key
    fireEvent.keyDown(window, { key: 'z' });

    // Check that playerInput and activeIndex are updated
    expect(mockSetPlayerInput).toHaveBeenCalledWith(['Z', '', '', '', '']);
    expect(mockSetActiveIndex).toHaveBeenCalledWith(1);

    // Re-rendex the page
    render(
      <Phase1
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['Z', '', '', '', '']}
        setPlayerInput={mockSetPlayerInput}
        activeIndex={1}
        setActiveIndex={mockSetActiveIndex}
      />
    );

    // Check that the letter tile has been updated according to the pressed key
    const zTiles = screen.getAllByText('Z');
    expect(zTiles.length).toBe(1);
  });

  it('checks that back-space can be used to erase text', async () => {
    render(
      <Phase1
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['A', 'P', 'P', 'L', 'E']}
        setPlayerInput={mockSetPlayerInput}
        activeIndex={5}
        setActiveIndex={mockSetActiveIndex}
      />
    );

    // Press backspace
    fireEvent.keyDown(window, { key: 'Backspace' });

    // Check that playerInput and activeIndex are updated accordingly
    expect(mockSetPlayerInput).toHaveBeenCalledWith(['A', 'P', 'P', 'L', '']);
    expect(mockSetActiveIndex).toHaveBeenCalledWith(4);
  });

  it('checks that pressing enter can be used to submit answer', () => {
    render(
      <Phase1
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['a', 'p', 'p', 'l', 'e']}
        setPlayerInput={mockSetPlayerInput}
        activeIndex={4}
        setActiveIndex={mockSetActiveIndex}
      />
    );

    // Check that pressing enter triggers handleSubmit
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('checks that clicking the ready-button can be used to submit answer', () => {
    render(
      <Phase1
        currentWord={mockWord}
        handleSubmit={mockHandleSubmit}
        playerInput={['a', 'p', 'p', 'l', 'e']}
        setPlayerInput={mockSetPlayerInput}
        activeIndex={4}
        setActiveIndex={mockSetActiveIndex}
      />
    );

    // Check that clicking the ready-button triggers handleSubmit
    fireEvent.click(screen.getByText('VALMIS'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
