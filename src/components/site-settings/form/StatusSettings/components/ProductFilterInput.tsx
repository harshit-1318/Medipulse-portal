import { Plus } from "lucide-react";
import type { ProductFilterInputProps } from "../types";

export const ProductFilterInput: React.FC<ProductFilterInputProps> = ({
    tempProductId,
    setTempProductId,
    handleAddProductId,
    handleRemoveProductId,
    productIds
}) => {
    return (
        <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">Allowed Product IDs</label>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 bg-slate-50 shrink-0 group-hover:border-indigo-400 transition-colors">
                    <Plus size={18} />
                </div>
                <div className="relative group flex-1">
                    <input
                        type="text"
                        value={tempProductId}
                        onChange={(e) => setTempProductId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProductId())}
                        placeholder="Type Product ID..."
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAddProductId}
                    className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-[14px] font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    Add
                </button>
            </div>
            <p className="text-[12px] text-slate-400 font-medium italic mt-2 ml-13">
                EXAMPLE IDS: 9754295501109, 9750521839925...
            </p>
            
            {/* Display Added Product IDs */}
            {productIds && productIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 ml-13 pt-2">
                    {productIds.split(',').map((id: string, index: number) => id.trim() && (
                        <div key={index} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-[14px] font-bold text-indigo-700 shadow-sm animate-in zoom-in-95 duration-200">
                            <span>{id.trim()}</span>
                            <button onClick={() => handleRemoveProductId(id.trim())} className="text-indigo-400 hover:text-red-500 ml-1 transition-colors">
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
