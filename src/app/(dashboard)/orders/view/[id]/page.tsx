'use client';

import { use } from 'react';
import OrderDetailsPage from '@/components/order-details';

interface OrderDetailsRouteProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsRoute({ params }: OrderDetailsRouteProps) {
  const { id } = use(params);

  return (
    <div className="w-full h-full min-h-screen bg-slate-50">
      <OrderDetailsPage orderId={id} />
    </div>
  );
}
