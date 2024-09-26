import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component and checks if it starts', () => {
  render(<App />);
  const appElement = screen.getByText(/Sanapolku/i);
  expect(appElement).toBeInTheDocument();
});