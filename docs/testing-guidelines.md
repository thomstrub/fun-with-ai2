# TODO App - Testing Guidelines

## Overview
This document outlines the testing standards and practices for the TODO application. Comprehensive testing ensures code quality, reliability, and maintainability across all layers of the application.

## Testing Principles

### Core Testing Philosophy
- **Test-Driven Development**: Write tests for new features before implementation when possible
- **Comprehensive Coverage**: Aim for meaningful test coverage that validates behavior, not just line coverage
- **Maintainability First**: Write clear, well-documented tests that are easy to understand and modify
- **Fast Feedback**: Tests should run quickly to enable rapid development iteration
- **Isolation**: Tests should be independent and not rely on other tests' state or execution order

## Testing Pyramid

The testing strategy follows the testing pyramid with emphasis on lower-cost, faster tests:

```
     /\
    /E2E\
   /-----\
  / Integration \
 /-----------\
/  Unit Tests \
```

### Unit Tests (Foundation)
- **Coverage**: 70-80% of codebase
- **Scope**: Individual functions, methods, and components in isolation
- **Speed**: Fast execution (milliseconds)
- **Dependencies**: Mocked or stubbed external dependencies
- **Examples**: Function logic, component rendering with props, state management

### Integration Tests (Middle Layer)
- **Coverage**: 15-20% of codebase
- **Scope**: Multiple components or modules working together
- **Speed**: Moderate execution (seconds)
- **Dependencies**: May use real services or in-memory implementations
- **Examples**: Frontend components with state management, API endpoints with database

### End-to-End Tests (Top Layer)
- **Coverage**: 5-10% of codebase
- **Scope**: Complete user workflows from UI through backend to database
- **Speed**: Slower execution (seconds to minutes)
- **Dependencies**: Real application instances, real or test databases
- **Examples**: Adding a task with due date, editing and deleting tasks, filtering and sorting

## Test Requirements for New Features

### Mandatory Test Coverage
All new features must include:
- **Unit Tests**: Core logic and component functionality
- **Integration Tests**: Feature interaction with other system components
- **End-to-End Tests**: User-facing workflows and complete feature scenarios

### Feature Checklist
Before marking a feature as complete, ensure:
- [ ] Unit tests written and passing
- [ ] Integration tests cover feature interactions
- [ ] End-to-end tests validate user workflows
- [ ] Tests are documented with clear descriptions
- [ ] Edge cases and error scenarios are tested
- [ ] Tests pass locally and in CI/CD pipeline
- [ ] Code coverage meets minimum thresholds

## Frontend Testing

### Unit Tests
**Framework**: Jest with React Testing Library

**Scope**: Individual components and utility functions
- Component rendering with various props
- State changes and event handlers
- Conditional rendering
- Utility function logic

**Best Practices**:
```javascript
// Test behavior, not implementation
test('displays task as completed when checked', () => {
  // Arrange
  const { getByRole } = render(<TaskCard task={task} />);
  
  // Act
  fireEvent.click(getByRole('checkbox'));
  
  // Assert
  expect(getByRole('checkbox')).toBeChecked();
});
```

### Integration Tests
**Scope**: Components with state management, context, and child components
- Multiple components working together
- State management integration
- Context provider behavior
- Navigation between screens

**Example Scenarios**:
- Adding a task updates the task list
- Editing a task reflects changes in the UI
- Filtering/sorting tasks works correctly

### End-to-End Tests
**Framework**: Cypress or Playwright (recommended for future implementation)

**Scope**: Complete user workflows
- User creates a task with due date
- User edits and saves task changes
- User marks task as complete
- User deletes a task
- User sorts and filters tasks

## Backend Testing

### Unit Tests
**Framework**: Jest

**Scope**: Individual route handlers and utility functions
- Request/response handling
- Validation logic
- Error handling
- Business logic

**Best Practices**:
```javascript
test('returns 400 when task title is missing', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ dueDate: '2025-12-25' });
  
  expect(response.status).toBe(400);
});
```

### Integration Tests
**Scope**: API endpoints with database interactions
- CRUD operations
- Data persistence
- Database constraints
- Error responses

**Example Scenarios**:
- POST /api/tasks creates a new task
- GET /api/tasks returns all tasks
- PUT /api/tasks/:id updates a task
- DELETE /api/tasks/:id removes a task

### End-to-End Tests
**Scope**: Complete API workflows
- Creating and retrieving tasks
- Editing and verifying updates
- Deleting and confirming removal
- Sorting and filtering operations

