export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="#C99A2E">
        <rect x="112" y="14" width="16" height="52" rx="8" transform="rotate(0 120 120)" />
        <rect x="112" y="14" width="16" height="52" rx="8" transform="rotate(45 120 120)" />
        <rect x="112" y="14" width="16" height="52" rx="8" transform="rotate(90 120 120)" />
        <rect x="112" y="14" width="16" height="52" rx="8" transform="rotate(135 120 120)" />
        <rect x="112" y="14" width="16" height="52" rx="8" transform="rotate(180 120 120)" />
        <rect x="112" y="14" width="16" height="52" rx="8" transform="rotate(225 120 120)" />
        <rect x="112" y="14" width="16" height="52" rx="8" transform="rotate(270 120 120)" />
        <rect x="112" y="14" width="16" height="52" rx="8" transform="rotate(315 120 120)" />
      </g>
      <circle cx="120" cy="120" r="38" fill="#C99A2E" stroke="#191B23" strokeWidth="7" />
    </svg>
  )
}
