// src/components/LottieBackground.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * LottieBackground
 *
 * Props:
 * - src (string, required) : embed URL (e.g. from lottie.host)
 * - opacity (number)       : wrapper opacity (only applied in background mode)
 * - className (string)     : additional wrapper classes
 * - title (string)         : iframe title
 * - inline (bool)          : if true -> render as an inline embedded frame (like a map)
 * - height (number|string) : height for inline mode (px or Tailwind-friendly units like '320px')
 */
const LottieBackground = ({
  src,
  opacity = 0.28,
  className = "",
  title = "Lottie background",
  inline = false,
  height = 320,
}) => {
  if (!src) return null;

  // Inline embed (like a map)
  if (inline) {
    const hStyle = typeof height === "number" ? `${height}px` : height;
    return (
      <div className={`w-full max-w-full mx-auto overflow-hidden rounded-lg ${className}`} style={{ height: hStyle }}>
        <iframe
          title={title}
          src={src}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
            objectFit: "cover",
          }}
          frameBorder="0"
          aria-hidden="false"
        />
      </div>
    );
  }

  // Full-bleed background mode (absolute, non-interactive)
  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <iframe
        title={title}
        src={src}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
          objectFit: "cover",
        }}
        frameBorder="0"
      />
    </div>
  );
};

LottieBackground.propTypes = {
  src: PropTypes.string.isRequired,
  opacity: PropTypes.number,
  className: PropTypes.string,
  title: PropTypes.string,
  inline: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default LottieBackground;