## Test Organization

### File Structure
```
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TaskCard.js
│   │   └── TaskCard.test.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── helpers.test.js
│   └── __tests__/
│       ├── integration/
│       │   └── TaskList.integration.test.js
│       └── e2e/
│           └── task-workflow.e2e.test.js

packages/backend/
├── src/
│   ├── routes/
│   │   ├── tasks.js
│   │   └── tasks.test.js
│   └── __tests__/
│       ├── integration/
│       │   └── tasks.integration.test.js
│       └── e2e/
│           └── api-workflow.e2e.test.js
```

### Naming Conventions
- Unit tests: `ComponentName.test.js` (same directory as component)
- Integration tests: `feature.integration.test.js` (in `__tests__/integration/`)
- End-to-end tests: `user-workflow.e2e.test.js` (in `__tests__/e2e/`)

## Maintainable Test Practices

### Clear Test Descriptions
Use descriptive test names that explain what is being tested:
```javascript
// Good
test('adds a new task to the list when form is submitted', () => {});

// Avoid
test('add task', () => {});
```

### Arrange-Act-Assert Pattern
Organize tests with clear setup, action, and verification phases:
```javascript
test('updates task due date when edited', () => {
  // Arrange
  const task = { id: 1, title: 'Test', dueDate: '2025-12-25' };
  
  // Act
  const updated = updateTask(task, { dueDate: '2025-12-26' });
  
  // Assert
  expect(updated.dueDate).toBe('2025-12-26');
});
```

### DRY Principle in Tests
Create helper functions and fixtures to reduce duplication:
```javascript
// helpers/test-utils.js
export const mockTask = {
  id: 1,
  title: 'Test Task',
  completed: false,
  dueDate: '2025-12-25'
};

export const renderWithProviders = (component) => {
  return render(<Provider>{component}</Provider>);
};
```

### Meaningful Assertions
Use specific assertions that clearly indicate what is being verified:
```javascript
// Good
expect(getByText('Completed')).toBeInTheDocument();

// Avoid
expect(result).toBeTruthy();
```

### Test Data Management
- Use fixtures for consistent test data
- Factory functions for creating test objects
- Reset state between tests
- Avoid test interdependencies

### Documentation
Add comments for complex test logic:
```javascript
test('handles race condition when multiple edits occur simultaneously', () => {
  // NOTE: This test verifies that the most recent edit takes precedence
  // even when requests complete out of order (timing: edit2 -> edit1 -> complete)
});
```

## Code Coverage Requirements

### Minimum Coverage Targets
- **Statements**: 75%
- **Branches**: 70%
- **Functions**: 75%
- **Lines**: 75%

### Coverage Exclusions
Exclude from coverage requirements:
- Generated files
- Configuration files
- Test utilities
- Type definitions

## Continuous Integration

### Test Execution in CI/CD
- All tests must pass before merging to main
- Tests run automatically on pull requests
- Coverage reports are generated and validated
- Failed tests block deployment

### Pre-commit Checks
- Run unit tests for modified files
- Run linting checks
- Validate test coverage

## Debugging Tests

### Useful Tools
- `debug()` from React Testing Library for DOM inspection
- `screen` queries for better debugging
- Browser DevTools for Cypress/Playwright
- Test output and error messages

### Common Testing Patterns

**Testing async operations**:
```javascript
test('loads tasks on component mount', async () => {
  render(<TaskList />);
  const tasks = await screen.findAllByTestId('task-item');
  expect(tasks.length).toBeGreaterThan(0);
});
```

**Testing error states**:
```javascript
test('displays error message on failed request', async () => {
  mockFetch.mockRejectedValueOnce(new Error('Network error'));
  render(<TaskList />);
  const error = await screen.findByText('Network error');
  expect(error).toBeInTheDocument();
});
```

## Test Maintenance

### Regular Reviews
- Review tests during code reviews
- Refactor brittle or unclear tests
- Remove obsolete tests
- Update tests when requirements change

### Anti-Patterns to Avoid
- Testing implementation details instead of behavior
- Creating interdependent tests
- Using sleeps or timeouts instead of proper waits
- Testing multiple features in one test
- Over-mocking (mocking things that should be real)
- Skipping or ignoring tests long-term

## Performance Considerations
- Keep unit tests under 100ms
- Run tests in parallel when possible
- Cache expensive test setup
- Use in-memory databases for integration tests
- Limit end-to-end tests to critical user paths
