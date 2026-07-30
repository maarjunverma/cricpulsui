import React, { useState } from 'react';
import { Activity, Calendar, Users, Award, Zap, Play, Pause, RefreshCw, Volume2, VolumeX, ChevronRight, ChevronDown, Menu, X } from 'lucide-react';


export default function Header({ 
  currentTab, 
  setCurrentTab, 
  liveMatches, 
  selectedMatchId, 
  setSelectedMatchId,
  simSpeed,
  setSimSpeed,
  onResetMatches,
  isMuted,
  onToggleMute,
  appMode,
  onToggleMode
}) {
  const [filterType, setFilterType] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'live', label: 'Home', icon: Activity },
    { key: 'fixtures', label: 'Schedule', icon: Calendar },
    { key: 'teams', label: 'Teams', icon: Users },
    { key: 'rankings', label: 'Rankings', icon: Award },
  ];

  const filterChips = ['all', 'live', 'finished', 'upcoming'];

  return (
    <header style={styles.headerWrapper} className="full-width-section">
      {/* ─── Top Navbar ─── */}
      <div style={styles.navbar}>
        <div style={styles.navInner} className="full-width-inner">
          {/* Logo */}
          <div style={styles.logoContainer} onClick={() => { setCurrentTab('live'); setMobileMenuOpen(false); }}>
            <div style={styles.logoIcon}>
              <Activity size={20} color="#10b981" />
            </div>
            <span style={styles.logoText}>
              CRIC<span style={styles.logoHighlight}>PULS</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav style={styles.desktopNav}>
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setCurrentTab(item.key)}
                style={{
                  ...styles.navBtn,
                  ...(currentTab === item.key ? styles.navBtnActive : {})
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div style={styles.rightControls}>
            {/* Mode Toggle */}
            <button 
              onClick={onToggleMode}
              style={{
                ...styles.modeToggleBtn,
                ...(appMode === 'live' ? styles.modeToggleLive : styles.modeToggleDemo)
              }}
              title={appMode === 'live' ? "Switch to Demo Mode" : "Switch to Live Data"}
            >
              {appMode === 'live' && <span className="red-indicator" style={{ marginRight: '5px' }} />}
              <span>{appMode === 'live' ? 'LIVE' : 'DEMO'}</span>
            </button>

            {/* Sim Speed (Demo only) */}
            {appMode === 'demo' && (
              <div style={styles.speedPill}>
                <Zap size={12} color="#f59e0b" />
                {[
                  { speed: 0, label: <Pause size={10} /> },
                  { speed: 5000, label: '1x' },
                  { speed: 2000, label: '3x' },
                  { speed: 500, label: '10x' },
                ].map(({ speed, label }) => (
                  <button
                    key={speed}
                    onClick={() => setSimSpeed(speed)}
                    style={{
                      ...styles.speedBtn,
                      ...(simSpeed === speed ? styles.speedBtnActive : {})
                    }}
                  >
                    {label}
                  </button>
                ))}
                <button onClick={onResetMatches} style={styles.resetBtn} title="Reset Scores">
                  <RefreshCw size={10} />
                </button>
              </div>
            )}

            {/* Mute Toggle */}
            <button 
              onClick={onToggleMute} 
              style={styles.iconBtn}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={styles.mobileMenuBtn}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div style={styles.mobileNavDropdown}>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => { setCurrentTab(item.key); setMobileMenuOpen(false); }}
                  style={{
                    ...styles.mobileNavBtn,
                    ...(currentTab === item.key ? styles.mobileNavBtnActive : {})
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Match Ticker Bar ─── */}
      <div style={styles.tickerBar}>
        <div style={styles.tickerBarInner} className="full-width-inner">
          <span style={styles.tickerLabel}>MATCHES</span>
          <div style={styles.tickerScroll}>
            {liveMatches.map(match => {
              const isSelected = selectedMatchId === match.id;
              return (
                <button
                  key={match.id}
                  onClick={() => { setSelectedMatchId(match.id); setCurrentTab('live'); }}
                  style={{
                    ...styles.tickerItem,
                    ...(isSelected ? styles.tickerItemActive : {})
                  }}
                >
                  <span style={styles.tickerTeamText}>
                    {match.team1.shortName} vs {match.team2.shortName}
                  </span>
                  <span style={styles.tickerDot}>•</span>
                  <span style={{
                    ...styles.tickerStatusText,
                    color: match.isFinished ? 'var(--text-muted)' : 'var(--emerald)'
                  }}>
                    {match.isFinished ? 'Finished' : 'Live'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Score Cards Carousel ─── */}
      <div style={styles.carouselSection}>
        <div className="full-width-inner">
          {/* Filter Chips */}
          <div style={styles.filterRow}>
            {filterChips.map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                style={{
                  ...styles.filterChip,
                  ...(filterType === f ? styles.filterChipActive : {})
                }}
              >
                {filterType === f && <span style={styles.checkmark}>✓</span>}
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Score Cards */}
          <div style={styles.scoreCardsTrack}>
            {liveMatches
              .filter(m => {
                if (filterType === 'all') return true;
                if (filterType === 'live') return !m.isFinished;
                if (filterType === 'finished') return m.isFinished;
                return false;
              })
              .map(match => {
                const isSelected = selectedMatchId === match.id;
                return (
                  <div
                    key={match.id}
                    onClick={() => { setSelectedMatchId(match.id); setCurrentTab('live'); }}
                    style={{
                      ...styles.scoreCard,
                      ...(isSelected ? styles.scoreCardSelected : {})
                    }}
                  >
                    {/* Card Header */}
                    <div style={styles.scoreCardHeader}>
                      <span style={styles.scoreCardTitle}>
                        {!match.isFinished && <span className="red-indicator" style={{ marginRight: '6px', width: '6px', height: '6px' }} />}
                        {match.isFinished ? '' : 'Live '}
                        {match.title.split(' - ').pop() || match.format}
                      </span>
                    </div>
                    <div style={styles.scoreCardMeta}>
                      {match.venue}
                    </div>

                    {/* Team Scores */}
                    <div style={styles.teamRow}>
                      <div style={styles.teamInfo}>
                        <div style={{ ...styles.teamDot, backgroundColor: match.team1.color }} />
                        <span style={styles.teamShortName}>{match.team1.shortName}</span>
                      </div>
                      <span style={styles.teamScoreVal}>
                        {match.score.team1.runs}/{match.score.team1.wickets}
                        <span style={styles.teamOversVal}> ({match.score.team1.overs.toFixed(1)})</span>
                      </span>
                    </div>
                    <div style={styles.teamRow}>
                      <div style={styles.teamInfo}>
                        <div style={{ ...styles.teamDot, backgroundColor: match.team2.color }} />
                        <span style={styles.teamShortName}>{match.team2.shortName}</span>
                      </div>
                      <span style={styles.teamScoreVal}>
                        {match.innings === 2 || match.isFinished
                          ? `${match.score.team2.runs}/${match.score.team2.wickets}`
                          : '—'}
                        {(match.innings === 2 || match.isFinished) && (
                          <span style={styles.teamOversVal}> ({match.score.team2.overs.toFixed(1)})</span>
                        )}
                      </span>
                    </div>

                    {/* Card Footer Links */}
                    <div style={styles.scoreCardFooter}>
                      {['Series', 'Table', 'Schedule'].map(link => (
                        <span key={link} style={styles.cardFooterLink}>{link}</span>
                      ))}
                    </div>
                  </div>
                );
              })
            }
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBarTrack}>
            <div style={{
              ...styles.progressBarFill,
              width: `${Math.min(100, (liveMatches.filter(m => !m.isFinished).length / Math.max(1, liveMatches.length)) * 100)}%`
            }} />
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  headerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid var(--border-color)',
  },

  /* ─── Navbar ─── */
  navbar: {
    background: 'linear-gradient(135deg, #0d2b2b 0%, #0a1e2e 50%, #0d1520 100%)',
    borderBottom: '1px solid rgba(16, 185, 129, 0.08)',
  },
  navInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 1rem',
    maxWidth: '1440px',
    margin: '0 auto',
    gap: '1rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    flexShrink: 0,
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(16, 185, 129, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  logoHighlight: {
    color: '#10b981',
  },
  desktopNav: {
    display: 'flex',
    gap: '0.25rem',
    flex: 1,
    justifyContent: 'center',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    color: '#cbd5e1',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    borderRadius: '6px',
    transition: 'all 0.2s',
  },
  navBtnActive: {
    color: '#fff',
    background: 'rgba(16, 185, 129, 0.1)',
    borderBottom: '2px solid #10b981',
    borderRadius: '6px 6px 0 0',
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexShrink: 0,
  },
  modeToggleBtn: {
    border: '1px solid transparent',
    padding: '4px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    transition: 'all 0.2s',
  },
  modeToggleDemo: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'var(--text-secondary)',
  },
  modeToggleLive: {
    background: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
  },
  speedPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '3px 6px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  speedBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    padding: '2px 6px',
    fontSize: '0.7rem',
    borderRadius: '3px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
  },
  speedBtnActive: {
    background: '#10b981',
    color: '#000',
  },
  resetBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '3px',
    transition: 'all 0.15s',
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text-secondary)',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  mobileMenuBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    display: 'none', // visible at mobile via CSS
  },
  mobileNavDropdown: {
    background: 'rgba(13, 43, 43, 0.98)',
    borderTop: '1px solid var(--border-color)',
    padding: '0.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  mobileNavBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '0.75rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderRadius: '6px',
    fontWeight: '500',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  mobileNavBtnActive: {
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.08)',
  },

  /* ─── Ticker Bar ─── */
  tickerBar: {
    background: 'rgba(10, 14, 26, 0.95)',
    borderBottom: '1px solid var(--border-color)',
  },
  tickerBarInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.4rem 1rem',
    maxWidth: '1440px',
    margin: '0 auto',
    overflowX: 'auto',
  },
  tickerLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '0.05em',
    flexShrink: 0,
    fontFamily: 'var(--font-heading)',
  },
  tickerScroll: {
    display: 'flex',
    gap: '1.5rem',
    overflowX: 'auto',
  },
  tickerItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    cursor: 'pointer',
    padding: '4px 0',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  tickerItemActive: {
    transform: 'scale(1.02)',
  },
  tickerTeamText: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#cbd5e1',
    whiteSpace: 'nowrap',
  },
  tickerDot: {
    color: 'var(--text-muted)',
    fontSize: '0.6rem',
  },
  tickerStatusText: {
    fontSize: '0.75rem',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },

  /* ─── Score Cards Carousel ─── */
  carouselSection: {
    background: 'var(--bg-primary)',
    padding: '1rem 0',
  },
  filterRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    padding: '0 1rem',
  },
  filterChip: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '5px 14px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  filterChipActive: {
    background: 'var(--emerald)',
    borderColor: 'var(--emerald)',
    color: '#fff',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: '0.7rem',
    fontWeight: '700',
  },
  scoreCardsTrack: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    padding: '0 1rem 0.75rem 1rem',
    scrollSnapType: 'x mandatory',
  },
  scoreCard: {
    minWidth: '280px',
    maxWidth: '320px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    scrollSnapAlign: 'start',
    flexShrink: 0,
  },
  scoreCardSelected: {
    borderColor: 'var(--emerald)',
    background: 'rgba(16, 185, 129, 0.04)',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.08)',
  },
  scoreCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px',
  },
  scoreCardTitle: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--text-link)',
    display: 'flex',
    alignItems: 'center',
  },
  scoreCardMeta: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    marginBottom: '0.75rem',
  },
  teamRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.35rem 0',
  },
  teamInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  teamDot: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    opacity: 0.8,
  },
  teamShortName: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  teamScoreVal: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  teamOversVal: {
    fontSize: '0.78rem',
    fontWeight: '400',
    color: 'var(--text-muted)',
  },
  scoreCardFooter: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.75rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid var(--border-color)',
  },
  cardFooterLink: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'color 0.2s',
  },

  /* Progress bar under carousel */
  progressBarTrack: {
    height: '3px',
    background: 'var(--border-color)',
    borderRadius: '2px',
    margin: '0 1rem',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--emerald), var(--teal))',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
};
