import { useSessionStore } from '../../store/useSessionStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { Sidebar } from './Sidebar';
import { DashboardScreen }      from '../screens/DashboardScreen';
import { SalesTerminalScreen }  from '../screens/SalesTerminalScreen';
import { ProductsScreen }       from '../screens/ProductsScreen';
import { ExpireProductsScreen } from '../screens/ExpireProductsScreen';
import { UsersScreen }          from '../screens/UsersScreen';
import { AnalyticsScreen }      from '../screens/AnalyticsScreen';
import { SettingsScreen }       from '../screens/SettingsScreen';
import { RestaurantDashboard }  from '../screens/RestaurantDashboard';

/**
 * DashboardLayout — Main shell after login.
 * Renders the Sidebar + the currently active screen.
 * Handles role-based access control for protected tabs.
 */
export function DashboardLayout() {
  const { currentUser, activeTab, posMode } = useSessionStore();
  const { products: allProducts, addProduct, deleteProduct, deductStock } = useInventoryStore();

  const isAdmin = currentUser?.role === 'Admin';
  
  // Hard Isolation: Filter globally by posMode
  const products = allProducts.filter(p => p.type === posMode);

  if (posMode === 'restaurant' && activeTab === 'Sales') {
    return (
      <div className="flex h-screen bg-dark-900 text-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-hidden relative flex">
          <AmbientLayers />
          <RestaurantDashboard />
        </main>
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'Dashboard':
        return isAdmin
          ? <DashboardScreen />
          : <SalesTerminalScreen products={products} deductStock={deductStock} />;

      case 'Sales':
        return <SalesTerminalScreen products={products} deductStock={deductStock} />;

      case 'Products':
        return <ProductsScreen products={products} addProduct={addProduct} deleteProduct={deleteProduct} currentUser={currentUser} posMode={posMode} />;

      case 'Expire':
        return <ExpireProductsScreen products={products} />;

      case 'Users':
        return isAdmin
          ? <UsersScreen />
          : <SalesTerminalScreen products={products} deductStock={deductStock} />;

      case 'Analytics':
        return isAdmin
          ? <AnalyticsScreen products={products} />
          : <SalesTerminalScreen products={products} deductStock={deductStock} />;

      case 'Settings':
        return isAdmin
          ? <SettingsScreen />
          : <SalesTerminalScreen products={products} deductStock={deductStock} />;

      default:
        return <SalesTerminalScreen products={products} deductStock={deductStock} />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-900 text-gray-100" dir="ltr">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative flex">
        <AmbientLayers />
        {/* key forces re-mount = re-triggers page-enter animation on tab change */}
        <div key={activeTab} className="page-enter flex-1 overflow-hidden flex">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

/** Layered ambient glow blobs — purely decorative */
function AmbientLayers() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Top-right primary blob */}
      <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-primary-500/6 rounded-full blur-[140px] animate-float-slow" />
      {/* Bottom-left accent blob */}
      <div className="absolute -bottom-60 -left-20 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
      {/* Center subtle tint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-800/4 rounded-full blur-[100px]" />
    </div>
  );
}
