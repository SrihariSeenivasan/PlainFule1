// ── Shared SVG Doodle Components for consistent design system ──

interface DoodleProps {
  size?: number;
  style?: React.CSSProperties;
  color?: string;
  className?: string;
  width?: number;
  height?: number;
  rotate?: number;
}

export const Squiggle = ({ width = 120, style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox={`0 0 ${width} 12`} width={width} height={12} style={style} aria-hidden="true">
    <path
      d={`M2,6 Q${width * 0.1},2 ${width * 0.2},6 Q${width * 0.3},10 ${width * 0.4},6 Q${width * 0.5},2 ${width * 0.6},6 Q${width * 0.7},10 ${width * 0.8},6 Q${width * 0.9},2 ${width - 2},6`}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const StarDoodle = ({ size = 20, rotate = 0, style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${rotate}deg)`, ...style }} aria-hidden="true">
    <path
      d="M12,2.5 L13.8,8.8 L20.5,8.8 L15.1,12.7 L17.0,19.0 L12,15.1 L7.0,19.0 L8.9,12.7 L3.5,8.8 L10.2,8.8 Z"
      fill={color}
      stroke={`${color}99`}
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const CircleScribble = ({ size = 60, style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox="0 0 60 60" width={size} height={size} style={style} aria-hidden="true">
    <path
      d="M30,4 C46,4 56,14 56,30 C56,46 46,56 30,56 C14,56 4,46 4,30 C4,14 14,4 30,4"
      fill="none"
      stroke={`${color}40`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="5,3"
    />
    <path
      d="M30,8 C44,7 52,17 53,30 C54,44 44,52 30,52 C17,53 8,43 7,30"
      fill="none"
      stroke={`${color}1f`}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const WavyLine = ({ width = 200, style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox={`0 0 ${width} 16`} width={width} height={16} style={style} aria-hidden="true">
    <path
      d={`M0,8 Q${width * 0.125},2 ${width * 0.25},8 Q${width * 0.375},14 ${width * 0.5},8 Q${width * 0.625},2 ${width * 0.75},8 Q${width * 0.875},14 ${width},8`}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

export const HandDrawnUnderline = ({ width = 160, style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox={`0 0 ${width} 14`} width={width} height={14} style={style} aria-hidden="true">
    <path
      d={`M3,8 C${width * 0.15},4 ${width * 0.35},11 ${width * 0.5},7 C${width * 0.65},3 ${width * 0.8},10 ${width - 3},7`}
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d={`M6,11 C${width * 0.2},9 ${width * 0.5},13 ${width * 0.75},10 C${width * 0.85},9 ${width * 0.95},11 ${width - 5},10`}
      fill="none"
      stroke={`${color}4d`}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const QuoteOpen = ({ size = 40, style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox="0 0 40 32" width={size} height={size * 0.8} style={style} aria-hidden="true">
    <path
      d="M4,20 C3,10 8,4 16,3 C17,3 18,4 18,5 C12,7 9,11 10,16 L16,16 C18,16 18,18 18,20 L18,28 C18,30 16,30 14,30 L6,30 C4,30 4,28 4,26 Z"
      fill={`${color}19`}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M24,20 C23,10 28,4 36,3 C37,3 38,4 38,5 C32,7 29,11 30,16 L36,16 C38,16 38,18 38,20 L38,28 C38,30 36,30 34,30 L26,30 C24,30 24,28 24,26 Z"
      fill={`${color}19`}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowDoodle = ({ style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox="0 0 48 24" width={48} height={24} style={style} aria-hidden="true">
    <path d="M2,12 C10,8 20,10 36,12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M30,6 L36,12 L30,18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CrossHatch = ({ size = 40, style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={style} aria-hidden="true">
    {[0, 8, 16, 24, 32].map(y => (
      <line key={`y-${y}`} x1="0" y1={y} x2="40" y2={y} stroke={`${color}26`} strokeWidth="1" />
    ))}
    {[0, 8, 16, 24, 32].map(x => (
      <line key={`x-${x}`} x1={x} y1="0" x2={x} y2="40" stroke={`${color}26`} strokeWidth="1" />
    ))}
  </svg>
);

export const ScratchCircle = ({ style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox="0 0 80 80" width={80} height={80} style={style} aria-hidden="true">
    <path
      d="M40,6 C58,5 74,20 74,40 C74,60 59,74 40,74 C21,74 6,59 6,40 C6,21 20,6 40,6 Z"
      fill={`${color}0f`}
      stroke={`${color}33`}
      strokeWidth="1.5"
      strokeDasharray="6,3"
    />
  </svg>
);

export const PaperPlane = ({ size = 32, style = {}, color = '#15803d' }: DoodleProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} style={style} aria-hidden="true">
    <path d="M2,16 L30,4 L22,28 L16,18 Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M16,18 L22,12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const WiggleLine = ({ color = '#15803d', className = '', width = 200 }: { color?: string; className?: string; width?: number }) => (
  <svg viewBox={`0 0 ${width} 10`} fill="none" className={className} aria-hidden="true">
    <path d={`M0 5 C${width * 0.125} 1,${width * 0.25} 9,${width * 0.375} 5 S${width * 0.625} 1,${width * 0.75} 5 S${width * 0.875} 9,${width} 5`} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const Sparkle = ({ color = '#15803d', className = '', size = 24 }: { color?: string; className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} width={size} height={size} aria-hidden="true">
    <path d="M12 2 L13.5 10 L22 12 L13.5 14 L12 22 L10.5 14 L2 12 L10.5 10 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

export const CircleDoodle = ({ color = '#15803d', className = '', size = 60 }: { color?: string; className?: string; size?: number }) => (
  <svg viewBox="0 0 60 60" fill="none" className={className} width={size} height={size} aria-hidden="true">
    <path d="M30 6 C46 5,55 16,54 30 S44 55,29 55 S5 44,5 29 S14 5,30 6Z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export const DoodleArrowDown = ({ color = '#15803d', className = '', size = 20 }: { color?: string; className?: string; size?: number }) => (
  <svg viewBox="0 0 20 28" fill="none" className={className} width={size} height={size} aria-hidden="true">
    <path d="M10 2 C8 8,12 14,9 22" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M5 18 L9 24 L14 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const DoodleBorder = ({ color, className = '' }: { color: string; className?: string }) => (
  <svg
    className={`absolute pointer-events-none ${className}`}
    style={{ inset: '-6px', width: 'calc(100% + 12px)', height: 'calc(100% + 12px)' }}
    preserveAspectRatio="none"
    viewBox="0 0 300 200"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 12 C70 4,220 4,294 10 S300 40,298 158 S292 196,250 197 S70 198,14 195 S2 168,2 100 S3 18,6 12Z"
      stroke={color}
      strokeWidth="2.2"
      fill="none"
      strokeDasharray="6 3"
      strokeLinecap="round"
    />
  </svg>
);

export const Scribble = ({ style = {}, color = '#15803d' }: { style?: React.CSSProperties; color?: string }) => (
  <svg viewBox="0 0 120 24" style={style} aria-hidden="true">
    <path
      d="M4,18 Q20,6 36,14 Q52,22 68,10 Q84,2 100,12 Q108,16 116,8"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
