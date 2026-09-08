'use client';

import { use } from 'react';
import {
  CancelledOrdersContent,
  FulfilledOrdersContent,
  OnHoldOrdersContent,
  UnfulfilledOrdersContent,
  AllOrdersContent,
} from "@/components/orders-table";

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
