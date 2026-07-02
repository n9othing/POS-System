import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, X, ScanLine } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useBarcode } from '../../hooks/useBarcode';

/**
 * SalesTerminalScreen — Primary cashier interface.
 * Left: product grid. Right: cart panel.
 */
export function SalesTerminalScreen({ products, deductStock }) {
  const { items, addItem, removeItem, updateQty, clearCart, getSubtotal } = useCartStore();
  const { addSale } = useSessionStore();
  const [cartError, setCartError] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  // Filter retail only
  const retailProducts = products.filter(p => p.type === 'retail');

  // Categories
  const categories = ['All', ...new Set(retailProducts.map(p => p.category))];
  const [activeCategory, setActiveCategory] = useState('All');

  // Display products
  const displayProducts = activeCategory === 'All'
    ? retailProducts
    : retailProducts.filter(p => p.category === activeCategory);

  const handleScan = (code) => {
    const product = retailProducts.find((p) => p.barcode === code);
    if (!product) {
      setCartError(`⚠️ کاڵا بەم بارکۆدە نەدۆزرایەوە: ${code}`);
      setTimeout(() => setCartError(''), 3000);
      return;
    }
    handleAddProduct(product);
  };

  const { barcodeInput, setBarcodeInput, handleKeyDown, showScanner, openScanner, closeScanner } = useBarcode({
    onScan: handleScan,
    containerId: 'sales-barcode-reader',
  });

  const handleAddProduct = (product) => {
    const result = addItem(product);
    if (result?.error === 'OUT_OF_STOCK') {
      setCartError('⚠️ ئەم کاڵایە لە کۆگا نەماوە!');
      setTimeout(() => setCartError(''), 3000);
    } else if (result?.error === 'EXCEEDS_STOCK') {
      setCartError('⚠️ بڕی داواکراو لە کۆگادا نییە!');
      setTimeout(() => setCartError(''), 3000);
    }
  };

  const subtotal = getSubtotal();

  const handlePay = () => {
    if (items.length === 0) {
      setCartError('🛒 سەبەتەکەت بەتاڵە!');
      setTimeout(() => setCartError(''), 3000);
      return;
    }
    deductStock(items.map((i) => ({ id: i.id, qty: i.qty })));
    addSale(subtotal);
    setPaySuccess(true);
    clearCart();
    setTimeout(() => setPaySuccess(false), 2500);
  };

  return (
    <div className="flex w-full h-full">

      {/* ── Left: Product Grid ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-6">

        {/* Barcode bar */}
        <div className="glass-panel rounded-xl flex items-center px-4 h-[58px] mb-5 gap-3 flex-shrink-0">
          <ScanLine size={16} className="text-gray-600 flex-shrink-0" />
          <span className="section-label whitespace-nowrap">Barcode</span>
          <input
            id="barcode-input"
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scan or type barcode, then press Enter…"
            className="input-glass rounded-lg flex-1 h-[36px] px-3 text-sm font-mono"
          />
          <button
            onClick={showScanner ? closeScanner : openScanner}
            className={`px-3.5 h-[36px] rounded-lg text-xs font-bold transition-all flex-shrink-0
              ${showScanner
                ? 'btn-danger py-0'
                : 'btn-ghost py-0'}`}
          >
            {showScanner ? '✕ Close' : '📷 Scan'}
          </button>
        </div>

        {/* Camera preview */}
        {showScanner && (
          <div className="mb-4 glass-card p-4 rounded-xl max-w-sm mx-auto flex-shrink-0 animate-fade-in">
            <div id="sales-barcode-reader" className="w-full rounded-lg overflow-hidden border border-white/[0.05]" />
            <p className="text-center text-xs text-primary-400 mt-2 animate-pulse">خەریکی گەڕانە بەدوای بارکۆد…</p>
          </div>
        )}

        {/* Page header */}
        <header className="mb-5 flex-shrink-0 animate-fade-slide">
          <h2 className="text-2xl font-black tracking-tight text-white">Sales Terminal</h2>
          <p className="text-gray-600 text-xs mt-1">Click a product or scan barcode to add to cart</p>
        </header>

        {/* Cart error */}
        {cartError && (
          <div className="mb-4 bg-danger-dim border border-danger/30 text-red-400 text-sm p-3.5 rounded-xl animate-fade-in flex-shrink-0 flex items-center gap-2">
            {cartError}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 custom-scrollbar flex-shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeCategory === cat
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                  : 'bg-dark-800/50 text-gray-400 border border-white/[0.05] hover:bg-dark-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto pb-4 custom-scrollbar flex-1">
          {displayProducts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handleAddProduct(p)}
              disabled={p.stock <= 0}
              style={{ animationDelay: `${i * 0.04}s` }}
              className={`glass-card accent-line rounded-2xl p-4 text-left flex flex-col group animate-fade-slide
                ${p.stock <= 0 ? 'opacity-35 cursor-not-allowed !border-red-500/20 hover:transform-none hover:shadow-none hover:border-red-500/20' : 'cursor-pointer'}`}
            >
              <div className={`w-full h-24 rounded-xl mb-3 flex items-center justify-center text-4xl border transition-transform duration-300 group-hover:scale-105 ${p.color || 'bg-primary-500/10 text-primary-400 border-primary-500/20'}`}>
                {p.icon || '📦'}
              </div>
              <p className="font-semibold text-gray-200 text-sm leading-snug flex-1">{p.name}</p>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/[0.04]">
                <span className="text-2xs text-gray-700 font-mono">#{p.barcode}</span>
                <span className="text-primary-400 font-black text-sm">{p.price.toLocaleString()} IQD</span>
              </div>
              <span className={`text-2xs mt-1 self-end ${p.stock <= 0 ? 'text-red-500 font-bold' : p.stock < 10 ? 'text-amber-500' : 'text-gray-700'}`}>
                Stock: {p.stock}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Cart Panel ── */}
      <div className="w-[320px] glass-panel border-l border-white/[0.04] flex flex-col h-full flex-shrink-0">

        {/* Cart header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-primary-400" />
            <h3 className="font-bold text-gray-200 text-sm">Current Order</h3>
            {items.length > 0 && (
              <span className="badge-primary">{items.length}</span>
            )}
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Success flash */}
        {paySuccess && (
          <div className="mx-4 mt-4 bg-success-dim border border-success/30 text-emerald-400 text-sm font-bold p-3 rounded-xl text-center animate-scale-in">
            ✅ Payment successful!
          </div>
        )}

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <ShoppingCart size={36} className="text-dark-600 mb-3" />
              <p className="text-gray-600 text-sm font-medium">Cart is empty</p>
              <p className="text-gray-700 text-xs mt-1">Add products from the left panel</p>
            </div>
          ) : (
            items.map((item, i) => (
              <div
                key={item.id}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="glass-xs rounded-xl p-3 animate-fade-slide hover:border-primary-500/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-2.5">
                  <p className="font-semibold text-sm text-gray-200 leading-snug flex-1 pr-2">{item.name}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0 p-0.5 rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  {/* Qty controls */}
                  <div className="flex items-center gap-1.5 glass-xs border border-white/[0.04] rounded-lg p-1">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-dark-600 transition-all"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center text-gray-200">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, +1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-dark-600 transition-all"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <span className="text-primary-400 font-black text-sm">
                    {(item.price * item.qty).toLocaleString()} IQD
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals + Pay */}
        <div className="px-5 py-5 border-t border-white/[0.04]">
          <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="font-mono text-gray-400">{subtotal.toLocaleString()} IQD</span>
          </div>
          <div className="flex justify-between items-center mb-5 text-base font-bold">
            <span className="text-gray-200">Total</span>
            <span className="text-primary-300 text-lg">{subtotal.toLocaleString()} IQD</span>
          </div>
          <button
            id="pay-now-btn"
            onClick={handlePay}
            disabled={items.length === 0}
            className="btn-primary w-full py-4 text-base rounded-xl"
          >
            {items.length === 0 ? 'Add items to pay' : `Pay Now — ${subtotal.toLocaleString()} IQD`}
          </button>
        </div>
      </div>
    </div>
  );
}
