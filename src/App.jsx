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
            return matchesList.some(m => m.id === prevId) ? prevId : matchesList[0].id;
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

    const currentMatch = liveMatches.find(m => m.id === selectedMatchId);
    const isLive = currentMatch ? (!currentMatch.isFinished && currentMatch.status === 'LIVE') : true;

    const fetchDetail = async () => {
      try {
        const details = await getMatchDetails(selectedMatchId);
        if (active && details) {
          setLiveMatches(prev => prev.map(m => {
            if (m.id === selectedMatchId) {
              return transformCricbuzzToCricPuls(m, details);
            }
            return m;
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

  // Find selected match
  const selectedMatch = liveMatches.find(m => m.id === selectedMatchId) || liveMatches[0] || null;

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
            <h3>{getUIText('downloadApp', appLanguage)}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="#" style={sidebarStyles.downloadLink}>
                <span style={sidebarStyles.downloadIcon}>▶</span>
                <span>Android App</span>
                <span style={sidebarStyles.externalArrow}>↗</span>
              </a>
              <a href="#" style={sidebarStyles.downloadLink}>
                <span style={sidebarStyles.downloadIcon}></span>
                <span>iOS App</span>
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

      {/* Footer */}
      <footer style={footerStyle}>
        <div className="full-width-inner" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            &copy; {new Date().getFullYear()} CricPuls. All rights reserved. Live scores, commentary, and match statistics.
          </p>
        </div>
      </footer>

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
  padding: '1.5rem 0',
  borderTop: '1px solid var(--border-color)',
  background: 'var(--bg-secondary)',
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
