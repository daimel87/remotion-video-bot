import {AbsoluteFill} from 'remotion';

export const TechGrid: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#050b1f'}}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(70,110,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(70,110,255,0.18) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(70,110,255,0.25) 0%, rgba(5,11,31,0) 60%)',
        }}
      />
    </AbsoluteFill>
  );
};
