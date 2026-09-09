import React from 'react';
import { Crown, Shield, Stethoscope, HeartPulse, Headphones, Coins, User, Truck } from 'lucide-react';
import { getRoleBadgeConfig } from '../utils';

interface RoleBadgeProps {
  role: string;
  isSuper?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, isSuper = false }) => {
  const config = getRoleBadgeConfig(role, isSuper);

  const renderIcon = () => {
    switch (config.iconName) {
      case 'Crown': return <Crown className="w-3.5 h-3.5 shrink-0" />;
      case 'Shield': return <Shield className="w-3.5 h-3.5 shrink-0" />;
      case 'Stethoscope': return <Stethoscope className="w-3.5 h-3.5 shrink-0" />;
      case 'HeartPulse': return <HeartPulse className="w-3.5 h-3.5 shrink-0" />;
      case 'Headphones': return <Headphones className="w-3.5 h-3.5 shrink-0" />;
      case 'Coins': return <Coins className="w-3.5 h-3.5 shrink-0" />;
      case 'Truck': return <Truck className="w-3.5 h-3.5 shrink-0" />;
      default: return <User className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <span
      data-testid="role-badge"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-2xs whitespace-nowrap ${config.bgClass} ${config.textClass} ${config.borderClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {renderIcon()}
      <span>{config.label}</span>
    </span>
  );
};

export default RoleBadge;
