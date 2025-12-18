# TODO App - Coding Guidelines

## Overview
This document outlines the coding style, quality principles, and best practices for the TODO application. These guidelines ensure consistency, maintainability, and code quality across the entire codebase.

## Code Philosophy

### Core Principles
- **Readability First**: Code is read far more often than it is written. Prioritize clarity over cleverness.
- **Consistency**: Maintain consistent patterns and conventions throughout the codebase.
- **Maintainability**: Write code that is easy to understand, modify, and extend.
- **Quality**: Emphasize code quality over rapid development. Technical debt accrues interest.
- **Collaboration**: Write code with your team in mind. Help them understand your intentions.

## General Formatting Rules

### Indentation and Whitespace
- **Indentation**: Use 2 spaces for indentation (not tabs)
- **Line Length**: Keep lines to a maximum of 100 characters for readability
- **Trailing Whitespace**: Remove all trailing whitespace
- **Blank Lines**: Use blank lines to separate logical sections within functions and between methods
- **File Ending**: Ensure all files end with a single newline character

### Naming Conventions

#### Variables and Functions
- **camelCase**: Use camelCase for variables and functions
  ```javascript
  // Good
  const taskList = [];
  function handleTaskSubmit() {}
  
  // Avoid
  const task_list = [];
  function Handle_Task_Submit() {}
  ```

#### Constants
- **UPPER_SNAKE_CASE**: Use UPPER_SNAKE_CASE for constants
  ```javascript
  // Good
  const MAX_TASK_LENGTH = 100;
  const API_ENDPOINT = 'https://api.example.com';
  
  // Avoid
  const maxTaskLength = 100;
  const api_endpoint = 'https://api.example.com';
  ```

#### Classes and Components
- **PascalCase**: Use PascalCase for classes and React components
  ```javascript
  // Good
  class TaskManager {}
  function TaskCard() {}
  
  // Avoid
  class taskManager {}
  function taskCard() {}
  ```

#### Boolean Variables
- **is/has Prefix**: Use `is` or `has` prefix for boolean variables
  ```javascript
  // Good
  const isCompleted = true;
  const hasError = false;
  
  // Avoid
  const completed = true;
  const error = false;
  ```

### Semicolons and Quotes
- **Semicolons**: Always include semicolons at the end of statements
- **Quotes**: Use double quotes (`"`) for strings consistently
  ```javascript
  // Good
  const message = "Task completed";
  
  // Avoid
  const message = 'Task completed';
  ```

## Import Organization

### Import Order
Organize imports in the following order:
1. External dependencies (third-party libraries)
2. Internal dependencies (application code)
3. Relative imports (local files)

Separate each group with a blank line.

```javascript
// Good - Organized imports
import React, { useState } from 'react';
import axios from 'axios';

import { TaskService } from '../services/taskService';
import { useAppContext } from '../context/AppContext';

import { formatDate } from './utils';
import styles from './TaskCard.module.css';

// Avoid - Mixed import organization
import { formatDate } from './utils';
import axios from 'axios';
import React from 'react';
import styles from './TaskCard.module.css';
import { TaskService } from '../services/taskService';
```

### Import Statements
- **Named Imports**: Use named imports for specific exports
  ```javascript
  // Good
  import { TaskService } from '../services/taskService';
  
  // Avoid (unless necessary)
  import * as TaskModule from '../services/taskService';
  ```

- **Default Imports**: Use default imports only for default exports
  ```javascript
  // Good
  import TaskCard from '../components/TaskCard';
  
  // Avoid
  import { default as TaskCard } from '../components/TaskCard';
  ```

## Linter Usage

### ESLint Configuration
The project uses ESLint to enforce code quality standards. All code must pass ESLint checks before being committed.

### Running ESLint
- **Check all files**: `npm run lint`
- **Fix auto-fixable issues**: `npm run lint:fix`
- **Check specific file**: `npm run lint -- src/file.js`

### Common ESLint Rules
- No unused variables
- No console logs in production code
- No debugger statements
- Consistent function declarations
- Proper error handling
- No duplicate imports

### Ignoring ESLint Rules
Only ignore ESLint rules when absolutely necessary, and always provide a comment explaining why:

```javascript
// Bad - No explanation
// eslint-disable-next-line
const tasks = getTasks();

// Good - Clear explanation
// eslint-disable-next-line no-console
console.log('Debug: tasks loaded');
```

## Best Practices

### DRY Principle (Don't Repeat Yourself)
Avoid code duplication by extracting common logic into reusable functions and components.

```javascript
// Bad - Repeated logic
function formatTaskDate1(date) {
  return new Date(date).toLocaleDateString('en-US');
}

function formatTaskDate2(date) {
  return new Date(date).toLocaleDateString('en-US');
}

// Good - Extracted to utility function
function formatTaskDate(date) {
  return new Date(date).toLocaleDateString('en-US');
}
```

### KISS Principle (Keep It Simple, Stupid)
Write simple, straightforward code. Avoid unnecessary complexity.

```javascript
// Bad - Overly complex
const getCompletedTasks = (tasks) => 
  tasks.filter(t => t.completed === true).map(t => ({ ...t, status: 'done' }));

// Good - Clear and simple
function getCompletedTasks(tasks) {
  return tasks.filter(task => task.completed);
}
```

### Single Responsibility Principle
Each function or component should have a single, well-defined purpose.

