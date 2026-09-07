import { useEffect, useState } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useGlobalLoader } from '@/store';
import { useCurrentOrderLabel } from '@/store';
import { type BreadcrumbItem, parseBreadcrumbs, routeMap } from './BreadcrumbUtils';
import { BreadcrumbDropdown } from './BreadcrumbDropdown';
import { ordersFiltersMenu } from '../sidebar/menus/ordersFilters';
import { orderStatusMenu } from '../sidebar/menus/orderStatus';
import { documentStatusMenu } from '../sidebar/menus/documentStatus';
import { customerOrdersMenu } from '../sidebar/menus/customerOrders';
import { productTypeMenu } from '../sidebar/menus/productType';
import { categoriesMenu } from '../sidebar/menus/categories';
import { sitesMenu } from '../sidebar/menus/sitesMenu';
import { surveysMenu } from '../sidebar/menus/surveys';
import { usersMenu } from '../sidebar/menus/usersMenu';

export default function Breadcrumb() {
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const isLoading = useGlobalLoader(state => state.loading);
    const currentOrderLabel = useCurrentOrderLabel();

    useEffect(() => {
        const handlePathChange = () => {
            if (typeof window !== 'undefined') {
                setBreadcrumbs(parseBreadcrumbs(window.location.pathname));
            }
        };
        handlePathChange();
        window.addEventListener('popstate', handlePathChange);
        return () => window.removeEventListener('popstate', handlePathChange);
    }, []);

    if (isLoading) return null;

    const isDashboard = breadcrumbs.length === 0 || (breadcrumbs.length === 1 && breadcrumbs[0].path === '/dashboard');
    if (isDashboard) return <nav className="flex items-center text-sm font-montserrat"><span className="text-slate-800 font-bold tracking-tight">Dashboard</span></nav>;

    return (
        <nav className="flex items-center text-sm font-montserrat space-x-1.5">
            <a href="/dashboard" className="text-slate-400 hover:text-[#3eb489] transition-colors flex items-center">
                <span className="text-[18px] font-bold text-[#3eb489] mr-2">|</span><Home size={15} />
            </a>

            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const menuKey = Object.keys(routeMap).find(key => routeMap[key] === crumb.label);
                const currentMenu = menuKey ? { 
                    'orders': ordersFiltersMenu, 
                    'status': orderStatusMenu, 
                    'document': documentStatusMenu, 
                    'customer': customerOrdersMenu, 
                    'product': productTypeMenu, 
                    'category': categoriesMenu,
                    'sites': sitesMenu,
                    'users': usersMenu,
                    'surveys': surveysMenu
                }[menuKey] : null;

                return (
                    <div key={crumb.path} className="flex items-center space-x-1.5">
                        <ChevronRight size={14} className="text-slate-300" />
                        {currentMenu ? (
                            <BreadcrumbDropdown 
                                label={crumb.label} isOpen={openDropdown === crumb.label} isLast={isLast} 
                                onToggle={() => setOpenDropdown(openDropdown === crumb.label ? null : crumb.label)} 
                                menu={currentMenu} 
                            />
                        ) : isLast ? (
                            <span className="text-slate-700 font-semibold tracking-tight">
                                {currentOrderLabel && /^\d+$/.test(crumb.label) ? currentOrderLabel : crumb.label}
                            </span>
                        ) : <a href={crumb.path} className="text-slate-400 hover:text-[#3eb489] font-medium transition-colors">{crumb.label}</a>}
                    </div>
                );
            })}
        </nav>
    );
}
