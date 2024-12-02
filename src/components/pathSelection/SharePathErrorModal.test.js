import { render, screen, fireEvent } from '@testing-library/react';
import SharePathErrorModal from './SharePathErrorModal';
import React from 'react';

describe('SharePathErrorModal', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal with the correct content', () => {
    render(<SharePathErrorModal onClose={onCloseMock} />);

    // Check that the modal title is displayed
    expect(
      screen.getByText('Polun jakaminen epäonnistui!')
    ).toBeInTheDocument();

    // Check that the modal description is displayed
    expect(screen.getByText(/Yritä jakamista uudestaan./)).toBeInTheDocument();

    // Check that the button text is correct
    expect(screen.getByText('Sulje')).toBeInTheDocument();
  });

  it('should call onClose when the "Sulje" button is clicked', () => {
    render(<SharePathErrorModal onClose={onCloseMock} />);

    // Simulate clicking the "Sulje" button
    fireEvent.click(screen.getByText('Sulje'));

    // Check if the onClose function was called
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
