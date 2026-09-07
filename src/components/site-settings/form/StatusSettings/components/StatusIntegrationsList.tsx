import React from "react";
import { KeyRound, Globe, Link, Lock, Server, User, Mail } from "lucide-react";
import { FormInput } from "./FormInput";
import { ToggleSection } from "./ToggleSection";
import { ProductFilterInput } from "./ProductFilterInput";
import { SenderOverridesSection } from "./SenderOverridesSection";

interface StatusIntegrationsListProps {
    form: any;
    handleChange: (e: any) => void;
    handleSwitchChange: (name: string, checked: boolean) => void;
    handleSenderOverrideChange?: (key: string, value: string) => void;
    showTokens: Record<string, boolean>;
    toggleToken: (tokenKey: string) => void;
    tempProductId: string;
    setTempProductId: (v: string) => void;
    handleAddProductId: () => void;
    handleRemoveProductId: (id: string) => void;
}

export const StatusIntegrationsList: React.FC<StatusIntegrationsListProps> = ({
    form,
    handleChange,
    handleSwitchChange,
    handleSenderOverrideChange,
    showTokens,
    toggleToken,
    tempProductId,
    setTempProductId,
    handleAddProductId,
    handleRemoveProductId,
}) => {
    const renderFormInput = (label: string, name: string, placeholder: string, icon: any, isPassword = false) => (
        <FormInput
            label={label}
            name={name}
            placeholder={placeholder}
            icon={icon}
            isPassword={isPassword}
            value={form[name] || ''}
            onChange={handleChange}
            showTokens={showTokens}
            toggleToken={toggleToken}
        />
    );

    return (
        <div className="flex flex-col">
            <ToggleSection label="Enable Daily.co Integration" name="enableDailyCo" checked={form.enableDailyCo} title="Daily.co Configuration" handleSwitchChange={handleSwitchChange}>
                {renderFormInput("Daily API Key", "dailyCoSecretKey", "Enter Daily API Key", KeyRound, true)}
                {renderFormInput("Daily Domain", "dailyCoDomain", "api.daily.co", Globe)}
                {renderFormInput("Daily Webhook HMAC", "dailyCoWebhookHMAC", "Enter Webhook HMAC", Lock, true)}
                {renderFormInput("Daily Webhook URL", "dailyCoWebhookUrl", "https://example.com/webhook", Link)}
                {renderFormInput("Daily Subdomain", "dailyCoSubdomain", "your-subdomain", Globe)}
            </ToggleSection>

            <ToggleSection label="Enable Docman Jobs" name="enableDocmanJobs" checked={form.enableDocmanJobs} title="Docman Jobs Configuration" handleSwitchChange={handleSwitchChange}>
                {renderFormInput("Jobs API Token", "jobsApiToken", "Jobs API Token", KeyRound, true)}
            </ToggleSection>

            <ToggleSection label="Enable Mailing Configuration" name="enableMailing" checked={form.enableMailing} title="Mail Configuration" handleSwitchChange={handleSwitchChange}>
                {renderFormInput("MAIL_HOST", "mailHost", "MAIL_HOST", Server)}
                {renderFormInput("MAIL_PORT", "mailPort", "MAIL_PORT", Server)}
                {renderFormInput("MAIL_USERNAME", "mailUsername", "MAIL_USERNAME", User)}
                {renderFormInput("MAIL_PASSWORD", "mailPassword", "MAIL_PASSWORD", Lock, true)}
                {renderFormInput("FROM ADDRESS", "mailFromAddress", "FROM ADDRESS", Mail)}
                {renderFormInput("FROM NAME", "mailFromName", "FROM NAME", User)}
                <SenderOverridesSection
                    senderOverrides={form.senderOverrides || {}}
                    onChange={handleSenderOverrideChange || (() => {})}
                />
            </ToggleSection>

            <ToggleSection label="Enable Lexis Nexis Integration" name="enableLexisNexis" checked={form.enableLexisNexis} title="Lexis Nexis Configuration" handleSwitchChange={handleSwitchChange}>
                {renderFormInput("LEXIS_NEXIS_URL", "lexisNexisUrl", "LEXIS_NEXIS_URL", Link)}
                <div className="hidden md:block"></div>
                {renderFormInput("LEXIS_NEXIS_USERNAME", "lexisNexisUsername", "LEXIS_NEXIS_USERNAME", User)}
                <div className="hidden md:block"></div>
                {renderFormInput("LEXIS_NEXIS_PASSWORD", "lexisNexisPassword", "LEXIS_NEXIS_PASSWORD", Lock, true)}
            </ToggleSection>

            <ToggleSection label="Enable Klaviyo Configuration" name="enableKlaviyo" checked={form.enableKlaviyo} title="Klaviyo Configuration" handleSwitchChange={handleSwitchChange}>
                {renderFormInput("Klaviyo API Key", "klaviyoApiKey", "Enter Klaviyo API Key", KeyRound, true)}
            </ToggleSection>

            <ToggleSection label="Enable Product Filtering" name="enableProductFilter" checked={form.enableProductFilter} title="Product Filtering Configuration" handleSwitchChange={handleSwitchChange}>
                <ProductFilterInput 
                    tempProductId={tempProductId}
                    setTempProductId={setTempProductId}
                    handleAddProductId={handleAddProductId}
                    handleRemoveProductId={handleRemoveProductId}
                    productIds={form.product_ids || ''}
                />
            </ToggleSection>
        </div>
    );
};
