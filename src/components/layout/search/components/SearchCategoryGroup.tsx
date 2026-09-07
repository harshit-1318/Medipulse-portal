import React from 'react';
import { SectionHeader } from './SearchRowItems';

interface SearchCategoryGroupProps {
    icon: React.ReactNode;
    label: string;
    count: number;
    children: React.ReactNode;
    isTop?: boolean;
}

export function SearchCategoryGroup({ icon, label, count, children, isTop = false }: SearchCategoryGroupProps) {
    return (
        <div className={isTop ? 'mt-2' : ''}>
            <SectionHeader
                icon={icon}
                label={label}
                count={count}
            />
            {children}
        </div>
    );
}
