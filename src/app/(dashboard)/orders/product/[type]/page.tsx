'use client';

import { use } from 'react';
import { InjectableOrdersContent, OralOrdersContent, AllOrdersContent } from "@/components/orders-table";

interface ProductOrdersPageProps {
  params: Promise<{ type: string }>;
}

export default function ProductOrdersPage({ params }: ProductOrdersPageProps) {
  const { type } = use(params);

  switch (type) {
    case 'injectable':
      return <InjectableOrdersContent />;
    case 'oral':
      return <OralOrdersContent />;
    default:
      return <AllOrdersContent />;
  }
}
