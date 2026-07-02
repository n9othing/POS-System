import { create } from 'zustand';

/**
 * useCartStore
 * Global shopping cart for the Sales Terminal.
 * Subtotal is derived on every access (no stale values).
 */
export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => {
    if (product.stock <= 0) return { error: 'OUT_OF_STOCK' };

    const existing = get().items.find((i) => i.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) return { error: 'EXCEEDS_STOCK' };
      set({
        items: get().items.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        ),
      });
    } else {
      set({
        items: [
          ...get().items,
          {
            id: product.id,
            barcode: product.barcode,
            name: product.name,
            price: product.price,
            category: product.category,
            qty: 1,
          },
        ],
      });
    }
    return { error: null };
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  updateQty: (id, delta) => {
    set({
      items: get()
        .items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0),
    });
  },

  clearCart: () => set({ items: [] }),

  /** Derived: total price of all cart items */
  getSubtotal: () =>
    get().items.reduce((acc, item) => acc + item.price * item.qty, 0),
}));
