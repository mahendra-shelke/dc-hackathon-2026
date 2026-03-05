export default function DigiCertLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="dc-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0174C3" />
          <stop offset="100%" stopColor="#00B4FF" />
        </linearGradient>
        <linearGradient id="dc-inner-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Background rounded square */}
      <rect width="256" height="256" rx="48" fill="url(#dc-shield-grad)" />
      {/* Shield shape */}
      <path
        d="M128 36L56 68v48c0 52.8 30.72 102.24 72 114.24 41.28-12 72-61.44 72-114.24V68L128 36z"
        fill="url(#dc-inner-grad)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="3"
      />
      {/* Checkmark */}
      <path
        d="M100 128l20 22 36-40"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle keyhole accent */}
      <circle cx="128" cy="98" r="8" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}
