import { APIRequestContext } from '@playwright/test';

export async function createTestEmployee(request: APIRequestContext, data: object) {
  const res = await request.post(`${process.env.API_URL}/api/employee`, { data });
  return res.json();
}

export async function createTestProposal(request: APIRequestContext, data: object) {
  const res = await request.post('http://localhost:5000/api/projectproposal', { data });
  return res.json();
}

export async function createTestSkill(request: APIRequestContext, data: object) {
  const res = await request.post('http://localhost:5000/api/skill', { data });
  return res.json();
}