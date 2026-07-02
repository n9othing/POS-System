import { useState } from 'react';
import { Plus, Camera, CameraOff, Package } from 'lucide-react';
import { useBarcode } from '../../hooks/useBarcode';

const CATEGORIES = {
  retail: ['Cables', 'Glass', 'Cases'],
  restaurant: ['Appetizers', 'Main Course', 'Drinks']
};

/**
 * ProductsScreen — Inventory management with barcode scanner support.
 */
export function ProductsScreen({ products, addProduct, deleteProduct, currentUser, posMode = 'retail' }) {
  const isAdmin = currentUser?.role === 'Admin';

  const [form, setForm] = useState({
    barcode: '', name: '', price: '', stock: '', expireDate: '', category: CATEGORIES[posMode]?.[0] || 'Cables',
  });

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const handleScan  = (code) => updateField('barcode', code);

  const { showScanner, openScanner, closeScanner } = useBarcode({
    onScan: handleScan,
    containerId: 'product-barcode-reader',
  });

  const handleAdd = () => {
    if (!form.barcode || !form.name || !form.price || !form.stock) return;
    addProduct({ ...form, type: posMode });
    setForm({ barcode: '', name: '', price: '', stock: '', expireDate: '', category: CATEGORIES[posMode]?.[0] || 'Cables' });
  };

  return (
    <div className="p-8 w-full overflow-y-auto custom-scrollbar">

      {/* ── Header ── */}
      <header className="mb-7 animate-fade-slide">
        <p className="section-label mb-2">Inventory</p>
        <h2 className="text-3xl font-black tracking-tight text-white">Product List</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your inventory and add new items</p>
      </header>

      {/* ── Add Product Form — Admin only ── */}
      {isAdmin && (
        <div className="glass-panel rounded-2xl p-6 mb-6 animate-fade-slide" style={{ animationDelay: '0.05s' }}>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold text-primary-400">Add New Product</h3>
            <button
              onClick={showScanner ? closeScanner : openScanner}
              className={showScanner ? 'btn-danger py-2 px-3.5 text-xs' : 'btn-ghost py-2 px-3.5 text-xs'}
            >
              {showScanner ? <><CameraOff size={14} /> Close Camera</> : <><Camera size={14} /> Scan Barcode</>}
            </button>
          </div>

          {showScanner && (
            <div className="mb-5 glass-xs border border-white/[0.04] p-4 rounded-xl max-w-md mx-auto animate-fade-in">
              <div id="product-barcode-reader" className="w-full rounded-lg overflow-hidden" />
              <p className="text-center text-xs text-primary-400 mt-2 animate-pulse">
                خەریکی گەڕانە بەدوای بارکۆد... کاڵاکە بهێنە بەردەم کامێراکە
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { field: 'barcode', label: 'Barcode',     placeholder: '123456', type: 'text' },
              { field: 'name',    label: 'Product Name',placeholder: 'Name',   type: 'text' },
              { field: 'price',   label: 'Price (IQD)', placeholder: '0',      type: 'number' },
              { field: 'stock',   label: 'Stock Qty',   placeholder: '0',      type: 'number' },
            ].map(({ field, label, placeholder, type }) => (
              <div key={field}>
                <label className="text-xs text-gray-500 block mb-1.5 font-medium">{label}</label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={(e) => updateField(field, e.target.value)}
                  placeholder={placeholder}
                  className="input-glass rounded-xl w-full py-2.5 px-3.5 text-sm"
                />
              </div>
            ))}

            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">Expire Date</label>
              <input
                type="date"
                value={form.expireDate}
                onChange={(e) => updateField('expireDate', e.target.value)}
                className="input-glass rounded-xl w-full py-2.5 px-3.5 text-sm h-[42px]"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="input-glass rounded-xl w-full py-2.5 px-3.5 text-sm h-[42px]"
              >
                {CATEGORIES[posMode]?.map((c) => (
                  <option key={c} value={c} style={{ background: '#0C0C11' }}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus size={15} />
            Save Product
          </button>
        </div>
      )}

      {/* ── Products Table ── */}
      <div className="glass-panel rounded-2xl overflow-hidden animate-fade-slide" style={{ animationDelay: '0.1s' }}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {['Barcode', 'Name', 'Price', 'Stock', 'Expire Date', 'Category', ...(isAdmin ? ['Action'] : [])].map((h) => (
                  <th key={h} className="py-3.5 px-5 font-semibold text-2xs tracking-[0.1em] uppercase text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((item, i) => (
                <tr
                  key={item.id}
                  style={{ animationDelay: `${i * 0.03}s` }}
                  className="text-gray-300 border-b border-white/[0.03] last:border-0 hover:bg-dark-600/30 transition-colors animate-fade-in"
                >
                  <td className="py-3.5 px-5 font-mono text-gray-600 text-xs">{item.barcode}</td>
                  <td className="py-3.5 px-5 font-semibold text-gray-200">{item.name}</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold">{item.price.toLocaleString()} IQD</td>
                  <td className="py-3.5 px-5">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-full
                      ${item.stock <= 0 ? 'bg-danger-dim text-red-400 border border-danger/20'
                        : item.stock < 10 ? 'bg-warning-dim text-amber-400 border border-warning/20'
                        : 'text-gray-400'}`}>
                      {item.stock <= 0 ? 'Out of stock' : item.stock}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-gray-600 text-xs">{item.expireDate}</td>
                  <td className="py-3.5 px-5">
                    <span className="badge-primary">{item.category}</span>
                  </td>
                  {isAdmin && (
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => deleteProduct(item.id)}
                        className="btn-danger text-xs py-1.5 px-3"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="py-16 text-center">
                    <Package size={40} className="text-dark-500 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No products found. Add some above.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
