'use client';

import { use } from 'react';
import UploadedDocsContent from "@/components/orders-table/views/document-status/UploadedDocsContent";
import NotUploadedDocsContent from "@/components/orders-table/views/document-status/NotUploadedDocsContent";
import { AllOrdersContent } from "@/components/orders-table/views";

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
