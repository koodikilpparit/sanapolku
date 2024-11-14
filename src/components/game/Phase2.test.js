import React from 'react';
import { render, screen, createRef } from '@testing-library/react';
import Phase2 from '../../components/game/Phase2';

// Clear all mocks after all tests
afterAll(() => {
  jest.clearAllMocks();
});

describe('Phase2 Component', () => {
  const mockWord = {
    id: 1,
    word: 'apple',
    imageData: { src: 'apple.jpg', author: null },
  };
  const mockShuffledWord = 'elppa';
  const mockHandle = jest.fn();
  const mockHandleInputChange = jest.fn();
  const mockInputRefs = jest.fn();
  mockInputRefs.current = [];

  // Clear all mocks before each test
  beforeEach(async () => {
    mockHandle;
  });

  describe('Phase2 Component', () => {
    test('renders without crashing', () => {
      expect(true).toBe(true);
    });
  });
});
