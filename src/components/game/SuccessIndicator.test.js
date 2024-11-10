import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessIndicator from './SuccessIndicator';

describe('SuccessIndicator', () => {
  test('renders success indicator with icon and text', () => {
    render(<SuccessIndicator />);

    const successIcon = screen.getByTestId('success-indicator');
    expect(successIcon).toBeInTheDocument();
    expect(successIcon).toHaveClass('success-indicator');

    const successText = screen.getByText('Oikein!');
    expect(successText).toBeInTheDocument();
    expect(successText).toHaveClass('success-text');
  });
});
