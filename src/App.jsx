import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MatchCenter from './components/MatchCenter';
import FixturesPage from './components/FixturesPage';
import TeamsPage from './components/TeamsPage';
import RankingsPage from './components/RankingsPage';
import PlayerProfileModal from './components/PlayerProfileModal';
import { INITIAL_LIVE_MATCHES, MOCK_FIXTURES, TEAMS } from './data/mockMatches';
import { simulateBall } from './services/simulationEngine';
import { setMute } from './services/audioService';
import { getLiveMatches, getMatchDetails, transformCricbuzzToCricPuls } from './services/apiService';
import './App.css';


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
  const [liveMatches, setLiveMatches] = useState(INITIAL_LIVE_MATCHES);
  const [fixtures, setFixtures] = useState(MOCK_FIXTURES);
  const [selectedMatchId, setSelectedMatchId] = useState('live_1');
  const [simSpeed, setSimSpeed] = useState(5000);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [appMode, setAppMode] = useState('live');
  const [rankingFormat, setRankingFormat] = useState('ODI');

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setMute(nextMute);
  };

  const handleToggleMode = () => {
    const nextMode = appMode === 'demo' ? 'live' : 'demo';
    setAppMode(nextMode);
    if (nextMode === 'demo') {
      setLiveMatches(JSON.parse(JSON.stringify(INITIAL_LIVE_MATCHES)));
      setSelectedMatchId('live_1');
    }
  };

  // Live API Polling Loop
  useEffect(() => {
    if (appMode !== 'live') return;

    let active = true;

    const pollLiveMatches = async () => {
      console.log("Polling live Cricbuzz API from proxy...");
      const rawMatchesList = await getLiveMatches();
      if (!active) return;

      if (rawMatchesList && rawMatchesList.length > 0) {
        const transformedList = await Promise.all(
          rawMatchesList.slice(0, 5).map(async (rawMatch) => {
            const matchId = rawMatch.id;
            const details = await getMatchDetails(matchId);
            return transformCricbuzzToCricPuls(rawMatch, details);
          })
        );
        
        if (!active) return;
        
        const cleanList = transformedList.filter(Boolean);
        if (cleanList.length > 0) {
          setLiveMatches(cleanList);
          if (!cleanList.some(m => m.id === selectedMatchId)) {
            setSelectedMatchId(cleanList[0].id);
          }
        }
      }
    };

    pollLiveMatches();
    const intervalId = setInterval(pollLiveMatches, 25000);

    return () => {
      active = false;
      clearInterval(intervalId);
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
    setLiveMatches(JSON.parse(JSON.stringify(INITIAL_LIVE_MATCHES)));
    setFixtures(JSON.parse(JSON.stringify(MOCK_FIXTURES)));
    setSelectedMatchId('live_1');
    setSimSpeed(5000);
    setSelectedPlayerId(null);
  };

  // Find selected match
  const selectedMatch = liveMatches.find(m => m.id === selectedMatchId) || liveMatches[0];

  // Helper to lookup player object + team name for the profile modal
  const getPlayerDetails = (playerId) => {
    if (!playerId) return { player: null, teamName: '' };
    
    for (const teamKey in TEAMS) {
      const team = TEAMS[teamKey];
      const player = team.squad.find(p => p.id === playerId);
      if (player) {
        return { player, teamName: team.name };
      }
    }
    return { player: null, teamName: '' };
  };

  const { player: modalPlayer, teamName: modalTeamName } = getPlayerDetails(selectedPlayerId);

  return (
    <>
      {/* Full-Width Header */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        liveMatches={liveMatches}
        selectedMatchId={selectedMatchId}
        setSelectedMatchId={setSelectedMatchId}
        simSpeed={simSpeed}
        setSimSpeed={setSimSpeed}
        onResetMatches={handleResetMatches}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        appMode={appMode}
        onToggleMode={handleToggleMode}
      />

      {/* 3-Column Layout */}
      <div className="page-layout">
        {/* ─── Left Sidebar ─── */}
        <aside className="left-sidebar">
          <div className="sidebar-card">
            <h3>Popular Series</h3>
            {POPULAR_SERIES.map((series, i) => (
              <span key={i} className="sidebar-link">{series}</span>
            ))}
            <span className="sidebar-link" style={{ color: 'var(--emerald)', fontWeight: '600', marginTop: '4px' }}>
              See More
            </span>
          </div>

          <div className="sidebar-card">
            <h3>Top Rankings</h3>
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
                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No.1 Batter</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{TOP_RANKINGS[rankingFormat].batter}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No.1 Bowler</span>
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
            />
          )}
          
          {currentTab === 'fixtures' && (
            <FixturesPage 
              liveMatches={liveMatches}
              fixtures={fixtures}
              onSelectMatch={setSelectedMatchId}
              setCurrentTab={setCurrentTab}
            />
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
            <h3>Download the App</h3>
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
            <h3>Follow Us</h3>
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
            <h3>Quick Stats</h3>
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={sidebarStyles.statRow}>
                <span style={{ color: 'var(--text-muted)' }}>Live Matches</span>
                <span style={{ color: 'var(--emerald)', fontWeight: '700' }}>
                  {liveMatches.filter(m => !m.isFinished).length}
                </span>
              </div>
              <div style={sidebarStyles.statRow}>
                <span style={{ color: 'var(--text-muted)' }}>Completed</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                  {liveMatches.filter(m => m.isFinished).length}
                </span>
              </div>
              <div style={sidebarStyles.statRow}>
                <span style={{ color: 'var(--text-muted)' }}>Mode</span>
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
            &copy; {new Date().getFullYear()} CricPuls. All rights reserved. Live scores, statistics, and session odds are simulated.
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
