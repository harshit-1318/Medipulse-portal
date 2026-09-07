'use client';

import { use } from 'react';
import UserDetailPage from '@/components/users/pages/UserDetailPage';

interface UserDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailRoute({ params }: UserDetailRouteProps) {
  const { id } = use(params);

  return (
    <div className="w-full h-full overflow-x-hidden">
      <UserDetailPage userId={id} />
    </div>
  );
}
