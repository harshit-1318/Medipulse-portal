'use client';

import dynamic from 'next/dynamic';

const ActivityLogsContent = dynamic(
  () => import('@/components/activity-logs/ActivityLogsContent'),
  { ssr: false }
);

export default function ActivityLogsRoute() {
  return (
    <div className="w-full h-full overflow-x-hidden">
      <ActivityLogsContent />
    </div>
  );
}
