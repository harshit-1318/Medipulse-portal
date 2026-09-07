import { normalizeCustomer } from "@/utils/helpers";
import type { OrderType } from "@/api/services/orders";

export function CustomerCell({ order }: { order: OrderType }) {
    const { name, email, id } = normalizeCustomer(order);

    return (
        <div className="flex flex-col items-center justify-center font-montserrat leading-tight text-center">
            <span className="text-[14px] font-semibold text-slate-900">{name}</span>
            <span className="text-[12px] text-slate-600">{email}</span>
            <span className="text-[11px] font-medium text-indigo-600">ID: {id}</span>
        </div>
    );
}
