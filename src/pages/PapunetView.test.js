import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import PapunetView from './PapunetView';
import { fetchPhotos } from '../utils/PapunetPhotoFetcher';
import { proxy } from '../utils/PapunetPhotoFetcher';

jest.mock('../utils/PapunetPhotoFetcher');

describe('PapunetView', () => {
  const mockOnSelectImage = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with initial search term', () => {
    const { getByPlaceholderText, getByText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    expect(getByPlaceholderText('Kirjoita hakusana')).toHaveValue('test');
    expect(getByText('Papunet Kuvahaku')).toBeInTheDocument();
  });

  test('fetches photos on initial render if initialSearchTerm is provided', async () => {
    const mockPhotos = [
      { uid: '1', thumb: 'thumb1.jpg', name: 'Photo 1', author: 'Author 1' },
      { uid: '2', thumb: 'thumb2.jpg', name: 'Photo 2', author: 'Author 2' },
    ];
    fetchPhotos.mockResolvedValue(mockPhotos);

    const { getByAltText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    await waitFor(() => {
      expect(getByAltText('Photo 1')).toBeInTheDocument();
      expect(getByAltText('Photo 2')).toBeInTheDocument();
    });
  });

  test('displays error message when photo fetch fails', async () => {
    fetchPhotos.mockRejectedValue(new Error('Virhe kuvien hakemisessa'));

    const { getByText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    await waitFor(() => {
      expect(getByText('Virhe kuvien hakemisessa')).toBeInTheDocument();
    });
  });

  test('updates search term on input change', () => {
    const { getByPlaceholderText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    const input = getByPlaceholderText('Kirjoita hakusana');
    fireEvent.change(input, { target: { value: 'new search' } });

    expect(input).toHaveValue('new search');
  });

  test('should call onSelectImage with selected image when save is clicked', async () => {
    const mockPhotos = [
      {
        uid: '1',
        thumb: 'thumb1.jpg',
        name: 'Photo 1',
        author: 'Author 1',
        url: 'photo1.jpg',
      },
    ];
    fetchPhotos.mockResolvedValue(mockPhotos);

    const { getByAltText, getByText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    await waitFor(() => {
      fireEvent.click(getByAltText('Photo 1'));
    });

    fireEvent.click(getByText('VALITSE'));

    expect(mockOnSelectImage).toHaveBeenCalledWith({
      src: proxy + 'photo1.jpg',
      author: 'Author 1',
    });
  });

  test('should display "No results" message when no photos are fetched', async () => {
    fetchPhotos.mockResolvedValue([]);

    const { getByText } = render(
      <PapunetView onSelectImage={mockOnSelectImage} initialSearchTerm="test" />
    );

    await waitFor(() => {
      expect(getByText('Ei kuvatuloksia')).toBeInTheDocument();
    });
  });

  it('should close when "PERUUTA" button is clicked', async () => {
    fetchPhotos.mockResolvedValue([]);
    const { getByText } = render(
      <PapunetView
        onSelectImage={mockOnSelectImage}
        initialSearchTerm="test"
        closeModal={mockCloseModal}
      />
    );

    fireEvent.click(getByText('PERUUTA'));

    expect(mockCloseModal).toHaveBeenCalled();
  });
});
