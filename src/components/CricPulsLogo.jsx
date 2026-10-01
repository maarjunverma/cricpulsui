import React from 'react';

/**
 * CricPuls Official Vector Logo & Icon Component
 * 
 * Variants:
 * - 'full': Icon + "CRICPULS" typography + "LIVE" pulse badge
 * - 'icon': Brand pulse insignia only
 * - 'badge': Compact circular badge with neon pulse ring
 * - 'footer': Full logo with secondary tagline
 * 
 * Copyright (c) 2026 CricPuls. All rights reserved.
 */
export default function CricPulsLogo({ 
  variant = 'full', 
  size = 36, 
  glow = true,
  animated = true,
  showLiveBadge = false,
  className = '',
  style = {}
}) {
  const iconSize = typeof size === 'number' ? size : 36;

  // The official CricPuls Vector Pulse Emblem
  const renderEmblem = (s) => (
    <svg 
      width={s} 
      height={s} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`cricpuls-emblem-svg ${animated ? 'pulse-animated' : ''}`}
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="CricPuls Logo Emblem"
    >
      <defs>
        {/* Obsidian Ball Gradient */}
        <radialGradient id="cpBallGrad" cx="36%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="45%" stopColor="#0f172a" />
          <stop offset="85%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#030712" />
        </radialGradient>

        {/* Emerald Seam Gradient */}
        <linearGradient id="cpSeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Electric Cyan-Emerald Pulse Wave Gradient */}
        <linearGradient id="cpPulseGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="35%" stopColor="#22d3ee" />
          <stop offset="65%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Outer Ring Glow Gradient */}
        <linearGradient id="cpRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
        </linearGradient>

        {/* Neon Glow Filters */}
        <filter id="cpGlowFilter" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.5" result="blur1" />
          <feGaussianBlur stdDeviation="5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="cpSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Ball Clip Path */}
        <clipPath id="cpBallClip">
          <circle cx="50" cy="50" r="42" />
        </clipPath>
      </defs>

      {/* Outer Atmospheric Aura (if glow enabled) */}
      {glow && (
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="url(#cpRingGrad)" 
          strokeWidth="1.5" 
          opacity="0.6"
          strokeDasharray="4 2"
        />
      )}

      {/* Main Cricket Ball Core */}
      <circle 
        cx="50" 
        cy="50" 
        r="42" 
        fill="url(#cpBallGrad)" 
        stroke="url(#cpRingGrad)" 
        strokeWidth="2.5"
      />

      {/* Specular Highlight on Sphere */}
      <ellipse 
        cx="38" 
        cy="28" 
        rx="18" 
        ry="10" 
        fill="#ffffff" 
        opacity="0.12" 
        transform="rotate(-25 38 28)"
        filter="url(#cpSoftGlow)"
      />

      {/* Cricket Ball Seam Arcs (clipped to ball) */}
      <g clipPath="url(#cpBallClip)">
        {/* Background diagonal seam track */}
        <path 
          d="M 12 88 Q 50 50 88 12" 
          stroke="url(#cpSeamGrad)" 
          strokeWidth="6" 
          strokeOpacity="0.25"
          fill="none"
        />
        <path 
          d="M 12 88 Q 50 50 88 12" 
          stroke="#0f172a" 
          strokeWidth="2" 
          fill="none"
        />

        {/* Cricket Stitches (dots along upper & lower seam) */}
        <g stroke="#34d399" strokeWidth="1.8" opacity="0.6" strokeLinecap="round">
          <line x1="20" y1="84" x2="24" y2="80" />
          <line x1="28" y1="76" x2="32" y2="72" />
          <line x1="36" y1="68" x2="40" y2="64" />
          <line x1="60" y1="44" x2="64" y2="40" />
          <line x1="68" y1="36" x2="72" y2="32" />
          <line x1="76" y1="28" x2="80" y2="24" />
        </g>
        <g stroke="#06b6d4" strokeWidth="1.8" opacity="0.6" strokeLinecap="round">
          <line x1="16" y1="80" x2="20" y2="76" />
          <line x1="24" y1="72" x2="28" y2="68" />
          <line x1="32" y1="64" x2="36" y2="60" />
          <line x1="64" y1="40" x2="68" y2="36" />
          <line x1="72" y1="32" x2="76" y2="28" />
          <line x1="80" y1="24" x2="84" y2="20" />
        </g>
      </g>

      {/* The Electric CricPuls Heartbeat Wave (Glowing Neon) */}
      <g filter={glow ? "url(#cpGlowFilter)" : undefined}>
        {/* Glow Underlay */}
        <path 
          d="M 10 50 L 32 50 L 39 37 L 46 66 L 54 18 L 62 76 L 68 44 L 74 54 L 79 50 L 90 50" 
          stroke="url(#cpPulseGrad)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
          opacity="0.35"
        />

        {/* Main Sharp Neon Pulse Wave */}
        <path 
          d="M 10 50 L 32 50 L 39 37 L 46 66 L 54 18 L 62 76 L 68 44 L 74 54 L 79 50 L 90 50" 
          stroke="url(#cpPulseGrad)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Pulse Heartbeat Core Apex Spark */}
        <circle cx="54" cy="18" r="3" fill="#ffffff" filter="url(#cpGlowFilter)" />
        <circle cx="62" cy="76" r="2.5" fill="#38bdf8" />
        <circle cx="90" cy="50" r="2" fill="#34d399" />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div 
        className={`cricpuls-logo-icon-wrap ${className}`} 
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
      >
        {renderEmblem(iconSize)}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div 
        className={`cricpuls-badge-wrap ${className}`} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '4px 10px 4px 6px',
          borderRadius: '9999px',
          boxShadow: '0 0 16px rgba(16, 185, 129, 0.18)',
          ...style
        }}
      >
        {renderEmblem(iconSize || 24)}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            CRIC<span style={{ color: 'var(--emerald, #10b981)' }}>AI</span>
          </span>
          <span style={{ fontSize: '0.58rem', fontWeight: '700', color: '#22d3ee', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            CRICKET AI
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div 
        className={`cricpuls-logo-footer ${className}`} 
        style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', ...style }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          {renderEmblem(iconSize || 38)}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ 
              fontSize: '1.45rem', 
              fontWeight: '900', 
              fontFamily: 'var(--font-heading, "Inter", sans-serif)', 
              color: '#ffffff',
              letterSpacing: '-0.03em' 
            }}>
              CRIC<span style={{ color: '#10b981', textShadow: '0 0 16px rgba(16, 185, 129, 0.5)' }}>AI</span>
            </span>
          </div>
        </div>
        <span style={{ 
          fontSize: '0.72rem', 
          color: 'var(--text-muted, #94a3b8)', 
          letterSpacing: '0.04em',
          fontWeight: '500'
        }}>
          REAL-TIME CRICKET INTELLIGENCE &amp; AI COMMENTARY
        </span>
      </div>
    );
  }

  // Default 'full' variant for Navbar / Header
  return (
    <div 
      className={`cricpuls-logo-container ${className}`} 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '9px',
        cursor: 'pointer',
        userSelect: 'none',
        ...style
      }}
    >
      <div 
        className="cricpuls-logo-icon-box"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.08) 70%, transparent 100%)',
          boxShadow: glow ? '0 0 20px rgba(16, 185, 129, 0.25), inset 0 0 12px rgba(6, 182, 212, 0.15)' : 'none',
          border: '1px solid rgba(16, 185, 129, 0.28)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {renderEmblem(iconSize - 6)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span 
          className="cricpuls-brand-text"
          style={{
            fontSize: '1.45rem',
            fontWeight: '900',
            fontFamily: 'var(--font-heading, "Inter", sans-serif)',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'center',
            lineHeight: 1
          }}
        >
          CRIC<span style={{ color: '#10b981', textShadow: '0 0 18px rgba(16, 185, 129, 0.6)' }}>AI</span>
        </span>
        {showLiveBadge && (
          <span 
            className="brand-pulse-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.68rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.25))',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              padding: '2px 7px',
              borderRadius: '9999px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)',
              lineHeight: 1.2
            }}
          >
            <span 
              style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
                display: 'inline-block' 
              }} 
            />
            LIVE
          </span>
        )}
      </div>
    </div>
  );
}
