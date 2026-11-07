import { Cog, Factory, ShoppingBag } from 'lucide-react';
import type { Role, VentureStatus } from './types';

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { id: '50+', label: '1Cr +', min: 50, max: Infinity },
  { id: '30-50', label: '50L - 1Cr', min: 30, max: 50 },
  { id: '15-30', label: '15L - 30L', min: 15, max: 30 },
  { id: '10-15', label: '10L - 15L', min: 10, max: 15 },
  { id: '5-10', label: '5L - 10L', min: 5, max: 10 },
  { id: '2-5', label: '2L - 5L', min: 2, max: 5 },
];

export const CATEGORIES = [
  { id: 'Retail', label: 'Retail', icon: ShoppingBag },
  { id: 'Manufacturing', label: 'Manufacturing', icon: Factory },
  { id: 'Service', label: 'Service', icon: Cog },
] as const;

export const ROLE_TITLES: Record<Role, string> = {
  student: 'Creator',
  admin: 'Program administrator',
  investor: 'Investor',
};

export const STATUS_STYLES: Record<VentureStatus, string> = {
  'Under review': 'bg-amber-50 text-amber-800 ring-amber-200',
  'Revision requested': 'bg-orange-50 text-orange-800 ring-orange-200',
  Approved: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'Not selected': 'bg-slate-100 text-slate-600 ring-slate-200',
};
