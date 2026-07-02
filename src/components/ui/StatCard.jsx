/**
 * StatCard — Dashboard metric card with animated accent line and hover lift.
 */
export function StatCard({ title, amount, icon, color, trend }) {
  return (
    <div className="glass-card accent-line p-6 rounded-2xl relative overflow-hidden group cursor-default hover-lift">
      {/* Ambient corner glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary-500/8 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        {icon && (
          <span className="text-2xl leading-none select-none">{icon}</span>
        )}
        {trend !== undefined && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1
            ${trend >= 0 ? 'bg-success-dim text-emerald-400 border border-success/20' : 'bg-danger-dim text-red-400 border border-danger/20'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <p className="text-gray-500 text-xs font-medium tracking-wide uppercase mb-1.5">{title}</p>
      <h3 className={`text-2xl font-black tracking-tight ${color}`}>{amount}</h3>
    </div>
  );
}
