import React, { useEffect, useRef } from 'react';

export default function ScooterCursor() {
  const cursorRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleMouseDown = (e) => {
      if (popupRef.current) {
        // Direct DOM manipulation mapping without triggering React lifecycle
        popupRef.current.style.left = `${e.clientX}px`;
        popupRef.current.style.top = `${e.clientY}px`;
        
        // Remove and re-add class to restart CSS animation cleanly
        popupRef.current.classList.remove('play-popup');
        void popupRef.current.offsetWidth; // Force CSS reflow flush
        popupRef.current.classList.add('play-popup');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    let animationFrameId;

    const render = () => {
      // Smooth linear interpolation (LERP) mapped per user specs
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (cursorRef.current) {
        // Zero top/left positional attributes - strictly 3D GPU vectors applied
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <img
        ref={cursorRef}
        src="/Scooter.png"
        alt="cursor"
        className="scooter-cursor"
      />

      {/* Persistent DOM element waiting for manual animation tracking */}
      <div ref={popupRef} className="magic-popup">
        <img src="/Open.png" alt="popup" />
      </div>

      <style>{`
        .scooter-cursor {
          position: fixed;
          left: 0;
          top: 0;
          width: 42px;
          height: auto;
          pointer-events: none;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          z-index: 9999;
          background: transparent;
          object-fit: contain;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.15));
        }

        .magic-popup {
          position: fixed;
          pointer-events: none;
          z-index: 9997;
          opacity: 0;
          transform: translate(-50%, -40px) scale(0.8);
          will-change: transform, opacity;
        }

        .magic-popup img {
          max-width: 120px;
          filter: drop-shadow(0px 8px 16px rgba(0,0,0,0.15));
          background: transparent;
        }

        .play-popup {
          animation: scooterPopupFade 1.5s forwards;
        }

        @keyframes scooterPopupFade {
          0% { opacity: 0; transform: translate(-50%, -40px) scale(0.8); }
          15% { opacity: 1; transform: translate(-50%, -70px) scale(1.05); }
          25% { opacity: 1; transform: translate(-50%, -65px) scale(1); }
          80% { opacity: 1; transform: translate(-50%, -65px) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -85px) scale(0.9); }
        }
      `}</style>
    </>
  );
}
