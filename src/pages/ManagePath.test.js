import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useParams } from 'react-router-dom';
import ManagePath from './ManagePath';
import PathSelection from './PathSelection';
import * as db from '../db/db';
import { PathProvider } from '../components/pathSelection/PathContext';
import * as ShareUtils from '../utils/ShareUtils';

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('ManagePath Component UI Tests', () => {
  let pathId;
  const mockNavigate = jest.fn();

  // Utility function to set up the test DB
  const initializeTestDB = async () => {
    await db.resetDB();
    return await db.addPath('testPath');
  };

  // Initialize the fake IndexedDB before each test
  beforeEach(async () => {
    pathId = await initializeTestDB();

    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({
      pathId: pathId,
    });
    const mockInitializePeer = jest.spyOn(ShareUtils, 'initializePeer');
    mockInitializePeer.mockImplementation(() =>
      Promise.resolve([{ id: 1, peer: jest.fn() }])
    );

    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('should render the ManagePath component and display the path name as the title', () => {
    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Check if the title is rendered
    waitFor(() => {
      expect(screen.getByText('testPath')).toBeInTheDocument();
    });
  });

  it('checks if back button navigates back to the previous page', () => {
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
        <PathProvider>
          <PathSelection />
        </PathProvider>
      </BrowserRouter>
    );

    // Get the back button and simulate a click
    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    // Check if navigate was called with correct url
    expect(mockNavigate).toHaveBeenCalledWith('/omatpolut');
    expect(screen.getByText('Polut')).toBeInTheDocument();
  });

  it('should allow navigation to add a new word when the add word button is clicked', () => {
    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Get the add word button and simulate a click
    const addButton = screen.getByTestId('add-word-icon');
    fireEvent.click(addButton);

    // Check if navigate was called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith(`/uusisana/${pathId}`);
  });

  it('opens and closes the edit path name modal', async () => {
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Open the edit path name modal
    fireEvent.click(container.querySelector('.edit-button'));
    expect(screen.getByText(/Vaihda polun nimi/i)).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByText(/Peruuta/i));
    expect(screen.queryByText(/Vaihda polun nimi/i)).not.toBeInTheDocument();
  });

  it('does not submit if path name is empty', async () => {
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Open the edit path name modal
    fireEvent.click(container.querySelector('.edit-button'));

    // Leave the path name input empty and click save
    const input = screen.getByPlaceholderText(/Anna uusi polun nimi/i);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText(/Tallenna/i));

    // Ensure alert message for empty name is displayed
    await waitFor(() => {
      expect(screen.getByText(/Vaihda polun nimi/i)).toBeInTheDocument();
    });
  });

  it('shows an error message when editing the path name fails', async () => {
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Open the edit path name modal
    fireEvent.click(container.querySelector('.edit-button'));

    // Enter new path name
    const input = screen.getByPlaceholderText(/Anna uusi polun nimi/i);
    fireEvent.change(input, { target: { value: 'New Path Name' } });

    // Mock error response for editPathName
    const mockEditPathName = jest.spyOn(db, 'editPathName');
    mockEditPathName.mockRejectedValue(new Error('Failed to edit path name'));

    // Click save button
    fireEvent.click(screen.getByText(/Tallenna/i));

    // Wait for the error alert to appear
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to edit path name');
    });
  });

  it('shows an error message when deleting a word fails', async () => {
    await db.addWord('testing', pathId, { imageData: { src: '' } });
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    waitFor(() => {
      // Open the edit path name modal
      fireEvent.click(container.querySelector('.delete-button'));
    });

    // Mock error response for editPathName
    const mockDeleteWord = jest.spyOn(db, 'deleteWord');
    mockDeleteWord.mockRejectedValue(new Error());

    // Confirm deletion
    waitFor(() => {
      fireEvent.click(container.querySelector('.save-button'));
    });

    // Wait for the error alert to appear
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error deleting the word.');
    });
  });

  it('deletes the word when delete button is clicked', async () => {
    // Mock the getWordsForPath function to return the added word
    const mockGetWordsForPath = jest.spyOn(db, 'getWordsForPath');
    mockGetWordsForPath.mockResolvedValue([
      {
        id: 1,
        word: 'Test Word1',
        imageData: { src: 'test-image-src' },
      },
      {
        id: 2,
        word: 'Test Word2',
        imageData: { src: 'test-image-src' },
      },
    ]);

    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Wait for the word to be displayed in the list
    await waitFor(() => {
      expect(screen.getByText('Test Word1')).toBeInTheDocument();
      expect(screen.getByText('Test Word2')).toBeInTheDocument();
    });

    // Simulate opening the delete word modal
    const wordSpan = screen.getByText('Test Word1');
    const deleteButton = wordSpan
      .closest('.word-row-container')
      .querySelector('.delete-button');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(
      screen.getByText(/Haluatko varmasti poistaa sanan?/i)
    ).toBeInTheDocument();

    // Mock the deleteWord function
    const mockDeleteWord = jest.spyOn(db, 'deleteWord');
    mockDeleteWord.mockResolvedValue();

    // Simulate confirming the deletion
    fireEvent.click(screen.getByRole('button', { name: /Poista/i }));

    // Wait for the word to be removed from the list
    await waitFor(() => {
      expect(screen.queryByText('Test Word1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Word2')).toBeInTheDocument();
    });
  });

  it('navigates to "/omatpolut" when last word is deleted', async () => {
    // Mock the getWordsForPath function to return the added word
    const mockGetWordsForPath = jest.spyOn(db, 'getWordsForPath');
    mockGetWordsForPath.mockResolvedValue([
      {
        id: 1,
        word: 'Test Word',
        imageData: { src: 'test-image-src' },
      },
    ]);

    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Wait for the word to be displayed in the list
    await waitFor(() => {
      expect(screen.getByText('Test Word')).toBeInTheDocument();
    });

    // Simulate opening the delete word modal
    const wordSpan = screen.getByText('Test Word');
    const deleteButton = wordSpan
      .closest('.word-row-container')
      .querySelector('.delete-button');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(
      screen.getByText(/Haluatko varmasti poistaa sanan?/i)
    ).toBeInTheDocument();

    // Mock the deleteWord function
    const mockDeleteWord = jest.spyOn(db, 'deleteWord');
    mockDeleteWord.mockResolvedValue();

    // Simulate confirming the deletion
    fireEvent.click(screen.getByRole('button', { name: /Poista/i }));

    // Wait for the word to be removed from the list
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/omatpolut');
    });
  });

  it('navigates to "/uusisana" when add button is clicked', async () => {
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Simulate opening the delete word modal
    const addButton = container.querySelector('.add-button');

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/uusisana/' + pathId);
    });
  });

  it('navigates to "/omatpolut" if path ID is not valid', async () => {
    useParams.mockReturnValue({
      pathId: NaN,
    });
    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/omatpolut');
    });
  });

  it('navigates to "/omatpolut" if path is not found', async () => {
    useParams.mockReturnValue({
      pathId: 9999999, // Some ID that is not found from DB
    });
    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/omatpolut');
    });
  });
});
