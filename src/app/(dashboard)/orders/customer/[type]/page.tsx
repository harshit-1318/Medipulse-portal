'use client';

import { use } from 'react';
import { FirstOrdersContent, RepeatOrdersContent, AllOrdersContent } from "@/components/orders-table";

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
