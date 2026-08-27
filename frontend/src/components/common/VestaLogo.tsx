import React from 'react';

interface VestaLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const VestaLogo: React.FC<VestaLogoProps> = ({
  size = 28,
  className = '',
  style = {}
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))',
        ...style
      }}
    >
      <defs>
        <linearGradient id="vestaBoltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="35%" stopColor="#7C3AED" />
          <stop offset="70%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {/* Precision Geometric Lightning Bolt matching the Vesta Brand Icon */}
      <path
        d="M10 5.5H24.5L16.2 13.8H23L11.5 27.5L14.2 17.2H7.5L10 5.5Z"
        fill="url(#vestaBoltGradient)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VestaLogo;
