import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/services/orders';

export function useRecentOrders() {
    const { data: orderResponse, isLoading: loading } = useQuery({
        queryKey: ['recent-orders'],
        queryFn: () => getOrders(1, {
            orderId: "", status: "", customer: "", products: "", category: "", documents: "", startDate: "", endDate: "", repeatedOrders: "all", sortBy: "date", sort: "desc"
        }),
        refetchOnMount: 'always',
    });

    const orders = orderResponse?.orders || [];

    // Fallback dummy data if nothing loads
    const displayOrders = orders.length > 0 ? orders.slice(0, 5) : [
        {
            id: "#1205",
            date: "24-02-2026",
            status: "ON HOLD",
            customer: { first_name: "Himani", last_name: ".", email: "himani@example.com", id: "7643682537541" },
            repeatedOrders: 2,
            products: "Wegovy® Injectable Pen",
            documents: "Uploaded"
        },
        {
            id: "#1204",
            date: "24-02-2026",
            status: "ON HOLD",
            customer: { first_name: "Himani", last_name: ".", email: "himani@example.com", id: "7643682537541" },
            repeatedOrders: 2,
            products: "Wegovy® Injectable Pen",
            documents: "Uploaded"
        },
        {
            id: "#1203",
            date: "24-02-2026",
            status: "ON HOLD",
            customer: { first_name: "Himani", last_name: ".", email: "himani@example.com", id: "7643682537541" },
            repeatedOrders: 2,
            products: "Wegovy® Injectable Pen",
            documents: "Uploaded"
        }
    ] as any[];

    return { orders: displayOrders, loading };
}
