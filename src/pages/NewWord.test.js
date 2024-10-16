import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewWord from './NewWord';
import ManagePath from './ManagePath';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('NewWord Component UI Tests', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
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

    it('should trigger the handleSave function when "VALMIS" button is clicked', () => {
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

    // Check if navigate was called with -1 (go back to previous page)
    expect(mockNavigate).toHaveBeenCalledWith(-1);
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

    // Check if navigate was called with -1 (go back to previous page)
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(screen.getByText('Lisää sanoja')).toBeInTheDocument();
  });
});
