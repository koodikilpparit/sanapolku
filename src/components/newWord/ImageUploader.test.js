import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageUploader from './ImageUploader';

describe('ImageUploader tests', () => {
  // Mocks alert before every test
  beforeEach(() => {
    global.alert = jest.fn(); // Creates mock alert
  });

  it('should render the image upload button', () => {
    // Mocks the setImageData function
    const setImageDataMock = jest.fn();

    // Renders the ImageUploader with the mocked function
    render(<ImageUploader setImageData={setImageDataMock} />);

    // Checks if the upload button is rendered
    const uploadButton = screen.getByText('Laitteelta');
    expect(uploadButton).toBeInTheDocument();
  });

  it('should allow user to upload a valid image', () => {
    const setImageDataMock = jest.fn();
    render(<ImageUploader setImageData={setImageDataMock} />);

    // Test file which produces base64
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByText('Laitteelta');

    // Simulates uploading file
    fireEvent.change(input, { target: { files: [file] } });

    // Mocks FileReader
    const fileReaderMock = {
      onload: null,
      readAsDataURL: function () {
        // Simulates onload event
        if (this.onload) {
          this.onload({
            target: { result: 'data:image/png;base64,ZHVtbXkgY29udGVudA==' },
          });
        }
      },
    };

    // Replaces globals FileReaders with mock
    global.FileReader = jest.fn(() => fileReaderMock);

    // Calls readAsDataURL
    const reader = new FileReader();
    reader.readAsDataURL(file);
  });

  it('should alert if invalid file type is uploaded', () => {
    const setImageDataMock = jest.fn();
    render(<ImageUploader setImageData={setImageDataMock} />);

    // Creates invalid file
    const invalidFile = new File(['dummy content'], 'test.txt', {
      type: 'text/plain',
    });

    // Get the hidden file input element
    const input = screen
      .getByText(/Laitteelta/i)
      .closest('button').nextElementSibling;

    // Simulates uploading invalid file
    fireEvent.change(input, { target: { files: [invalidFile] } });

    // Checks that alert has been called with right message
    expect(global.alert).toHaveBeenCalledWith(
      'Vain JPEG, JPG tai PNG tiedostot hyväksytään.'
    );

    global.alert.mockRestore();
  });

  it('should not call setImageData if an invalid file type is uploaded', () => {
    const setImageDataMock = jest.fn();
    render(<ImageUploader setImageData={setImageDataMock} />);

    // Creates invalid file
    const invalidFile = new File(['dummy content'], 'test.txt', {
      type: 'text/plain',
    });
    const input = screen.getByText('Laitteelta');

    // Simulates uploading invalid file
    fireEvent.change(input, { target: { files: [invalidFile] } });

    // Checks that there isn't setImageData calls
    expect(setImageDataMock).not.toHaveBeenCalled();
  });

  it('should handle empty file selection gracefully', () => {
    const setImageDataMock = jest.fn();
    render(<ImageUploader setImageData={setImageDataMock} />);

    const input = screen.getByText('Laitteelta');

    // Simulates empty file selection
    fireEvent.change(input, { target: { files: [] } });

    // Checks that there isn't setImageData calls
    expect(setImageDataMock).not.toHaveBeenCalled();
  });
});
