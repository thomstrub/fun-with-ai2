import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks?sortBy=${sortBy}&order=${sortOrder}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showSnackbar('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      showSnackbar('Task added successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to add task', 'error');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await fetch(`/api/tasks/${taskData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      showSnackbar('Task updated successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to update task', 'error');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      showSnackbar(
        updatedTask.completed ? 'Task marked as complete' : 'Task marked as incomplete',
        'success'
      );
    } catch (err) {
      showSnackbar('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(t => t.id !== taskId));
      showSnackbar('Task deleted successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to delete task', 'error');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormSave = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleAddTask(taskData);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && tasks.length === 0) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h1" component="h1">
            My Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
            aria-label="Add new task"
          >
            Add Task
          </Button>
        </Box>

        <Box display="flex" gap={2} mb={3}>
          <FormControl fullWidth>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              inputProps={{ 'aria-label': 'Sort tasks by' }}
            >
              <MenuItem value="created_at">Creation Date</MenuItem>
              <MenuItem value="due_date">Due Date</MenuItem>
              <MenuItem value="completed">Completion Status</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="sort_order">Custom Order</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="sort-order-label">Order</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value)}
              inputProps={{ 'aria-label': 'Sort order' }}
            >
              <MenuItem value="ASC">Ascending</MenuItem>
              <MenuItem value="DESC">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          {tasks.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              No tasks yet. Click "Add Task" to create your first task!
            </Typography>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </Box>

        <TaskForm
          open={formOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
          task={editingTask}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default TaskList;
