import gsap from 'gsap';
import React, { use, useEffect, useState, useRef } from 'react';

const CONFETTI_TOP_RATIO = 0.05;

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

/**
 * 간단한 하트 컨페티를 화면에 발사합니다.
 * index.tsx에서 Physics2DPlugin을 이미 register 했다고 가정합니다.
 */
export const fireHeartConfetti = (x: number, y: number, count = 20) => {
  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  const targetX = random(window.innerWidth * 0.02, window.innerWidth * 0.12);
  const targetY = random(0, Math.max(2, window.innerHeight * CONFETTI_TOP_RATIO));

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = Math.round(random(14, 26));
    el.style.position = 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.lineHeight = '1';
    
    // 랜덤 색상
    const r = Math.round(random(200, 255));
    const g = Math.round(random(20, 90));
    const b = Math.round(random(20, 90));
    el.style.color = `rgb(${r}, ${g}, ${b})`;

    el.innerHTML = `
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M50 20 C72.9 0 91.7 20 91.7 40 C91.7 60 50 90 50 90 C50 90 8.3 60 8.3 40 C8.3 20 27.1 0 50 20 Z" fill="currentColor"/>
      </svg>
    `;
    document.body.appendChild(el);

    // 좌측 상단(targetX,targetY) 방향으로 각도 계산, 스프레드는 넉넉히
    // 고정 발사 각도 + 스프레드로 제어 (음수는 위쪽 방향)
    const DESIRED_ANGLE = -120; // 원하는 발사 각도(도)
    const SPREAD_ANGLE = 25;   // ±스프레드
    const angleWithSpread = DESIRED_ANGLE + random(-SPREAD_ANGLE, SPREAD_ANGLE);

    gsap.to(el, {
      duration: random(0.9, 1.6),
      physics2D: {
        velocity: random(400, 600),
        angle: angleWithSpread,
        gravity: 600,
      },
      opacity: 0,
      scale: 0.8,
      ease: 'power1.in',
      onComplete: () => el.remove(),
    });
  }
};

export const WavyHeartIcon: React.FC<WavyHeartIconProps> = ({ size = 29, className, timeline = null, isLiked = false}) => {
  const svgRef = useRef<SVGSVGElement|null>(null);
  const prevLikedRef = useRef<boolean>(isLiked);
  const tl = timeline || gsap.timeline();
  const [color, setColor] = useState(isLiked ? '#ff4757' : '#ffffff');
  useEffect(() => {
    const wasLiked = prevLikedRef.current;
    if (!wasLiked && isLiked) {
      if(svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        try {
          fireHeartConfetti(cx, cy, 20);
        } catch{}
      }
    }
    prevLikedRef.current = isLiked;

    const currentY = gsap.getProperty("#waveMask", "translateY");
    const targetY = isLiked ? -70 : 5;
    
    if (currentY !== targetY) {
      try { tl.clear(); } catch {}
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
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} ref={svgRef}>
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
