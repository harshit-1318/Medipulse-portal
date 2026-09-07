'use client';

import { use } from 'react';
import SiteDetailPage from '@/components/site-settings/SiteDetailPage';

interface SiteDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default function SiteDetailRoute({ params }: SiteDetailRouteProps) {
  const { id } = use(params);

  return (
    <div className="w-full h-full overflow-x-hidden">
      <SiteDetailPage siteId={id} />
    </div>
  );
}
