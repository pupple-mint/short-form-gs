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
export const fireHeartConfetti = (x: number, y: number, count = 20, onReturn?: () => void) => {
  const random = (min: number, max: number) => Math.random() * (max - min) + min;
  let returnCallbackCalled = false; // 한 번만 호출되도록 플래그

  const targetX = random(window.innerWidth * 0.02, window.innerWidth * 0.12);
  const targetY = random(0, Math.max(2, window.innerHeight * CONFETTI_TOP_RATIO));

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = Math.round(random(14, 26));
    el.style.position = 'fixed';
    // 초기 좌표를 엘리먼트 중심 기준이 아닌 좌상단으로 맞추어 transform 충돌을 피함
    el.style.left = `${x - size / 2}px`;
    el.style.top = `${y - size / 2}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    // physics2D가 transform을 사용하므로 초기 transform을 0으로 설정
    el.style.transform = 'translate(0, 0)';
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

    const peakDuration = random(0.9, 1.3); // 발사하여 최고점까지 걸리는 시간
    const holdDuration = 0.12; // 최고점에서 잠깐 멈춤
    const returnDuration = 0.6; // 복귀 지속시간

    const pTl = gsap.timeline({
      onComplete: () => el.remove(),
    });

    // 1) 발사(physics)
    pTl.to(el, {
      duration: peakDuration,
      physics2D: {
        velocity: random(300, 700),
        angle: angleWithSpread,
        gravity: 450,
      },
      scale: 1,
      ease: 'power1.out',
    });

    // 2) 잠깐 정지
    pTl.to({}, { duration: holdDuration });

    // 3) 현재 화면상의 위치를 left/top으로 고정시키고 아이콘 중심(x,y)으로 복귀시키기
    pTl.add(() => {
      // 현재 시각적 중심 좌표를 계산하여 left/top으로 설정 (teleport 방지)
      const r = el.getBoundingClientRect();
      const centerX = r.left + r.width / 2;
      const centerY = r.top + r.height / 2;
      // 좌상단 기준 좌표로 변환
      el.style.left = `${centerX - size / 2}px`;
      el.style.top = `${centerY - size / 2}px`;
      // transform을 제거하여 left/top 기반으로 자연스럽게 이어지게 함
      try { gsap.set(el, { clearProps: 'transform' }); } catch {}
      // 복귀 애니메이션 시작 시 콜백(예: 하트 물채우기 시작) — 한 번만 호출
      if (!returnCallbackCalled) {
        try { if (typeof onReturn === 'function') onReturn(); } catch {}
        returnCallbackCalled = true;
      }
    });

    pTl.to(el, {
      duration: returnDuration,
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      // 점점 작아지며 아이콘으로 흡수되도록 scale을 0으로 줄임
      scale: 0,
      
      ease: 'power4.in',
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
    const currentY = gsap.getProperty("#waveMask", "translateY");
    const targetY = isLiked ? -70 : 5;

    if (!wasLiked && isLiked) {
      // 좋아요로 전환된 경우: 컨페티 발사, 복귀 시 물채우기 시작
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        try {
          fireHeartConfetti(cx, cy, 20, () => {
            try { tl.clear(); } catch {}
            setColor('#ff4757');
            tl.to("#waveMask", {
              translateY: targetY,
              duration: 1.6,
              ease: "power2.inOut",
              onComplete: () => {
                // 복귀 후(취소 등) 색상 처리
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
          });
        } catch{}
      }
    } else {
      // 좋아요 해제 또는 기타 경우: 즉시 웨이브 애니메이션 실행
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
    }

    prevLikedRef.current = isLiked;
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
