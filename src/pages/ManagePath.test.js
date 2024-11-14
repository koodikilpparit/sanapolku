import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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
  const mockNavigate = jest.fn();
  let pathId;

  // Utility function to set up the test DB
  const initializeTestDB = async () => {
    await db.resetDB();
    return await db.addPath('testPath');
  };

  // Initialize the fake IndexedDB before each test
  beforeEach(async () => {
    pathId = await initializeTestDB();

    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useParams.mockReturnValue({
      pathId: pathId,
    });
    const mockInitializePeer = jest.spyOn(ShareUtils, 'initializePeer');
    mockInitializePeer.mockImplementation(() =>
      Promise.resolve([{ id: 1, peer: jest.fn() }])
    );
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

    // Check if navigate was called with -1 (go back to previous page)
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(screen.getByText('Polut')).toBeInTheDocument();
  });

  it('should allow navigation to add a new word when "LISÄÄ UUSI SANA" is clicked', () => {
    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Get the add word button and simulate a click
    const addButton = screen.getByLabelText('Lisää uusi sana');
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

  it('successfully edits the path name', async () => {
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Open the edit path name modal
    fireEvent.click(container.querySelector('.edit-button'));

    // Enter new path name
    const input = screen.getByPlaceholderText(/Anna uusi polun nimi/i);
    fireEvent.change(input, { target: { value: 'Updated Path Name' } });

    // Mock successful response for editPathName
    const mockEditPathName = jest.spyOn(db, 'editPathName');
    mockEditPathName.mockResolvedValue({
      id: pathId,
      name: 'Updated Path Name',
    });

    // Click save button
    fireEvent.click(screen.getByText(/Tallenna/i));

    // Wait for the updated path name to display in the title
    await waitFor(() => {
      expect(screen.getByText('Updated Path Name')).toBeInTheDocument();
    });
  });

  it('shows an error message when editing the path name fails', async () => {
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Mock the window.alert to avoid actual alert
    window.alert = jest.fn();

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
});
