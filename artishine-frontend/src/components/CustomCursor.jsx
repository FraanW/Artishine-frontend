import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  useEffect(() => {
    if (!cursorRef.current || !cursorDotRef.current || !cursorOutlineRef.current) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Position the cursor
    const positionCursor = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      
      // Add a slight delay to the outline for a smooth trailing effect
      requestAnimationFrame(() => {
        cursorOutline.style.left = `${mouseX}px`;
        cursorOutline.style.top = `${mouseY}px`;
      });

      // Add hover effects on interactive elements
      const target = e.target;
      if (target.closest('a, button, [role="button"], [data-cursor="pointer"]')) {
        cursorDot.classList.add('scale-150');
        cursorOutline.classList.add('scale-50', 'bg-amber-500/20');
      } else {
        cursorDot.classList.remove('scale-150');
        cursorOutline.classList.remove('scale-50', 'bg-amber-500/20');
      }
    };

    // Add click effect
    const handleClick = () => {
      cursorDot.classList.add('scale-75');
      cursorOutline.classList.add('scale-75');
      setTimeout(() => {
        cursorDot.classList.remove('scale-75');
        cursorOutline.classList.remove('scale-75');
      }, 100);
    };

    window.addEventListener('mousemove', positionCursor);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('mouseup', handleClick);

    return () => {
      window.removeEventListener('mousemove', positionCursor);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('mouseup', handleClick);
      document.body.style.cursor = ''; // Reset default cursor on unmount
    };
  }, []);

  return (
    <div ref={cursorRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[10000]">
      <div
        ref={cursorDotRef}
        className="w-3 h-3 bg-amber-600 rounded-full fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-150 ease-out"
      />
      <div
        ref={cursorOutlineRef}
        className="w-8 h-8 border-2 border-amber-600 rounded-full fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out"
      />
    </div>
  );
};

export default CustomCursor;
