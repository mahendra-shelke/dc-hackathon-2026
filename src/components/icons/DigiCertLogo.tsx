export default function DigiCertLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="dc-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0174C3" />
          <stop offset="100%" stopColor="#00B4FF" />
        </linearGradient>
      </defs>
      {/* Background rounded square */}
      <rect width="256" height="256" rx="48" fill="url(#dc-bg-grad)" />
      {/* Letter "d" */}
      <text
        x="128"
        y="180"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="180"
        fill="#FFFFFF"
      >
        d
      </text>
    </svg>
  );
}
