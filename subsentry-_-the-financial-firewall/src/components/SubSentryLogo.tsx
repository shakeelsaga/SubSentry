import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SubSentryLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  const heightClass = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8';
  const imgSizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none tracking-tighter ${className}`}>
      {/* Logo image from /public/assets/fevicon.png with resilient SVG fallback */}
      {!imgError ? (
        <img
          src="/assets/fevicon.png"
          alt="SubSentry Logo"
          className={`${imgSizeClass} object-contain rounded-md shadow-[0_0_10px_rgba(204,255,0,0.3)]`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="relative flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${heightClass} w-auto aspect-square`}
          >
            <polygon
              points="20,2 36,9 36,25 20,38 4,25 4,9"
              fill="#06080F"
              stroke="#CCFF00"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <polygon
              points="20,8 30,13 30,23 20,31 10,23 10,13"
              fill="rgba(204, 255, 0, 0.15)"
              stroke="#CCFF00"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <circle cx="20" cy="19" r="4.5" fill="#CCFF00" />
            <path d="M20 11V15M20 23V27M12 19H16M24 19H28" stroke="#06080F" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Brand Typographic Wordmark in full #CCFF00 color */}
      <div className="flex items-center">
        <span className="font-['Space_Grotesk'] font-black tracking-[-0.03em] text-[#CCFF00] text-xl md:text-2xl uppercase drop-shadow-[0_0_12px_rgba(204,255,0,0.35)]">
          SUBSENTRY
        </span>
      </div>
    </div>
  );
};
