'use client';

import dynamic from 'next/dynamic';

const ActivityLogsContent = dynamic(
  () => import('@/components/activity-logs/ActivityLogsContent'),
  { ssr: false }
);

export default function EmailHistoryRoute() {
  return (
    <div className="w-full h-full overflow-x-hidden">
      <ActivityLogsContent
        title="Email History"
        storageSuffix="activity_logs_email_history"
        defaultAction="email_sent"
      />
    </div>
  );
}
