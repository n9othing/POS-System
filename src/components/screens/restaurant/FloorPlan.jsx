import { Users } from 'lucide-react';

/**
 * FloorPlan — Visual grid of restaurant tables.
 */
export function FloorPlan({ tables, onTableClick }) {
  
  // Helpers for table styling based on status
  const getStatusStyles = (status) => {
    switch (status) {
      case 'available':
        return {
          borderClass: 'border-white/[0.05] hover:border-emerald-500/30',
          glowClass: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          badgeClass: 'bg-success-dim text-emerald-400 border-success/20',
          label: 'Available'
        };
      case 'occupied':
        return {
          borderClass: 'border-warning/30',
          glowClass: 'shadow-[0_0_24px_rgba(245,158,11,0.15)]',
          badgeClass: 'bg-warning-dim text-amber-400 border-warning/30',
          label: 'Seated'
        };
      case 'pending_order':
        return {
          borderClass: 'border-danger/40',
          glowClass: 'shadow-[0_0_32px_rgba(244,63,94,0.25)] animate-pulse-glow',
          badgeClass: 'bg-danger-dim text-red-400 border-danger/30',
          label: 'Pending Order'
        };
      default:
        return {
          borderClass: 'border-white/[0.05]',
          glowClass: '',
          badgeClass: 'bg-dark-700 text-gray-400',
          label: 'Unknown'
        };
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 p-2">
      {tables.map((table, i) => {
        const styles = getStatusStyles(table.status);
        
        return (
          <button
            key={table.id}
            onClick={() => onTableClick(table)}
            style={{ animationDelay: `${i * 0.05}s` }}
            className={`glass-card relative flex flex-col p-5 rounded-2xl text-left group transition-all duration-300 animate-fade-slide cursor-pointer hover:-translate-y-1 ${styles.borderClass} ${styles.glowClass}`}
          >
            {/* Top row: Table number & Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-dark-700/50 border border-white/[0.04] flex items-center justify-center font-black text-xl text-gray-200 shadow-inner">
                  {table.number}
                </div>
                <div className="flex items-center gap-1.5 text-2xs text-gray-500 font-medium px-2 py-1 rounded-lg bg-dark-800/40 border border-white/[0.02]">
                  <Users size={12} />
                  {table.seats}
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${styles.badgeClass}`}>
                {styles.label}
              </span>
            </div>

            {/* Content row: Order total or empty state */}
            <div className="mt-auto pt-4 border-t border-white/[0.04]">
              {table.total > 0 ? (
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-500">Current Bill</span>
                  <span className="text-lg font-black text-primary-300 tracking-tight">
                    {table.total.toLocaleString()} IQD
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-end opacity-50">
                  <span className="text-xs text-gray-500">Current Bill</span>
                  <span className="text-sm font-semibold text-gray-600">0 IQD</span>
                </div>
              )}
            </div>

            {/* Decorative subtle accent line for occupied tables */}
            {table.status !== 'available' && (
              <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
            )}
          </button>
        );
      })}
    </div>
  );
}
