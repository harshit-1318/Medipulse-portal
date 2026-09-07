import { expect } from 'vitest';
import { GET as getUsersRoute, POST as postUsersRoute } from '@/app/api/users/route';

export async function verifyRestrictedApiOperations(token: string, isSuperAdmin: boolean) {
  const createReq = new Request('http://localhost:3000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: 'Malicious Injected User',
      email: `injected_${Date.now()}@hack.com`,
      role: 'super_admin',
      password: 'Password123!',
    }),
  });

  const createRes = await postUsersRoute(createReq);
  if (isSuperAdmin) {
    expect([200, 201]).toContain(createRes.status);
    const resBody = await createRes.json();
    const createdId = resBody?.data?._id || resBody?.data?.id;
    if (createdId) {
      const { User } = await import('@/lib/db/models/User');
      await User.findByIdAndDelete(createdId);
    }
  } else {
    expect(createRes.status).toBe(403);
    const errBody = await createRes.json();
    expect(errBody.message).toContain('Super Admin access required');
  }

  const listReq = new Request('http://localhost:3000/api/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listRes = await getUsersRoute(listReq);
  expect(listRes.status).toBe(isSuperAdmin ? 200 : 403);
}
