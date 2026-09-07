'use client';

import { use } from 'react';
import FirstOrdersContent from "@/components/orders-table/views/customer-orders/FirstOrdersContent";
import RepeatOrdersContent from "@/components/orders-table/views/customer-orders/RepeatOrdersContent";
import { AllOrdersContent } from "@/components/orders-table/views";

interface CustomerOrdersPageProps {
  params: Promise<{ type: string }>;
}

export default function CustomerOrdersPage({ params }: CustomerOrdersPageProps) {
  const { type } = use(params);

  switch (type) {
    case 'first':
      return <FirstOrdersContent />;
    case 'repeat':
      return <RepeatOrdersContent />;
    default:
      return <AllOrdersContent />;
  }
}
