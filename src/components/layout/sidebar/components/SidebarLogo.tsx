import React, { useState, useEffect } from 'react';
import { BRANDING } from '@/utils/branding';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';
import { useSiteInfo, useUserInfo } from '@/store';

interface SidebarLogoProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function SidebarLogo({ isCollapsed, onToggle }: SidebarLogoProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const siteInfo = useSiteInfo();
    const userInfo = useUserInfo();
    const isSuper = Boolean(
        userInfo?.is_super_admin ||
        userInfo?.effectiveRole === 'super_admin' ||
        userInfo?.role === 'super_admin'
    );
    const homeUrl = (mounted && isSuper) ? '/super-dashboard' : '/dashboard';

    const rawLogo = (siteInfo.logo || '').trim();
    const isDarkVariant = rawLogo === '/medipulse-logo-dark.svg' || rawLogo.includes('logo-dark') || rawLogo === '/rxLogoDark.svg';
    const isStandardSvg = rawLogo === '/medipulse-logo-dark.svg' || rawLogo === '/medipulse-logo.svg' || rawLogo === '/rxLogoDark.svg' || rawLogo === '/rxLogo.svg' || rawLogo === '/logo.png' || rawLogo === '/favicon.svg' || rawLogo === '/logo-icon.png';
    const fullLogoUrl = (!isDarkVariant && rawLogo && !isStandardSvg) ? rawLogo : (BRANDING.LOGO_URL || '/medipulse-logo.svg');
    const iconLogoUrl = (siteInfo.small_icon_url && siteInfo.small_icon_url !== '/medipulse-logo.svg' && siteInfo.small_icon_url !== '/rxLogo.svg' ? siteInfo.small_icon_url : '').trim() || BRANDING.LOGO_ICON_URL || '/favicon.svg';
    const appName = (siteInfo.name || '').trim() || BRANDING.APP_NAME;

    return (
        <>
            {/* Logo Area */}
            <a
                href={homeUrl}
                className={`relative flex items-center h-22 border-b border-slate-100/80 bg-white group transition-all duration-300 overflow-hidden ${
                    isCollapsed ? 'justify-center px-2' : 'px-4'
                }`}
            >
                <AnimatePresence mode="wait">
                    {!isCollapsed ? (
                        <motion.div 
                            key="full-logo"
                            initial={{ opacity: 0, x: -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-center w-full"
                        >
                            <img 
                                src={fullLogoUrl} 
                                alt={appName} 
                                className="h-13.5 w-auto max-w-60 object-contain transition-all duration-300 group-hover:scale-[1.03]" 
                            />
                        </motion.div>
                    ) : (

                        <motion.div 
                            key="small-icon"
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full flex justify-center items-center"
                        >
                            <img 
                                src={iconLogoUrl} 
                                alt="MP" 
                                className="h-11 w-auto object-contain rounded-lg hover:scale-110 transition-all duration-300" 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </a>

            {/* Collapse Toggle Button (Floating Upper) */}
            <button
                onClick={onToggle}
                className="absolute -right-3.5 top-8.5 bg-white border border-slate-200 shadow-sm rounded-full p-1.5 text-slate-400 hover:text-[#00a294] hover:scale-110 active:scale-95 transition-all duration-200 z-30 flex items-center justify-center"
                aria-label="Toggle Sidebar"
            >
                {isCollapsed ? <ArrowRightToLine size={14} /> : <ArrowLeftToLine size={14} />}
            </button>
        </>
    );
}
