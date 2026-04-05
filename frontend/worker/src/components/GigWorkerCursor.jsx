// import React, { useEffect, useState, useRef } from 'react';

// export default function GigWorkerCursor() {
//   const cursorRef = useRef(null);
  
//   const [clicked, setClicked] = useState(false);
//   const [moving, setMoving] = useState(false);
//   const clickedRef = useRef(false);

//   useEffect(() => {
//     let mouseX = window.innerWidth / 2;
//     let mouseY = window.innerHeight / 2;
//     let currentX = mouseX;
//     let currentY = mouseY;
    
//     let lastTime = performance.now();
//     let moveTimeout;

//     const handleMouseMove = (e) => {
//       mouseX = e.clientX;
//       mouseY = e.clientY;
//       setMoving(true);
//       clearTimeout(moveTimeout);
//       moveTimeout = setTimeout(() => setMoving(false), 120);
//     };

//     const handleMouseDown = () => {
//       setClicked(true);
//       clickedRef.current = true;
//       setTimeout(() => {
//         setClicked(false);
//         clickedRef.current = false;
//       }, 1500);
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('mousedown', handleMouseDown);
    
//     let animationFrameId;
//     let flip = 1;

//     const render = (time) => {
//       const dt = time - lastTime;
//       lastTime = time;

//       const dx = mouseX - currentX;
//       const dy = mouseY - currentY;
//       const speed = Math.sqrt(dx * dx + dy * dy);

//       // Only update positions if not currently clicked (frozen)
//       if (!clickedRef.current) {
//         currentX += dx * 0.25;
//         currentY += dy * 0.25;
//       }

//       // Determine facing direction (flip) based on actual movement towards mouse
//       if (dx < -1.5) flip = -1;
//       else if (dx > 1.5) flip = 1;
      
//       // Calculate off-axis tilt when moving
//       let targetRot = 0;
//       if (speed > 1.5 && !clickedRef.current) {
//         targetRot = (dy / 3);
//         if (targetRot > 15) targetRot = 15;
//         if (targetRot < -15) targetRot = -15;
//       }

//       if (cursorRef.current) {
//         cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scaleX(${flip}) rotate(${targetRot}deg)`;
//       }

//       animationFrameId = requestAnimationFrame(render);
//     };

//     animationFrameId = requestAnimationFrame(render);

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mousedown', handleMouseDown);
//       cancelAnimationFrame(animationFrameId);
//       clearTimeout(moveTimeout);
//     };
//   }, []);

//   return (
//     <>
//       <div
//         ref={cursorRef}
//         className={`gig-svg-cursor ${moving && !clicked ? 'is-moving' : ''} ${clicked ? 'is-clicked' : ''}`}
//         style={{
//           position: 'fixed',
//           left: 0,
//           top: 0,
//           width: 48,
//           height: 48,
//           pointerEvents: 'none',
//           zIndex: 9999,
//           willChange: 'transform'
//         }}
//       >
//         <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
          
//           <g className="scooter-body" transform="translate(10, 45)">
            
//             {/* Back Delivery Box */}
//             <g className="delivery-box" transform="translate(5, -15)">
//               <rect x="-5" y="-5" width="28" height="28" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
//               {/* Box Lid - Rotates open on click */}
//               <g className="box-lid">
//                 <rect x="-5" y="-5" width="28" height="6" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
//               </g>
//               <text x="9" y="14" fontSize="14" textAnchor="middle" fill="#d97706" fontWeight="bold" fontFamily="sans-serif">G</text>
//             </g>

//             {/* Scooter frame base */}
//             <path d="M 24 20 L 52 20 L 68 0 L 74 5 L 60 25 L 24 25 Z" fill="#6366f1" />
            
//             {/* Steering Handles */}
//             <path d="M 52 14 L 60 2 L 68 2" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
//             <circle cx="68" cy="2" r="3" fill="#3730a3" />

//             {/* Tailpipe / minimal details */}
//             <path d="M 20 22 L 15 22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

