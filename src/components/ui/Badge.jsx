/**
 * Badge — Inline status chip / pill.
 * variant: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'default'
 */
const VARIANTS = {
  success: 'bg-success-dim  text-emerald-400 border border-success/20',
  danger:  'bg-danger-dim   text-red-400     border border-danger/20',
  warning: 'bg-warning-dim  text-amber-400   border border-warning/20',
  info:    'bg-info-dim     text-sky-400     border border-info/20',
  primary: 'bg-primary-600/15 text-primary-300 border border-primary-500/25',
  default: 'bg-dark-700/80  text-gray-400   border border-white/[0.06]',
};

export function Badge({ children, variant = 'default' }) {
  return (
    <span className={`inline-flex items-center text-2xs font-bold px-2.5 py-0.5 rounded-full tracking-wide ${VARIANTS[variant] ?? VARIANTS.default}`}>
      {children}
    </span>
  );
}
