import { create } from 'zustand';

const TABLES_KEY = 'aram_pos_tables';

// Helper to generate 12 default tables
const generateDefaultTables = () => {
  const tables = [];
  for (let i = 1; i <= 12; i++) {
    tables.push({
      id: `table-${i}`,
      number: i,
      status: 'available', // available, occupied, pending_order
      currentOrder: [],
      total: 0,
      seats: i <= 4 ? 2 : (i <= 8 ? 4 : 6), // Mix of 2, 4, and 6 seaters
    });
  }
  return tables;
};

const loadTables = () => {
  try {
    const saved = localStorage.getItem(TABLES_KEY);
    return saved ? JSON.parse(saved) : generateDefaultTables();
  } catch {
    return generateDefaultTables();
  }
};

export const useRestaurantStore = create((set, get) => ({
  tables: loadTables(),

  // Change a table's status manually or automatically
  updateTableStatus: (id, status) => {
    set((state) => {
      const updated = state.tables.map((t) =>
        t.id === id ? { ...t, status } : t
      );
      localStorage.setItem(TABLES_KEY, JSON.stringify(updated));
      return { tables: updated };
    });
  },

  // Add items to a table's current order
  addItemsToTable: (id, items) => {
    set((state) => {
      const updated = state.tables.map((t) => {
        if (t.id !== id) return t;

        // Merge new items with existing items or add them
        let newOrder = [...t.currentOrder];
        items.forEach((newItem) => {
          // Find item with same id AND same note
          const existing = newOrder.find((i) => i.id === newItem.id && i.note === newItem.note);
          if (existing) {
            existing.qty += newItem.qty;
          } else {
            newOrder.push({ ...newItem, kitchenStatus: 'Preparing' });
          }
        });

        const newTotal = newOrder.reduce((sum, item) => sum + (item.price * item.qty), 0);
        
        // Auto-change status if it was available
        const newStatus = t.status === 'available' ? 'occupied' : t.status;

        return { ...t, currentOrder: newOrder, total: newTotal, status: newStatus };
      });

      localStorage.setItem(TABLES_KEY, JSON.stringify(updated));
      return { tables: updated };
    });
  },

  // Clear table after payment
  clearTable: (id) => {
    set((state) => {
      const updated = state.tables.map((t) =>
        t.id === id ? { ...t, status: 'available', currentOrder: [], total: 0 } : t
      );
      localStorage.setItem(TABLES_KEY, JSON.stringify(updated));
      return { tables: updated };
    });
  },
  
  // Set explicit current order (useful if editing quantities down or removing items)
  setTableOrder: (id, newOrder) => {
    set((state) => {
      const updated = state.tables.map((t) => {
        if (t.id !== id) return t;
        const newTotal = newOrder.reduce((sum, item) => sum + (item.price * item.qty), 0);
        return { ...t, currentOrder: newOrder, total: newTotal };
      });
      localStorage.setItem(TABLES_KEY, JSON.stringify(updated));
      return { tables: updated };
    });
  }
}));
