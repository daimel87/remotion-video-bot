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
