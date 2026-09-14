export const MOD = navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'

export const Kbd = ({ children }) => (
  <kbd className="ml-2.5 rounded border border-current/30 px-1.5 py-0.5 font-mono text-[0.625rem] leading-none tracking-[0.15em] opacity-75">
    {children}
  </kbd>
)
