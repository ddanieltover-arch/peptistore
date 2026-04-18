import React from 'react';
import { Award, Zap, Shield, Beaker } from 'lucide-react';

export type BadgeType = 'elite' | 'bestseller' | 'low_stock' | 'new' | 'verified';

interface ProductBadgeProps {
  type: BadgeType;
  className?: string;
  size?: 'sm' | 'md';
}

const badgeConfigs = {
  elite: {
    label: 'Elite Seller',
    icon: Award,
    classes: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/20'
  },
  bestseller: {
    label: 'Bestseller',
    icon: Zap,
    classes: 'bg-amber-500 text-white border-amber-400/20 shadow-sm shadow-amber-100'
  },
  low_stock: {
    label: 'Limited Stock',
    icon: Zap,
    classes: 'bg-red-50 text-red-600 border-red-100'
  },
  new: {
    label: 'New Release',
    icon: Shield,
    classes: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  },
  verified: {
    label: 'Purity Tested',
    icon: Beaker,
    classes: 'bg-blue-50 text-blue-600 border-blue-100'
  }
};

export function ProductBadge({ type, className = '', size = 'sm' }: ProductBadgeProps) {
  const config = badgeConfigs[type];
  const Icon = config.icon;
  
  return (
    <div className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border
      font-black uppercase tracking-widest leading-none
      ${size === 'sm' ? 'text-[9px]' : 'text-[10px]'}
      ${config.classes}
      ${className}
    `}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={3} />
      <span>{config.label}</span>
    </div>
  );
}
