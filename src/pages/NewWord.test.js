import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  BrowserRouter,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import NewWord from './NewWord';
import ManagePath from './ManagePath';
import * as db from '../db/db';

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock the ImageUploader component to simulate an image
jest.mock('../components/newWord/ImageUploader', () => {
  const PropTypes = require('prop-types');

  const MockImageUploader = ({ setImageData }) => (
    <button
      onClick={() =>
        setImageData({ src: 'test-image-src', author: 'test-author' })
      }
    >
      Mock ImageUploader
    </button>
  );

  MockImageUploader.displayName = 'MockImageUploader'; // Add display name

  // Add prop types validation
  MockImageUploader.propTypes = {
    setImageData: PropTypes.func.isRequired,
  };

  return MockImageUploader;
});

// Mock ImageCropper for simplicity
jest.mock('../components/newWord/ImageCropper', () => {
  const PropTypes = require('prop-types');

  const MockImageCropper = ({
    imageSrc = 'default-image-src',
    onCroppedImage,
  }) => (
    <div>
      <p>ImageCropper Mock</p>
      <p>{imageSrc}</p>
      <button onClick={() => onCroppedImage('cropped-image-src')}>Crop</button>
    </div>
  );

  MockImageCropper.displayName = 'MockImageCropper'; // Add display name

  // Add prop types validation
  MockImageCropper.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    onCroppedImage: PropTypes.func.isRequired,
  };

  return MockImageCropper;
});

describe('NewWord Component UI Tests', () => {
  const mockNavigate = jest.fn();
  let pathId;

  // Utility function to set up the test DB
  const initializeTestDB = async () => {
    await db.resetDB();
    return await db.addPath('testPath');
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    pathId = await initializeTestDB();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({
      pathId: pathId,
    });
    useLocation.mockReturnValue(jest.fn());
  });

  it('should render the NewWord component and display "Uusi sana"', () => {
    render(
      <BrowserRouter>
        <NewWord />
      </BrowserRouter>
    );

    // Check if the header text "Uusi sana" is rendered
    expect(screen.getByText('Uusi sana')).toBeInTheDocument();
  });

  it('should allow user to input a word', () => {
    render(
      <BrowserRouter>
        <NewWord />
      </BrowserRouter>
    );

    // Get the input field and type into it
    const input = screen.getByPlaceholderText('Uusi sana');
    fireEvent.change(input, { target: { value: 'test word' } });

    // Check if the input value is updated
    expect(input.value).toBe('test word');
  });

  it('should alert when "VALMIS" button is clicked but word not set', () => {
    render(
      <BrowserRouter>
        <NewWord />
      </BrowserRouter>
    );

    // Mock the window.alert to avoid actual alert
    window.alert = jest.fn();

    // Get the save button and simulate a click
    const saveButton = screen.getByText('VALMIS');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    // Since the word input is empty initially, it should trigger an alert
    expect(window.alert).toHaveBeenCalledWith('Syötä sana');
  });

  it('should add word when "VALMIS" button is clicked', () => {
    const mockAddWord = jest.spyOn(db, 'addWord');
    mockAddWord.mockResolvedValue();
    render(
      <BrowserRouter>
        <NewWord />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Uusi sana');
    fireEvent.change(input, { target: { value: 'test word' } });

    // Get the save button and simulate a click
    const saveButton = screen.getByText('VALMIS');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    waitFor(() => {
      expect(mockAddWord).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/muokkaapolkua/' + pathId);
    });
  });
  it('should create path AND add word when "VALMIS" button is clicked if path does not exist', async () => {
    // Setup
    await db.resetDB();
    const newPathId = 9;
    const mockAddPath = jest.spyOn(db, 'addPath');
    mockAddPath.mockResolvedValue(newPathId);
    const mockAddWord = jest.spyOn(db, 'addWord');
    mockAddWord.mockResolvedValue();
    useLocation.mockReturnValue({
      state: { newPathName: 'newPath' },
    });

    // Start test
    render(
      <BrowserRouter>
        <NewWord />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Uusi sana');
    fireEvent.change(input, { target: { value: 'test word' } });

    // Get the save button and simulate a click
    const saveButton = screen.getByText('VALMIS');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    waitFor(() => {
      expect(mockAddPath).toHaveBeenCalledWith('newPath');
      expect(mockAddWord).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/muokkaapolkua/' + newPathId);
    });
  });

  it('checks if "PERUUTA" button navigates back to the previous page', () => {
    render(
      <BrowserRouter>
        <NewWord />
        <ManagePath />
      </BrowserRouter>
    );

    // Get the cancel button and simulate a click
    const cancelButton = screen.getByText('PERUUTA');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);

    // Check if navigate was called with correct url
    waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/muokkaapolkua/' + pathId)
    );
  });

  it('checks if back button navigates back to the previous page', () => {
    const { container } = render(
      <BrowserRouter>
        <NewWord />
        <ManagePath />
      </BrowserRouter>
    );

    // Get the back button and simulate a click
    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    // Check if navigate was called with correct url
    waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/muokkaapolkua/' + pathId)
    );
  });

  it('should open the Papunet modal when "Papunetistä" button is clicked', () => {
    render(
      <BrowserRouter>
        <NewWord />
      </BrowserRouter>
    );

    const fetchPhotosButton = screen.getByText('Papunetistä');
    fireEvent.click(fetchPhotosButton);

    // Check if Papunet modal is open
    expect(screen.getByText('Papunet Kuvahaku')).toBeInTheDocument();
  });

  it('updates the preview image and closes cropping modal after cropping', async () => {
    // Render the NewWord component inside a Router context
    render(
      <BrowserRouter>
        <NewWord />
      </BrowserRouter>
    );

    // Simulate selecting an image using the mocked ImageUploader
    const imageUploaderButton = screen.getByText('Mock ImageUploader');
    fireEvent.click(imageUploaderButton);

    // Assert that the cropping modal is displayed
    const croppingModal = screen.getByText('ImageCropper Mock');
    expect(croppingModal).toBeInTheDocument();

    // Simulate cropping the image
    const cropButton = screen.getByText('Crop');
    fireEvent.click(cropButton);

    // Assert that the preview image and imageData are updated
    const previewImage = screen.getByAltText('Esikatselu');
    expect(previewImage).toHaveAttribute('src', 'cropped-image-src');
  });
});
