import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ManagePath from './ManagePath';
import PathSelection from './PathSelection';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ManagePath Component UI Tests', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  it('should render the ManagePath component and display the title "Lisää sanoja"', () => {
    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Check if the title "Lisää sanoja" is rendered
    expect(screen.getByText('Lisää sanoja')).toBeInTheDocument();
  });

  it('checks if back button navigates back to the previous page', () => {
    const { container } = render(
      <BrowserRouter>
        <ManagePath />
        <PathSelection />
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
    expect(mockNavigate).toHaveBeenCalledWith('/uusisana/undefined');
  });
});
