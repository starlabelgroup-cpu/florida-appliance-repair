// Custom SVG icon set — sun + bolt logo, 10 service icons, UI icons.
// All stroke-based, currentColor, no emoji anywhere in the UI.

interface IconProps {
  size?: number
  className?: string
}

function base(size: number, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  }
}

/** Brand mark: a Florida sun (aqua disc + rays) with a coral bolt. */
export function Logo({ size = 40, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <g stroke="#1FB6C9" strokeWidth="2.6" strokeLinecap="round">
        <path d="M24 2.5v4.5" />
        <path d="M24 41v4.5" />
        <path d="M2.5 24H7" />
        <path d="M41 24h4.5" />
        <path d="M8.1 8.1l3.2 3.2" />
        <path d="M36.7 36.7l3.2 3.2" />
        <path d="M39.9 8.1l-3.2 3.2" />
        <path d="M11.3 36.7l-3.2 3.2" />
      </g>
      <circle cx="24" cy="24" r="13.5" fill="#07304D" stroke="#1FB6C9" strokeWidth="2.2" />
      <path
        d="M26.6 13.5 18.4 26h4.4l-1.8 8.5 8.6-12.9h-4.7z"
        fill="#FF7A59"
        stroke="#FF7A59"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const paths: Record<string, React.ReactNode> = {
  fridge: (<><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M6 10h12" /><path d="M9 6v2M9 13v3" /></>),
  washer: (<><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M12 10.5c1.2 1.4 3.4 1.2 4.2-.4M8 6h.01M11 6h4" /></>),
  dryer: (<><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M9.8 13c.7-1 1.5 1 2.2 0M8 6h.01M11 6h4" /></>),
  oven: (<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 9h16" /><rect x="7.5" y="12" width="9" height="5" rx="1" /><path d="M7 6.5h.01M11 6.5h.01M15 6.5h.01" /></>),
  dishwasher: (<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M5 8h14" /><path d="M8.5 13.5c1.5 1.6 5.5 1.6 7 0M8.5 17c1.5 1.6 5.5 1.6 7 0M12 10.5v.01" /></>),
  freezer: (<><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M6 13h12" /><path d="M12 5.5v4M9.8 7.5h4.4M12 15.5v4M9.8 17.5h4.4" /></>),
  microwave: (<><rect x="3" y="6" width="18" height="12" rx="2" /><rect x="6" y="9" width="9" height="6" rx="1" /><path d="M18 9.5h.01M18 12.5h.01M18 15.5h.01" /></>),
  cooktop: (<><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="8.5" cy="12" r="2.4" /><circle cx="15.5" cy="12" r="1.7" /><path d="M6 20.5h.01M10 20.5h.01" /></>),
  disposal: (<><path d="M8 4h8l-.8 4H8.8z" /><path d="M8.8 8h6.4l-.6 5.5a3 3 0 0 1-5.2 0z" /><path d="M10 17.5V20M14 17.5V20" /></>),
  wine: (<><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M7 8h10" /><path d="M10 12.5h4M10 16h4M13.5 5.5h.01" /></>),
  pin: (<><path d="M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21z" /><circle cx="12" cy="10.5" r="2.3" /></>),
  phone: (<><path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 6.2 2 2 0 0 1 5 4z" /></>),
  calendar: (<><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M4 10.5h16M8 3.5v4M16 3.5v4" /></>),
  shield: (<><path d="M12 3l7 2.5V11c0 4.6-3 8.2-7 10-4-1.8-7-5.4-7-10V5.5z" /><path d="M9 11.5l2.2 2.2L15.5 9.5" /></>),
  wrench: (<><path d="M14.7 6.2a4.2 4.2 0 0 1 5.5-4L17.4 5l1.7 1.7 2.8-2.8a4.2 4.2 0 0 1-5.5 5.5L8.9 16.9a2.1 2.1 0 0 1-3 0l-1.3-1.3a2.1 2.1 0 0 1 0-3z" transform="translate(-1.6 1.2)" /></>),
  bolt: (<><path d="M13 2.5L5 13.5h5L9.5 21.5 19 10h-5.5z" /></>),
  arrow: (<><path d="M4 12h15M13 6l6 6-6 6" /></>),
  check: (<><path d="M4.5 12.5l5 5L19.5 7" /></>),
  alert: (<><path d="M12 4L2.8 20h18.4z" /><path d="M12 10v4.5M12 17.2v.01" /></>),
  mail: (<><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
}

export function Icon({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
  return <svg {...base(size, className)}>{paths[name] ?? paths.bolt}</svg>
}
