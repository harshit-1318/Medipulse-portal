import { ChevronDown, Layers } from "lucide-react";
import { useDropdown } from "@/components/orders-table/hooks";
import { CustomDropdownMenu } from "@/components/orders-table/ui";


export const StatusDropdown = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const { open, setOpen, triggerRef, dropdownRef } = useDropdown<HTMLButtonElement>();

    const options = [
        { label: "All Statuses", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ];

    const currentLabel = options.find((opt) => opt.value === value)?.label ?? "All Statuses";

    return (
        <div className="relative group">
            <Layers size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none z-10" />
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((prev: boolean) => !prev)}
                className={`w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 flex items-center justify-between group/btn focus:outline-none transition-all ${open ? "bg-white border-indigo-500 ring-4 ring-indigo-500/10" : "hover:border-slate-300 focus:bg-white focus:border-indigo-500"}`}
            >
                <span>{currentLabel}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180 text-indigo-600" : ""}`} />
            </button>

            <CustomDropdownMenu
                open={open}
                dropdownRef={dropdownRef}
                options={options}
                value={value}
                onChange={onChange}
                setOpen={setOpen}
            />
        </div>
    );
};
