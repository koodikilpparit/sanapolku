import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImagePreview from './ImagePreview';

describe('ImagePreview component', () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    mockClose.mockClear();
  });

  test('renders the image correctly', () => {
    const image = 'https://example.com/image.jpg';
    render(<ImagePreview image={image} author="John Doe" onClose={mockClose} />);

    const imgElement = screen.getByAltText('Esikatselu');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toBe(image);
  });

  test('displays author info when author is provided with Papunet image', () => {
    const image = 'https://example.com/image.jpg';
    const author = 'John Doe';
    render(<ImagePreview image={image} author={author} onClose={mockClose} />);

    const authorText = screen.getByText('Kuva: Papunetin kuvapankki, papunet.net, John Doe');
    expect(authorText).toBeInTheDocument();
  });

  test('displays "Tuntematon tekijä" when author is not provided with Papunet image', () => {
    const image = 'https://example.com/image.jpg';
    render(<ImagePreview image={image} author='Tuntematon tekijä' onClose={mockClose} />);

    const authorText = screen.getByText('Kuva: Papunetin kuvapankki, papunet.net, Tuntematon tekijä');
    expect(authorText).toBeInTheDocument();
  });

  test('does not display author info when author is null with user-uploaded image', () => {
    const image = 'https://example.com/image.jpg';
    render(<ImagePreview image={image} author={null} onClose={mockClose} />);

    const authorText = screen.queryByText(/Kuva: Papunetin kuvapankki, papunet.net/);
    expect(authorText).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const image = 'https://example.com/image.jpg';
    render(<ImagePreview image={image} author="John Doe" onClose={mockClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
