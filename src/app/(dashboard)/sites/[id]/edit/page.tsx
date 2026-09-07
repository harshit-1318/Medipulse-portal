'use client';

import { use } from 'react';
import SiteSettingsPage from '@/components/site-settings/SiteSettingsPage';

interface EditSiteRouteProps {
  params: Promise<{ id: string }>;
}

export default function EditSiteRoute({ params }: EditSiteRouteProps) {
  const { id } = use(params);

  return (
    <div className="w-full h-full overflow-x-hidden">
      <SiteSettingsPage siteId={id} />
    </div>
  );
}
