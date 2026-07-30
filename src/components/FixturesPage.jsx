import React, { useState } from 'react';
import { Calendar, MapPin, Award, Clock } from 'lucide-react';

export default function FixturesPage({ liveMatches, fixtures, onSelectMatch, setCurrentTab }) {
  const [subTab, setSubTab] = useState('live'); // 'live', 'upcoming', 'finished'

  // Combine liveMatches and mockFixtures to get complete lists
  const allMatches = [
    ...liveMatches.map(m => ({ ...m, category: m.isFinished ? 'finished' : 'live' })),
    ...fixtures.map(f => ({ ...f, category: f.status.toLowerCase() }))
  ];

  const filteredMatches = allMatches.filter(m => m.category === subTab);

  const getFormatBadgeColor = (format) => {
    if (format === 'T20') return 'rgba(20, 184, 166, 0.1)';
    if (format === 'ODI') return 'rgba(16, 185, 129, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  };

  const getFormatTextColor = (format) => {
    if (format === 'T20') return 'var(--teal)';
    if (format === 'ODI') return 'var(--emerald)';
    return 'var(--red-accent)';
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Cricket Fixtures</h2>
        
        {/* Inner sub tabs */}
        <div style={styles.subTabs}>
          <button 
            onClick={() => setSubTab('live')} 
            style={{...styles.subTabBtn, ...(subTab === 'live' ? styles.subTabBtnActive : {})}}
          >
            In-Progress ({allMatches.filter(m => m.category === 'live').length})
          </button>
          <button 
            onClick={() => setSubTab('upcoming')} 
            style={{...styles.subTabBtn, ...(subTab === 'upcoming' ? styles.subTabBtnActive : {})}}
          >
            Upcoming ({allMatches.filter(m => m.category === 'upcoming').length})
          </button>
          <button 
            onClick={() => setSubTab('finished')} 
            style={{...styles.subTabBtn, ...(subTab === 'finished' ? styles.subTabBtnActive : {})}}
          >
            Finished ({allMatches.filter(m => m.category === 'finished').length})
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={styles.grid}>
        {filteredMatches.map(match => {
          const formatColor = getFormatBadgeColor(match.format);
          const formatTextColor = getFormatTextColor(match.format);
          
          return (
            <div 
              key={match.id} 
              style={styles.card} 
              className="glass-card"
              onClick={() => {
                if (match.category === 'live' || match.isFinished) {
                  onSelectMatch(match.id);
                  setCurrentTab('live');
                }
              }}
            >
              {/* Card Top Meta */}
              <div style={styles.cardTop}>
                <span style={{
                  ...styles.formatBadge,
                  backgroundColor: formatColor,
                  color: formatTextColor
                }}>
                  {match.format}
                </span>
                
                {match.category === 'live' && (
                  <span style={styles.liveBadge}>
                    <span className="pulse-indicator" style={{ marginRight: '6px' }} />
                    LIVE
                  </span>
                )}
                {match.category === 'upcoming' && (
                  <span style={styles.upcomingBadge}>
                    <Clock size={10} style={{ marginRight: '4px' }} />
                    {match.countdown}
                  </span>
                )}
                {match.category === 'finished' && (
                  <span style={styles.finishedBadge}>Finished</span>
                )}
              </div>

              {/* Match Header */}
              <h3 style={styles.matchTitle}>{match.title}</h3>
              
              <div style={styles.venueContainer}>
                <MapPin size={12} color="var(--text-muted)" />
                <span style={styles.venueName}>{match.venue}</span>
              </div>

              {/* Teams & Scores Summary */}
              <div style={styles.teamContainer}>
                <div style={styles.teamLine}>
                  <div style={styles.teamDetails}>
                    <div style={{...styles.teamDot, backgroundColor: match.team1.color}} />
                    <span style={styles.teamName}>{match.team1.name}</span>
                  </div>
                  {/* Show scores if match started/finished */}
                  {(match.category === 'live' || match.category === 'finished') && match.score && (
                    <span style={styles.scoreText}>
                      {match.score.team1.runs}/{match.score.team1.wickets} 
                      <span style={styles.oversText}>({match.score.team1.overs.toFixed(1)})</span>
                    </span>
                  )}
                </div>

                <div style={styles.teamLine}>
                  <div style={styles.teamDetails}>
                    <div style={{...styles.teamDot, backgroundColor: match.team2.color}} />
                    <span style={styles.teamName}>{match.team2.name}</span>
                  </div>
                  {/* Show scores if match started/finished */}
                  {(match.category === 'live' || match.category === 'finished') && match.score && (
                    <span style={styles.scoreText}>
                      {match.innings === 2 || match.category === 'finished' ? (
                        <>
                          {match.score.team2.runs}/{match.score.team2.wickets} 
                          <span style={styles.oversText}>({match.score.team2.overs.toFixed(1)})</span>
                        </>
                      ) : (
                        'Yet to bat'
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Match Result / Upcoming Schedule Line */}
              <div style={styles.cardFooter}>
                {match.category === 'live' && (
                  <span style={styles.statusLive}>{match.status}</span>
                )}
                {match.category === 'finished' && (
                  <span style={styles.statusFinished}>
                    <Award size={14} style={{ marginRight: '6px' }} />
                    {match.result || match.status}
                  </span>
                )}
                {match.category === 'upcoming' && (
                  <span style={styles.statusUpcoming}>
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    {match.date} • {match.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredMatches.length === 0 && (
          <div style={styles.emptyContainer} className="glass-card">
            <h4 style={{ color: 'var(--text-secondary)' }}>No matches in this category</h4>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '10px',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    color: '#fff',
  },
  subTabs: {
    display: 'flex',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '3px',
    borderRadius: '10px',
    gap: '2px',
  },
  subTabBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  subTabBtnActive: {
    background: 'var(--emerald)',
    color: '#fff',
    fontWeight: '700',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1rem',
  },
  card: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formatBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
    letterSpacing: '0.5px',
  },
  liveBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--emerald)',
    padding: '3px 8px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  upcomingBadge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'var(--amber)',
    background: 'rgba(255, 214, 0, 0.1)',
    padding: '3px 8px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  finishedBadge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  matchTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.3',
  },
  venueContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
  },
  venueName: {
    color: 'var(--text-secondary)',
  },
  teamContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '8px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  teamLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  teamDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  teamName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff',
  },
  scoreText: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#fff',
  },
  oversText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    marginLeft: '4px',
  },
  cardFooter: {
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  statusLive: {
    color: 'var(--emerald)',
  },
  statusFinished: {
    color: 'var(--teal)',
    display: 'flex',
    alignItems: 'center',
  },
  statusUpcoming: {
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
  },
  emptyContainer: {
    gridColumn: '1 / -1',
    padding: '3rem',
    textAlign: 'center',
  }
};
