'use client';

import { ParkedOrdersContent } from "@/components/orders-table/views";

export default function ParkedOrdersPage() {
  return (
    <div className="w-full h-full overflow-x-hidden">
      <ParkedOrdersContent />
    </div>
  );
}
