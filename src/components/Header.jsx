import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Activity, Calendar, Users, Award, Zap, Play, Pause, RefreshCw, Volume2, VolumeX, ChevronRight, ChevronLeft, Menu, X, Trophy, Newspaper } from 'lucide-react';
import { getUIText } from '../services/translations';
import CricPulsLogo from './CricPulsLogo';
import TeamFlag from './TeamFlag';


export default function Header({ 
  currentTab, 
  setCurrentTab, 
  _fixturesSubTab,
  setFixturesSubTab,
  liveMatches = [], 
  fixtures = [],
  selectedMatchId, 
  setSelectedMatchId,
  _simSpeed,
  _setSimSpeed,
  _onResetMatches,
  _isMuted,
  _onToggleMute,
  _appMode,
  _onToggleMode,
  appLanguage = 'en',
  onLanguageChange
}) {
  const [filterType, setFilterType] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Carousel Scrollbar & Navigation (High Visibility) ───
  const carouselTrackRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [scrollInfo, setScrollInfo] = useState({ scrollLeft: 0, maxScroll: 0, ratio: 0, thumbWidthPercent: 25 });

  // ─── Ticker Smooth Scroll State & Controls (Pure smooth scrolling, no slider buttons) ───
  const tickerTrackRef = useRef(null);
  const [tickerScrollState, setTickerScrollState] = useState({ canLeft: false, canRight: false });
  const isDraggingTicker = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const hasDraggedTicker = useRef(false);

  const updateTickerScroll = useCallback(() => {
    const el = tickerTrackRef.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 4;
    const canRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 4;
    setTickerScrollState({ canLeft, canRight });
  }, []);

  useEffect(() => {
    updateTickerScroll();
    const el = tickerTrackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateTickerScroll, { passive: true });
    window.addEventListener('resize', updateTickerScroll);
    return () => {
      el.removeEventListener('scroll', updateTickerScroll);
      window.removeEventListener('resize', updateTickerScroll);
    };
  }, [liveMatches, fixtures, updateTickerScroll]);

  const handleTickerWheel = (e) => {
    const el = tickerTrackRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
    }
  };

  const handleTickerMouseDown = (e) => {
    isDraggingTicker.current = true;
    hasDraggedTicker.current = false;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = tickerTrackRef.current ? tickerTrackRef.current.scrollLeft : 0;
  };

  const handleTickerMouseMove = (e) => {
    if (!isDraggingTicker.current || !tickerTrackRef.current) return;
    const deltaX = e.pageX - dragStartX.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedTicker.current = true;
    }
    tickerTrackRef.current.scrollLeft = dragStartScrollLeft.current - deltaX;
  };

  const handleTickerMouseUp = () => {
    isDraggingTicker.current = false;
  };

  // Combine live matches and fixtures up to 20 matches for the ticker
  const tickerMatches = [
    ...liveMatches.map(m => ({
      ...m,
      isFinished: m.isFinished || m.category === 'finished' || (m.status && m.status.toUpperCase() === 'FINISHED'),
      isLive: !m.isFinished && (m.status === 'LIVE' || m.category === 'live')
    })),
    ...fixtures.filter(f => !liveMatches.some(lm => lm.id === f.id)).map(f => {
      const isFin = f.isFinished || (f.status && f.status.toUpperCase() === 'FINISHED');
      const isLiv = !isFin && (f.status && f.status.toUpperCase() === 'LIVE');
      return {
        ...f,
        isFinished: isFin,
        isLive: isLiv
      };
    })
  ].slice(0, 20);

  const updateScrollInfo = useCallback(() => {
    const el = carouselTrackRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const scrollLeft = el.scrollLeft;
    const ratio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    const thumbWidthPercent = el.scrollWidth > 0 
      ? Math.max(8, Math.min(35, (el.clientWidth / el.scrollWidth) * 100))
      : 20;
    setScrollInfo({ scrollLeft, maxScroll, ratio, thumbWidthPercent });
  }, []);

  useEffect(() => {
    const el = carouselTrackRef.current;
    if (!el) return;

    updateScrollInfo();

    let rAF = null;
    const onScrollOrResize = () => {
      if (window.innerWidth > 992) {
        setMobileMenuOpen(false);
      }
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        updateScrollInfo();
      });
    };

    el.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      if (rAF) cancelAnimationFrame(rAF);
      el.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [liveMatches, fixtures, filterType, updateScrollInfo]);

  const scrollCarousel = (direction) => {
    if (!carouselTrackRef.current) return;
    const scrollAmount = 340;
    carouselTrackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleCarouselWheel = (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && carouselTrackRef.current) {
      e.preventDefault();
      // Gentle, controlled horizontal scroll increment (not jumping 10 cards)
      const step = Math.sign(e.deltaY) * Math.min(180, Math.abs(e.deltaY) * 0.7);
      carouselTrackRef.current.scrollBy({ left: step, behavior: 'auto' });
    }
  };

  const handleTrackClick = (e) => {
    if (e.target.closest('.carousel-scrollbar-thumb')) return;
    const carouselEl = carouselTrackRef.current;
    const trackEl = scrollTrackRef.current;
    if (!carouselEl || !trackEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const thumbWidthPx = (scrollInfo.thumbWidthPercent / 100) * trackRect.width;
    const thumbLeftPx = (thumbLeftPercent / 100) * trackRect.width;
    const thumbCenterPx = thumbLeftPx + (thumbWidthPx / 2);

    // Smooth single-page advance (approx 1 card width ~340px) instead of jumping across the whole track
    const scrollStep = 340;

    if (clickX > thumbCenterPx) {
      carouselEl.scrollBy({ left: scrollStep, behavior: 'smooth' });
    } else {
      carouselEl.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    }
  };

  const handleThumbPointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const carouselEl = carouselTrackRef.current;
    const trackEl = scrollTrackRef.current;
    if (!carouselEl || !trackEl) return;

    setIsDraggingThumb(true);
    // Disable smooth behavior & snap during active dragging for immediate 1:1 tactile precision
    carouselEl.style.scrollBehavior = 'auto';
    carouselEl.style.scrollSnapType = 'none';

    const trackRect = trackEl.getBoundingClientRect();
    const startX = e.clientX;
    const startScrollLeft = carouselEl.scrollLeft;
    const maxScroll = Math.max(0, carouselEl.scrollWidth - carouselEl.clientWidth);

    // Calculate effective thumb width in pixels
    const thumbWidthPx = (scrollInfo.thumbWidthPercent / 100) * trackRect.width;
    const usableTrackWidth = Math.max(1, trackRect.width - thumbWidthPx);

    let rafId = null;

    const onPointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Proportional scroll delta based on the usable track width
      const scrollDelta = (deltaX / usableTrackWidth) * maxScroll;
      const targetScroll = Math.max(0, Math.min(maxScroll, startScrollLeft + scrollDelta));

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        carouselEl.scrollLeft = targetScroll;
        updateScrollInfo();
      });
    };

    const onPointerUp = () => {
      setIsDraggingThumb(false);
      if (rafId) cancelAnimationFrame(rafId);
      // Re-enable smooth scrolling after drag finishes
      carouselEl.style.scrollBehavior = 'smooth';
      carouselEl.style.scrollSnapType = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const thumbLeftPercent = scrollInfo.ratio * (100 - scrollInfo.thumbWidthPercent);

  const navItems = [
    { key: 'live', label: getUIText('home', appLanguage), icon: Activity },
    { key: 'fixtures', label: getUIText('schedule', appLanguage), icon: Calendar },
    { key: 'series', label: getUIText('series', appLanguage), icon: Trophy },
    { key: 'news', label: getUIText('news', appLanguage), icon: Newspaper },
    { key: 'teams', label: getUIText('teams', appLanguage), icon: Users },
    { key: 'rankings', label: getUIText('rankings', appLanguage), icon: Award },
  ];

  const filterChips = ['all', 'live', 'upcoming', 'finished'];

  return (
    <>
    {/* ─── Sticky App Header (Top Navbar) ─── */}
    <header className="app-header-sticky" style={styles.headerSticky}>
      <div style={styles.navInner} className="full-width-inner">
          {/* Official CricPuls Logo */}
          <div style={styles.logoContainer} onClick={() => { setCurrentTab('live'); setMobileMenuOpen(false); }}>
            <CricPulsLogo variant="full" size={38} animated={true} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav" style={styles.desktopNav}>
            {navItems.map(item => {
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  className={`nav-link-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (item.key === 'fixtures' && setFixturesSubTab) {
                      setFixturesSubTab('upcoming');
                    }
                    setCurrentTab(item.key);
                  }}
                  style={{
                    ...styles.navBtn,
                    ...(isActive ? styles.navBtnActive : {})
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div style={styles.rightControls}>
            {/* App Language Switcher (EN | HI) */}
            <div className="app-language-toggle">
              <button
                type="button"
                className={`lang-opt-btn ${appLanguage === 'en' ? 'active' : ''}`}
                onClick={() => onLanguageChange && onLanguageChange('en')}
                title="Switch app language to English"
              >
                EN
              </button>
              <span className="lang-divider">|</span>
              <button
                type="button"
                className={`lang-opt-btn ${appLanguage === 'hi' ? 'active' : ''}`}
                onClick={() => onLanguageChange && onLanguageChange('hi')}
                title="Switch app language to Hindi (हिंदी)"
              >
                HI
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={styles.mobileMenuBtn}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div style={styles.mobileNavDropdown} className="mobile-nav-dropdown">
            {/* Mobile App Language Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-muted)' }}>App Language</span>
              <div className="app-language-toggle">
                <button
                  type="button"
                  className={`lang-opt-btn ${appLanguage === 'en' ? 'active' : ''}`}
                  onClick={() => onLanguageChange && onLanguageChange('en')}
                >
                  English
                </button>
                <span className="lang-divider">|</span>
                <button
                  type="button"
                  className={`lang-opt-btn ${appLanguage === 'hi' ? 'active' : ''}`}
                  onClick={() => onLanguageChange && onLanguageChange('hi')}
                >
                  हिंदी
                </button>
              </div>
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { 
                    if (item.key === 'fixtures' && setFixturesSubTab) {
                      setFixturesSubTab('upcoming');
                    }
                    setCurrentTab(item.key); 
                    setMobileMenuOpen(false); 
                  }}
                  style={{
                    ...styles.mobileNavBtn,
                    ...(isActive ? styles.mobileNavBtnActive : {})
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ─── Match Ticker Bar ─── */}
      <div style={styles.tickerBar}>
        <div style={styles.tickerBarInner} className="full-width-inner">
          <div style={styles.tickerLabelContainer}>
            <span style={styles.tickerLabel}>{getUIText('matches', appLanguage)}</span>
            <div style={styles.tickerDivider} />
          </div>

          <div className="ticker-scroll-wrapper" style={styles.tickerScrollWrapper}>
            {tickerScrollState.canLeft && (
              <div className="ticker-fade-left" />
            )}

            <div 
              ref={tickerTrackRef} 
              className="ticker-scroll-track" 
              onWheel={handleTickerWheel}
              onMouseDown={handleTickerMouseDown}
              onMouseMove={handleTickerMouseMove}
              onMouseUp={handleTickerMouseUp}
              onMouseLeave={handleTickerMouseUp}
              style={styles.tickerScroll}
            >
              {tickerMatches.map(match => {
                const isSelected = selectedMatchId === match.id;
                const isLive = match.isLive;
                const isFinished = match.isFinished;
                const statusLabel = isLive 
                  ? getUIText('live', appLanguage) 
                  : isFinished 
                    ? getUIText('finished', appLanguage) 
                    : (match.countdown || match.date || getUIText('upcoming', appLanguage));
                const statusColor = isLive ? 'var(--emerald)' : isFinished ? 'var(--text-muted)' : 'var(--teal)';

                return (
                  <button
                    key={match.id}
                    onClick={() => {
                      if (hasDraggedTicker.current) return;
                      setSelectedMatchId(match.id);
                      if (isLive || isFinished) {
                        setCurrentTab('live');
                      } else {
                        if (setFixturesSubTab) setFixturesSubTab('upcoming');
                        setCurrentTab('fixtures');
                      }
                    }}
                    className={`ticker-item ${isSelected ? 'active' : ''}`}
                    style={{
                      ...styles.tickerItem,
                      ...(isSelected ? styles.tickerItemActive : {})
                    }}
                    title={`${match.team1?.name || match.team1?.shortName} vs ${match.team2?.name || match.team2?.shortName}`}
                  >
                    <span style={{ ...styles.tickerTeamText, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <TeamFlag team={match.team1} size={14} />
                      <span>{match.team1?.shortName || match.team1?.name}</span>
                      <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>vs</span>
                      <TeamFlag team={match.team2} size={14} />
                      <span>{match.team2?.shortName || match.team2?.name}</span>
                    </span>
                    <span style={styles.tickerDot}>•</span>
                    <span style={{
                      ...styles.tickerStatusText,
                      color: statusColor
                    }}>
                      {statusLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {tickerScrollState.canRight && (
              <div className="ticker-fade-right" />
            )}
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

          {/* Score Cards Carousel with high visibility navigation & scrollbar */}
          <div className={`carousel-track-wrapper ${isDraggingThumb ? 'is-dragging' : ''}`}>
            <button
              className={`carousel-nav-btn carousel-nav-prev ${scrollInfo.scrollLeft <= 5 ? 'disabled' : ''}`}
              onClick={() => scrollCarousel('left')}
              aria-label="Previous matches"
              title="Scroll left"
            >
              <ChevronLeft size={22} />
            </button>

            <div 
              ref={carouselTrackRef}
              className="score-cards-track"
              style={styles.scoreCardsTrack}
              onScroll={updateScrollInfo}
              onWheel={handleCarouselWheel}
            >
              {(() => {
                const combinedMatches = [
                  ...liveMatches.map(m => ({ 
                    ...m, 
                    category: m.isFinished ? 'finished' : (m.category || (m.status === 'UPCOMING' ? 'upcoming' : 'live')) 
                  })),
                  ...fixtures.filter(f => !liveMatches.some(lm => lm.id === f.id)).map(f => {
                    let cat = f.category;
                    if (!cat) {
                      if (f.isFinished || (f.status && f.status.toUpperCase() === 'FINISHED')) cat = 'finished';
                      else if (f.status && f.status.toUpperCase() === 'UPCOMING') cat = 'upcoming';
                      else if (f.status && f.status.toUpperCase() === 'LIVE') cat = 'live';
                      else cat = 'upcoming';
                    }
                    return {
                      ...f,
                      category: cat.toLowerCase()
                    };
                  })
                ];

                const filtered = combinedMatches.filter(m => {
                  if (filterType === 'all') return true;
                  if (filterType === 'live') return m.category === 'live';
                  if (filterType === 'upcoming') return m.category === 'upcoming';
                  if (filterType === 'finished') return m.category === 'finished';
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No {filterType} matches found.
                    </div>
                  );
                }

                return filtered.map(match => {
                  const isSelected = selectedMatchId === match.id;
                  const isLive = match.category === 'live';
                  const isUpcoming = match.category === 'upcoming';
                  const isFinished = match.category === 'finished';

                  return (
                    <div
                      key={match.id}
                      onClick={() => {
                        setSelectedMatchId(match.id);
                        setCurrentTab('live');
                      }}
                      className={`score-card ${isSelected ? 'selected' : ''}`}
                      style={{
                        ...styles.scoreCard,
                        ...(isSelected ? styles.scoreCardSelected : {}),
                        cursor: 'pointer'
                      }}
                    >
                      {/* Card Header */}
                      <div style={styles.scoreCardHeader}>
                        <span style={styles.scoreCardTitle}>
                          {isLive && <span className="red-indicator" style={{ marginRight: '6px', width: '6px', height: '6px' }} />}
                          {isUpcoming && <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0ea5e9', marginRight: '6px' }} />}
                          {isFinished && <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', marginRight: '6px' }} />}
                          {isLive ? `${getUIText('live', appLanguage)} ` : isUpcoming ? `${getUIText('upcoming', appLanguage)} • ` : `${getUIText('finished', appLanguage)} • `}
                          {match.format || 'T20'}
                        </span>
                        {isUpcoming && match.countdown && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--teal)', fontWeight: '600' }}>
                            {match.countdown}
                          </span>
                        )}
                      </div>
                      <div style={styles.scoreCardMeta}>
                        {match.venue}
                      </div>

                      {/* Team Scores / Names with Official Flags */}
                      <div style={styles.teamRow}>
                        <div style={styles.teamInfo}>
                          <TeamFlag team={match.team1} size={20} />
                          <span style={styles.teamShortName}>{match.team1?.shortName || match.team1?.name}</span>
                        </div>
                        <span style={styles.teamScoreVal}>
                          {match.score?.team1 ? (
                            <>
                              {match.score.team1.runs}/{match.score.team1.wickets}
                              <span style={styles.teamOversVal}> ({typeof match.score.team1.overs === 'number' ? match.score.team1.overs.toFixed(1) : match.score.team1.overs})</span>
                            </>
                          ) : (
                            isUpcoming ? (match.time || 'TBD') : '—'
                          )}
                        </span>
                      </div>
                      <div style={styles.teamRow}>
                        <div style={styles.teamInfo}>
                          <TeamFlag team={match.team2} size={20} />
                          <span style={styles.teamShortName}>{match.team2?.shortName || match.team2?.name}</span>
                        </div>
                        <span style={styles.teamScoreVal}>
                          {match.score?.team2 ? (
                            (match.innings === 2 || isFinished || match.score.team2.runs > 0) ? (
                              <>
                                {match.score.team2.runs}/{match.score.team2.wickets}
                                <span style={styles.teamOversVal}> ({typeof match.score.team2.overs === 'number' ? match.score.team2.overs.toFixed(1) : match.score.team2.overs})</span>
                              </>
                            ) : (
                              getUIText('yetToBat', appLanguage)
                            )
                          ) : (
                            isUpcoming ? (match.date || 'Scheduled') : '—'
                          )}
                        </span>
                      </div>

                      {/* Card Footer Status */}
                      <div style={styles.scoreCardFooter}>
                        <span style={{
                          ...styles.cardFooterLink,
                          color: isLive ? 'var(--emerald)' : isFinished ? 'var(--amber)' : 'var(--text-muted)'
                        }}>
                          {match.result || match.statusText || (isUpcoming ? (match.date && match.time ? `${match.date} • ${match.time}` : (match.countdown || match.date || match.status || 'Match Scheduled')) : match.status)}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <button
              className={`carousel-nav-btn carousel-nav-next ${scrollInfo.scrollLeft >= scrollInfo.maxScroll - 5 ? 'disabled' : ''}`}
              onClick={() => scrollCarousel('right')}
              aria-label="Next matches"
              title="Scroll right"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* High-Visibility Interactive Scrollbar Track for Tablets & Big Screens */}
          <div 
            ref={scrollTrackRef}
            className="carousel-scrollbar-container"
            onClick={handleTrackClick}
            title="Click or drag to scroll matches"
          >
            <div className="carousel-scrollbar-track">
              <div 
                className={`carousel-scrollbar-thumb ${isDraggingThumb ? 'active' : ''}`}
                style={{
                  width: `${scrollInfo.thumbWidthPercent}%`,
                  left: `${thumbLeftPercent}%`,
                }}
                onPointerDown={handleThumbPointerDown}
              />
            </div>
          </div>
        </div>
      </div>

    {/* ─── Mobile App Bottom Navigation Bar ─── */}
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {navItems.filter(item => item.key !== 'series').map(item => {
        const Icon = item.icon;
        const isActive = currentTab === item.key;
        return (
          <button
            key={`mobile-bottom-${item.key}`}
            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => {
              if (item.key === 'fixtures' && setFixturesSubTab) {
                setFixturesSubTab('upcoming');
              }
              setCurrentTab(item.key);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title={item.label}
            aria-label={item.label}
          >
            <div className="mobile-bottom-icon-wrap">
              <Icon size={20} />
              {item.key === 'live' && <span className="mobile-live-dot" />}
            </div>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
    </>
  );
}

const styles = {
  /* ─── Sticky Header / Navbar ─── */
  headerSticky: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'linear-gradient(135deg, rgba(13, 43, 43, 0.98) 0%, rgba(10, 30, 46, 0.98) 50%, rgba(13, 21, 32, 0.98) 100%)',
    borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
    width: '100%',
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
    fontSize: '1.55rem',
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
    gap: '0.6rem',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtn: {
    background: 'transparent',
    border: '1px solid transparent',
    color: '#94a3b8',
    padding: '0.55rem 1.25rem',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  navBtnActive: {
    color: '#ffffff',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid var(--emerald)',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
    fontWeight: '700',
    borderRadius: '8px',
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
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
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
    border: '1px solid transparent',
    color: 'var(--text-secondary)',
    padding: '0.85rem 1.15rem',
    fontSize: '1.05rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    borderRadius: '8px',
    fontWeight: '600',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  mobileNavBtnActive: {
    color: '#ffffff',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid var(--emerald)',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)',
    fontWeight: '600',
  },

  /* ─── Ticker Bar ─── */
  tickerBar: {
    background: 'rgba(10, 14, 26, 0.95)',
    borderBottom: '1px solid var(--border-color)',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  tickerBarInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.45rem 1rem',
    maxWidth: '1440px',
    margin: '0 auto',
    overflow: 'hidden',
    position: 'relative',
  },
  tickerLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexShrink: 0,
  },
  tickerLabel: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '0.06em',
    flexShrink: 0,
    fontFamily: 'var(--font-heading)',
  },
  tickerDivider: {
    width: '1px',
    height: '18px',
    background: 'rgba(255, 255, 255, 0.15)',
    flexShrink: 0,
  },
  tickerScrollWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  tickerScroll: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    flex: 1,
    minWidth: 0,
    padding: '2px 4px',
  },
  tickerItem: {
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    cursor: 'pointer',
    padding: '4px 10px',
    flexShrink: 0,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
  },
  tickerItemActive: {
    border: '1px solid var(--emerald)',
    background: 'rgba(16, 185, 129, 0.12)',
    boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)',
    color: '#ffffff',
  },
  tickerTeamText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#cbd5e1',
    whiteSpace: 'nowrap',
  },
  tickerDot: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  tickerStatusText: {
    fontSize: '0.95rem',
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
    borderWidth: '1.5px',
    borderStyle: 'solid',
    background: 'transparent',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)',
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

};
