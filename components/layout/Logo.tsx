export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-800 shadow-lg shadow-orange-800/50">
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/20 to-transparent" />

        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" className="relative z-10">
          <path
            d="M11 15.5 C8 14.5 4.5 14 2 14 L2 3 C4.5 3 8 3.5 11 4.5 Z"
            fill="rgba(255,255,255,0.95)"
            style={{ animation: "logoFill 0.35s 0.1s ease both", opacity: 0 }}
          />
          <path
            d="M11 15.5 C14 14.5 17.5 14 20 14 L20 3 C17.5 3 14 3.5 11 4.5 Z"
            fill="rgba(255,255,255,0.75)"
            style={{ animation: "logoFill 0.35s 0.2s ease both", opacity: 0 }}
          />
          <line
            x1="11"
            y1="4.5"
            x2="11"
            y2="15.5"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            style={{ animation: "logoFill 0.3s 0.4s ease both", opacity: 0 }}
          />
          <line
            x1="3.5"
            y1="7"
            x2="9.5"
            y2="7.5"
            stroke="rgba(255,220,180,0.7)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ animation: "logoFill 0.25s 0.5s ease both", opacity: 0 }}
          />
          <line
            x1="3.5"
            y1="9.5"
            x2="9.5"
            y2="10"
            stroke="rgba(255,220,180,0.7)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ animation: "logoFill 0.25s 0.55s ease both", opacity: 0 }}
          />
          <line
            x1="3.5"
            y1="12"
            x2="8"
            y2="12.4"
            stroke="rgba(255,220,180,0.7)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ animation: "logoFill 0.25s 0.6s ease both", opacity: 0 }}
          />
          <line
            x1="12.5"
            y1="7.5"
            x2="18.5"
            y2="7"
            stroke="rgba(255,200,160,0.6)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ animation: "logoFill 0.25s 0.5s ease both", opacity: 0 }}
          />
          <line
            x1="12.5"
            y1="10"
            x2="18.5"
            y2="9.5"
            stroke="rgba(255,200,160,0.6)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ animation: "logoFill 0.25s 0.55s ease both", opacity: 0 }}
          />
          <line
            x1="12.5"
            y1="12.4"
            x2="17"
            y2="12"
            stroke="rgba(255,200,160,0.6)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ animation: "logoFill 0.25s 0.6s ease both", opacity: 0 }}
          />
        </svg>

        <div
          className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ animation: "logoShimmer 2.4s 0.9s ease forwards", left: "-80%" }}
        />
      </div>

      <div className="flex flex-col">
        <span className="font-serif text-xl leading-none tracking-tight text-orange-400">
          BookHaven
        </span>
        <span className="text-muted-foreground mt-0.5 text-xs font-medium tracking-widest uppercase">
          Est. 2026
        </span>
      </div>
    </div>
  );
}
