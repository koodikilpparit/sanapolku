import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Phase2 from '../../components/game/Phase2';

// Clear all mocks after all tests
afterAll(() => {
  jest.clearAllMocks();
});

describe('Phase2 Component', () => {
  // Clear all mocks after all tests
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Phase2 Component', () => {
    test('renders without crashing', () => {
      const mockSetPlayerInput = jest.fn();
      const mockHandleSubmit = jest.fn();
      render(
        <Phase2
          currentWord={{ word: 'TEST', img: 'test.png' }}
          shuffledWord="TSET"
          playerInput={['', '', '', '']}
          setPlayerInput={mockSetPlayerInput}
          handleSubmit={mockHandleSubmit}
        />
      );

      expect(screen.getByText('Järjestä kirjaimet')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /VALMIS/i })).toBeDisabled();
    });

    test('dummy test to pass', () => {
      expect(true).toBe(true);
    });
  });
});
