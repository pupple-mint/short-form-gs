import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders video upload interface', () => {
  render(<App />);
  const uploadTitle = screen.getByText(/동영상 업로드/i);
  expect(uploadTitle).toBeInTheDocument();
});
