import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ManagePath from './ManagePath';
import PathSelection from './PathSelection';
import { PathProvider } from '../components/pathSelection/PathContext';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('ManagePath Component UI Tests', () => {
  const mockNavigate = jest.fn();
  const mockPathName = 'testPath';

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useParams.mockReturnValue({
      pathName: mockPathName,
    });
  });

  it('should render the ManagePath component and display the path name as the title', () => {
    render(
      <BrowserRouter>
        <ManagePath />
      </BrowserRouter>
    );

    // Check if the title is rendered
    expect(screen.getByText('testPath')).toBeInTheDocument();
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
    expect(mockNavigate).toHaveBeenCalledWith('/uusisana/testPath');
  });
});
