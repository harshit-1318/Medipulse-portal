'use client';

import { use } from 'react';
import { UploadedDocsContent, NotUploadedDocsContent, AllOrdersContent } from "@/components/orders-table";

interface DocumentOrdersPageProps {
  params: Promise<{ type: string }>;
}

export default function DocumentOrdersPage({ params }: DocumentOrdersPageProps) {
  const { type } = use(params);

  switch (type) {
    case 'uploaded':
      return <UploadedDocsContent />;
    case 'not-uploaded':
      return <NotUploadedDocsContent />;
    default:
      return <AllOrdersContent />;
  }
}
