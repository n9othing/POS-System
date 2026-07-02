import { useState } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Send, CreditCard, MessageSquareText } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useRestaurantStore } from '../../../store/useRestaurantStore';
import { useSessionStore } from '../../../store/useSessionStore';

/**
 * CustomizationModal — Sub-modal for adding special instructions to a food item.
 */
function CustomizationModal({ product, onConfirm, onClose }) {
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-modal w-full max-w-sm rounded-3xl p-6 shadow-glow-xl animate-scale-in">
        <h3 className="text-xl font-bold text-white mb-2">Customize Order</h3>
        <p className="text-gray-400 text-sm mb-6">Add special instructions for {product.name}</p>

        <textarea
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. No onions, extra spicy..."
          className="w-full bg-dark-900/50 border border-white/[0.08] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all resize-none h-32 mb-6"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={() => onConfirm(note)} className="btn-primary">
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * TableOrderModal — Unified POS interface scoped to a single table.
 */
export function TableOrderModal({ table, onClose }) {
  const allProducts = useInventoryStore((s) => s.products);
  const deductStock = useInventoryStore((s) => s.deductStock);
  const { addItemsToTable, clearTable } = useRestaurantStore();
  const { addSale } = useSessionStore();

  // Filter restaurant only
  const restaurantProducts = allProducts.filter(p => p.type === 'restaurant');

  // Categories
  const categories = ['All', ...new Set(restaurantProducts.map((p) => p.category))];
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filtered products
  const products = activeCategory === 'All' 
    ? restaurantProducts 
    : restaurantProducts.filter((p) => p.category === activeCategory);

  // Local unsent items
  const [localItems, setLocalItems] = useState([]);
  const [error, setError] = useState('');
  
  // Customization state
  const [customizingProduct, setCustomizingProduct] = useState(null);

  // ── Handlers ──

  const initiateAddProduct = (product) => {
    if (product.stock <= 0) {
      showError('⚠️ ئەم کاڵایە لە کۆگا نەماوە!');
      return;
    }
    setCustomizingProduct(product);
  };

  const confirmAddProduct = (note) => {
    const product = customizingProduct;
    setLocalItems((prev) => {
      // Find if we already have the EXACT same product with the EXACT same note locally
      const existing = prev.find((i) => i.id === product.id && i.note === note);
      
      if (existing) {
        if (existing.qty >= product.stock) {
          showError('⚠️ بڕی داواکراو لە کۆگادا نییە!');
          return prev;
        }
        return prev.map((i) => i.cartId === existing.cartId ? { ...i, qty: i.qty + 1 } : i);
      }
      
      // Add as new line item with a unique cartId
      return [...prev, { ...product, qty: 1, note, cartId: Date.now() + Math.random() }];
    });
    setCustomizingProduct(null);
  };

  const updateLocalQty = (cartId, delta) => {
    setLocalItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );
  };

  const removeLocalItem = (cartId) => {
    setLocalItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const handleSendOrder = () => {
    if (localItems.length === 0) return;
    addItemsToTable(table.id, localItems);
    useRestaurantStore.getState().updateTableStatus(table.id, 'pending_order');
    onClose();
  };

  const handlePayAndClear = () => {
    const finalTotal = table.total + localSubtotal;
    if (finalTotal === 0) return;
    
    // Combine items to deduct
    const allItemsToDeduct = [...table.currentOrder];
    localItems.forEach(li => {
      const existing = allItemsToDeduct.find(i => i.id === li.id);
      if (existing) existing.qty += li.qty;
      else allItemsToDeduct.push(li);
    });

    deductStock(allItemsToDeduct.map(i => ({ id: i.id, qty: i.qty })));
    addSale(finalTotal);
    clearTable(table.id);
    onClose();
  };

  // ── Derived Data ──
  const localSubtotal = localItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const grandTotal = table.total + localSubtotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      
      {customizingProduct && (
        <CustomizationModal 
          product={customizingProduct} 
          onClose={() => setCustomizingProduct(null)} 
          onConfirm={confirmAddProduct} 
        />
      )}

      <div className="glass-modal w-full max-w-6xl h-[85vh] rounded-3xl overflow-hidden flex flex-col animate-scale-in shadow-glow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-dark-900/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-dark-700/80 flex items-center justify-center text-xl font-black text-gray-200">
              {table.number}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Table {table.number} Order</h2>
              <p className="text-xs text-gray-400">Status: <span className="text-primary-400 capitalize">{table.status.replace('_', ' ')}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left: Product Grid */}
          <div className="flex-[3] flex flex-col overflow-hidden">
            
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto px-6 py-4 border-b border-white/[0.04] custom-scrollbar flex-shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                      : 'bg-dark-800/50 text-gray-400 border border-white/[0.05] hover:bg-dark-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {error && (
                <div className="mb-4 bg-danger-dim border border-danger/30 text-red-400 text-sm p-3 rounded-xl animate-fade-in flex items-center gap-2">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => initiateAddProduct(p)}
                    disabled={p.stock <= 0 || p.isAvailable === false}
                    style={{ animationDelay: `${i * 0.03}s` }}
                    className={`glass-card rounded-xl p-3 text-left flex flex-col group animate-fade-slide cursor-pointer
                      ${(p.stock <= 0 || p.isAvailable === false) ? 'opacity-35 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                  >
                    <div className={`w-full h-16 rounded-lg mb-2 flex items-center justify-center text-2xl border transition-transform ${p.color || 'bg-primary-500/10 text-primary-400 border-primary-500/20'}`}>
                      {p.icon || '🥘'}
                    </div>
                    <p className="font-semibold text-gray-200 text-xs leading-snug line-clamp-1">{p.name}</p>
                    <span className="text-primary-400 font-bold text-xs mt-1">{p.price.toLocaleString()} IQD</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Cart/Order */}
          <div className="flex-[2] glass-panel border-l border-white/[0.04] flex flex-col h-full bg-dark-900/30">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              
              {/* Sent Items */}
              {table.currentOrder.length > 0 && (
                <div className="space-y-2">
                  <p className="section-label">Sent to Kitchen</p>
                  {table.currentOrder.map((item, i) => (
                    <div key={`${item.id}-${i}`} className="glass-xs rounded-xl p-2.5 opacity-80 flex flex-col border border-white/[0.02]">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-400 bg-dark-800 w-6 h-6 flex items-center justify-center rounded-md">{item.qty}</span>
                          <span className="text-sm text-gray-300 font-medium">{item.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                      
                      {/* Kitchen Status & Note */}
                      <div className="flex items-center gap-3 pl-9">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-info-dim text-blue-400 border border-info/30">
                          {item.kitchenStatus || 'Preparing'}
                        </span>
                        {item.note && (
                          <span className="text-[10px] text-gray-500 italic flex items-center gap-1">
                            <MessageSquareText size={10} /> "{item.note}"
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Unsent Local Items */}
              {localItems.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="section-label text-warning">Unsent Items</p>
                  {localItems.map((item) => (
                    <div key={item.cartId} className="glass-xs rounded-xl p-3 border border-warning/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]">
                      <div className="flex justify-between items-start mb-1.5">
                        <p className="font-semibold text-sm text-amber-100">{item.name}</p>
                        <button onClick={() => removeLocalItem(item.cartId)} className="text-amber-500/50 hover:text-red-400 transition-colors p-0.5">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      {item.note && (
                        <div className="mb-2 text-xs text-warning/80 bg-warning-dim/50 px-2 py-1 rounded border border-warning/20 italic">
                          Note: {item.note}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 glass-xs border border-white/[0.04] rounded-lg p-1">
                          <button onClick={() => updateLocalQty(item.cartId, -1)} className="w-5 h-5 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-dark-600"><Minus size={10} /></button>
                          <span className="text-xs font-bold w-5 text-center text-gray-200">{item.qty}</span>
                          <button onClick={() => updateLocalQty(item.cartId, +1)} className="w-5 h-5 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-dark-600"><Plus size={10} /></button>
                        </div>
                        <span className="text-amber-400 font-bold text-xs">{(item.price * item.qty).toLocaleString()} IQD</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {table.currentOrder.length === 0 && localItems.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <ShoppingCart size={32} className="mb-2" />
                  <p className="text-sm">Table is empty</p>
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            <div className="p-5 border-t border-white/[0.06] bg-dark-900/50 space-y-3">
              <div className="flex justify-between items-end mb-3">
                <span className="text-gray-400 text-sm">Grand Total</span>
                <span className="text-2xl font-black text-primary-300 tracking-tight">{grandTotal.toLocaleString()} IQD</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSendOrder}
                  disabled={localItems.length === 0}
                  className="btn-ghost flex items-center justify-center gap-2 border-warning/30 text-amber-400 hover:bg-warning-dim hover:border-warning/50 hover:text-amber-300 disabled:opacity-30"
                >
                  <Send size={16} /> Send Order
                </button>
                <button
                  onClick={handlePayAndClear}
                  disabled={grandTotal === 0}
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <CreditCard size={16} /> Pay & Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
