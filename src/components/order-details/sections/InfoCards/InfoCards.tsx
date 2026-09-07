import type { ApiResponse } from "@/components/order-details/types";
import { ContactCard } from "./components/ContactCard";
import { CustomerCard } from "./components/CustomerCard";
import { ProductsCard } from "./components/ProductsCard";

interface InfoCardsProps {
    orderInfo: ApiResponse["orderInfo"];
    customerInfo: ApiResponse["customerInfo"];
    products: ApiResponse["products"];
    formattedCreatedAt: string;
    repeatedOrders?: number;
    lastPreviousOrder?: ApiResponse["lastPreviousOrder"];
}

export function InfoCards({ orderInfo, customerInfo, products, formattedCreatedAt, repeatedOrders, lastPreviousOrder }: InfoCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-stretch">
            <ContactCard
                orderInfo={orderInfo}
                customerInfo={customerInfo}
                formattedCreatedAt={formattedCreatedAt}
                lastPreviousOrder={lastPreviousOrder}
            />
            <CustomerCard
                customerInfo={customerInfo}
            />
            <ProductsCard
                products={products}
            />
        </div>
    );
}

export { ContactCard, CustomerCard, ProductsCard };
