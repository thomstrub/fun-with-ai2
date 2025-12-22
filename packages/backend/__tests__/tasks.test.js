const request = require('supertest');
const { app, db } = require('../src/app');

describe('Task API Endpoints', () => {
  beforeEach(() => {
    // Clear tasks table and reset with sample data
    db.exec('DELETE FROM tasks');
    db.exec(`
      INSERT INTO tasks (title, description, due_date, completed, sort_order)
      VALUES 
        ('Test Task 1', 'Description 1', '2025-12-30', 0, 0),
        ('Test Task 2', 'Description 2', '2025-12-25', 1, 1),
        ('Test Task 3', '', NULL, 0, 2)
    `);
  });

  afterAll(() => {
    db.close();
  });

  describe('GET /api/tasks', () => {
    test('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    test('should sort tasks by due_date ascending', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ sortBy: 'due_date', order: 'ASC' });
      
      expect(response.status).toBe(200);
      // NULL dates sort first in SQLite, so Test Task 3 (no due date) comes first
      expect(response.body[0].title).toBe('Test Task 3');
      expect(response.body[1].title).toBe('Test Task 2');
    });

    test('should sort tasks by completed status', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ sortBy: 'completed', order: 'DESC' });
      
      expect(response.status).toBe(200);
      expect(response.body[0].completed).toBe(1);
    });

    test('should handle invalid sort parameters gracefully', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ sortBy: 'invalid', order: 'INVALID' });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('should return a single task by ID', async () => {
      const tasks = db.prepare('SELECT * FROM tasks LIMIT 1').get();
      const response = await request(app).get(`/api/tasks/${tasks.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(tasks.id);
      expect(response.body.title).toBe(tasks.title);
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(app).get('/api/tasks/99999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('should return 400 for invalid task ID', async () => {
      const response = await request(app).get('/api/tasks/invalid');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid task ID is required');
    });
  });

  describe('POST /api/tasks', () => {
    test('should create a new task with all fields', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        due_date: '2025-12-31',
        completed: 0
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Task');
      expect(response.body.description).toBe('New Description');
      expect(response.body.due_date).toBe('2025-12-31');
      expect(response.body.completed).toBe(0);
      expect(response.body.id).toBeDefined();
    });

    test('should create task with only title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Minimal Task' });
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Minimal Task');
      expect(response.body.description).toBe('');
    });

    test('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Task title is required');
    });

    test('should return 400 when title is empty string', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Task title is required');
    });

    test('should trim whitespace from title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '  Trimmed Task  ' });
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Trimmed Task');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('should update all task fields', async () => {
      const tasks = db.prepare('SELECT * FROM tasks LIMIT 1').get();
      
      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
        due_date: '2026-01-01',
        completed: 1
      };
      
      const response = await request(app)
        .put(`/api/tasks/${tasks.id}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.description).toBe('Updated Description');
      expect(response.body.due_date).toBe('2026-01-01');
      expect(response.body.completed).toBe(1);
    });

    test('should update partial task fields', async () => {
      const tasks = db.prepare('SELECT * FROM tasks LIMIT 1').get();
      
      const response = await request(app)
        .put(`/api/tasks/${tasks.id}`)
        .send({ title: 'Only Title Updated' });
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Only Title Updated');
      expect(response.body.description).toBe(tasks.description);
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/99999')
        .send({ title: 'Updated' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('should return 400 when updating with empty title', async () => {
      const tasks = db.prepare('SELECT * FROM tasks LIMIT 1').get();
      
      const response = await request(app)
        .put(`/api/tasks/${tasks.id}`)
        .send({ title: '' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Task title cannot be empty');
    });

    test('should return 400 for invalid task ID', async () => {
      const response = await request(app)
        .put('/api/tasks/invalid')
        .send({ title: 'Updated' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid task ID is required');
    });
  });

  describe('PATCH /api/tasks/:id/toggle', () => {
    test('should toggle task from incomplete to complete', async () => {
      const task = db.prepare('SELECT * FROM tasks WHERE completed = 0 LIMIT 1').get();
      
      const response = await request(app).patch(`/api/tasks/${task.id}/toggle`);
      
      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(1);
    });

    test('should toggle task from complete to incomplete', async () => {
      const task = db.prepare('SELECT * FROM tasks WHERE completed = 1 LIMIT 1').get();
      
      const response = await request(app).patch(`/api/tasks/${task.id}/toggle`);
      
      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(0);
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(app).patch('/api/tasks/99999/toggle');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('should return 400 for invalid task ID', async () => {
      const response = await request(app).patch('/api/tasks/invalid/toggle');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid task ID is required');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('should delete an existing task', async () => {
      const task = db.prepare('SELECT * FROM tasks LIMIT 1').get();
      
      const response = await request(app).delete(`/api/tasks/${task.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(response.body.id).toBe(task.id);
      
      // Verify task is deleted
      const deleted = db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id);
      expect(deleted).toBeUndefined();
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(app).delete('/api/tasks/99999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('should return 400 for invalid task ID', async () => {
      const response = await request(app).delete('/api/tasks/invalid');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid task ID is required');
    });
  });

  describe('PUT /api/tasks/reorder', () => {
    test('should reorder multiple tasks', async () => {
      const tasks = db.prepare('SELECT * FROM tasks').all();
      
      const reorderData = {
        tasks: [
          { id: tasks[0].id, sort_order: 2 },
          { id: tasks[1].id, sort_order: 0 },
          { id: tasks[2].id, sort_order: 1 }
        ]
      };
      
      const response = await request(app)
        .put('/api/tasks/reorder')
        .send(reorderData);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tasks reordered successfully');
      
      // Verify new order
      const reordered = db.prepare('SELECT * FROM tasks ORDER BY sort_order ASC').all();
      expect(reordered[0].id).toBe(tasks[1].id);
      expect(reordered[1].id).toBe(tasks[2].id);
      expect(reordered[2].id).toBe(tasks[0].id);
    });

    test('should return 400 when tasks array is missing', async () => {
      const response = await request(app).put('/api/tasks/reorder').send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Tasks array is required');
    });

    test('should return 400 when tasks array is empty', async () => {
      const response = await request(app)
        .put('/api/tasks/reorder')
        .send({ tasks: [] });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Tasks array is required');
    });
  });
});
