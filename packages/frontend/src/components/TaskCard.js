import React from 'react';
import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import PropTypes from 'prop-types';

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !task.completed;
  };

  return (
    <Card
      sx={{
        opacity: task.completed ? 0.7 : 1,
        transition: 'all 0.3s ease',
      }}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Checkbox
            checked={task.completed === 1}
            onChange={() => onToggle(task.id)}
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            sx={{ mt: -1 }}
          />
          
          <Box flex={1}>
            <Typography
              variant="h6"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
                mb: 1,
              }}
            >
              {task.title}
            </Typography>
            
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  mb: 1,
                }}
              >
                {task.description}
              </Typography>
            )}
            
            {task.due_date && (
              <Chip
                icon={<EventIcon />}
                label={formatDate(task.due_date)}
                size="small"
                color={isOverdue(task.due_date) ? 'error' : 'default'}
                sx={{ mt: 1 }}
                aria-label={`Due date: ${formatDate(task.due_date)}`}
              />
            )}
          </Box>
          
          <Box display="flex" gap={1}>
            <IconButton
              onClick={() => onEdit(task)}
              size="small"
              aria-label={`Edit task "${task.title}"`}
              sx={{
                '&:focus': {
                  outline: '2px solid #9D4EDD',
                  outlineOffset: '2px',
                },
              }}
            >
              <EditIcon />
            </IconButton>
            
            <IconButton
              onClick={() => onDelete(task.id)}
              size="small"
              color="error"
              aria-label={`Delete task "${task.title}"`}
              sx={{
                '&:focus': {
                  outline: '2px solid #9D4EDD',
                  outlineOffset: '2px',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    due_date: PropTypes.string,
    completed: PropTypes.number.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskCard;
