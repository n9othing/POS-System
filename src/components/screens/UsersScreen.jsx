import { useState } from 'react';
import { useSessionStore } from '../../store/useSessionStore';
import { UserPlus, ShieldCheck } from 'lucide-react';

/**
 * UsersScreen — Staff account management (Admin only).
 */
export function UsersScreen() {
  const { users, addUser } = useSessionStore();
  const [uName, setUName]     = useState('');
  const [uPass, setUPass]     = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!uName.trim() || !uPass.trim()) return;
    if (users.find((u) => u.name === uName.trim())) {
      setMessage({ type: 'error', text: '⚠️ ئەم بەکارهێنەرە پێشتر تۆمارکراوە!' });
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addUser(uName.trim(), uPass.trim());
    setUName('');
    setUPass('');
    setMessage({ type: 'success', text: '✅ بەکارهێنەری نوێ زیادکرا!' });
    setTimeout(() => setMessage(''), 3000);
  };

  const roleStyles = {
    Admin:   'bg-primary-600/15 text-primary-300 border border-primary-500/25',
    Cashier: 'bg-info-dim text-sky-400 border border-info/20',
  };

  return (
    <div className="p-8 w-full overflow-y-auto custom-scrollbar">

      <header className="mb-7 animate-fade-slide">
        <p className="section-label mb-2">Staff</p>
        <h2 className="text-3xl font-black tracking-tight text-white">User Management</h2>
        <p className="text-gray-500 text-sm mt-1">Manage staff accounts and permissions</p>
      </header>

      <div className="grid grid-cols-3 gap-6">

        {/* ── Staff List ── */}
        <div className="col-span-2 glass-panel rounded-2xl p-6 animate-fade-slide" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-gray-200">Active Staff</h3>
            <span className="badge-primary">{users.length} users</span>
          </div>

          <div className="space-y-2">
            {users.map((u, i) => (
              <div
                key={u.id}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="flex items-center justify-between glass-xs border border-white/[0.04] p-3.5 rounded-xl hover:border-primary-500/20 transition-all duration-200 animate-fade-slide"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600/35 to-primary-400/15 border border-primary-500/25 text-primary-300 flex items-center justify-center font-black text-sm flex-shrink-0">
                    {u.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200 text-sm">{u.name}</p>
                    <p className="text-2xs text-gray-700 font-mono">ID: {u.id}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleStyles[u.role] ?? roleStyles.Cashier}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Add User Form ── */}
        <div className="glass-panel rounded-2xl p-6 h-fit animate-fade-slide" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-5">
            <UserPlus size={16} className="text-primary-400" />
            <h3 className="text-sm font-bold text-primary-400">Add New User</h3>
          </div>

          {message && (
            <div className={`text-xs p-3 rounded-xl mb-4 text-center border animate-fade-in
              ${message.type === 'success'
                ? 'bg-success-dim border-success/25 text-emerald-400'
                : 'bg-danger-dim border-danger/25 text-red-400'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">Username</label>
              <input
                type="text"
                value={uName}
                onChange={(e) => setUName(e.target.value)}
                placeholder="cashier01"
                className="input-glass rounded-xl w-full py-2.5 px-3.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={uPass}
                onChange={(e) => setUPass(e.target.value)}
                placeholder="••••••••"
                className="input-glass rounded-xl w-full py-2.5 px-3.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 p-3 glass-xs rounded-xl border border-white/[0.04]">
              <ShieldCheck size={14} className="text-sky-400 flex-shrink-0" />
              <p className="text-2xs text-gray-600">New accounts are assigned the <span className="text-sky-400 font-bold">Cashier</span> role by default.</p>
            </div>
            <button type="submit" className="btn-primary w-full">
              <UserPlus size={15} />
              Add User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