```javascript
// Bad - Multiple responsibilities
function handleTaskSubmit(title, dueDate) {
  const task = { title, dueDate };
  validateTask(task);
  saveTaskToDatabase(task);
  updateUIWithNewTask(task);
  trackAnalytics(task);
}

// Good - Separated concerns
function handleTaskSubmit(title, dueDate) {
  const task = createTask(title, dueDate);
  saveTask(task);
}

function createTask(title, dueDate) {
  return { title, dueDate, id: generateId() };
}
```

### Error Handling
Always handle errors appropriately. Don't silently fail.

```javascript
// Bad - No error handling
function fetchTasks() {
  return fetch('/api/tasks').then(r => r.json());
}

// Good - Proper error handling
async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}
```

### Comments and Documentation

#### When to Comment
- Complex algorithms or business logic
- Non-obvious decisions or workarounds
- Important state or side effects
- Clarifying the "why" not the "what"

#### When NOT to Comment
- Self-explanatory code
- Obvious variable names and function purposes
- Redundant comments that repeat the code

```javascript
// Bad - Redundant comment
// Increment counter
counter++;

// Good - Explaining the why
// Increment counter to track retry attempts
counter++;

// Good - Self-explanatory code
function calculateTaskPriority(dueDate, completionDays) {
  return (completionDays - now) / completionDays;
}
```

### Function Length
- **Keep functions short**: Aim for functions under 20 lines
- **Single purpose**: Each function should do one thing well
- **Extract helper functions**: Break complex logic into smaller, testable functions

```javascript
// Bad - Too long, multiple purposes
function processTaskList(tasks, sortBy, filter) {
  const filtered = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });
  
  if (sortBy === 'date') {
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  return filtered.map(t => ({
    ...t,
    displayDate: new Date(t.dueDate).toLocaleDateString()
  }));
}

// Good - Separated concerns
function filterTasks(tasks, filter) {
  const filters = {
    completed: t => t.completed,
    pending: t => !t.completed
  };
  const filterFn = filters[filter] || (() => true);
  return tasks.filter(filterFn);
}

function sortTasks(tasks, sortBy) {
  const sorters = {
    date: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    title: (a, b) => a.title.localeCompare(b.title)
  };
  const sorterFn = sorters[sortBy] || (() => 0);
  return [...tasks].sort(sorterFn);
}

function formatTasks(tasks) {
  return tasks.map(t => ({
    ...t,
    displayDate: new Date(t.dueDate).toLocaleDateString()
  }));
}
```

### Async/Await vs Promises
Prefer async/await over promise chains for better readability.

```javascript
// Acceptable - Promise chain
function getTasks() {
  return fetch('/api/tasks')
    .then(r => r.json())
    .then(data => data.tasks)
    .catch(error => console.error(error));
}

// Better - async/await
async function getTasks() {
  try {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    return data.tasks;
  } catch (error) {
    console.error(error);
  }
}
```

### const vs let vs var
- **const**: Default choice for all variables
- **let**: Only when variable needs to be reassigned
- **var**: Never use in modern code

```javascript
// Good - Use const by default
const taskList = [];
const taskTitle = 'New Task';

// Acceptable - Use let when reassignment needed
let taskCount = 0;
taskCount++;

// Bad - Never use var
var tasks = [];
```

## Frontend-Specific Guidelines

### Component Organization
Organize React components in the following order:
1. Imports
2. Component definition
3. Event handlers
4. Render method / return statement
5. Default exports

```javascript
import React, { useState } from 'react';
import { TaskService } from '../services/taskService';
import './TaskCard.css';

function TaskCard({ task, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedTask) => {
    onEdit(updatedTask);
    setIsEditing(false);
  };

  if (isEditing) {
    return <TaskEditForm task={task} onSave={handleSave} />;
  }

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.dueDate}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}

export default TaskCard;
```

### Component Props
- **Use destructuring**: Destructure props in component parameters
- **PropTypes or TypeScript**: Validate component props
- **Prop documentation**: Document complex props with comments

```javascript
import PropTypes from 'prop-types';

function TaskCard({ task, onEdit, onDelete }) {
  // Component code
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.required,
    title: PropTypes.string.required,
    dueDate: PropTypes.string,
    completed: PropTypes.bool
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TaskCard;
```

## Backend-Specific Guidelines

### Route Organization
Organize route files by feature:
- `/routes/tasks.js` - Task-related routes
- `/routes/auth.js` - Authentication routes
- `/routes/index.js` - Main route configuration

### Middleware Usage
- Use middleware for cross-cutting concerns (logging, error handling, authentication)
- Keep middleware focused and reusable

```javascript
// Good - Single responsibility middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
}

app.use(errorHandler);
```

### API Response Format
Maintain consistent API response format:

```javascript
// Success response
{
  success: true,
  data: { /* resource data */ },
  message: "Operation completed successfully"
}

// Error response
{
  success: false,
  error: "Error message",
  details: { /* optional error details */ }
}
```

## Code Review Checklist

Before submitting code for review, ensure:
- [ ] All ESLint checks pass
- [ ] Code follows naming conventions
- [ ] Imports are properly organized
- [ ] No console logs in production code
- [ ] DRY principle is applied
- [ ] Functions are short and focused
- [ ] Error handling is implemented
- [ ] Comments explain "why" not "what"
- [ ] All tests pass
- [ ] Code coverage meets minimum thresholds

## Continuous Improvement

- Review and update these guidelines as the project evolves
- Share learnings from code reviews with the team
- Refactor legacy code that doesn't follow current guidelines
- Celebrate good code practices and share examples
