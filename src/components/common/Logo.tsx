import { motion } from 'framer-motion';
import { useState } from 'react';
import { BRANDING } from '../../utils/branding';
import { useSiteInfo } from '@/store';

interface LogoProps {
    size?: number;
    className?: string;
    isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 220, className = "", isDark = true }) => {
    const siteInfo = useSiteInfo();
    const customLogo = (siteInfo.logo || '').trim();
    const appName = (siteInfo.name || '').trim() || BRANDING.APP_NAME;
    const [imageError, setImageError] = useState(false);

    // Dynamic high-contrast logo per theme (Light vs Dark)
    const defaultLogoSrc = isDark ? '/medipulse-logo-dark.svg' : '/medipulse-logo.svg';
    const isStandardSvg = customLogo === '/medipulse-logo-dark.svg' || customLogo === '/medipulse-logo.svg' || customLogo === '/rxLogoDark.svg' || customLogo === '/rxLogo.svg' || customLogo === '/logo.png';
    const logoSrc = (!imageError && customLogo && !isStandardSvg) ? customLogo : defaultLogoSrc;

    return (
        <motion.div 
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`flex items-center justify-center ${className}`}
        >
            <img
                src={logoSrc}
                alt={appName}
                onError={() => setImageError(true)}
                style={{ width: size, height: 'auto', maxHeight: '75px' }}
                className={`transition-all duration-300 object-contain hover:scale-[1.02] ${
                    isDark 
                        ? 'filter drop-shadow-[0_4px_20px_rgba(0,207,202,0.25)]' 
                        : 'filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                }`}
            />
        </motion.div>
    );
};

export default Logo;





