import React, { useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import CricketField from './CricketField';
import { playBallEvent } from '../services/audioService';

export default function LiveTab({ match, onPlayerClick }) {
  if (!match) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>No active match selected or loading live Cricbuzz feed...</p>
      </div>
    );
  }

  const { batting, bowling, recentBalls, commentary, odds } = match;
  const striker = batting?.striker;
  const nonStriker = batting?.nonStriker;
  const activeBowler = bowling?.active;

  // Sound effects triggered ball-by-ball
  useEffect(() => {
    if (match?.lastBall) {
      playBallEvent(match.lastBall.event);
    }
  }, [match?.lastBall]);

  // Audio commentary player (text-to-speech using window.speechSynthesis)
  const speakLastCommentary = () => {
    if (!commentary || commentary.length === 0) return;
    const utterance = new SpeechSynthesisUtterance(commentary[0].text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel(); // cancel any active speech
    window.speechSynthesis.speak(utterance);
  };

  const getBallClass = (ballEvent) => {
    if (ballEvent === '4') return 'four';
    if (ballEvent === '6') return 'six';
    if (ballEvent === 'W') return 'wicket';
    if (ballEvent === 'Wd' || ballEvent === 'Nb') return 'extras';
    return '';
  };

  return (
    <div style={styles.mainSplit} className="fade-in">
      <div style={styles.leftCol}>
      
      {/* Active Batsmen & Bowler Card */}
      <div style={styles.gridSection}>
        {/* Batsmen Box */}
        <div style={styles.card} className="glass-card">
          <h4 style={styles.cardTitle}>Batting</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Batsman</th>
                <th style={styles.textRight}>R</th>
                <th style={styles.textRight}>B</th>
                <th style={styles.textRight}>4s</th>
                <th style={styles.textRight}>6s</th>
                <th style={styles.textRight}>SR</th>
              </tr>
            </thead>
            <tbody>
              {striker && (
                <tr style={styles.activeRow}>
                  <td 
                    onClick={() => onPlayerClick(striker.id)} 
                    style={styles.playerLink}
                  >
                    {striker.name} <span style={styles.strikerDot}>*</span>
                  </td>
                  <td style={{...styles.textRight, fontWeight: '700'}}>{striker.runs}</td>
                  <td style={styles.textRight}>{striker.balls}</td>
                  <td style={styles.textRight}>{striker.fours}</td>
                  <td style={styles.textRight}>{striker.sixes}</td>
                  <td style={{...styles.textRight, color: 'var(--teal)'}}>
                    {striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : '0.0'}
                  </td>
                </tr>
              )}
              {nonStriker && (
                <tr>
                  <td 
                    onClick={() => onPlayerClick(nonStriker.id)} 
                    style={styles.playerLink}
                  >
                    {nonStriker.name}
                  </td>
                  <td style={{...styles.textRight, fontWeight: '600'}}>{nonStriker.runs}</td>
                  <td style={styles.textRight}>{nonStriker.balls}</td>
                  <td style={styles.textRight}>{nonStriker.fours}</td>
                  <td style={styles.textRight}>{nonStriker.sixes}</td>
                  <td style={{...styles.textRight, color: 'var(--text-secondary)'}}>
                    {nonStriker.balls > 0 ? ((nonStriker.runs / nonStriker.balls) * 100).toFixed(1) : '0.0'}
                  </td>
                </tr>
              )}
              {!striker && !nonStriker && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                    No active batsmen
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bowler Box */}
        <div style={styles.card} className="glass-card">
          <h4 style={styles.cardTitle}>Bowling</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Bowler</th>
                <th style={styles.textRight}>O</th>
                <th style={styles.textRight}>M</th>
                <th style={styles.textRight}>R</th>
                <th style={styles.textRight}>W</th>
                <th style={styles.textRight}>Econ</th>
              </tr>
            </thead>
            <tbody>
              {activeBowler ? (
                <tr style={styles.activeRow}>
                  <td 
                    onClick={() => onPlayerClick(activeBowler.id)} 
                    style={styles.playerLink}
                  >
                    {activeBowler.name}
                  </td>
                  <td style={{...styles.textRight, fontWeight: '700'}}>{activeBowler.overs.toFixed(1)}</td>
                  <td style={styles.textRight}>{activeBowler.maidens}</td>
                  <td style={styles.textRight}>{activeBowler.runs}</td>
                  <td style={{...styles.textRight, color: 'var(--red-accent)', fontWeight: '700'}}>{activeBowler.wkts}</td>
                  <td style={{...styles.textRight, color: 'var(--emerald)'}}>
                    {activeBowler.overs > 0 ? (activeBowler.runs / (Math.floor(activeBowler.overs) + (activeBowler.overs % 1) * 1.666)).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                    No active bowler
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Balls Tracker Card */}
      <div style={styles.recentContainer} className="glass-card">
        <span style={styles.recentLabel}>Recent Balls:</span>
        <div style={styles.ballsList}>
          {recentBalls.map((ball, idx) => (
            <span 
              key={idx} 
              className={`ball-circle ${getBallClass(ball)}`}
            >
              {ball}
            </span>
          ))}
          {recentBalls.length === 0 && <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Starts of over...</span>}
        </div>
      </div>

      {/* Win Probability Bar */}
      {odds && odds.winProbability !== undefined && (
        <div style={styles.probCard} className="glass-card">
          <div style={styles.probLabelRow}>
            <span style={{ fontWeight: '700', color: match.team1.color }}>
              {match.team1.shortName} ({odds.winProbability}%)
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Win Probability
            </span>
            <span style={{ fontWeight: '700', color: match.team2.color }}>
              {match.team2.shortName} ({100 - odds.winProbability}%)
            </span>
          </div>
          <div style={styles.barOuter}>
            <div 
              style={{ 
                ...styles.barInnerTeam1, 
                width: `${odds.winProbability}%`,
                background: match.team1.color 
              }}
            />
            <div 
              style={{ 
                ...styles.barInnerTeam2, 
                width: `${100 - odds.winProbability}%`,
                background: match.team2.color 
              }}
            />
          </div>
        </div>
      )}

      {/* Commentary Card */}
      <div style={styles.commCard} className="glass-card">
        <div style={styles.commHeader}>
          <h4 style={styles.cardTitle}>Live Commentary</h4>
          <button onClick={speakLastCommentary} style={styles.audioBtn} title="Speak latest ball description">
            <Volume2 size={16} />
            <span>Speak Ball</span>
          </button>
        </div>
        <div style={styles.commFeed}>
          {commentary.map((comm, idx) => {
            const isWicket = comm.event === 'Wicket!';
            const isBoundary = comm.event === '4 runs' || comm.event === '6 runs';
            
            return (
              <div key={idx} style={styles.commItem}>
                <div style={styles.commMeta}>
                  <span style={styles.commBall}>{comm.ball}</span>
                  <span 
                    style={{
                      ...styles.commEvent,
                      ...(isWicket ? styles.commWicket : {}),
                      ...(isBoundary ? styles.commBoundary : {})
                    }}
                  >
                    {comm.event}
                  </span>
                </div>
                <div style={styles.commText}>{comm.text}</div>
              </div>
            );
          })}
          {commentary.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              Waiting for commentary...
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Pitch Map & Fielding Visual */}
    <div style={styles.rightCol}>
      <CricketField lastBall={match.lastBall} />
    </div>

  </div>
);
}

const styles = {
  mainSplit: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  gridSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  card: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  cardTitle: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    color: 'var(--emerald)',
    letterSpacing: '0.05em',
    fontWeight: '700',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '6px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  activeRow: {
    background: 'rgba(16, 185, 129, 0.04)',
  },
  playerLink: {
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  strikerDot: {
    color: 'var(--emerald)',
    fontWeight: '800',
  },
  textRight: {
    textAlign: 'right',
  },
  recentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '12px 1.25rem',
    flexWrap: 'wrap',
  },
  recentLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  ballsList: {
    display: 'flex',
    gap: '8px',
  },
  probCard: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  probLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barOuter: {
    height: '10px',
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
  },
  barInnerTeam1: {
    height: '100%',
    transition: 'width 0.5s ease-out',
  },
  barInnerTeam2: {
    height: '100%',
    transition: 'width 0.5s ease-out',
  },
  commCard: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  commHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '8px',
  },
  audioBtn: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: 'var(--emerald)',
    padding: '4px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  },
  commFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  commItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  commMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  commBall: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#fff',
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  commEvent: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
  },
  commWicket: {
    color: 'var(--red-accent)',
  },
  commBoundary: {
    color: 'var(--teal)',
  },
  commText: {
    fontSize: '0.85rem',
    lineHeight: '1.4',
    color: 'var(--text-primary)',
  }
};
