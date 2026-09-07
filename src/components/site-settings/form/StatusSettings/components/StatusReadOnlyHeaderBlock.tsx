import { StatusDropdown } from "./StatusDropdown";

interface StatusReadOnlyHeaderBlockProps {
    isActive: boolean;
    readOnly: boolean;
    handleSwitchChange: (key: string, value: any) => void;
}

export function StatusReadOnlyHeaderBlock({ isActive, readOnly, handleSwitchChange }: StatusReadOnlyHeaderBlockProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2 border-b border-slate-200/60 w-full items-end">
            <div className="space-y-1.5 w-full">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                    <span>Status</span>
                    <span className="text-[11px] text-red-500 normal-case tracking-normal font-medium">Required</span>
                </label>
                <StatusDropdown 
                    value={isActive} 
                    onChange={(val) => handleSwitchChange('is_active', val)} 
                />
            </div>

            <div className="space-y-1.5 w-full mb-0.5">
                <div className="flex items-center justify-between h-10 px-2 lg:pl-4">
                    <div className="space-y-1">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">Read Only Mode</label>
                        <p className="text-[11px] font-medium text-slate-400 ml-1 leading-tight">Only Super Admins can change this.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleSwitchChange('read_only', !readOnly)}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${readOnly ? 'bg-amber-500' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${readOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}
