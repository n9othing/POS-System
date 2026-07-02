/**
 * NavItem — Sidebar navigation button with active gradient + glow indicator.
 */
export function NavItem({ icon, text, isActive, onClick, badge, delay = 0 }) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}s` }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-250 relative group focus-ring animate-fade-slide
        ${isActive
          ? 'bg-gradient-to-r from-primary-600/22 to-primary-500/8 text-primary-300 font-semibold border border-primary-500/25 shadow-inner-glow'
          : 'text-gray-500 hover:text-gray-200 hover:bg-dark-600/60 border border-transparent'
        }`}
    >
      {/* Glowing left accent bar */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300
          ${isActive ? 'h-[60%] bg-primary-400 shadow-[0_0_12px_rgba(167,139,250,0.9)] opacity-100' : 'h-0 opacity-0'}`}
      />

      {/* Icon */}
      <span className={`transition-all duration-200 flex-shrink-0 ${isActive ? 'text-primary-400 scale-110' : 'group-hover:scale-105 group-hover:text-gray-300'}`}>
        {icon}
      </span>

      {/* Label */}
      <span className="flex-1 text-left text-sm">{text}</span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-danger/90 text-white text-2xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-glow-danger animate-bounce-sm">
          {badge}
        </span>
      )}
    </button>
  );
}
