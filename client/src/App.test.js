import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login link', () => {
  render(<App />);
  const linkElement = screen.getByText(/register/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders signup link', () => {
  render(<App />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
