import type { LucideIcon } from "lucide-react";

export interface StatusSettingsProps {
    form: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleSwitchChange: (name: string, checked: boolean) => void;
    handleSenderOverrideChange: (templateKey: string, value: string) => void;
}

export interface FormInputProps {
    label: string;
    name: string;
    placeholder: string;
    isPassword?: boolean;
    icon?: LucideIcon;
    value: string;
    onChange: (e: React.ChangeEvent<any>) => void;
    showTokens: Record<string, boolean>;
    toggleToken: (name: string) => void;
}

export interface ConfigCardProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

export interface ToggleSectionProps {
    label: string;
    name: string;
    checked: boolean;
    title: string;
    children: React.ReactNode;
    handleSwitchChange: (name: string, checked: boolean) => void;
}

export interface ProductFilterInputProps {
    tempProductId: string;
    setTempProductId: (value: string) => void;
    handleAddProductId: () => void;
    handleRemoveProductId: (id: string) => void;
    productIds: string;
}
