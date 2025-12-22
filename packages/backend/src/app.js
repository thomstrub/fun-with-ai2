const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    completed INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialItems = ['Item 1', 'Item 2', 'Item 3'];
const insertStmt = db.prepare('INSERT INTO items (name) VALUES (?)');

initialItems.forEach(item => {
  insertStmt.run(item);
});

// Insert sample tasks
const sampleTasks = [
  { title: 'Complete project documentation', description: 'Write comprehensive docs for the TODO app', due_date: '2025-12-30', completed: 0 },
  { title: 'Review pull requests', description: 'Check pending PRs on GitHub', due_date: '2025-12-23', completed: 0 },
  { title: 'Team meeting', description: 'Weekly sync with the team', due_date: '2025-12-22', completed: 1 }
];

const taskInsertStmt = db.prepare(
  'INSERT INTO tasks (title, description, due_date, completed, sort_order) VALUES (?, ?, ?, ?, ?)'
);

sampleTasks.forEach((task, index) => {
  taskInsertStmt.run(task.title, task.description, task.due_date, task.completed, index);
});

console.log('In-memory database initialized with sample data');

// API Routes
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const result = insertStmt.run(name);
    const id = result.lastInsertRowid;

    const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM items WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Item deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Task API Routes
// PUT update sort order for multiple tasks (must be before /:id routes)
app.put('/api/tasks/reorder', (req, res) => {
  try {
    const { tasks } = req.body;
    
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Tasks array is required' });
    }
    
    const updateStmt = db.prepare('UPDATE tasks SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    
    tasks.forEach(({ id, sort_order }) => {
      if (id && sort_order !== undefined) {
        updateStmt.run(sort_order, id);
      }
    });
    
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
});

// GET all tasks with optional sorting
app.get('/api/tasks', (req, res) => {
  try {
    const { sortBy = 'created_at', order = 'DESC' } = req.query;
    
    // Validate sort parameters
    const validSortFields = ['created_at', 'due_date', 'completed', 'sort_order', 'title'];
    const validOrders = ['ASC', 'DESC'];
    
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
    
    const query = `SELECT * FROM tasks ORDER BY ${sortField} ${sortOrder}`;
    const tasks = db.prepare(query).all();
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET single task by ID
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST create new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description = '', due_date = null, completed = 0 } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    // Get max sort_order
    const maxSortOrder = db.prepare('SELECT MAX(sort_order) as max FROM tasks').get();
    const sortOrder = (maxSortOrder.max || 0) + 1;
    
    const insertTask = db.prepare(
      'INSERT INTO tasks (title, description, due_date, completed, sort_order) VALUES (?, ?, ?, ?, ?)'
    );
    
    const result = insertTask.run(title.trim(), description, due_date, completed ? 1 : 0, sortOrder);
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update existing task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, completed } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (title !== undefined && (!title || typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title.trim());
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(due_date);
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      values.push(completed ? 1 : 0);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const updateQuery = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...values);
    
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PATCH toggle task completion
app.patch('/api/tasks/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const toggleStmt = db.prepare(
      'UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    toggleStmt.run(task.completed ? 0 : 1, id);
    
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStmt.run(id);
    
    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db, insertStmt };