//             {/* Rider Character */}
//             <g className="rider">
//               {/* Body */}
//               <path d="M 33 20 C 33 -5, 52 -5, 50 15 Z" fill="#7c3aed" /> 
//               {/* Arms reaching for handles */}
//               <path d="M 45 5 C 50 2, 55 5, 58 7" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
//               {/* Helmet */}
//               <path d="M 35 -6 A 12 12 0 0 1 59 -6 Z" fill="#f43f5e" />
//               {/* Visor */}
//               <rect x="49" y="-11" width="5" height="7" fill="#fda4af" rx="2" /> 
//               {/* Tiny Backpack strap */}
//               <path d="M 40 -6 L 35 10" stroke="#5b21b6" strokeWidth="2" />
//             </g>

//             {/* Back Wheel */}
//             <g transform="translate(26, 25)">
//                <circle cx="0" cy="0" r="10" fill="#1e293b" className="wheel" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 8" />
//                <circle cx="0" cy="0" r="4" fill="#94a3b8" />
//             </g>

//             {/* Front Wheel */}
//             <g transform="translate(68, 25)">
//                <circle cx="0" cy="0" r="10" fill="#1e293b" className="wheel" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 8" />
//                <circle cx="0" cy="0" r="4" fill="#94a3b8" />
//             </g>
//           </g>

//           {/* Magical Floating Popup on Click */}
//           <g className="gig-popup" transform="translate(15, -45)" opacity="0">
//             {/* Tail */}
//             <polygon points="18,34 26,34 22,42" fill="#fff" />
//             {/* Box */}
//             <rect x="-10" y="4" width="60" height="30" rx="8" fill="#fff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
//             {/* Icon / text */}
//             <text x="20" y="24" fontSize="13" fill="#6d28d9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">📦 Pack</text>
//           </g>
          
//           {/* Optional faint smoke puffs attached inside SVG so they travel with the element but are animated */}
//           <g className="smoke-puff">
//              <circle cx="10" cy="65" r="4" fill="#cbd5e1" opacity="0.6" />
//           </g>
//           <g className="smoke-puff" style={{ animationDelay: '0.2s' }}>
//              <circle cx="-5" cy="63" r="6" fill="#e2e8f0" opacity="0.4" />
//           </g>

//         </svg>
//       </div>

//       <style>{`
//         /* Base / Default SVG states */
//         .scooter-body {
//            transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
//         }

//         .box-lid {
//            transform-origin: top left;
//            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
//         }

//         .rider {
//            transform-origin: 40px 10px;
//            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
//         }
        
//         .smoke-puff circle {
//            opacity: 0;
//            transform: scale(0.5);
//            transition: opacity 0.2s;
//         }

//         /* Moving State (wheels spinning, suspension bounce, trailing smoke) */
//         .is-moving .scooter-body {
//            animation: suspensionBounce 0.4s infinite alternate ease-in-out;
//         }

//         .is-moving .wheel {
//            animation: wheelSpin 0.45s linear infinite;
//            transform-origin: 0 0;
//         }

//         .is-moving .smoke-puff circle {
//            animation: smokeTrail 0.6s infinite linear;
//         }

//         /* Clicked Event States (Stopped, look back, open box, tooltip) */
//         .is-clicked .scooter-body {
//            animation: none !important;
//         }

//         .is-clicked .box-lid {
//            transform: rotate(-110deg) translateX(-2px) translateY(-5px);
//         }

//         .is-clicked .rider {
//            transform: rotate(-25deg);
//         }

//         .is-clicked .gig-popup {
//            animation: toolTipPop 1.4s cubic-bezier(0.2, 1, 0.3, 1) forwards;
//         }

//         @keyframes suspensionBounce {
//           0% { transform: translate(10px, 46px); }
//           100% { transform: translate(10px, 44px); }
//         }

//         @keyframes wheelSpin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes toolTipPop {
//           0% { opacity: 0; transform: translate(10px, -20px) scale(0.6); }
//           15% { opacity: 1; transform: translate(15px, -35px) scale(1.05); }
//           25% { opacity: 1; transform: translate(15px, -30px) scale(1); }
//           85% { opacity: 1; transform: translate(15px, -30px) scale(1); }
//           100% { opacity: 0; transform: translate(15px, -45px) scale(0.8); }
//         }
        
//         @keyframes smokeTrail {
//           0% { opacity: 0.8; transform: translate(0px, 0px) scale(0.5); }
//           50% { opacity: 0.4; }
//           100% { opacity: 0; transform: translate(-20px, -5px) scale(1.8); }
//         }
        
//         * {
//            cursor: none !important;
//         }
//       `}</style>
//     </>
//   );
// }
