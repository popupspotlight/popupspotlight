export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="#C99A2E">
        <rect x="112" y="18" width="16" height="44" rx="8" transform="rotate(0 120 92)" />
        <rect x="112" y="18" width="16" height="44" rx="8" transform="rotate(45 120 92)" />
        <rect x="112" y="18" width="16" height="44" rx="8" transform="rotate(90 120 92)" />
        <rect x="112" y="18" width="16" height="44" rx="8" transform="rotate(135 120 92)" />
        <rect x="112" y="18" width="16" height="44" rx="8" transform="rotate(-45 120 92)" />
        <rect x="112" y="18" width="16" height="44" rx="8" transform="rotate(-90 120 92)" />
        <rect x="112" y="18" width="16" height="44" rx="8" transform="rotate(-135 120 92)" />
      </g>
      <circle cx="120" cy="92" r="32" fill="#C99A2E" stroke="#191B23" strokeWidth="6" />
      <rect x="58" y="128" width="140" height="22" rx="2" fill="#191B23" />
      <g fill="#191B23">
        <circle cx="72" cy="164" r="14" />
        <circle cx="100" cy="164" r="14" />
        <circle cx="128" cy="164" r="14" />
        <circle cx="156" cy="164" r="14" />
        <circle cx="184" cy="164" r="14" />
      </g>
    </svg>
  )
}
