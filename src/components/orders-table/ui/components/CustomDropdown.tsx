import type { ElementType } from "react";
import { useDropdown } from "../../hooks";
import { CustomDropdownMenu } from "./CustomDropdownMenu";
export type DropdownOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type CustomDropdownProps = {
    label: string;
    icon: ElementType;
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
    disabled?: boolean;
};

export default function CustomDropdown({
    label,
    icon: Icon,
    value,
    onChange,
    options,
    disabled = false,
}: CustomDropdownProps) {
    const { open, setOpen, triggerRef, dropdownRef } = useDropdown<HTMLButtonElement>();

    const currentLabel = options.find((opt) => opt.value === value)?.label ?? options[0]?.label ?? "Select";

    return (
        <div className={`flex flex-col gap-1 select-none relative ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider truncate">{label}</label>

            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((prev: boolean) => !prev)}
                className="w-full h-9.5 pl-10 pr-9 bg-slate-50/70 border border-slate-200 rounded-xl text-[13.5px] font-semibold text-slate-800 flex items-center relative hover:border-slate-300 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 group/btn shadow-xs"
            >
                <div className="absolute left-2.5 w-6 h-6 flex items-center justify-center bg-white rounded-md border border-slate-200/80 group-hover/btn:bg-[#00a294]/10 group-hover/btn:border-[#00a294]/30 group-hover/btn:text-[#00a294] transition-colors">
                    <Icon className="h-3.5 w-3.5 text-slate-400 group-hover/btn:text-[#00a294] transition-colors" />
                </div>
                <span className="flex-1 text-left whitespace-nowrap overflow-hidden ml-1.5">{currentLabel}</span>
                <svg
                    className={`w-3.5 h-3.5 absolute right-3 transition-transform duration-300 ${open ? "rotate-180 text-[#00a294]" : "rotate-0 text-slate-400"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
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
}
