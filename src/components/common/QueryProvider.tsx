'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CanonicalQueryProvider from '@/components/providers/QueryProvider';
import '@/utils/http';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    let hasParentClient = false;
    try {
        hasParentClient = Boolean(useQueryClient());
    } catch {
        hasParentClient = false;
    }

    if (hasParentClient) {
        return <>{children}</>;
    }

    return <CanonicalQueryProvider>{children}</CanonicalQueryProvider>;
};

export default QueryProvider;

