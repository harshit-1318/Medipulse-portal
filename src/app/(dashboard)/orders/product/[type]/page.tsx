'use client';

import { use } from 'react';
import InjectableOrdersContent from "@/components/orders-table/views/product-type/InjectableOrdersContent";
import OralOrdersContent from "@/components/orders-table/views/product-type/OralOrdersContent";
import { AllOrdersContent } from "@/components/orders-table/views";

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
