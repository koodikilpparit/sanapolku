import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import PapunetView from './PapunetView';
import PapunetPhotoFetcher from '../utils/PapunetPhotoFetcher';

jest.mock('../utils/PapunetPhotoFetcher');

describe('PapunetView', () => {
  const mockOnSelectImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with initial search term', () => {
    const { getByPlaceholderText, getByText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    expect(getByPlaceholderText('Enter search term')).toHaveValue('test');
    expect(getByText('Photo Fetcher')).toBeInTheDocument();
  });

  test('fetches photos on initial render if initialSearchTerm is provided', async () => {
    const mockPhotos = [
      { uid: '1', thumb: 'thumb1.jpg', name: 'Photo 1', author: 'Author 1' },
      { uid: '2', thumb: 'thumb2.jpg', name: 'Photo 2', author: 'Author 2' },
    ];
    PapunetPhotoFetcher.fetchPhotos.mockResolvedValue(mockPhotos);

    const { getByText, getByAltText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    await waitFor(() => {
      expect(getByAltText('Photo 1')).toBeInTheDocument();
      expect(getByAltText('Photo 2')).toBeInTheDocument();
    });

    expect(getByText('Photo 1')).toBeInTheDocument();
    expect(getByText('Author: Author 1')).toBeInTheDocument();
    expect(getByText('Photo 2')).toBeInTheDocument();
    expect(getByText('Author: Author 2')).toBeInTheDocument();
  });

  test('displays error message when photo fetch fails', async () => {
    PapunetPhotoFetcher.fetchPhotos.mockRejectedValue(
      new Error('Error fetching photos')
    );

    const { getByText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    await waitFor(() => {
      expect(getByText('Error fetching photos')).toBeInTheDocument();
    });
  });

  test('updates search term on input change', () => {
    const { getByPlaceholderText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    const input = getByPlaceholderText('Enter search term');
    fireEvent.change(input, { target: { value: 'new search' } });

    expect(input).toHaveValue('new search');
  });
});
