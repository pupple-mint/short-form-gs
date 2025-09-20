import gsap from 'gsap';
import React, { useEffect, useState } from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

interface WavyHeartIconProps extends IconProps {
  timeline?: gsap.core.Timeline;
  isLiked?: boolean;
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

export const WavyHeartIcon: React.FC<WavyHeartIconProps> = ({ size = 29, className, timeline = null, isLiked = false}) => {
  const tl = timeline || gsap.timeline();
  const [color, setColor] = useState(isLiked ? '#ff4757' : '#ffffff');
  useEffect(() => {
    const currentY = gsap.getProperty("#waveMask", "translateY");
    const targetY = isLiked ? -70 : 5;
    
    if (currentY !== targetY) {
      if (isLiked) {
        setColor('#ff4757');
      }
      tl.to("#waveMask", {
        translateY: targetY,
        duration: 1.6,
        ease: "power2.inOut",
        onComplete: () => {
          if (!isLiked) {
            setColor('#fff');
          }
        }
      });
      tl.fromTo("#waveMask", {translateX: -12}, {
        translateX: 12,
        duration: 0.2,
        ease: "power2.inOut",
        repeat: 8,
        yoyo: true,
      }, 0);
    }
  }, [isLiked, tl]);

  const heartPath = "M50 20 C72.9 0 91.7 20 91.7 40 C91.7 60 50 90 50 90 C50 90 8.3 60 8.3 40 C8.3 20 27.1 0 50 20 Z";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <clipPath id="revealMask">
          <path
            id="waveMask" 
            d="M0 80 Q25 70 50 80 T100 80 L100 180 L0 180 Z" 
            style={{transform: "translateY(5px)"}} 
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
