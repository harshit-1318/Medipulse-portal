import { ChevronDown } from "lucide-react";
import { useDropdown } from "@/components/orders-table/hooks";
import { CustomDropdownMenu } from "@/components/orders-table/ui";


interface StatusDropdownProps {
    value: boolean;
    onChange: (val: boolean) => void;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ value, onChange }) => {
    const { open, setOpen, triggerRef, dropdownRef } = useDropdown<HTMLButtonElement>();

    const options = [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
    ];

    const currentLabel = value ? "Active" : "Inactive";

    return (
        <div className="relative group">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((prev: boolean) => !prev)}
                className={`w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 flex items-center justify-between group/btn focus:outline-none transition-all ${open ? "bg-white border-indigo-500 ring-4 ring-indigo-500/10" : "hover:border-slate-300 focus:bg-white focus:border-indigo-500"}`}
            >
                <span>{currentLabel}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180 text-indigo-600" : ""}`} />
            </button>

            <CustomDropdownMenu
                open={open}
                dropdownRef={dropdownRef}
                options={options}
                value={value ? "true" : "false"}
                onChange={(val) => {
                    onChange(val === "true");
                }}
                setOpen={setOpen}
            />
        </div>
    );
};
