import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import type { OrderType } from "@/api/services/orders";
import type { PageType } from "../../types";
import { StatusCell } from "../../cells";
import { CustomerCell } from "../../cells";
import { ProductsCell } from "../../cells";
import { ActionsCell } from "../../cells";
import { DateCell } from "../../cells";
import { DocsCell } from "../../cells";
import { OrderIdCell } from "../../cells";
import {
  sortOrderId,
  sortOrderDate,
  sortStatus,
  sortCustomer,
  sortOrdersCount,
  sortProducts,
} from "../../utils/orderSorting";

export function useOrderColumns(pageType: PageType) {
  return useMemo<ColumnDef<OrderType>[]>(
    () => [
      {
        accessorKey: "id",
        sortingFn: sortOrderId,
        header: () => (
          <span className="text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80">ORDER ID</span>
        ),
        cell: ({ row }) => <OrderIdCell order={row.original} />,
      },
      {
        accessorKey: "date",
        sortingFn: sortOrderDate,
        header: () => (
          <span className="text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80">ORDER DATE</span>
        ),
        cell: ({ row }) => <DateCell dateStr={row.original.date} />,
      },
      {
        accessorKey: "status",
        sortingFn: sortStatus,
        header: () => (
          <span className="text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80">STATUS</span>
        ),
        cell: ({ row }) => <StatusCell status={row.original.fulfillment_status || row.original.status} />
      },
      {
        accessorKey: "customer",
        sortingFn: sortCustomer,
        header: () => (
          <span className="text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80">CUSTOMER</span>
        ),
        cell: ({ row }) => <CustomerCell order={row.original} />,
      },
      {
        accessorKey: "repeatedOrders",
        sortingFn: sortOrdersCount,
        header: () => (
          <span className="text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80">ORDERS</span>
        ),
        cell: ({ row }) => {
          const count = Number(row.original.repeatedOrders || 0);
          return count <= 0 ? (
            <span className="inline-block px-4 py-1.5 rounded-full text-[13px] font-medium bg-blue-50 text-blue-700 border border-blue-100/50 shadow-sm transition-all hover:bg-blue-100/50">
              First Order
            </span>
          ) : (
            <span className="inline-block px-4 py-1.5 rounded-full text-[13px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100/50 shadow-sm transition-all hover:bg-emerald-100/50">
              Repeat ({count + 1})
            </span>
          );
        },
      },
      {
        accessorKey: "products",
        id: "product",
        sortingFn: sortProducts,
        header: () => (
          <span className="text-[13px] font-extrabold font-montserrat tracking-widest whitespace-nowrap text-[#003B73]/80">PRODUCTS</span>
        ),
        cell: ({ row }) => <ProductsCell productsRaw={row.original.products} />,
      },
      {
        accessorKey: "documentsUploaded",
        enableSorting: false,
        header: () => (
          <span
            className="text-[13px] font-extrabold font-montserrat tracking-widest whitespace-nowrap text-[#003B73]/80"
            title="Document legend: ID, Full Photo, Video"
          >
            DOCS
          </span>
        ),
        cell: ({ row }) => (
          <DocsCell
            uploaded={Boolean(row.original.documentsUploaded)}
            documentItemsStatus={row.original.documentItemsStatus}
          />
        ),
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => (
          <span className="text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80">ACTIONS</span>
        ),
        cell: ({ row }) => <ActionsCell order={row.original} />,
      },
    ],
    [pageType],
  );
}
