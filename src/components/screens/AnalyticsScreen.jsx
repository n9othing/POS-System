import { useSessionStore } from '../../store/useSessionStore';
import { StatCard } from '../ui/StatCard';
import { BarChart2, PieChart } from 'lucide-react';

/**
 * AnalyticsScreen — Revenue breakdown and inventory performance.
 */
export function AnalyticsScreen({ products }) {
  const { totalRevenue, totalOrders, posMode } = useSessionStore();

  const getCatRevenue = (cat) =>
    products
      .filter((p) => p.category === cat)
      .reduce((acc, p) => acc + p.price * Math.max(0, 50 - p.stock), 0);

  const isRetail = posMode === 'retail';
  const cat1 = isRetail ? 'Cables' : 'Appetizers';
  const cat2 = isRetail ? 'Glass'  : 'Main Course';
  const cat3 = isRetail ? 'Cases'  : 'Drinks';

  const rev1 = getCatRevenue(cat1);
  const rev2 = getCatRevenue(cat2);
  const rev3 = getCatRevenue(cat3);
  const maxRev = Math.max(rev1, rev2, rev3, 1);
  const netProfit = Math.round(totalRevenue * 0.3);

  const barData = [
    { label: cat1, value: rev1, color: 'bg-blue-500',   bar: 'from-blue-600 to-blue-400',     glow: 'rgba(59,130,246,0.45)' },
    { label: cat2, value: rev2, color: 'bg-violet-500', bar: 'from-violet-600 to-violet-400',  glow: 'rgba(139,92,246,0.45)' },
    { label: cat3, value: rev3, color: 'bg-pink-500',   bar: 'from-pink-600 to-pink-400',      glow: 'rgba(236,72,153,0.45)' },
  ];

  return (
    <div className="p-8 w-full overflow-y-auto custom-scrollbar">

      <header className="mb-7 animate-fade-slide">
        <p className="section-label mb-2">Reports</p>
        <h2 className="text-3xl font-black tracking-tight text-white">{isRetail ? 'Retail Analytics' : 'Restaurant Analytics'}</h2>
        <p className="text-gray-500 text-sm mt-1">{isRetail ? 'Sales performance and accessory breakdown' : 'Menu performance and order volume'}</p>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Sales',   amount: `${totalRevenue.toLocaleString()} IQD`, icon: '💰', color: 'text-primary-400', delay: 0.05 },
          { title: 'Net Profit',    amount: `${netProfit.toLocaleString()} IQD`,    icon: '📈', color: 'text-emerald-400', delay: 0.1  },
          { title: 'Total Orders',  amount: totalOrders.toString(),                  icon: '🧾', color: 'text-gray-100',    delay: 0.15 },
          { title: 'Est. Expenses', amount: '2,936,000 IQD',                         icon: '💸', color: 'text-red-400',    delay: 0.2  },
        ].map((c) => (
          <div key={c.title} className="animate-fade-slide" style={{ animationDelay: `${c.delay}s` }}>
            <StatCard title={c.title} amount={c.amount} icon={c.icon} color={c.color} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">

        {/* Bar chart */}
        <div className="col-span-2 glass-panel rounded-2xl p-6 animate-fade-slide" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={15} className="text-primary-400" />
            <h3 className="text-sm font-bold text-gray-200">Revenue by Category</h3>
          </div>
          <p className="text-2xs text-gray-700 mb-8 ml-5">Estimated from sold inventory units</p>

          <div className="h-48 flex items-end gap-10 border-b border-l border-white/[0.05] pb-2 pl-4 mx-4">
            {barData.map(({ label, value, bar, glow }) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-600 font-mono text-2xs">{value.toLocaleString()}</span>
                <div
                  style={{
                    height: `${Math.max(6, (value / maxRev) * 148)}px`,
                    boxShadow: `0 0 20px ${glow}, 0 0 40px ${glow}`,
                    transition: 'height 0.7s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                  className={`w-12 bg-gradient-to-t ${bar} rounded-t-lg`}
                />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category split */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col animate-fade-slide" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-1">
            <PieChart size={15} className="text-primary-400" />
            <h3 className="text-sm font-bold text-gray-200">Category Split</h3>
          </div>
          <p className="text-2xs text-gray-700 mb-5">Inventory value share</p>

          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-28">
              <div className="w-full h-full rounded-full border-[10px] border-t-blue-500 border-r-violet-500 border-b-pink-500 border-l-dark-600 animate-pulse" />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-gray-400 tracking-wider">LIVE</span>
            </div>
          </div>

          <div className="glass-xs border border-white/[0.04] rounded-xl p-4 space-y-3 text-xs mt-auto">
            {barData.map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
                  {label}
                </span>
                <span className="font-mono text-gray-300 text-2xs">{value.toLocaleString()} IQD</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
