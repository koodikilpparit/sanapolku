import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Start page by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const startElement = screen.getByText(/Sanapolku/i);
  expect(startElement).toBeInTheDocument();
});
