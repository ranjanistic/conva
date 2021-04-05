import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login link', () => {
  render(<App />);
  screen.getAllByText(/register/i).forEach((elem)=>{
    expect(elem).toBeInTheDocument();
  })
});

test('renders signup link', () => {
  render(<App />);
  screen.getAllByText(/login/i).forEach((elem)=>{
    expect(elem).toBeInTheDocument();
  })
});
