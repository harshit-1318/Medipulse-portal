'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoleCredentialsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/super-admin/role-credentials');
  }, [router]);

  return (
    <div className="flex items-center justify-center p-12 text-slate-500 font-medium">
      Redirecting to Role Credentials...
    </div>
  );
}
