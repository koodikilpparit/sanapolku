import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DeleteWordModal from './DeleteWordModal';
import { deleteWord } from '../db/db';

jest.mock('../db/db');

describe('DeleteWordModal', () => {
  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <DeleteWordModal onClose={mockOnClose} onDelete={mockOnDelete} />
    );

    expect(getByText('Vahvista poisto')).toBeInTheDocument();
    expect(getByText('Haluatko varmasti poistaa sanan?')).toBeInTheDocument();
    expect(getByText('Peruuta')).toBeInTheDocument();
    expect(getByText('Poista')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    const { getByText } = render(
      <DeleteWordModal onClose={mockOnClose} onDelete={mockOnDelete} />
    );

    fireEvent.click(getByText('Peruuta'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onDelete when delete button is clicked', async () => {
    deleteWord.mockResolvedValueOnce();

    const { getByText } = render(
      <DeleteWordModal onClose={mockOnClose} onDelete={mockOnDelete} />
    );

    fireEvent.click(getByText('Poista'));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });
});
