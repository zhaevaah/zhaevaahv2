import React from "react";

/**
 * Universal Female (Venus ♀) Luxury Icon
 */
export function FemaleSymbolIcon({
  className = "w-3.5 h-3.5",
  strokeWidth = 2.2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Venus Circle */}
      <circle cx="12" cy="9" r="6" />
      {/* Downward Cross Stem */}
      <line x1="12" y1="15" x2="12" y2="22" />
      {/* Horizontal Crossbar */}
      <line x1="8.5" y1="18.5" x2="15.5" y2="18.5" />
    </svg>
  );
}

/**
 * Universal Male (Mars ♂) Luxury Icon
 */
export function MaleSymbolIcon({
  className = "w-3.5 h-3.5",
  strokeWidth = 2.2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Mars Circle */}
      <circle cx="9.5" cy="14.5" r="5.5" />
      {/* Diagonal Pointer Arrow */}
      <line x1="13.5" y1="10.5" x2="20" y2="4" />
      {/* Arrow Tip */}
      <polyline points="15 4 20 4 20 9" />
    </svg>
  );
}
