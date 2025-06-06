import React from 'react';
import { Monitor } from 'lucide-react';
import { deviceIcons, type DeviceType } from '@/constants/deviceIcons';

interface DeviceIconProps {
  type: string;
  className?: string;
}

export const DeviceIcon = React.memo<DeviceIconProps>(({ type, className = 'h-3.5 w-3.5' }) => {
  const normalizedType = type.toLowerCase() as DeviceType;
  const IconComponent = deviceIcons[normalizedType] || Monitor;
  return <IconComponent className={className} />;
});

DeviceIcon.displayName = 'DeviceIcon';
