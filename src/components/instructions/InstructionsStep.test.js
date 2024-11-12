import React from 'react';
import { render } from '@testing-library/react';
import InstructionsStep from './InstructionsStep';

const mockImage = 'https://example.com/mock-image.jpg';

describe('InstructionsStep Component', () => {
  it('renders correctly with all required props', () => {
    const title = 'Step 1 – Example Title';
    const text = 'This is a description of step 1.';

    const { getByText, getByAltText } = render(
      <InstructionsStep title={title} text={text} image={mockImage} />
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();

    const image = getByAltText(title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockImage);
    expect(image).toHaveAttribute('alt', title);
  });

  it('throws a prop-types warning when required props are missing', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<InstructionsStep />);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
