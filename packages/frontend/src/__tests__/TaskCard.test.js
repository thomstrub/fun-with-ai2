import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../components/TaskCard';

describe('TaskCard Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    due_date: '2025-12-30',
    completed: 0,
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task title and description', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders due date chip', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    const dueDateChip = screen.getByLabelText(/Due date:/);
    expect(dueDateChip).toBeInTheDocument();
  });

  test('shows completed task with strikethrough', () => {
    const completedTask = { ...mockTask, completed: 1 };
    render(<TaskCard task={completedTask} {...mockHandlers} />);
    
    const title = screen.getByText('Test Task');
    expect(title).toHaveStyle({ textDecoration: 'line-through' });
  });

  test('calls onToggle when checkbox is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(1);
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    const editButton = screen.getByLabelText(/Edit task/);
    fireEvent.click(editButton);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    const deleteButton = screen.getByLabelText(/Delete task/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
  });

  test('does not render description when empty', () => {
    const taskWithoutDescription = { ...mockTask, description: '' };
    render(<TaskCard task={taskWithoutDescription} {...mockHandlers} />);
    
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  test('does not render due date chip when no due date', () => {
    const taskWithoutDueDate = { ...mockTask, due_date: null };
    render(<TaskCard task={taskWithoutDueDate} {...mockHandlers} />);
    
    expect(screen.queryByLabelText(/Due date:/)).not.toBeInTheDocument();
  });

  test('checkbox is checked for completed tasks', () => {
    const completedTask = { ...mockTask, completed: 1 };
    render(<TaskCard task={completedTask} {...mockHandlers} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('checkbox is not checked for incomplete tasks', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('has proper ARIA labels for accessibility', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    expect(screen.getByLabelText('Task: Test Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Mark task "Test Task" as complete/)).toBeInTheDocument();
    expect(screen.getByLabelText('Edit task "Test Task"')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete task "Test Task"')).toBeInTheDocument();
  });
});
