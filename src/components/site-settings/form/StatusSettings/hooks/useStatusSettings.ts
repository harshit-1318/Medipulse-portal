import { useState, useCallback } from "react";

export const useStatusSettings = (form: any, handleSwitchChange: (name: string, checked: boolean) => void) => {
    // Password visibility state
    const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

    const toggleToken = useCallback((name: string) => {
        setShowTokens(prev => ({ ...prev, [name]: !prev[name] }));
    }, []);

    // Product ID Filtering logic
    const [tempProductId, setTempProductId] = useState("");

    const handleAddProductId = useCallback(() => {
        if (!tempProductId.trim()) return;
        const currentIds = form.product_ids 
            ? form.product_ids.split(',').map((id: string) => id.trim()).filter(Boolean) 
            : [];
            
        if (!currentIds.includes(tempProductId.trim())) {
            currentIds.push(tempProductId.trim());
            handleSwitchChange('product_ids', currentIds.join(', '));
        }
        setTempProductId("");
    }, [tempProductId, form.product_ids, handleSwitchChange]);

    const handleRemoveProductId = useCallback((idToRemove: string) => {
        const currentIds = form.product_ids 
            ? form.product_ids.split(',').map((id: string) => id.trim()).filter(Boolean) 
            : [];
        const newIds = currentIds.filter((id: string) => id !== idToRemove);
        handleSwitchChange('product_ids', newIds.join(', '));
    }, [form.product_ids, handleSwitchChange]);

    return {
        showTokens,
        toggleToken,
        tempProductId,
        setTempProductId,
        handleAddProductId,
        handleRemoveProductId
    };
};
