import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { CustomSelectDropdown } from './CustomSelectDropdown';
import { useCustomSelectNav } from './useCustomSelectNav';
import { CustomSelectTrigger } from './CustomSelectTrigger';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    name: string;
    value: string;
    options: Option[];
    onChange: (e: any) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    icon?: React.ReactNode;
}

export default function CustomSelect({
    name,
    value,
    options,
    onChange,
    placeholder = 'Select option',
    disabled = false,
    error = false,
    icon
}: CustomSelectProps) {
    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (optionValue: string) => {
        onChange({
            target: {
                name,
                value: optionValue
            }
        });
        setIsOpen(false);
    };

    const {
        isOpen,
        setIsOpen,
        highlightedIndex,
        setHighlightedIndex,
        containerRef,
        handleKeyDown,
    } = useCustomSelectNav(disabled, options, handleSelect);

    return (
        <div 
            className="relative w-full" 
            ref={containerRef}
            onKeyDown={handleKeyDown}
        >
            <CustomSelectTrigger
                disabled={disabled}
                isOpen={isOpen}
                error={error}
                icon={icon}
                selectedOption={selectedOption}
                placeholder={placeholder}
                onClick={() => setIsOpen(!isOpen)}
            />

            <AnimatePresence>
                {isOpen && (
                    <CustomSelectDropdown
                        options={options}
                        value={value}
                        highlightedIndex={highlightedIndex}
                        setHighlightedIndex={setHighlightedIndex}
                        onSelect={handleSelect}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

