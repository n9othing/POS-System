import { Badge } from '../ui/Badge';
import { StatCard } from '../ui/StatCard';

/**
 * ExpireProductsScreen — Shows expired / out-of-stock + low-stock items.
 */
export function ExpireProductsScreen({ products }) {
  const today       = new Date().toISOString().split('T')[0];
  const expiredList = products.filter((p) => p.stock <= 0 || p.expireDate < today);
  const lowStock    = products.filter((p) => p.stock > 0 && p.stock < 10 && p.expireDate >= today);

  return (
    <div className="p-8 w-full overflow-y-auto custom-scrollbar">

      <header className="mb-7 animate-fade-slide">
        <p className="section-label mb-2">Monitoring</p>
        <h2 className="text-3xl font-black tracking-tight text-white">Inventory Status</h2>
        <p className="text-gray-500 text-sm mt-1">Expiration and low-stock alerts</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'Expired / Out of Stock', amount: expiredList.length.toString(), icon: '⚠️', color: 'text-red-400',   delay: 0.05 },
          { title: 'Low Stock (< 10 units)', amount: lowStock.length.toString(),    icon: '⏳', color: 'text-amber-400', delay: 0.1  },
          { title: 'Total Products',         amount: products.length.toString(),    icon: '📦', color: 'text-gray-200',  delay: 0.15 },
        ].map((c) => (
          <div key={c.title} className="animate-fade-slide" style={{ animationDelay: `${c.delay}s` }}>
            <StatCard title={c.title} amount={c.amount} icon={c.icon} color={c.color} />
          </div>
        ))}
      </div>

      {/* Expired table */}
      <Section title="⚠️  Expired or Out of Stock" accentClass="text-red-400" delay={0.2}>
        <Table
          columns={['Product Name', 'Stock Left', 'Price', 'Expire Date', 'Status']}
          rows={expiredList}
          renderRow={(item) => (
            <>
              <td className="py-3.5 px-5 font-semibold text-gray-200">{item.name}</td>
              <td className="py-3.5 px-5 text-red-400 font-bold">{item.stock}</td>
              <td className="py-3.5 px-5 text-emerald-400 font-bold">{item.price.toLocaleString()} IQD</td>
              <td className="py-3.5 px-5 font-mono text-xs text-gray-600">{item.expireDate}</td>
              <td className="py-3.5 px-5">
                <Badge variant="danger">{item.stock <= 0 ? 'Out of Stock' : 'Expired'}</Badge>
              </td>
            </>
          )}
          emptyMessage="No expired or out-of-stock items. Great job! ✅"
        />
      </Section>

      {/* Low stock table */}
      <Section title="⏳  Running Low (< 10 units)" accentClass="text-amber-400" delay={0.25}>
        <Table
          columns={['Product Name', 'Stock', 'Price', 'Expire Date']}
          rows={lowStock}
          renderRow={(item) => (
            <>
              <td className="py-3.5 px-5 font-semibold text-gray-200">{item.name}</td>
              <td className="py-3.5 px-5 text-amber-400 font-bold">{item.stock}</td>
              <td className="py-3.5 px-5 text-emerald-400 font-bold">{item.price.toLocaleString()} IQD</td>
              <td className="py-3.5 px-5 font-mono text-xs text-gray-600">{item.expireDate}</td>
            </>
          )}
          emptyMessage="No low-stock items."
        />
      </Section>
    </div>
  );
}

function Section({ title, accentClass, children, delay = 0 }) {
  return (
    <div
      className="glass-panel rounded-2xl p-6 mb-5 animate-fade-slide"
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className={`text-sm font-bold mb-4 ${accentClass}`}>{title}</h3>
      {children}
    </div>
  );
}

function Table({ columns, rows, renderRow, emptyMessage }) {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {columns.map((c) => (
              <th key={c} className="py-3 px-5 font-semibold text-2xs tracking-[0.1em] uppercase text-gray-600">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => (
            <tr
              key={item.id}
              style={{ animationDelay: `${i * 0.04}s` }}
              className="text-gray-400 border-b border-white/[0.03] last:border-0 hover:bg-dark-600/30 transition-colors animate-fade-in"
            >
              {renderRow(item)}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-gray-600 text-sm">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
