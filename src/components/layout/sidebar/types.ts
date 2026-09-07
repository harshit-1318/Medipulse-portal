export type NavItem = {
    title: string;
    path: string;
    icon: any;
    role?: string[];
    children?: NavItem[];
    dropdown?: boolean;
    color?: string;
};
