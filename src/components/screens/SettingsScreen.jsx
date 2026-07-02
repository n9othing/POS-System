import { useState } from 'react';
import { Save, Info } from 'lucide-react';

/**
 * SettingsScreen — Store configuration panel.
 */
export function SettingsScreen() {
  const [storeName, setStoreName] = useState('Antigravity POS');
  const [taxPct,    setTaxPct]    = useState('10');
  const [currency,  setCurrency]  = useState('IQD');
  const [saved,     setSaved]     = useState(false);

  const handleSave = () => {
    // TODO: persist to Zustand settings store + localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sysInfo = [
    { label: 'Version',  value: '2.0.0' },
    { label: 'Stack',    value: 'React + Vite + Electron + Zustand' },
    { label: 'Theme',    value: 'Dark Glassmorphism' },
    { label: 'Database', value: 'SQLite (via Electron IPC)' },
  ];

  return (
    <div className="p-8 w-full overflow-y-auto custom-scrollbar">

      <header className="mb-7 animate-fade-slide">
        <p className="section-label mb-2">Configuration</p>
        <h2 className="text-3xl font-black tracking-tight text-white">System Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Configure your store preferences</p>
      </header>

      <div className="max-w-2xl space-y-5">

        {/* Store info */}
        <div className="glass-panel rounded-2xl p-6 space-y-5 animate-fade-slide" style={{ animationDelay: '0.05s' }}>
          <h3 className="text-sm font-bold text-primary-400 uppercase tracking-wider">Store Information</h3>

          <div>
            <label className="text-xs text-gray-500 block mb-1.5 font-medium">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="input-glass rounded-xl w-full py-3 px-4 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">Tax Rate (%)</label>
              <input
                type="number"
                value={taxPct}
                onChange={(e) => setTaxPct(e.target.value)}
                className="input-glass rounded-xl w-full py-3 px-4 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-glass rounded-xl w-full py-3 px-4 text-sm h-[46px]"
              >
                <option value="IQD" style={{ background: '#0C0C11' }}>IQD — Iraqi Dinar</option>
                <option value="USD" style={{ background: '#0C0C11' }}>USD — US Dollar</option>
                <option value="EUR" style={{ background: '#0C0C11' }}>EUR — Euro</option>
              </select>
            </div>
          </div>
        </div>

        {/* System info */}
        <div className="glass-panel rounded-2xl p-6 animate-fade-slide" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-5">
            <Info size={15} className="text-primary-400" />
            <h3 className="text-sm font-bold text-primary-400 uppercase tracking-wider">System Info</h3>
          </div>
          <div className="space-y-0">
            {sysInfo.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex justify-between items-center py-3 ${i < sysInfo.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="text-gray-300 font-mono text-xs bg-dark-700/60 px-2.5 py-1 rounded-lg">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Success feedback */}
        {saved && (
          <div className="bg-success-dim border border-success/25 text-emerald-400 text-sm p-3.5 rounded-xl text-center animate-scale-in">
            ✅ Settings saved successfully!
          </div>
        )}

        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save size={15} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
