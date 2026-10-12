import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/tasks', tasksRouter);

// Contract-shaped error handler (NFR-1)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`TaskFlow API listening on http://localhost:${port}/api`));
