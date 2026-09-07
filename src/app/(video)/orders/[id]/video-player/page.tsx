'use client';

import { use } from 'react';
import { VideoPlayerPage } from '@/components/order-details/components';

interface VideoPlayerRouteProps {
  params: Promise<{ id: string }>;
}

export default function VideoPlayerRoute({ params }: VideoPlayerRouteProps) {
  const { id } = use(params);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4">
      <VideoPlayerPage orderId={id} />
    </div>
  );
}
