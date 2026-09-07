import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const role = cookieStore.get('role')?.value;

  if (!token) {
    redirect('/login');
  }

  if (role === 'super_admin') {
    redirect('/super-dashboard');
  }

  redirect('/dashboard');
}
