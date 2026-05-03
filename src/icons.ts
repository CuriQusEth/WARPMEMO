import {
  Cpu,
  Orbit,
  Rocket,
  Zap,
  Radar,
  Telescope,
  Satellite,
  Atom,
  Globe,
  Sparkles,
  Radio,
  Hexagon,
  Moon,
  Sun,
  Star,
  CloudLightning,
  ShieldAlert,
  Wifi,
  Database
} from 'lucide-react';

export const SCI_FI_ICONS = {
  Cpu,
  Orbit,
  Rocket,
  Zap,
  Radar,
  Telescope,
  Satellite,
  Atom,
  Globe,
  Sparkles,
  Radio,
  Hexagon,
  Moon,
  Sun,
  Star,
  CloudLightning,
  ShieldAlert,
  Wifi,
  Database
};

export type SciFiIconName = keyof typeof SCI_FI_ICONS;

export const ICON_NAMES = Object.keys(SCI_FI_ICONS) as SciFiIconName[];
