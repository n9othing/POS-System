import { create } from 'zustand';

/**
 * useSessionStore
 * Manages authenticated user, active navigation tab, and POS mode.
 */

const USERS_KEY = 'aram_pos_users';
const REVENUE_KEY = 'aram_total_revenue';
const ORDERS_KEY = 'aram_total_orders';

const DEFAULT_USERS = [{ id: 1, name: 'admin', password: '123456', role: 'Admin' }];

const loadUsers = () => {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

export const useSessionStore = create((set, get) => ({
  // ── Auth ──────────────────────────────────────────
  currentUser: null,
  users: loadUsers(),

  verifyLogin: (username, password) => {
    const user = get().users.find(
      (u) => u.name === username && u.password === password
    );
    return user ? { success: true, user } : { success: false };
  },

  completeLogin: (user, mode) => {
    localStorage.setItem('aram_pos_mode', mode);
    set({ currentUser: user, activeTab: 'Sales', posMode: mode });
  },

  logout: () => set({ currentUser: null, activeTab: 'Sales' }),

  addUser: (name, password) => {
    const newUser = { id: Date.now(), name, password, role: 'Cashier' };
    const updated = [...get().users, newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    set({ users: updated });
  },

  // ── Navigation ────────────────────────────────────
  activeTab: 'Sales',
  setTab: (tab) => set({ activeTab: tab }),

  // ── POS Mode ──────────────────────────────────────
  // 'retail' = mobile shop / product grid
  // 'restaurant' = table floor plan (future phase)
  posMode: localStorage.getItem('aram_pos_mode') || 'retail',
  setMode: (mode) => {
    localStorage.setItem('aram_pos_mode', mode);
    set({ posMode: mode });
  },

  // ── Revenue Tracking ──────────────────────────────
  totalRevenue: Number(localStorage.getItem(REVENUE_KEY)) || 0,
  totalOrders: Number(localStorage.getItem(ORDERS_KEY)) || 0,

  addSale: (amount) => {
    const newRevenue = get().totalRevenue + amount;
    const newOrders = get().totalOrders + 1;
    localStorage.setItem(REVENUE_KEY, newRevenue);
    localStorage.setItem(ORDERS_KEY, newOrders);
    set({ totalRevenue: newRevenue, totalOrders: newOrders });
  },

  resetDayTotals: () => {
    localStorage.setItem(REVENUE_KEY, 0);
    localStorage.setItem(ORDERS_KEY, 0);
    set({ totalRevenue: 0, totalOrders: 0 });
  },
}));
