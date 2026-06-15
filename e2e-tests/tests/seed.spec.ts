import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5000';

test('seed — API is reachable', async ({ request }) => {
  const res = await request.get(`${API}/health`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe('ok');
});