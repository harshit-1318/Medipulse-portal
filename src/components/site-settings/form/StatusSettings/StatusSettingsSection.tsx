import { Settings2 } from "lucide-react";
import type { StatusSettingsProps } from "./types";
import { useStatusSettings } from "./hooks/useStatusSettings";
import { StatusReadOnlyHeaderBlock } from "./components/StatusReadOnlyHeaderBlock";
import { StatusIntegrationsList } from "./components/StatusIntegrationsList";

export const StatusSettingsSection: React.FC<StatusSettingsProps> = ({ 
    form, 
    handleChange, 
    handleSwitchChange,
    handleSenderOverrideChange,
}) => {
    const {
        showTokens,
        toggleToken,
        tempProductId,
        setTempProductId,
        handleAddProductId,
        handleRemoveProductId
    } = useStatusSettings(form, handleSwitchChange);

    return (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Settings2 size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Status & Integrations</h3>
            </div>
            
            <div className="p-5 flex flex-col gap-5 flex-1">
                <StatusReadOnlyHeaderBlock
                    isActive={form.is_active}
                    readOnly={form.read_only}
                    handleSwitchChange={handleSwitchChange}
                />

                <StatusIntegrationsList
                    form={form}
                    handleChange={handleChange}
                    handleSwitchChange={handleSwitchChange}
                    handleSenderOverrideChange={handleSenderOverrideChange}
                    showTokens={showTokens}
                    toggleToken={toggleToken}
                    tempProductId={tempProductId}
                    setTempProductId={setTempProductId}
                    handleAddProductId={handleAddProductId}
                    handleRemoveProductId={handleRemoveProductId}
                />
            </div>
        </div>
    );
};

