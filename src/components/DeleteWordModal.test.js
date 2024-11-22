import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DeleteWordModal from './DeleteWordModal';
import { deleteWord } from '../db/db';

jest.mock('../db/db');

describe('DeleteWordModal', () => {
  const mockOnClose = jest.fn();
  const mockSetWords = jest.fn();
  const wordId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <DeleteWordModal
        onClose={mockOnClose}
        wordId={wordId}
        setWords={mockSetWords}
      />
    );

    expect(getByText('Vahvista poisto')).toBeInTheDocument();
    expect(getByText('Haluatko varmasti poistaa sanan?')).toBeInTheDocument();
    expect(getByText('Peruuta')).toBeInTheDocument();
    expect(getByText('Poista')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    const { getByText } = render(
      <DeleteWordModal
        onClose={mockOnClose}
        wordId={wordId}
        setWords={mockSetWords}
      />
    );

    fireEvent.click(getByText('Peruuta'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls deleteWord and setWords when delete button is clicked', async () => {
    deleteWord.mockResolvedValueOnce();

    const { getByText } = render(
      <DeleteWordModal
        onClose={mockOnClose}
        wordId={wordId}
        setWords={mockSetWords}
      />
    );

    fireEvent.click(getByText('Poista'));

    await waitFor(() => {
      expect(deleteWord).toHaveBeenCalledWith(wordId);
      expect(mockSetWords).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('shows alert and logs error if deleteWord fails', async () => {
    const errorMessage = 'Error deleting word';
    deleteWord.mockRejectedValueOnce(new Error(errorMessage));
    window.alert = jest.fn();

    const { getByText } = render(
      <DeleteWordModal
        onClose={mockOnClose}
        wordId={wordId}
        setWords={mockSetWords}
      />
    );

    fireEvent.click(getByText('Poista'));

    await waitFor(() => {
      expect(deleteWord).toHaveBeenCalledWith(wordId);
      expect(window.alert).toHaveBeenCalledWith('Error deleting the word.');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
