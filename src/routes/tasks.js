import { Router } from 'express';
import { pool } from '../db.js';
import { validateTaskInput, isUuid } from '../validate.js';

const router = Router();

// FR-2: list tasks, newest first, optional ?status= filter
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    if (status !== undefined && !['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'invalid status filter' });
    }
    const result = status
      ? await pool.query('SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC', [status])
      : await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { next(err); }
});

// FR-1: create task
router.post('/', async (req, res, next) => {
  try {
    const error = validateTaskInput(req.body);
    if (error) return res.status(400).json({ error });
    const { title, description = null, status = 'todo' } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), description, status],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// FR-3: get one task
router.get('/:id', async (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ error: 'task not found' });
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'task not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// FR-4: partial update
router.patch('/:id', async (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ error: 'task not found' });
    const error = validateTaskInput(req.body, { partial: true });
    if (error) return res.status(400).json({ error });
    const fields = [];
    const values = [];
    for (const key of ['title', 'description', 'status']) {
      if (req.body[key] !== undefined) {
        values.push(key === 'title' ? req.body[key].trim() : req.body[key]);
        fields.push(`${key} = $${values.length}`);
      }
    }
    if (fields.length === 0) return res.status(400).json({ error: 'no updatable fields provided' });
    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'task not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// FR-5: delete task
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ error: 'task not found' });
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'task not found' });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
