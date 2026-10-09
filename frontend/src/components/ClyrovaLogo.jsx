import React from 'react';

export default function ClyrovaLogo({ size = 'md', isDark = false, className = '' }) {
  // Size mappings
  const sizeClasses = {
    sm: 'text-lg sm:text-xl font-black tracking-tight',
    md: 'text-2xl sm:text-3xl font-black tracking-tight',
    lg: 'text-3xl sm:text-4xl font-black tracking-tight',
    xl: 'text-4xl sm:text-5xl font-black tracking-tight'
  };

  const dotSizes = {
    sm: 'h-1.5 w-1.5 ml-0.5 mb-0.5',
    md: 'h-2 w-2 ml-0.5 mb-1',
    lg: 'h-2.5 w-2.5 ml-1 mb-1',
    xl: 'h-3.5 w-3.5 ml-1 mb-1.5'
  };

  const textColor = isDark ? 'text-white' : 'text-[#0d382c]';

  return (
    <div className={`inline-flex items-baseline font-sans select-none ${className}`}>
      <span className={`${sizeClasses[size] || sizeClasses.md} ${textColor} leading-none font-extrabold tracking-tight`}>
        Clyrova
      </span>
      <span className={`inline-block rounded-full bg-amber-500 shadow-xs ${dotSizes[size] || dotSizes.md}`} />
    </div>
  );
}
