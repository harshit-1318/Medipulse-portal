export interface BreadcrumbItem {
    label: string;
    path: string;
}

export const routeMap: Record<string, string> = {
    'orders': 'Orders Filters',
    'status': 'Order Status',
    'document': 'Document Status',
    'customer': 'Customer Orders',
    'product': 'Product Type',
    'category': 'Categories',
    'sites': 'Sites',
    'users': 'Users',
    'docman-jobs': 'Docman Jobs',
    'surveys': 'Surveys',
    'create': 'Create'
};

export const parseBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const filteredSegments = segments.filter(s => s !== 'view');

    return filteredSegments.map((segment) => {
        const path = `/${segments.slice(0, segments.indexOf(segment) + 1).join('/')}`;
        const label = routeMap[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '));
        return { label, path };
    });
};
