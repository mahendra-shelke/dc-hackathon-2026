export default function DigiCertLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="256" height="256" rx="48" fill="#0174C3" />
      <text
        x="128"
        y="170"
        textAnchor="middle"
        fontFamily="Arial,Helvetica,sans-serif"
        fontWeight="700"
        fontSize="140"
        fill="#FFFFFF"
      >
        DC
      </text>
    </svg>
  );
}
