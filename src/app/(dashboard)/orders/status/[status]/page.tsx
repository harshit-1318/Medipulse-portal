'use client';

import { use } from 'react';
import CancelledOrdersContent from "@/components/orders-table/views/order-status/CancelledOrdersContent";
import FulfilledOrdersContent from "@/components/orders-table/views/order-status/FulfilledOrdersContent";
import OnHoldOrdersContent from "@/components/orders-table/views/order-status/OnHoldOrdersContent";
import UnfulfilledOrdersContent from "@/components/orders-table/views/order-status/UnfulfilledOrdersContent";
import { AllOrdersContent } from "@/components/orders-table/views";

interface StatusOrdersPageProps {
  params: Promise<{ status: string }>;
}

export default function StatusOrdersPage({ params }: StatusOrdersPageProps) {
  const { status } = use(params);

  switch (status) {
    case 'cancelled':
      return <CancelledOrdersContent />;
    case 'fulfilled':
      return <FulfilledOrdersContent />;
    case 'on-hold':
      return <OnHoldOrdersContent />;
    case 'unfulfilled':
      return <UnfulfilledOrdersContent />;
    default:
      return <AllOrdersContent />;
  }
}
