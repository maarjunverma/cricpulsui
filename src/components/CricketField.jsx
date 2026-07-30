import React, { useEffect, useState } from 'react';

export default function CricketField({ lastBall }) {
  const [animating, setAnimating] = useState(false);
  const [trailPath, setTrailPath] = useState('');
  const [landingPoint, setLandingPoint] = useState({ x: 150, y: 160 });
  const [eventBadge, setEventBadge] = useState(null);

  // Field center is (150, 150)
  // Batsman is at (150, 165)
  // Bowler releases from (150, 135)
  const bx = 150;
  const by = 165;
  const rx = 150;
  const ry = 135;

  useEffect(() => {
    if (!lastBall) return;

    // Reset animation
    setAnimating(false);
    setEventBadge(null);

    // Calculate final position
    const angleRad = ((lastBall.shotAngle - 90) * Math.PI) / 180; // offset by 90 to match coordinate system
    
    // Scale distance (0-110m) to field coordinates (0-120px max radius)
    const scale = Math.min((lastBall.distance / 100) * 115, 122);
    
    const targetX = bx + Math.cos(angleRad) * scale;
    const targetY = by + Math.sin(angleRad) * scale;

    setLandingPoint({ x: targetX, y: targetY });

    // Path for ball curve: bowler -> pitch -> batsman -> field landing
    const pitchX = 150;
    const pitchY = 152;
    const path = `M ${rx} ${ry} Q ${pitchX - 10} ${pitchY} ${bx} ${by} Q ${(bx + targetX) / 2 + 10} ${(by + targetY) / 2 - 20} ${targetX} ${targetY}`;
    setTrailPath(path);

    // Trigger animation
    setTimeout(() => {
      setAnimating(true);
    }, 50);

    // Capture event and runs to prevent async race condition if lastBall changes to null
    const currentEvent = lastBall.event;
    const currentRuns = lastBall.runs;

    // Show landing badge after animation finishes (approx 1s)
    const badgeTimeout = setTimeout(() => {
      setEventBadge({
        x: targetX,
        y: targetY,
        text: currentEvent === 'W' ? 'W' : currentRuns > 0 ? `+${currentRuns}` : currentEvent,
        isWicket: currentEvent === 'W',
        runs: currentRuns || 0
      });
    }, 1000);

    return () => clearTimeout(badgeTimeout);
  }, [lastBall]);

  // Determine highlight zone for glow
  const getZoneHighlight = () => {
    if (!lastBall || !animating || lastBall.event === 'Wd' || lastBall.event === 'Nb') return null;
    const angle = lastBall.shotAngle;
    
    // Zones based on angle
    if (angle >= 0 && angle < 45) return 'longOff';
    if (angle >= 45 && angle < 95) return 'covers';
    if (angle >= 95 && angle < 140) return 'point';
    if (angle >= 140 && angle < 185) return 'thirdMan';
    if (angle >= 185 && angle < 240) return 'fineLeg';
    if (angle >= 240 && angle < 285) return 'squareLeg';
    if (angle >= 285 && angle < 325) return 'midWicket';
    return 'longOn';
  };

  const highlightZone = getZoneHighlight();

  // Helper to check if a zone is active
  const isZoneActive = (zone) => highlightZone === zone;

  return (
    <div style={styles.container} className="glass-card">
      <div style={styles.header}>
        <h4 style={styles.title}>Visual Pitch Map & Field</h4>
        {lastBall && (
          <span style={styles.meta}>
            {lastBall.bowler} to {lastBall.striker} • <strong>{lastBall.pitchType}</strong>
          </span>
        )}
      </div>

      <div style={styles.fieldWrapper}>
        <svg viewBox="0 0 300 300" style={styles.svg}>
          {/* Gradients */}
          <defs>
            <radialGradient id="grassGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#142824" />
              <stop offset="70%" stopColor="#0b1716" />
              <stop offset="100%" stopColor="#060c0b" />
            </radialGradient>
            
            <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d1ab7e" />
              <stop offset="50%" stopColor="#c59e70" />
              <stop offset="100%" stopColor="#b68e5f" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <stop offset="0%" stopColor="var(--teal)" />
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grass Field */}
          <circle cx="150" cy="150" r="135" fill="url(#grassGrad)" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          
          {/* Boundary Ring */}
          <circle cx="150" cy="150" r="130" fill="none" stroke="var(--emerald)" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />

          {/* 30-Yard Circle */}
          <circle cx="150" cy="150" r="75" fill="none" stroke="rgba(255,214,0,0.3)" strokeWidth="1" strokeDasharray="4 6" />

          {/* Sectors / Fielding Zones with subtle hover-glows */}
          <g opacity="0.15">
            {/* Long Off */}
            <path d="M150,150 L150,20 A130,130 0 0,1 242,58 Z" fill={isZoneActive('longOff') ? 'var(--teal)' : 'transparent'} stroke="rgba(255,255,255,0.1)" />
            {/* Covers */}
            <path d="M150,150 L242,58 A130,130 0 0,1 280,150 Z" fill={isZoneActive('covers') ? 'var(--teal)' : 'transparent'} stroke="rgba(255,255,255,0.1)" />
            {/* Point */}
            <path d="M150,150 L280,150 A130,130 0 0,1 242,242 Z" fill={isZoneActive('point') ? 'var(--teal)' : 'transparent'} stroke="rgba(255,255,255,0.1)" />
            {/* Third Man */}
            <path d="M150,150 L242,242 A130,130 0 0,1 150,280 Z" fill={isZoneActive('thirdMan') ? 'var(--teal)' : 'transparent'} stroke="rgba(255,255,255,0.1)" />
            {/* Fine Leg */}
            <path d="M150,150 L150,280 A130,130 0 0,1 58,242 Z" fill={isZoneActive('fineLeg') ? 'var(--teal)' : 'transparent'} stroke="rgba(255,255,255,0.1)" />
            {/* Square Leg */}
            <path d="M150,150 L58,242 A130,130 0 0,1 20,150 Z" fill={isZoneActive('squareLeg') ? 'var(--teal)' : 'transparent'} stroke="rgba(255,255,255,0.1)" />
            {/* Mid Wicket */}
            <path d="M150,150 L20,150 A130,130 0 0,1 58,58 Z" fill={isZoneActive('midWicket') ? 'var(--teal)' : 'transparent'} stroke="rgba(255,255,255,0.1)" />
            {/* Long On */}
            <path d="M150,150 L58,58 A130,130 0 0,1 150,20 Z" fill={isZoneActive('longOn') ? 'var(--teal)' : 'transparent'} stroke="rgba(255,255,255,0.1)" />
          </g>

          {/* Active Highlight overlay */}
          {highlightZone && (
            <circle cx="150" cy="150" r="130" fill="none" stroke="var(--teal)" strokeWidth="2.5" opacity="0.35" style={{ filter: 'url(#glowFilter)' }} />
          )}

          {/* Pitch */}
          <rect x="145" y="130" width="10" height="40" rx="1" fill="url(#pitchGrad)" />
          {/* Crease Lines */}
          <line x1="143" y1="135" x2="147" y2="135" stroke="#fff" strokeWidth="0.75" />
          <line x1="143" y1="165" x2="147" y2="165" stroke="#fff" strokeWidth="0.75" />
          
          {/* Stumps (dots) */}
          <circle cx="150" cy="133" r="1" fill="#fff" />
          <circle cx="150" cy="167" r="1" fill="#fff" />

          {/* Sector Labels */}
          <g fontSize="7.5" fill="var(--text-secondary)" fontWeight="600" opacity="0.7" textAnchor="middle">
            <text x="150" y="32">LONG OFF</text>
            <text x="220" y="65">COVERS</text>
            <text x="255" y="153" textAnchor="end">POINT</text>
            <text x="210" y="235">THIRD MAN</text>
            <text x="90" y="235">FINE LEG</text>
            <text x="45" y="153" textAnchor="start">SQUARE LEG</text>
            <text x="80" y="65">MID-WICKET</text>
            <text x="150" y="280">LONG ON</text>
          </g>

          {/* Trajectory Trail */}
          {lastBall && animating && (
            <path
              d={trailPath}
              fill="none"
              stroke={lastBall.event === 'W' ? 'var(--red-accent)' : 'var(--teal)'}
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeDashoffset="0"
              style={styles.trailPathAnim}
            />
          )}

          {/* Ball Indicator node */}
          {lastBall && animating && (
            <circle cx="0" cy="0" r="4.5" fill={lastBall.event === 'W' ? 'var(--red-accent)' : '#fff'}>
              <animateMotion
                path={trailPath}
                begin="0s"
                dur="1s"
                repeatCount="1"
                fill="freeze"
              />
              <animate
                attributeName="r"
                values="4.5;7;4.5"
                dur="1s"
                repeatCount="1"
              />
            </circle>
          )}

          {/* Event Result Badge */}
          {eventBadge && (
            <g style={styles.badgeAnim}>
              <circle
                cx={eventBadge.x}
                cy={eventBadge.y}
                r="11"
                fill={
                  eventBadge.isWicket 
                    ? 'rgba(255, 61, 113, 0.9)' 
                    : eventBadge.runs >= 4 
                    ? 'rgba(0, 229, 255, 0.9)' 
                    : 'rgba(21, 31, 50, 0.9)'
                }
                stroke={
                  eventBadge.isWicket 
                    ? 'var(--red-accent)' 
                    : eventBadge.runs >= 4 
                    ? 'var(--teal)' 
                    : 'rgba(255,255,255,0.2)'
                }
                strokeWidth="1.5"
              />
              <text
                x={eventBadge.x}
                y={eventBadge.y + 3}
                fill="#fff"
                fontSize="8"
                fontWeight="800"
                textAnchor="middle"
              >
                {eventBadge.text}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Footer Info details */}
      {lastBall && lastBall.shotDirection !== 'None' && (
        <div style={styles.footerRow}>
          <div style={styles.footerCol}>
            <span style={styles.footerLabel}>Shot Placement</span>
            <span style={styles.footerValue}>{lastBall.shotDirection}</span>
          </div>
          <div style={styles.footerCol}>
            <span style={styles.footerLabel}>Shot Distance</span>
            <span style={styles.footerValue}>{lastBall.distance} meters</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    height: '100%',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    color: 'var(--teal)',
    letterSpacing: '0.5px',
  },
  meta: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  fieldWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  svg: {
    width: '100%',
    maxWidth: '280px',
    height: 'auto',
  },
  footerRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    background: 'rgba(0,0,0,0.2)',
    padding: '8px 12px',
    borderRadius: '10px',
    fontSize: '0.8rem',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  footerLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  footerValue: {
    color: '#fff',
    fontWeight: '700',
  },
  // SVG Animations inline styles / CSS bindings
  trailPathAnim: {
    strokeDasharray: '4 3',
    animation: 'dash 1s linear forwards',
  },
  badgeAnim: {
    animation: 'scaleIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    transformOrigin: 'center',
  }
};
