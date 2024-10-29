import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PathSelection from './PathSelection';
import * as db from '../db/db';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PathSelection Component UI Tests', () => {
  const mockNavigate = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    await resetDB();
  });

  it('should render the PathSelection component and display the title "Polut"', () => {
    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    // Check if the title "Polut" is rendered
    expect(screen.getByText('Polut')).toBeInTheDocument();
  });

  it('checks if back button navigates back to the previous page', () => {
    const { container } = render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    // Get the back button and simulate a click
    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    // Check if navigate was called with -1 (go back to previous page)
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should open the new path modal when clicking the add path button', () => {
    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    // Get the button (FontAwesomeIcon with aria-label) and open the modal
    const openModalButton = screen.getByLabelText('Lisää uusi polku');
    fireEvent.click(openModalButton);

    // Check if the modal content appears
    expect(screen.getByText('Lisää uusi polku')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Anna polun nimi')).toBeInTheDocument();
  });

  it('should allow the user to type in the input field inside the modal', () => {
    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    // Open the modal
    const openModalButton = screen.getByLabelText('Lisää uusi polku');
    fireEvent.click(openModalButton);

    // Get the input field inside the modal and type into it
    const input = screen.getByPlaceholderText('Anna polun nimi');
    fireEvent.change(input, { target: { value: 'Polku' } });

    // Check if the input value is updated
    expect(input.value).toBe('Polku');
  });

  it('should trigger an alert if the input is empty when trying to add a new path', async () => {
    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    // Mock the window.alert to avoid actual alert
    window.alert = jest.fn();

    // Open the modal
    const openModalButton = screen.getByLabelText('Lisää uusi polku');
    fireEvent.click(openModalButton);

    // Get the save button and simulate a click without typing in the input
    const saveButton = screen.getByRole('button', { name: /tallenna/i });
    fireEvent.click(saveButton);

    // Since the input is empty, it should trigger an alert
    expect(window.alert).toHaveBeenCalledWith('Anna polulle nimi');
  });

  it('should add a new path when the user enters a name and clicks "Tallenna"', async () => {
    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    // Mock the window.alert to avoid actual alert
    window.alert = jest.fn();

    // Open the modal
    const openModalButton = screen.getByLabelText('Lisää uusi polku');
    fireEvent.click(openModalButton);

    // Type in the input field inside the modal
    const input = screen.getByPlaceholderText('Anna polun nimi');
    fireEvent.change(input, { target: { value: 'Uusi Polku' } });

    // Simulate a click on the "Tallenna" button
    const saveButton = screen.getByRole('button', { name: /tallenna/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('Anna polun nimi')
      ).toBeInTheDocument();
    });
  });

  it('should navigate to the game path if words are associated with the path', async () => {
    // Mock db commands
    const mockGetAllPaths = jest.spyOn(db, 'getAllPaths');
    mockGetAllPaths.mockImplementation(() =>
      Promise.resolve([{ id: 1, name: 'TestPath' }])
    );

    const mockGetPathByName = jest.spyOn(db, 'getPathByName');
    mockGetPathByName.mockImplementation(() =>
      Promise.resolve({ id: 1, name: 'TestPath' })
    );

    const mockGetWordsForPath = jest.spyOn(db, 'getWordsForPath');
    mockGetWordsForPath.mockImplementation(() =>
      Promise.resolve(['word1', 'word2'])
    );

    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('TestPath')).toBeInTheDocument();
    });

    // Simulate clicking on a path item
    const pathItem = screen.getByText('TestPath');
    fireEvent.click(pathItem);

    // Wait and check if navigate was called with the correct route
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/peli/TestPath');
    });
  });

  it('should open "No Words in Path" modal if no words are associated with the path', async () => {
    // Mock db functions
    const mockGetAllPaths = jest.spyOn(db, 'getAllPaths');
    mockGetAllPaths.mockImplementation(() =>
      Promise.resolve([{ id: 1, name: 'EmptyPath' }])
    );

    const mockGetPathByName = jest.spyOn(db, 'getPathByName');
    mockGetPathByName.mockImplementation(() =>
      Promise.resolve({ id: 1, name: 'EmptyPath' })
    );

    const mockGetWordsForPath = jest.spyOn(db, 'getWordsForPath');
    mockGetWordsForPath.mockImplementation(() => Promise.resolve([]));

    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('EmptyPath')).toBeInTheDocument();
    });

    // Simulate clicking on a path item
    const pathItem = screen.getByText('EmptyPath');
    fireEvent.click(pathItem);

    // Check if "No Words in Path" modal is displayed
    await waitFor(() => {
      expect(
        screen.getByText('Polulla ei ole vielä sanoja')
      ).toBeInTheDocument();
    });
  });

  it('should close the "No Words in Path" modal when clicking "Palaa takaisin"', async () => {
    // Mock db functions
    const mockGetAllPaths = jest.spyOn(db, 'getAllPaths');
    mockGetAllPaths.mockImplementation(() =>
      Promise.resolve([{ id: 1, name: 'EmptyPath' }])
    );

    const mockGetPathByName = jest.spyOn(db, 'getPathByName');
    mockGetPathByName.mockImplementation(() =>
      Promise.resolve({ id: 1, name: 'EmptyPath' })
    );

    const mockGetWordsForPath = jest.spyOn(db, 'getWordsForPath');
    mockGetWordsForPath.mockImplementation(() => Promise.resolve([]));

    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('EmptyPath')).toBeInTheDocument();
    });

    // Simulate clicking on a path item
    const pathItem = screen.getByText('EmptyPath');
    fireEvent.click(pathItem);

    // Wait for the modal to appear
    await waitFor(() => {
      expect(
        screen.getByText('Polulla ei ole vielä sanoja')
      ).toBeInTheDocument();
    });

    // Click on "Palaa takaisin" button to close modal
    const backButton = screen.getByText('Palaa takaisin');
    fireEvent.click(backButton);

    // Check if modal has closed
    await waitFor(() => {
      expect(
        screen.queryByText('Polulla ei ole vielä sanoja')
      ).not.toBeInTheDocument();
    });
  });

  it('should navigate to the path edit page when "Muokkaa polkua" is clicked in the "No Words in Path" modal', async () => {
    // Mock db functions
    const mockGetAllPaths = jest.spyOn(db, 'getAllPaths');
    mockGetAllPaths.mockImplementation(() =>
      Promise.resolve([{ id: 1, name: 'EmptyPath' }])
    );

    const mockGetPathByName = jest.spyOn(db, 'getPathByName');
    mockGetPathByName.mockImplementation(() =>
      Promise.resolve({ id: 1, name: 'EmptyPath' })
    );

    const mockGetWordsForPath = jest.spyOn(db, 'getWordsForPath');
    mockGetWordsForPath.mockImplementation(() => Promise.resolve([]));

    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('EmptyPath')).toBeInTheDocument();
    });

    // Simulate clicking on a path item
    const pathItem = screen.getByText('EmptyPath');
    fireEvent.click(pathItem);

    // Wait for the modal to appear
    await waitFor(() => {
      expect(
        screen.getByText('Polulla ei ole vielä sanoja')
      ).toBeInTheDocument();
    });

    // Click on "Muokkaa polkua" button
    const editButton = screen.getByText('Muokkaa polkua');
    fireEvent.click(editButton);

    // Check if navigate was called with the correct edit path route
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/muokkaapolkua/EmptyPath');
    });
  });
});
