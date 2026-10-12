import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { db } from '../db.js';
import { validateTaskInput, isUuid } from '../validate.js';

const router = Router();
const STATUSES = ['todo', 'in_progress', 'done'];

// FR-2: list tasks, newest first, optional ?status= filter
router.get('/', (req, res, next) => {
  try {
    const { status } = req.query;
    if (status !== undefined && !STATUSES.includes(status)) {
      return res.status(400).json({ error: 'invalid status filter' });
    }
    const rows = status
      ? db.prepare('SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC').all(status)
      : db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) { next(err); }
});

// FR-1: create task (id generated server-side, ADR-003/ADR-005)
router.post('/', (req, res, next) => {
  try {
    const error = validateTaskInput(req.body);
    if (error) return res.status(400).json({ error });
    const { title, description = null, status = 'todo', priority = 'medium' } = req.body;
    const id = randomUUID();
    db.prepare('INSERT INTO tasks (id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)')
      .run(id, title.trim(), description, status, priority);
    res.status(201).json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
  } catch (err) { next(err); }
});

// FR-3: get one task
router.get('/:id', (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ error: 'task not found' });
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) return res.status(404).json({ error: 'task not found' });
    res.json(task);
  } catch (err) { next(err); }
});

// FR-4: partial update
router.patch('/:id', (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ error: 'task not found' });
    const error = validateTaskInput(req.body, { partial: true });
    if (error) return res.status(400).json({ error });
    const fields = [];
    const values = [];
    for (const key of ['title', 'description', 'status', 'priority']) {
      if (req.body[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === 'title' ? req.body[key].trim() : req.body[key]);
      }
    }
    if (fields.length === 0) return res.status(400).json({ error: 'no updatable fields provided' });
    const result = db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`)
      .run(...values, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'task not found' });
    res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id));
  } catch (err) { next(err); }
});

// FR-5: delete task
router.delete('/:id', (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ error: 'task not found' });
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'task not found' });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
