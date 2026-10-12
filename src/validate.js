// Input validation per spec/contracts/tasks-api.yaml (NFR-1)
const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high']; // spec 001: TaskPriority

export function validateTaskInput(body, { partial = false } = {}) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return 'request body must be a JSON object';
  }
  const allowed = ['title', 'description', 'status', 'priority'];
  for (const key of Object.keys(body)) {
    if (!allowed.includes(key)) return `unknown field: ${key}`;
  }
  if (!partial && (typeof body.title !== 'string' || body.title.trim().length < 1)) {
    return 'title is required';
  }
  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length < 1 || body.title.length > 200) {
      return 'title must be 1-200 characters';
    }
  }
  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string' || body.description.length > 2000) {
      return 'description must be at most 2000 characters';
    }
  }
  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    return `status must be one of: ${STATUSES.join(', ')}`;
  }
  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    return `priority must be one of: ${PRIORITIES.join(', ')}`;
  }
  return null;
}

export function isUuid(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
