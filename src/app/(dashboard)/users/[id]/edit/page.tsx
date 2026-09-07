'use client';

import { use } from 'react';
import UserFormPage from '@/components/users/pages/UserFormPage';

interface EditUserRouteProps {
  params: Promise<{ id: string }>;
}

export default function EditUserRoute({ params }: EditUserRouteProps) {
  const { id } = use(params);

  return (
    <div className="w-full h-full overflow-x-hidden">
      <UserFormPage userId={id} />
    </div>
  );
}
