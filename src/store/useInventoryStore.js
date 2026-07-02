import { create } from 'zustand';

/**
 * useInventoryStore
 * Manages the product catalog with automatic localStorage persistence.
 */

const DEFAULT_PRODUCTS = [
  // Retail items
  { id: 1, barcode: '1111', name: 'وایەری تایپ سی (ئەنکەر)', price: 15000, stock: 50, expireDate: '2026-12-31', icon: '🔌', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', category: 'Cables', isAvailable: true, type: 'retail' },
  { id: 2, barcode: '2222', name: 'شەحنی خێرا ٢٠ وات', price: 25000, stock: 30, expireDate: '2026-08-15', icon: '⚡', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', category: 'Cables', isAvailable: true, type: 'retail' },
  { id: 3, barcode: '3333', name: 'ئەپڵ وایەری ئۆرجیناڵ', price: 18000, stock: 45, expireDate: '2027-01-01', icon: '🪫', color: 'bg-green-500/10 text-green-500 border-green-500/20', category: 'Cables', isAvailable: true, type: 'retail' },
  { id: 4, barcode: '4444', name: 'گلاسی پارێزەر (آیفون)', price: 10000, stock: 100, expireDate: '2026-06-01', icon: '📱', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', category: 'Glass', isAvailable: true, type: 'retail' },
  { id: 5, barcode: '5555', name: 'کەیسی مۆبایل سلیڤەر', price: 12000, stock: 65, expireDate: '2027-12-31', icon: '👝', color: 'bg-pink-500/10 text-pink-500 border-pink-500/20', category: 'Cases', isAvailable: true, type: 'retail' },
  // Restaurant items
  { id: 6, barcode: 'R001', name: 'Classic Smash Burger', price: 8000, stock: 100, expireDate: '2099-12-31', icon: '🍔', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', category: 'Main Course', isAvailable: true, type: 'restaurant' },
  { id: 7, barcode: 'R002', name: 'Crispy Chicken Tenders', price: 6500, stock: 100, expireDate: '2099-12-31', icon: '🍗', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', category: 'Appetizers', isAvailable: true, type: 'restaurant' },
  { id: 8, barcode: 'R003', name: 'French Fries', price: 3000, stock: 100, expireDate: '2099-12-31', icon: '🍟', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', category: 'Appetizers', isAvailable: true, type: 'restaurant' },
  { id: 9, barcode: 'R004', name: 'Fresh Lemonade', price: 2500, stock: 100, expireDate: '2099-12-31', icon: '🍋', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', category: 'Drinks', isAvailable: true, type: 'restaurant' },
  { id: 10, barcode: 'R005', name: 'Cola Zero', price: 1500, stock: 100, expireDate: '2099-12-31', icon: '🥤', color: 'bg-red-500/10 text-red-500 border-red-500/20', category: 'Drinks', isAvailable: true, type: 'restaurant' },
];

const ICON_MAP = { Glass: '📱', Cases: '👝', 'Main Course': '🥘', Appetizers: '🍟', Drinks: '🥤' };
const COLOR_MAP = {
  Glass: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  Cases: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  Cables: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Main Course': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Appetizers: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Drinks: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

const load = () => {
  try {
    const saved = localStorage.getItem('aram_pos_products');
    if (saved) {
      const parsed = JSON.parse(saved).map(p => {
        if (!p.type) {
          // If type is missing, assume ids <= 5 are retail, others are restaurant
          return { ...p, type: p.id <= 5 ? 'retail' : 'restaurant' };
        }
        return p;
      });
      const missingDefaults = DEFAULT_PRODUCTS.filter(
        (dp) => !parsed.some((p) => p.id === dp.id)
      );
      return [...parsed, ...missingDefaults];
    }
    return DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
};

const save = (products) => {
  localStorage.setItem('aram_pos_products', JSON.stringify(products));
};

export const useInventoryStore = create((set, get) => ({
  products: load(),

  addProduct: ({ barcode, name, price, stock, expireDate, category, isAvailable = true, type = 'retail' }) => {
    const newProduct = {
      id: Date.now(),
      barcode,
      name,
      price: Number(price),
      stock: Number(stock),
      expireDate: expireDate || '2027-12-31',
      category,
      icon: ICON_MAP[category] || '🔌',
      color: COLOR_MAP[category] || COLOR_MAP.Cables,
      isAvailable,
      type,
    };
    const updated = [...get().products, newProduct];
    save(updated);
    set({ products: updated });
  },

  deleteProduct: (id) => {
    const updated = get().products.filter((p) => p.id !== id);
    save(updated);
    set({ products: updated });
  },

  /**
   * Deduct quantities sold from stock after a successful payment.
   * @param {Array<{id, qty}>} soldItems
   */
  deductStock: (soldItems) => {
    const updated = get().products.map((prod) => {
      const sold = soldItems.find((i) => i.id === prod.id);
      return sold ? { ...prod, stock: prod.stock - sold.qty } : prod;
    });
    save(updated);
    set({ products: updated });
  },
}));
