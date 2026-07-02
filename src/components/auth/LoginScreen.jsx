import { useState, useRef, useEffect } from 'react';
import { User, Lock, Zap, Store, Utensils } from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore';

/**
 * LoginScreen — Premium animated authentication screen.
 * Glassmorphism card, animated background orbs, shake on error.
 */
export function LoginScreen() {
  const { verifyLogin, completeLogin } = useSessionStore();

  const [step, setStep] = useState('login'); // 'login' | 'mode'
  const [verifiedUser, setVerifiedUser] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const formRef = useRef(null);

  useEffect(() => { setError(''); }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      triggerShake('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 550));
    const result = verifyLogin(username.trim(), password);
    setIsLoading(false);
    if (!result.success) {
      triggerShake('Invalid username or password.');
    } else {
      setVerifiedUser(result.user);
      setStep('mode');
    }
  };

  const handleModeSelect = (mode) => {
    completeLogin(verifiedUser, mode);
  };

  const triggerShake = (msg) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="flex h-screen w-screen bg-dark-900 items-center justify-center relative overflow-hidden">

      {/* ── Animated background orbs ── */}
      <div className="absolute top-[-18%] left-[-12%] w-[650px] h-[650px] rounded-full bg-primary-500/8 blur-[150px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-22%] right-[-12%] w-[550px] h-[550px] rounded-full bg-indigo-500/7 blur-[140px] animate-float pointer-events-none" style={{ animationDelay: '3.5s' }} />
      <div className="absolute top-[38%] right-[22%] w-[320px] h-[320px] rounded-full bg-violet-600/5 blur-[100px] animate-float-slow pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.018,
        }}
      />

      {/* ── Login Card ── */}
      <div
        ref={formRef}
        className={`glass-modal rounded-3xl p-10 w-[440px] z-10 animate-scale-in ${isShaking ? 'animate-shake' : ''}`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-9">
          <div className="w-[68px] h-[68px] bg-gradient-to-br from-primary-600 to-primary-400 rounded-[22px] flex items-center justify-center mb-5 animate-pulse-glow border border-primary-400/20 shadow-glow-md">
            <Zap className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" fill="white" />
          </div>
          <h1 className="text-[26px] font-black text-white tracking-tight text-glow">Antigravity POS</h1>
          <p className="text-gray-500 text-2xs mt-1.5 tracking-[0.2em] uppercase">Point of Sale System</p>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleSubmit}>
            {/* Divider */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-dark-600" />
              <span className="section-label">Sign In</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-dark-600" />
            </div>

            <div className="space-y-4">
              {/* Error */}
              {error && (
                <div className="bg-danger-dim border border-danger/25 text-red-400 text-xs p-3.5 rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in">
                  <span className="text-base">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="text-xs text-gray-400 block mb-2 font-semibold tracking-wide">Username</label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary-400 transition-colors duration-200"
                    size={16}
                  />
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    autoComplete="username"
                    className="input-glass rounded-xl w-full py-3.5 pl-11 pr-4 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs text-gray-400 block mb-2 font-semibold tracking-wide">Password</label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary-400 transition-colors duration-200"
                    size={16}
                  />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="input-glass rounded-xl w-full py-3.5 pl-11 pr-4 text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full mt-8 py-4 text-[15px] rounded-xl"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Footer hint */}
            <p className="text-center text-gray-700 text-[11px] mt-6 tracking-wide">
              Default: <span className="text-gray-500 font-mono">admin</span> / <span className="text-gray-500 font-mono">123456</span>
            </p>
          </form>
        ) : (
          <div className="animate-fade-slide">
            {/* Divider */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-dark-600" />
              <span className="section-label">Select Mode</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-dark-600" />
            </div>
            
            <p className="text-center text-gray-400 text-sm mb-6">
              Welcome back, <span className="text-primary-400 font-bold">{verifiedUser?.name}</span>.<br /> Please choose your workspace.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleModeSelect('retail')}
                className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 transition-all hover:-translate-y-1 hover:border-primary-500/50 group"
              >
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Store size={28} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-200">Retail</h3>
                  <p className="text-2xs text-gray-500 mt-1">Mobile Shop & Accessories</p>
                </div>
              </button>
              
              <button 
                onClick={() => handleModeSelect('restaurant')}
                className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 transition-all hover:-translate-y-1 hover:border-amber-500/50 group"
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Utensils size={28} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-200">Restaurant</h3>
                  <p className="text-2xs text-gray-500 mt-1">Tables & Kitchen Orders</p>
                </div>
              </button>
            </div>
            
            <button onClick={() => setStep('login')} className="btn-ghost w-full mt-6 py-3 text-xs">
              ← Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
