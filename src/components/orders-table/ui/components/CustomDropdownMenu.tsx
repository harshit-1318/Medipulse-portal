import { type RefObject } from "react";
import type { DropdownOption } from "./CustomDropdown";

type CustomDropdownMenuProps = {
    open: boolean;
    dropdownRef: RefObject<HTMLDivElement | null>;
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    setOpen: (open: boolean) => void;
};

export function CustomDropdownMenu({
    open,
    dropdownRef,
    options,
    value,
    onChange,
    setOpen,
}: CustomDropdownMenuProps) {
    if (!open) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.12)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 origin-top backdrop-blur-3xl"
        >
            <ul className="p-2 text-[13px] font-bold text-slate-700 max-h-64 overflow-y-auto custom-scrollbar">
                {options.map((opt) => {
                    const isActive = opt.value === value;
                    return (
                        <li key={opt.value} className="px-1">
                            <button
                                type="button"
                                disabled={isActive || opt.disabled}
                                onClick={() => {
                                    if (!opt.disabled) {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }
                                }}
                                className={`
                                    w-full px-4 py-3 rounded-xl text-left transition-all duration-300 flex items-center justify-between group/opt
                                    ${isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 cursor-default pointer-events-none"
                                        : opt.disabled
                                        ? "opacity-50 cursor-not-allowed text-slate-400"
                                        : "hover:bg-indigo-50 hover:text-indigo-600"
                                    }
                                `}
                            >
                                <span className={isActive ? "translate-x-1" : (opt.disabled ? "" : "group-hover/opt:translate-x-1 transition-transform")}>{opt.label}</span>
                                {isActive ? (
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                ) : (
                                    <div className={`w-1.5 h-1.5 rounded-full bg-slate-200 ${opt.disabled ? "" : "group-hover/opt:bg-indigo-400"} transition-colors`} />
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
