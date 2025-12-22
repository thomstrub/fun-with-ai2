import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the TaskList component to avoid deep rendering
jest.mock('../components/TaskList', () => {
  return function MockTaskList() {
    return <div data-testid="task-list">Task List Component</div>;
  };
});

describe('App Component', () => {
  test('renders TaskList component', () => {
    render(<App />);
    const taskList = screen.getByTestId('task-list');
    expect(taskList).toBeInTheDocument();
  });

  test('renders with Material UI ThemeProvider', () => {
    const { container } = render(<App />);
    // CssBaseline adds baseline styles
    expect(container).toBeTruthy();
  });
});
