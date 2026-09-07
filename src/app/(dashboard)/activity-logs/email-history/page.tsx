'use client';

import ActivityLogsContent from '@/components/activity-logs/ActivityLogsContent';

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
