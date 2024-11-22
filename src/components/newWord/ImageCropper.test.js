import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageCropper from './ImageCropper';

describe('ImageCropper component', () => {
  const imageSrc = 'https://example.com/test-image.jpg';
  const mockOnCroppedImage = jest.fn();

  beforeEach(() => {
    // Resets mocks before tests
    mockOnCroppedImage.mockReset();
  });

  it('should render the cropper component with the provided image', () => {
    render(
      <ImageCropper imageSrc={imageSrc} onCroppedImage={mockOnCroppedImage} />
    );

    // Check that image renders
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', imageSrc);
  });

  it('should not render the image cropper when no image is provided', () => {
    render(
      <ImageCropper imageSrc={null} onCroppedImage={mockOnCroppedImage} />
    );

    // Checks that "Rajaa" button does not render
    const cropperContainer = screen.queryByText('Rajaa');
    expect(cropperContainer).toBeNull();
  });

  it('should render the crop button when image is provided', () => {
    render(
      <ImageCropper
        imageSrc="https://example.com/test-image.jpg"
        onCroppedImage={jest.fn()}
      />
    );

    // Check that "Rajaa" button renders
    const cropButton = screen.getByText('Rajaa');
    expect(cropButton).toBeInTheDocument();
  });
});
