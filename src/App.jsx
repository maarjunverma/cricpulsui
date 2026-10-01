import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MatchCenter from './components/MatchCenter';
import FixturesPage from './components/FixturesPage';
import TeamsPage from './components/TeamsPage';
import RankingsPage from './components/RankingsPage';
import SeriesPage from './components/SeriesPage';
import NewsPage from './components/NewsPage';
import PlayerProfileModal from './components/PlayerProfileModal';
import { simulateBall } from './services/simulationEngine';
import { setMute } from './services/audioService';
import { 
  getLiveMatches, 
  getFixtures, 
  getMatchDetails, 
  transformCricbuzzToCricPuls,
  CLIENT_FALLBACK_MATCHES,
  CLIENT_FALLBACK_FIXTURES
} from './services/apiService';
import './App.css';
import { getUIText } from './services/translations';
import CricPulsLogo from './components/CricPulsLogo';
import CopyrightModal from './components/CopyrightModal';
import { AndroidIcon, AppleIcon, CopyrightShieldIcon, VerifiedPulseBadge } from './components/CricPulsIcons';


// Popular Series (static mock data for left sidebar)
const POPULAR_SERIES = [
  'India vs Australia 2026',
  'IPL 2026',
  'T20 World Cup 2026',
  'The Ashes 2026',
  'Pakistan Super League',
  'Big Bash League',
  'Lanka Premier League',
  'Caribbean Premier League',
];

// Rankings data for right sidebar
const TOP_RANKINGS = {
  ODI: { batter: 'Shubman Gill', bowler: 'Josh Hazlewood' },
  TEST: { batter: 'Joe Root', bowler: 'Jasprit Bumrah' },
  T20: { batter: 'Travis Head', bowler: 'Rashid Khan' },
};


