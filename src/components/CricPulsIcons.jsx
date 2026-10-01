import React from 'react';

/**
 * Co-branded CricPuls Identical Icon Suite
 * Pixel-perfect SVG icons styled to match the CricPuls visual identity.
 * 
 * Copyright (c) 2026 CricPuls. All rights reserved.
 */

// Official Android Download Icon with CricPuls Emerald Accents
export function AndroidIcon({ size = 20, className = '', color = 'currentColor' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="androidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Android Head */}
      <path 
        d="M6 10C6 6.68629 8.68629 4 12 4C15.3137 4 18 6.68629 18 10H6Z" 
        fill="url(#androidGrad)" 
      />
      {/* Eyes */}
      <circle cx="9.5" cy="7.5" r="1" fill="#090d16" />
      <circle cx="14.5" cy="7.5" r="1" fill="#090d16" />
      {/* Antennae */}
      <line x1="7.5" y1="4.5" x2="5.5" y2="2" stroke="url(#androidGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16.5" y1="4.5" x2="18.5" y2="2" stroke="url(#androidGrad)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Body */}
      <rect x="6" y="11.5" width="12" height="9" rx="2" fill="url(#androidGrad)" />
      {/* Arms */}
      <rect x="2.5" y="11.5" width="2.2" height="7.5" rx="1.1" fill="url(#androidGrad)" />
      <rect x="19.3" y="11.5" width="2.2" height="7.5" rx="1.1" fill="url(#androidGrad)" />
      {/* Legs */}
      <rect x="8.5" y="20.5" width="2.2" height="3" rx="1" fill="url(#androidGrad)" />
      <rect x="13.3" y="20.5" width="2.2" height="3" rx="1" fill="url(#androidGrad)" />
    </svg>
  );
}

// Official Apple iOS Icon with Premium Platinum/Cyan Accent
export function AppleIcon({ size = 20, className = '', color = 'currentColor' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      {/* Apple Leaf */}
      <path 
        d="M15.5 2C14.5 3.2 13 4 12 3.8C12 2.6 13.5 1.5 15.5 2Z" 
        fill="url(#appleGrad)" 
      />
      {/* Apple Body with Bite */}
      <path 
        d="M18.7 16.5C18 17.5 17.3 18.6 16.1 18.6C15 18.6 14.5 17.9 13.2 17.9C11.8 17.9 11.3 18.6 10.3 18.6C9.1 18.6 8.3 17.3 7.6 16.3C6.1 14.1 5 10.6 6.5 8.1C7.3 6.8 8.7 6 10.2 6C11.4 6 12.3 6.8 13.1 6.8C13.8 6.8 15 5.9 16.4 6.1C17 6.1 18.6 6.3 19.6 7.8C19.5 7.9 17.7 8.9 17.7 11.1C17.7 13.6 20 14.5 20.1 14.6C19.9 15.2 19.5 16.5 18.7 16.5Z" 
        fill="url(#appleGrad)" 
      />
    </svg>
  );
}

// Copyright & Trademark Legal Protection Shield
export function CopyrightShieldIcon({ size = 20, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path 
        d="M12 2L4 5.5V11.5C4 16.8 7.4 21.6 12 23C16.6 21.6 20 16.8 20 11.5V5.5L12 2Z" 
        stroke="url(#shieldGrad)" 
        strokeWidth="1.8" 
        fill="rgba(16, 185, 129, 0.08)" 
      />
      {/* Copyright 'C' */}
      <circle cx="12" cy="12" r="4.2" stroke="url(#shieldGrad)" strokeWidth="1.3" />
      <path 
        d="M13.2 10.5C12.8 10.2 12.4 10 11.8 10C10.7 10 9.8 10.9 9.8 12C9.8 13.1 10.7 14 11.8 14C12.4 14 12.8 13.8 13.2 13.5" 
        stroke="#ffffff" 
        strokeWidth="1.3" 
        strokeLinecap="round" 
      />
    </svg>
  );
}

// Verified CricPuls Quality Badge
export function VerifiedPulseBadge({ size = 16, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="verGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <path 
        d="M10 1L12.5 3.5L16 3.5L16.8 7L19.5 9.5L17.5 12.5L18 16L14.5 16.8L12.5 19.5L10 17.5L7.5 19.5L5.5 16.8L2 16L2.5 12.5L0.5 9.5L3.2 7L4 3.5L7.5 3.5L10 1Z" 
        fill="url(#verGrad)" 
      />
      <path 
        d="M6.5 10L9 12.5L14 7" 
        stroke="#060b13" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
