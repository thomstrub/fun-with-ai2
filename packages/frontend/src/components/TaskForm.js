import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PropTypes from 'prop-types';

function TaskForm({ open, onClose, onSave, task }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.due_date ? new Date(task.due_date) : null);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(null);
    }
    setErrors({});
  }, [task, open]);

  const validate = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
    };

    if (task) {
      taskData.id = task.id;
      taskData.completed = task.completed;
    }

    onSave(taskData);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setErrors({});
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="task-form-title"
    >
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <DialogTitle id="task-form-title">
          {task ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              required
              autoFocus
              inputProps={{
                'aria-label': 'Task title',
                'aria-required': 'true',
              }}
            />
            
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              inputProps={{
                'aria-label': 'Task description',
              }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={(newDate) => setDueDate(newDate)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      'aria-label': 'Task due date',
                    }}
                  />
                )}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: {
                      'aria-label': 'Task due date',
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            aria-label={task ? 'Save changes' : 'Add task'}
          >
            {task ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

TaskForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  task: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    due_date: PropTypes.string,
    completed: PropTypes.number,
  }),
};

TaskForm.defaultProps = {
  task: null,
};

export default TaskForm;
