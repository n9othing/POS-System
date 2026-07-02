import { SaveAll, TrendingUp, Utensils, Clock, Users } from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore';
import { useRestaurantStore } from '../../store/useRestaurantStore';
import { StatCard } from '../ui/StatCard';
import { saveEndOfDay } from '../../services/electronBridge';

/**
 * DashboardScreen — Admin overview with daily revenue stats and end-of-day close.
 */
export function DashboardScreen() {
  const { totalRevenue, totalOrders, resetDayTotals, currentUser, posMode } = useSessionStore();
  const tables = useRestaurantStore(s => s.tables);

  const handleEndOfDay = async () => {
    const confirmed = window.confirm(
      'ئایا دڵنیایت لە داخستنی سندوق و سفرکردنەوەی داتای ئەمڕۆ؟ داتاکان دەچنە ناو داتابەیس.'
    );
    if (!confirmed) return;

    const result = await saveEndOfDay({ totalRevenue, totalOrders });

    if (result.success) {
      resetDayTotals();
      if (result.browserMode) {
        alert('سفر کرایەوە (تێبینی: بۆ خەزنبوونی داتابەیس دەبێت لەناو پەنجەرەی ئیلیکترۆن بیت).');
      } else {
        alert('سندوق بە سەرکەوتوویی داخرا و داتاکانی ئەمڕۆ خەزن کران.');
      }
    } else {
      alert('هەڵەیەک ڕوویدا لە خەزنکردنی داتاکان: ' + result.error);
    }
  };

  const netProfit = Math.round(totalRevenue * 0.3);
  const avgOrder  = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Restaurant specific metrics
  const activeTables = tables.filter(t => t.status !== 'available');
  const pendingOrders = tables.filter(t => t.status === 'pending_order').length;
  const activeValue = activeTables.reduce((acc, t) => {
    const tableOrderValue = t.currentOrder.reduce((sum, item) => sum + item.price * item.qty, 0);
    return acc + t.total + tableOrderValue;
  }, 0);

  if (posMode === 'restaurant') {
    return (
      <div className="p-8 w-full overflow-y-auto custom-scrollbar">
        <header className="flex justify-between items-start mb-8 animate-fade-slide">
          <div>
            <p className="section-label mb-2">Restaurant Overview</p>
            <h2 className="text-3xl font-black tracking-tight text-white">Live Kitchen & Tables</h2>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, <span className="text-primary-400 font-semibold">{currentUser?.name}</span>
            </p>
          </div>
          <button onClick={handleEndOfDay} className="btn-danger flex items-center gap-2 mt-1">
            <SaveAll size={16} /> End of Shift
          </button>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Active Tables', amount: `${activeTables.length} / ${tables.length}`, icon: '🍽️', color: 'text-amber-400', delay: 0.05 },
            { title: 'Pending Orders', amount: pendingOrders.toString(), icon: '🔥', color: 'text-orange-400', delay: 0.1 },
            { title: 'Est. Current Value', amount: `${activeValue.toLocaleString()} IQD`, icon: '💎', color: 'text-primary-400', delay: 0.15 },
            { title: 'Completed Orders', amount: totalOrders.toString(), icon: '✅', color: 'text-emerald-400', delay: 0.2 },
          ].map((card) => (
            <div key={card.title} className="animate-fade-slide" style={{ animationDelay: `${card.delay}s` }}>
              <StatCard title={card.title} amount={card.amount} icon={card.icon} color={card.color} />
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-2xl p-6 animate-fade-slide" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-2 mb-5">
            <Utensils size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-gray-200">Current Table Status</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {activeTables.length === 0 ? (
              <p className="text-sm text-gray-500 italic col-span-4">No active tables at the moment.</p>
            ) : (
              activeTables.map(t => (
                <div key={t.id} className="glass-xs p-4 rounded-xl border border-white/[0.05]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-200">Table {t.number}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${t.status === 'pending_order' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Items: {t.currentOrder.reduce((acc, item) => acc + item.qty, 0)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full overflow-y-auto custom-scrollbar">

      {/* ── Header ── */}
      <header className="flex justify-between items-start mb-8 animate-fade-slide">
        <div>
          <p className="section-label mb-2">Overview</p>
          <h2 className="text-3xl font-black tracking-tight text-white">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back,{' '}
            <span className="text-primary-400 font-semibold">{currentUser?.name}</span>
            {' '}— here's today's performance
          </p>
        </div>
        <button
          id="end-of-day-btn"
          onClick={handleEndOfDay}
          className="btn-danger flex items-center gap-2 mt-1"
        >
          <SaveAll size={16} />
          End of Day
        </button>
      </header>

      {/* ── Stat Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Revenue',   amount: `${totalRevenue.toLocaleString()} IQD`, icon: '💰', color: 'text-primary-400', delay: 0.05 },
          { title: 'Net Profit (30%)', amount: `${netProfit.toLocaleString()} IQD`,   icon: '📈', color: 'text-emerald-400', delay: 0.1 },
          { title: 'Total Orders',    amount: totalOrders.toString(),                  icon: '🧾', color: 'text-gray-100',    delay: 0.15 },
          { title: 'Avg Order Value', amount: `${avgOrder.toLocaleString()} IQD`,     icon: '⚡', color: 'text-amber-400',   delay: 0.2 },
        ].map((card) => (
          <div key={card.title} className="animate-fade-slide" style={{ animationDelay: `${card.delay}s` }}>
            <StatCard title={card.title} amount={card.amount} icon={card.icon} color={card.color} />
          </div>
        ))}
      </div>

      {/* ── Summary Panel ── */}
      <div className="glass-panel rounded-2xl p-6 animate-fade-slide" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-primary-400" />
          <h3 className="text-sm font-bold text-gray-200">Today's Summary</h3>
        </div>
        <div className="space-y-0">
          {[
            { label: 'Gross Revenue', value: `${totalRevenue.toLocaleString()} IQD`, color: 'text-primary-400' },
            { label: 'Net Profit',    value: `${netProfit.toLocaleString()} IQD`,    color: 'text-emerald-400' },
            { label: 'Orders Placed', value: totalOrders,                              color: 'text-gray-200' },
          ].map(({ label, value, color }, i) => (
            <div key={label} className={`flex items-center justify-between py-3 ${i < 2 ? 'border-b border-white/[0.04]' : ''}`}>
              <span className="text-gray-500 text-sm">{label}</span>
              <span className={`font-bold text-sm ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
