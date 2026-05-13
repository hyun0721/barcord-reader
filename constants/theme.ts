export const COLORS = {
  primary: '#F49523',
  primaryLight: '#FEF3E8',
  primaryDark: '#D4791A',
  background: '#F7F7F7',
  card: '#FFFFFF',
  white: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#9E9E9E',
  border: '#F0F0F0',
  success: '#4CAF50',
  danger: '#EF4444',
  overlay: 'rgba(0,0,0,0.55)',
  scannerBg: '#111111',
  modalOverlay: 'rgba(0,0,0,0.6)',
} as const;

export const TYPE_COLORS: Record<'url' | 'email' | 'phone' | 'text', string> = {
  url: '#3B82F6',
  email: '#10B981',
  phone: '#F59E0B',
  text: COLORS.textSecondary,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
