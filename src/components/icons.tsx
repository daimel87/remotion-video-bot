export const ZincIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" stroke="#9be1ff" strokeWidth="3" />
    <circle cx="24" cy="24" r="4" fill="#9be1ff" />
    <ellipse
      cx="24"
      cy="24"
      rx="18"
      ry="8"
      stroke="#9be1ff"
      strokeWidth="2.5"
      transform="rotate(30 24 24)"
    />
    <ellipse
      cx="24"
      cy="24"
      rx="18"
      ry="8"
      stroke="#9be1ff"
      strokeWidth="2.5"
      transform="rotate(-30 24 24)"
    />
  </svg>
);

export const BrainIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M16 8c-4 0-7 3-7 7 0 2 1 3.5 2.5 4.5C10 21 9 23 9 25c0 3.5 2.5 6 6 6.5V36c0 2 1.5 4 4 4h2V8h-5z"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M32 8c4 0 7 3 7 7 0 2-1 3.5-2.5 4.5 1.5 1.5 2.5 3.5 2.5 5.5 0 3.5-2.5 6-6 6.5V36c0 2-1.5 4-4 4h-2V8h5z"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
    />
  </svg>
);

export const EnergyIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" stroke="#9be1ff" strokeWidth="2.5" />
    <path d="M26 8 L14 26 H22 L20 40 L34 20 H26 Z" fill="#9be1ff" />
  </svg>
);

export const HeartIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 40 C24 40 6 29 6 17 C6 11 10 7 16 7 C20 7 23 9.5 24 13 C25 9.5 28 7 32 7 C38 7 42 11 42 17 C42 29 24 40 24 40 Z"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M12 22 L18 22 L21 16 L26 28 L29 22 L36 22"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StepsIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M6 40 V32 H16 V24 H26 V16 H36 V8 H42"
      stroke="#9be1ff"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="42" cy="8" r="3" fill="#9be1ff" />
  </svg>
);

export const RouteIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="10" cy="38" r="4" stroke="#9be1ff" strokeWidth="2.5" />
    <path
      d="M10 34 C10 20 38 28 38 14"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
      strokeDasharray="4 4"
    />
    <path d="M32 6 L44 12 L32 18 Z" fill="#9be1ff" />
  </svg>
);

export const SunIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="10" fill="#9be1ff" />
    {Array.from({length: 8}).map((_, i) => {
      const angle = (i * Math.PI) / 4;
      const x1 = 24 + Math.cos(angle) * 15;
      const y1 = 24 + Math.sin(angle) * 15;
      const x2 = 24 + Math.cos(angle) * 22;
      const y2 = 24 + Math.sin(angle) * 22;
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#9be1ff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

export const TomatoIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="26" r="16" stroke="#9be1ff" strokeWidth="2.5" />
    <path
      d="M24 10 C22 13 20 14 17 14 M24 10 C26 13 28 14 31 14 M24 10 V16"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const LeafIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M10 38 C10 18 30 10 40 10 C40 22 32 40 10 38 Z"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
    />
    <path d="M12 36 C18 28 26 20 38 12" stroke="#9be1ff" strokeWidth="2" fill="none" />
  </svg>
);

export const MagnifierIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="21" cy="21" r="13" stroke="#9be1ff" strokeWidth="3" />
    <line x1="30" y1="30" x2="40" y2="40" stroke="#9be1ff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const ChartIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M6 42 V10 M6 42 H42" stroke="#9be1ff" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M10 34 L18 24 L26 28 L40 8"
      stroke="#9be1ff"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M32 8 H40 V16" stroke="#9be1ff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FlameIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 6 C24 6 14 16 14 26 C14 33 18.5 38 24 38 C29.5 38 34 33 34 26 C34 20 30 16 28 12 C28 18 24 20 24 24 C24 18 20 16 24 6 Z"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
      strokeLinejoin="round"
    />
  </svg>
);

export const CrossIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" stroke="#9be1ff" strokeWidth="2.5" />
    <path
      d="M24 14 V34 M14 24 H34"
      stroke="#9be1ff"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const TagIcon: React.FC<{size?: number}> = ({size = 48}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M6 22 L22 6 H38 V22 L22 38 Z"
      stroke="#9be1ff"
      strokeWidth="2.5"
      fill="none"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="14" r="3" fill="#9be1ff" />
  </svg>
);
