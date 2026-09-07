import type { OrderProduct } from "@/api/services/orders";

export function ProductsCell({ productsRaw }: { productsRaw: any }) {

    // 1. Normalize input to array
    let products: OrderProduct[] = [];
    
    if (Array.isArray(productsRaw)) {
        products = productsRaw;
    } else if (typeof productsRaw === "string") {
        if (productsRaw.trim() !== "" && productsRaw.toUpperCase() !== "N/A") {
            try {
                const parsed = JSON.parse(productsRaw);
                if (Array.isArray(parsed)) products = parsed;
                else if (typeof parsed === "object") products = [parsed as any];
                else products = [{ name: String(parsed) }];
            } catch {
                products = [{ name: productsRaw }];
            }
        }
    } else if (productsRaw && typeof productsRaw === "object") {
        // Handle single object case
        products = [productsRaw];
    }

    // 2. Filter out shipment protection
    products = products.filter(p => p && p.name && !p.name.toLowerCase().includes('shipment'));

    // 3. Handle empty state
    if (products.length === 0) {
        // Fallback: If we have a raw object that we couldn't parse but it has something
        const displayRaw = productsRaw ? (typeof productsRaw === 'object' ? JSON.stringify(productsRaw) : String(productsRaw)) : "";
        
        if (displayRaw && displayRaw !== "{}" && displayRaw !== "[]" && displayRaw.toUpperCase() !== "N/A") {
             return (
                <div className="flex flex-col items-center justify-center py-0.5 min-w-45 max-w-60 text-center">
                    <span className="text-[13px] font-medium text-slate-700 font-montserrat whitespace-normal wrap-break-word">
                        {displayRaw.length > 50 ? displayRaw.substring(0, 50) + "..." : displayRaw}
                    </span>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center py-0.5 min-w-45">
                <span className="text-slate-400 font-medium italic text-[13px]">No Products Found</span>
            </div>
        );
    }

    // 3. Render list
    return (
        <div className="flex flex-col items-center justify-center py-0.5 gap-0.5 min-w-45 max-w-60 text-center">
            {products.map((p, idx) => (
                <div key={`${p.name || idx}-${idx}`} className="flex flex-col items-center leading-tight">
                    <span className="text-[13px] font-medium text-slate-700 font-montserrat whitespace-normal wrap-break-word">
                        {p.name || "Unknown Product"}
                    </span>
                    {p.quantity && p.quantity > 1 && (
                        <span className="text-[11px] text-slate-500 font-medium italic">Qty: {p.quantity}</span>
                    )}
                </div>
            ))}
        </div>
    );
}
