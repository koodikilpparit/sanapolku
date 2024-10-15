import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PathSelection from './PathSelection';
import GameMenu from './GameMenu';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PathSelection Component UI Tests', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
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
        <GameMenu />
      </BrowserRouter>
    );

    // Get the back button and simulate a click
    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    // Check if navigate was called with -1 (go back to previous page)
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(screen.getByText('Valitse polku')).toBeInTheDocument();
  });

  it('should allow the user to type in the input field', () => {
    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    // Get the input field and type into it
    const input = screen.getByPlaceholderText('Anna polun nimi');
    fireEvent.change(input, { target: { value: 'Polku' } });

    // Check if the input value is updated
    expect(input.value).toBe('Polku');
  });

  it('should trigger the handleAddPath function when "Lisää polku" button is clicked', () => {
    render(
      <BrowserRouter>
        <PathSelection />
      </BrowserRouter>
    );

    // Mock the window.alert to avoid actual alert
    window.alert = jest.fn();

    // Get the add button and simulate a click
    const addButton = screen.getByText('Lisää polku');
    fireEvent.click(addButton);

    // Since the input is empty initially, it should trigger an alert
    expect(window.alert).toHaveBeenCalledWith('Anna polulle nimi');
  });
});
