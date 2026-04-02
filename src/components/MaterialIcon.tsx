import React from 'react';
import { 
  Mountain, 
  Flame, 
  Wind, 
  Droplets, 
  Cylinder, 
  Cpu, 
  Cog, 
  Box, 
  Diamond,
  Zap,
  Hammer
} from 'lucide-react';

const icons = {
  iron: Mountain,
  coal: Flame,
  copper: Wind,
  water: Droplets,
  ingot: Cylinder,
  component: Cpu,
  gear: Cog,
  box: Box,
  diamond: Diamond,
  energy: Zap,
  tool: Hammer,
};

export type IconType = keyof typeof icons;

interface MaterialIconProps {
  type?: string;
  className?: string;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({ type, className = 'w-5 h-5' }) => {
  const Icon = icons[type as IconType] || Box;
  return <Icon className={className} />;
};

export default MaterialIcon;
