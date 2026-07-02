import { useState } from 'react';
import { useRestaurantStore } from '../../store/useRestaurantStore';
import { FloorPlan } from './restaurant/FloorPlan';
import { TableOrderModal } from './restaurant/TableOrderModal';

/**
 * RestaurantDashboard — Main view for Restaurant Mode.
 * Displays the Floor Plan and manages the active Table Order modal.
 */
export function RestaurantDashboard() {
  const tables = useRestaurantStore((s) => s.tables);
  const [selectedTableId, setSelectedTableId] = useState(null);

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-8 animate-fade-slide relative z-10">
      
      {/* ── Header ── */}
      <header className="mb-6 flex-shrink-0">
        <p className="section-label mb-2">Restaurant Mode</p>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">Floor Plan</h2>
            <p className="text-gray-500 text-sm mt-1">Manage tables and current orders</p>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 bg-dark-800/50 backdrop-blur border border-white/[0.04] px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-xs text-gray-400 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span className="text-xs text-gray-400 font-medium">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              <span className="text-xs text-gray-400 font-medium">Pending Order</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Floor Plan Grid ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <FloorPlan 
          tables={tables} 
          onTableClick={(table) => setSelectedTableId(table.id)} 
        />
      </div>

      {/* ── Active Table Modal ── */}
      {selectedTable && (
        <TableOrderModal 
          table={selectedTable} 
          onClose={() => setSelectedTableId(null)} 
        />
      )}
    </div>
  );
}