function App() {
  const [currentTab, setCurrentTab] = useState('live');
  const [fixturesSubTab, setFixturesSubTab] = useState('upcoming');
  const [liveMatches, setLiveMatches] = useState(() => 
    CLIENT_FALLBACK_MATCHES.map(m => transformCricbuzzToCricPuls(m, null))
  );
  const [fixtures, setFixtures] = useState(() => CLIENT_FALLBACK_FIXTURES);
  const [selectedMatchId, setSelectedMatchId] = useState(CLIENT_FALLBACK_MATCHES[0]?.id || '129469');
  const [simSpeed, setSimSpeed] = useState(5000);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [appMode, setAppMode] = useState('live');
  const [rankingFormat, setRankingFormat] = useState('ODI');
  const [appLanguage, setAppLanguage] = useState(() => {
    return localStorage.getItem('cricpuls_app_language') || 'en';
  });
  const [isCopyrightModalOpen, setIsCopyrightModalOpen] = useState(false);

  const handleLanguageChange = (newLang) => {
    const lang = newLang === 'hi' ? 'hi' : 'en';
    setAppLanguage(lang);
    localStorage.setItem('cricpuls_app_language', lang);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setMute(nextMute);
  };

  const handleToggleMode = () => {
    const nextMode = appMode === 'demo' ? 'live' : 'demo';
    setAppMode(nextMode);
  };

  // 1. Scheduled / Finished Fixtures: Poll only ONCE PER HOUR (Requirement 3)
  useEffect(() => {
    let active = true;

    const fetchFixtures = async () => {
      try {
        const fixturesList = await getFixtures();
        if (active && fixturesList && fixturesList.length > 0) {
          setFixtures(fixturesList);
        }
      } catch (err) {
        console.warn("Fixtures fetch error:", err);
      }
    };

    fetchFixtures();
    const oneHourTimer = setInterval(fetchFixtures, 60 * 60 * 1000); // 60 minutes

    return () => {
      active = false;
      clearInterval(oneHourTimer);
    };
  }, []);

  // 2. Live Matches Polling: 15s if live match exists, 5m if no match is live (Requirement 3)
  useEffect(() => {
    if (appMode !== 'live') return;

    let active = true;
    let timerId = null;

    const pollLive = async () => {
      try {
        const matchesList = await getLiveMatches();
        if (!active) return;

        let hasLive = false;
        if (matchesList && matchesList.length > 0) {
          setLiveMatches(matchesList);
          setSelectedMatchId(prevId => {
            if (prevId) return prevId;
            return matchesList[0]?.id || null;
          });
          hasLive = matchesList.some(m => m.status === 'LIVE' && !m.isFinished);
        }

        // If no match is currently live, do not hammer RapidAPI — poll in 5 minutes!
        const delay = hasLive ? 15000 : 300000;
        if (active) {
          timerId = setTimeout(pollLive, delay);
        }
      } catch (err) {
        console.warn("Live poll error:", err);
        if (active) {
          timerId = setTimeout(pollLive, 30000);
        }
      }
    };

    pollLive();

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [appMode]);

  // 3. Scorecard / Detail Polling: Only for the currently selected match (and only if active)
  useEffect(() => {
    if (appMode !== 'live' || !selectedMatchId) return;

    let active = true;
    let detailTimer = null;

    const currentMatch = liveMatches.find(m => String(m.id) === String(selectedMatchId));
    const isLive = currentMatch ? (!currentMatch.isFinished && currentMatch.status === 'LIVE') : false;

    const fetchDetail = async () => {
      try {
        const details = await getMatchDetails(selectedMatchId);
        if (active && details) {
          setLiveMatches(prev => prev.map(m => {
            if (String(m.id) === String(selectedMatchId)) {
              return transformCricbuzzToCricPuls(m, details);
            }
            return m;
          }));
          setFixtures(prev => prev.map(f => {
            if (String(f.id) === String(selectedMatchId)) {
              return transformCricbuzzToCricPuls(f, details);
            }
            return f;
          }));
        }
      } catch (err) {
        console.warn("Match detail fetch error:", err);
      }
    };

    fetchDetail();
    // Only poll scorecard repeatedly if match is currently live
    if (isLive) {
      detailTimer = setInterval(fetchDetail, 15000);
    }

    return () => {
      active = false;
      if (detailTimer) clearInterval(detailTimer);
    };
  }, [appMode, selectedMatchId]);

  // Background Simulation Loop
  useEffect(() => {
    if (appMode !== 'demo' || simSpeed === 0) return;


    const intervalId = setInterval(() => {
      setLiveMatches(prevMatches => 
        prevMatches.map(match => {
          if (match.isFinished) return match;
          
          const updatedMatch = simulateBall(match);
          
          if (updatedMatch.isFinished) {
            setFixtures(prevFixtures => 
              prevFixtures.map(f => f.id === match.id ? { ...f, status: 'FINISHED', result: updatedMatch.status.split(' - ')[1] } : f)
            );
          }
          
          return updatedMatch;
        })
      );
    }, simSpeed);

    return () => clearInterval(intervalId);
  }, [simSpeed]);

  // Reset scores back to default
  const handleResetMatches = () => {
    setLiveMatches([]);
    setFixtures([]);
    setSelectedMatchId(null);
    setSimSpeed(5000);
    setSelectedPlayerId(null);
  };

  // Combine all matches so selectedMatch can resolve live, finished, or upcoming matches!
  const allMatchesCombined = [
    ...liveMatches,
    ...fixtures.filter(f => !liveMatches.some(lm => String(lm.id) === String(f.id)))
  ];

  // Find selected match from ALL sources (live matches, finished fixtures, upcoming)
  const selectedMatch = allMatchesCombined.find(m => String(m.id) === String(selectedMatchId)) 
    || liveMatches[0] 
    || fixtures[0] 
    || null;

  // Helper to lookup player object — returns null when no squads loaded
  const getPlayerDetails = (playerId) => {
    return { player: null, teamName: '' };
  };

  const { player: modalPlayer, teamName: modalTeamName } = getPlayerDetails(selectedPlayerId);

  return (
    <>
      {/* Full-Width Header */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        fixturesSubTab={fixturesSubTab}
        setFixturesSubTab={setFixturesSubTab}
        liveMatches={liveMatches}
        fixtures={fixtures}
        selectedMatchId={selectedMatchId}
        setSelectedMatchId={setSelectedMatchId}
        simSpeed={simSpeed}
        setSimSpeed={setSimSpeed}
        onResetMatches={handleResetMatches}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        appMode={appMode}
        onToggleMode={handleToggleMode}
        appLanguage={appLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* 3-Column Layout */}
      <div className="page-layout">
        {/* ─── Left Sidebar ─── */}
        <aside className="left-sidebar">
          <div className="sidebar-card">
            <h3>{getUIText('popularSeries', appLanguage)}</h3>
            {POPULAR_SERIES.map((series, i) => (
              <span 
                key={i} 
                className="sidebar-link" 
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentTab('series')}
              >
                {series}
              </span>
            ))}
            <span 
              className="sidebar-link" 
              style={{ color: 'var(--emerald)', fontWeight: '600', marginTop: '4px', cursor: 'pointer' }}
              onClick={() => setCurrentTab('series')}
            >
              {getUIText('seeMore', appLanguage)}
            </span>
          </div>

          <div className="sidebar-card">
            <h3>{getUIText('topRankings', appLanguage)}</h3>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
              {['ODI', 'TEST', 'T20'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setRankingFormat(fmt)}
                  style={{
                    background: rankingFormat === fmt ? 'var(--emerald)' : 'rgba(255,255,255,0.04)',
                    color: rankingFormat === fmt ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{getUIText('no1Batter', appLanguage)}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{TOP_RANKINGS[rankingFormat].batter}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{getUIText('no1Bowler', appLanguage)}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{TOP_RANKINGS[rankingFormat].bowler}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <main className="main-content">
          {/* SEO Semantic Header (Boosts Google Keyword Ranking for CricAi & Live Scores) */}
          <div className="seo-hero-heading" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.85rem',
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.18)',
            borderRadius: '10px',
            marginBottom: '0.85rem',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}>
            <h1 style={{
              fontSize: '0.86rem',
              fontWeight: '700',
              color: '#f8fafc',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ color: '#10b981' }}>⚡ CricAi:</span> Fastest Live Cricket Scores &amp; Ball-by-Ball AI Commentary
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '600' }}>
              IPL 2026 • ICC Tournaments • Instant Ball Pulse
            </span>
          </div>
          {currentTab === 'live' && (
            <MatchCenter 
              match={selectedMatch} 
              onPlayerClick={setSelectedPlayerId} 
              appLanguage={appLanguage}
              onLanguageChange={handleLanguageChange}
            />
          )}
          
          {currentTab === 'fixtures' && (
            <FixturesPage 
              liveMatches={liveMatches}
              fixtures={fixtures}
              subTab={fixturesSubTab}
              setSubTab={setFixturesSubTab}
              onSelectMatch={setSelectedMatchId}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'series' && (
            <SeriesPage 
              onSelectMatch={setSelectedMatchId}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'news' && (
            <NewsPage />
          )}

          {currentTab === 'teams' && (
            <TeamsPage 
              onPlayerClick={setSelectedPlayerId}
            />
          )}

          {currentTab === 'rankings' && (
            <RankingsPage 
              onPlayerClick={setSelectedPlayerId}
            />
          )}
        </main>

        {/* ─── Right Sidebar ─── */}
        <aside className="right-sidebar">
          <div className="sidebar-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>{getUIText('downloadApp', appLanguage)}</h3>
              <VerifiedPulseBadge size={16} />
            </div>

            {/* Official App Emblem Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.05))',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              marginBottom: '0.75rem'
            }}>
              <CricPulsLogo variant="icon" size={34} glow={true} animated={false} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
                  CricAi Mobile
                </span>
                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: '600' }}>
                  ● Live Ball Alert &amp; Audio
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a 
                href="#download-android" 
                style={sidebarStyles.downloadLink} 
                onClick={(e) => { e.preventDefault(); alert("CricAi Android APK is currently in preview build."); }}
              >
                <AndroidIcon size={18} />
                <span>Android App (.apk)</span>
                <span style={sidebarStyles.externalArrow}>↗</span>
              </a>
              <a 
                href="#download-ios" 
                style={sidebarStyles.downloadLink} 
                onClick={(e) => { e.preventDefault(); alert("CricAi iOS App will be available on the App Store soon!"); }}
              >
                <AppleIcon size={18} />
                <span>iOS App (Apple)</span>
                <span style={sidebarStyles.externalArrow}>↗</span>
              </a>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>{getUIText('followUs', appLanguage)}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['YouTube', 'Instagram', 'Twitter'].map(platform => (
                <a key={platform} href="#" style={sidebarStyles.socialLink}>
                  <span>{platform}</span>
                  <span style={sidebarStyles.externalArrow}>↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h3>{getUIText('quickStats', appLanguage)}</h3>
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={sidebarStyles.statRow}>
                <span style={{ color: 'var(--text-muted)' }}>{getUIText('liveMatchesCount', appLanguage)}</span>
                <span style={{ color: 'var(--emerald)', fontWeight: '700' }}>
                  {liveMatches.filter(m => !m.isFinished).length}
                </span>
              </div>
              <div style={sidebarStyles.statRow}>
                <span style={{ color: 'var(--text-muted)' }}>{getUIText('completedMatchesCount', appLanguage)}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                  {liveMatches.filter(m => m.isFinished).length}
                </span>
              </div>
              <div style={sidebarStyles.statRow}>
                <span style={{ color: 'var(--text-muted)' }}>{getUIText('mode', appLanguage)}</span>
                <span style={{ 
                  color: 'var(--red-accent)',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                }}>
                  ● LIVE
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Enhanced CricPuls Brand Footer with Copyrights & Legal Protection */}
      <footer style={footerStyle} className="app-footer">
        <div className="full-width-inner" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Main Footer Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.75rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* Left: Brand Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '380px' }}>
              <CricPulsLogo variant="footer" size={38} />
              <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.8rem', lineHeight: '1.55', margin: '4px 0 0 0' }}>
                Next-generation real-time cricket platform delivering the fastest ball-by-ball pulse tracker, AI commentary, and tournament intelligence.
              </p>
            </div>

            {/* Middle: Navigation shortcuts */}
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ color: '#fff', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                  Platform
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setCurrentTab('live')}>Live Scores</span>
                  <span style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setCurrentTab('fixtures')}>Schedule &amp; Fixtures</span>
                  <span style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setCurrentTab('series')}>Major Series</span>
                  <span style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setCurrentTab('rankings')}>ICC Rankings</span>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#fff', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                  Legal &amp; Trust
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem' }}>
                  <button 
                    onClick={() => setIsCopyrightModalOpen(true)}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#34d399', cursor: 'pointer', textAlign: 'left', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <CopyrightShieldIcon size={14} />
                    Copyright &amp; IP Notice
                  </button>
                  <button 
                    onClick={() => setIsCopyrightModalOpen(true)}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', textAlign: 'left' }}
                  >
                    Fair Use Disclaimer
                  </button>
                  <button 
                    onClick={() => setIsCopyrightModalOpen(true)}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', textAlign: 'left' }}
                  >
                    DMCA / Contact Legal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div style={{
            paddingTop: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.76rem',
            color: 'var(--text-muted, #94a3b8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>
                &copy; {new Date().getFullYear()} <strong>CricAi™</strong>. All rights reserved.
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: '#64748b' }}>
                All match marks, tournament names, and team crests belong to their respective governing bodies (ICC/BCCI).
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsCopyrightModalOpen(true)}
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <CopyrightShieldIcon size={13} />
                Copyright Terms
              </button>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>v2.4.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright & Legal Modal */}
      <CopyrightModal 
        isOpen={isCopyrightModalOpen} 
        onClose={() => setIsCopyrightModalOpen(false)} 
      />

      {/* Player Profile Detail Dialog Overlay */}
      {selectedPlayerId && (
        <PlayerProfileModal 
          player={modalPlayer}
          teamName={modalTeamName}
          onClose={() => setSelectedPlayerId(null)}
        />
      )}
    </>
  );
}

const footerStyle = {
  padding: '2.5rem 0 1.5rem 0',
  borderTop: '1px solid rgba(16, 185, 129, 0.2)',
  background: 'linear-gradient(180deg, rgba(10, 14, 26, 0.95) 0%, rgba(5, 8, 15, 0.98) 100%)',
  marginTop: '2rem',
};

const sidebarStyles = {
  downloadLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.85rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
  downloadIcon: {
    fontSize: '1rem',
  },
  externalArrow: {
    marginLeft: 'auto',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.85rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.35rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
};

export default App;
