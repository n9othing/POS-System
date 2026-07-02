import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, BarChart2, AlertTriangle, Store, Utensils } from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { NavItem } from '../ui/NavItem';

/**
 * Sidebar — Main navigation panel.
 * Role-based nav items + POS mode toggle (Admin only).
 */
export function Sidebar() {
  const { currentUser, activeTab, setTab, logout, posMode, setMode } = useSessionStore();
  const allProducts = useInventoryStore((s) => s.products);
  const products = allProducts.filter(p => p.type === posMode);

  const today = new Date().toISOString().split('T')[0];
  const issueCount = products.filter(
    (p) => p.stock <= 0 || p.expireDate < today
  ).length;

  const adminNav = [
    { id: 'Dashboard', icon: <LayoutDashboard size={18} />, text: 'Dashboard' },
    { id: 'Sales',     icon: posMode === 'restaurant' ? <Utensils size={18} /> : <ShoppingCart size={18} />, text: posMode === 'restaurant' ? 'Floor Plan' : 'Sales Terminal' },
    { id: 'Products',  icon: <Package size={18} />,         text: 'Products' },
    { id: 'Expire',    icon: <AlertTriangle size={18} />,   text: 'Inventory Status', badge: issueCount },
    { id: 'Users',     icon: <Users size={18} />,           text: 'Users' },
    { id: 'Analytics', icon: <BarChart2 size={18} />,       text: 'Analytics' },
    { id: 'Settings',  icon: <Settings size={18} />,        text: 'Settings' },
  ];

  const cashierNav = [
    { id: 'Sales',    icon: posMode === 'restaurant' ? <Utensils size={18} /> : <ShoppingCart size={18} />,  text: posMode === 'restaurant' ? 'Floor Plan' : 'Sales Terminal' },
    { id: 'Products', icon: <Package size={18} />,       text: 'Product List' },
    { id: 'Expire',   icon: <AlertTriangle size={18} />, text: 'Inventory Status', badge: issueCount },
  ];

  const navItems = currentUser?.role === 'Admin' ? adminNav : cashierNav;

  return (
    <aside className="w-[240px] glass-panel border-r border-white/[0.04] flex flex-col flex-shrink-0 z-20">

      {/* ── Logo ── */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-400 rounded-[11px] flex items-center justify-center shadow-glow-sm border border-primary-400/25 flex-shrink-0 animate-pulse-glow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold tracking-tight leading-none text-sm">Antigravity POS</span>
            <span className="text-2xs text-primary-400/80 tracking-[0.14em] mt-1 uppercase">
              {posMode === 'restaurant' ? 'Restaurant Mode' : 'Retail Mode'}
            </span>
          </div>
        </div>

        {/* ── Mode Toggle (Admin only) ── */}
        {currentUser?.role === 'Admin' && (
          <div className="mt-4 flex glass-xs rounded-xl p-1 gap-1">
            <button
              onClick={() => setMode('retail')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-2xs font-bold transition-all duration-250
                ${posMode === 'retail'
                  ? 'bg-primary-600/25 text-primary-300 border border-primary-500/35 shadow-glow-xs'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-dark-600/50'}`}
            >
              <Store size={11} /> Retail
            </button>
            <button
              onClick={() => setMode('restaurant')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-2xs font-bold transition-all duration-250
                ${posMode === 'restaurant'
                  ? 'bg-primary-600/25 text-primary-300 border border-primary-500/35 shadow-glow-xs'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-dark-600/50'}`}
            >
              <Utensils size={11} /> Restaurant
            </button>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        <p className="section-label px-3 mb-3">Navigation</p>
        {navItems.map((item, i) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            text={item.text}
            isActive={activeTab === item.id}
            onClick={() => setTab(item.id)}
            badge={item.badge}
            delay={i * 0.05}
          />
        ))}
      </nav>

      {/* ── User Card ── */}
      <div className="px-3 pb-5 border-t border-white/[0.04] pt-4">
        <div className="glass-xs rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600/40 to-primary-400/20 border border-primary-500/25 text-primary-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {currentUser?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-gray-200">{currentUser?.name}</p>
              <p className="text-2xs text-primary-400/80 font-medium">{currentUser?.role}</p>
            </div>
          </div>
          <button
            id="logout-btn"
            onClick={logout}
            title="Sign out"
            className="text-gray-600 hover:text-danger transition-all duration-200 ml-2 flex-shrink-0 p-1.5 rounded-lg hover:bg-danger-dim focus-ring"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
