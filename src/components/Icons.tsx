import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
    className={className}
  >
    <path d="M8 5v14l11-7z"/>
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
    className={className}
  >
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
    stroke={color} 
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export const HeartOutlineIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 21.35c-1.35-1.22-2.74-2.62-4.15-4.19C4.4 13.36 2 10.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 1.78-2.4 4.86-5.85 8.66-1.41 1.57-2.8 2.97-4.15 4.19z"/>
  </svg>
);

export const WavyHeartIcon: React.FC<IconProps> = ({ size = 29, color = 'currentColor', className }) => {
  const heartPath = "M50 20 C72.9 0 91.7 20 91.7 40 C91.7 60 50 90 50 90 C50 90 8.3 60 8.3 40 C8.3 20 27.1 0 50 20 Z";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <clipPath id="revealMask">
          {/*
            [수정] path의 높이를 100으로 설정 (y=80에서 y=180까지).
            이제 이 마스크는 하트 전체를 덮고도 남을 만큼 충분히 커.
          */}
          <path
            id="waveMask" 
            d="M0 80 Q25 70 50 80 T100 80 L100 180 L0 180 Z" 
            style={{transform: "translateY(31px)"}} 
          />
        </clipPath>
      </defs>

      <g clipPath="url(#revealMask)">
        <path 
          fill={color} 
          d={heartPath} 
        />
      </g>
      
      <path 
        fill="none" 
        stroke={color} 
        strokeWidth="10" 
        d={heartPath} 
      />
    </svg>
  );
}

export const UploadIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
    className={className}
  >
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    <path d="M12,11L16,15H13V19H11V15H8L12,11Z"/>
  </svg>
);
