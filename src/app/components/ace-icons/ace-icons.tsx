import React from "react";

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const IconWrapper = ({
  children,
  size = 16,
  strokeWidth = 1.7,
  viewBox = "0 0 24 24",
  className = "",
}: {
  children: React.ReactNode;
  size?: number;
  strokeWidth?: number;
  viewBox?: string;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const AceIcons = {
  beaker: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M9 3h6M10 3v6.5L5.2 18a2 2 0 001.8 3h10a2 2 0 001.8-3L14 9.5V3" />
      <path d="M7.5 14h9" />
    </IconWrapper>
  ),

  layers: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </IconWrapper>
  ),

  play: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M6 4l14 8-14 8V4z" />
    </IconWrapper>
  ),

  playCirc: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
    </IconWrapper>
  ),

  pulse: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </IconWrapper>
  ),

  results: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M3 3v18h18" />
      <path d="M7 14l3-3 3 3 5-6" />
    </IconWrapper>
  ),

  history: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 106 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </IconWrapper>
  ),

  search: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 1.8} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </IconWrapper>
  ),

  filter: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M4 4h16l-6.5 8v6l-3 2v-8L4 4z" />
    </IconWrapper>
  ),

  plus: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 2} className={className}>
      <path d="M12 5v14M5 12h14" />
    </IconWrapper>
  ),

  check: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 2.2} className={className}>
      <path d="M20 6L9 17l-5-5" />
    </IconWrapper>
  ),

  checkCirc: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 1.8} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </IconWrapper>
  ),

  xCirc: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 1.8} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </IconWrapper>
  ),

  x: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 2} className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </IconWrapper>
  ),

  alert: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </IconWrapper>
  ),

  clock: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 1.8} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </IconWrapper>
  ),

  copy: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M9 9h11a0 0 0 010 0v11a0 0 0 010 0H9a0 0 0 010 0V9z" />
      <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
    </IconWrapper>
  ),

  archive: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M3 4h18v4H3zM5 8v11a1 1 0 001 1h12a1 1 0 001-1V8" />
      <path d="M10 12h4" />
    </IconWrapper>
  ),

  trash: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6" />
      <path d="M10 11v6M14 11v6" />
    </IconWrapper>
  ),

  more: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none" />
    </IconWrapper>
  ),

  moreH: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className} viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.8" fill="currentColor" stroke="none" />
    </IconWrapper>
  ),

  edit: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </IconWrapper>
  ),

  compare: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M6 3v18M18 3v18" />
      <path d="M9 8l-3 3 3 3M15 8l3 3-3 3" />
    </IconWrapper>
  ),

  arrowR: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconWrapper>
  ),

  arrowUp: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 2} className={className}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </IconWrapper>
  ),

  arrowDn: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 2} className={className}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </IconWrapper>
  ),

  download: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <path d="M7 10l5 5 5-5M12 15V3" />
    </IconWrapper>
  ),

  sliders: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </IconWrapper>
  ),

  chevDown: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size || 13} strokeWidth={strokeWidth || 2.2} className={className}>
      <path d="M6 9l6 6 6-6" />
    </IconWrapper>
  ),

  chevRight: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size || 13} strokeWidth={strokeWidth || 2.2} className={className}>
      <path d="M9 18l6-6-6-6" />
    </IconWrapper>
  ),

  chevUp: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size || 13} strokeWidth={strokeWidth || 2.2} className={className}>
      <path d="M18 15l-6-6-6 6" />
    </IconWrapper>
  ),

  chevLeft: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size || 13} strokeWidth={strokeWidth || 2.2} className={className}>
      <path d="M15 18l-6-6 6-6" />
    </IconWrapper>
  ),

  eye: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </IconWrapper>
  ),

  tag: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z" />
      <path d="M7 7h.01" />
    </IconWrapper>
  ),

  user: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" />
    </IconWrapper>
  ),

  calendar: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </IconWrapper>
  ),

  sparkles: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 15l.7 1.8L21.5 17.5 19.7 18.2 19 20l-.7-1.8L16.5 17.5 18.3 16.8 19 15z" />
    </IconWrapper>
  ),

  target: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </IconWrapper>
  ),

  gauge: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M12 14l4-4" />
      <path d="M3.5 18a9 9 0 1117 0" />
    </IconWrapper>
  ),

  bolt: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </IconWrapper>
  ),

  dollar: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </IconWrapper>
  ),

  loader: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 2} className={className}>
      <path d="M12 2a10 10 0 0110 10" opacity="1" />
      <path d="M22 12a10 10 0 01-10 10" opacity="0.25" />
      <path d="M12 22A10 10 0 012 12" opacity="0.25" />
      <path d="M2 12A10 10 0 0112 2" opacity="0.6" />
    </IconWrapper>
  ),

  refresh: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size || 15} strokeWidth={strokeWidth || 1.8} className={className}>
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </IconWrapper>
  ),

  bell: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 01-3.4 0" />
    </IconWrapper>
  ),

  settings: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth || 1.6} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </IconWrapper>
  ),

  grid: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </IconWrapper>
  ),

  rows: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <rect x="3" y="11" width="18" height="5" rx="1" />
      <rect x="3" y="18" width="18" height="3" rx="1" />
    </IconWrapper>
  ),

  star: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.8 6.1 21l1.2-6.5L2.5 9.9 9.1 9 12 3z" />
    </IconWrapper>
  ),

  doc: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </IconWrapper>
  ),

  flow: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M6 9v3a3 3 0 003 3h6" />
    </IconWrapper>
  ),

  chat: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M21 11.5a8.5 8.5 0 01-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1121 11.5z" />
    </IconWrapper>
  ),

  cloud: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </IconWrapper>
  ),

  branch: ({ size, strokeWidth, className }: IconProps = {}) => (
    <IconWrapper size={size} strokeWidth={strokeWidth} className={className}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="9" r="2.5" />
      <path d="M6 8.5v7M8.5 6h4a3 3 0 013 3" />
    </IconWrapper>
  ),
};
