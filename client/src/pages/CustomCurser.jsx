import React, { useEffect, useRef } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  let idleTimeout;

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Add "active" class for dot float animation
      if (dotRef.current) {
        dotRef.current.classList.add("active");
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
          dotRef.current?.classList.remove("active");
        }, 500);
      }
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px)`;
      }

      requestAnimationFrame(animate);
    };
    animate();

    const handleClick = () => {
      if (dotRef.current) {
        dotRef.current.classList.add("clicked");
        setTimeout(() => {
          dotRef.current?.classList.remove("clicked");
        }, 200);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursorRef}>
      <div className="cursor-dot" ref={dotRef}></div>
    </div>
  );
};

export default CustomCursor;
