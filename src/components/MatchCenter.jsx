import React, { useState } from 'react';
import LiveTab from './LiveTab';
import ScorecardTab from './ScorecardTab';
import OddsTab from './OddsTab';
import AnalyticsTab from './AnalyticsTab';
import FantasyTab from './FantasyTab';
import { MapPin, Users, Info } from 'lucide-react';


export default function MatchCenter({ match, onPlayerClick }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!match) {
    return (
      <div style={styles.emptyContainer} className="glass-card fade-in">
        <h3 style={{ color: 'var(--text-secondary)' }}>Select a match from the cards above</h3>
      </div>
    );
  }

  const { team1, team2, score, format, title, venue, status, toss, innings, isFinished } = match;
  const t1Runs = score.team1.runs;
  const t1Wkts = score.team1.wickets;
  const t1Overs = score.team1.overs;
  const t2Runs = score.team2.runs;
  const t2Wkts = score.team2.wickets;
  const t2Overs = score.team2.overs;

  const calculateCRR = (runs, overs) => {
    if (overs === 0) return '0.00';
    const overInt = Math.floor(overs);
    const balls = overInt * 6 + Math.round((overs % 1) * 10);
    return ((runs / balls) * 6).toFixed(2);
  };

  const calculateRRR = () => {
    if (innings !== 2 || isFinished) return null;
    const maxOvers = format === 'T20' ? 20 : 50;
    const totalBalls = maxOvers * 6;
    const ballsBowled = Math.floor(t2Overs) * 6 + Math.round((t2Overs % 1) * 10);
    const ballsRemaining = totalBalls - ballsBowled;
    const runsNeeded = t1Runs + 1 - t2Runs;

    if (ballsRemaining <= 0 || runsNeeded <= 0) return '0.00';
    return ((runsNeeded / ballsRemaining) * 6).toFixed(2);
  };

  const crr = innings === 1 ? calculateCRR(t1Runs, t1Overs) : calculateCRR(t2Runs, t2Overs);
  const rrr = calculateRRR();

  const tabs = [
    { key: 'summary', label: 'Summary' },
    { key: 'live', label: 'Commentary' },
    { key: 'scorecard', label: 'Scorecard' },
    { key: 'info', label: 'Info' },
    { key: 'odds', label: 'Odds & Session' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'fantasy', label: 'Fantasy' },
  ];

  // Build batsmen/bowler data for summary
  const striker = match.batting?.striker;
  const nonStriker = match.batting?.nonStriker;
  const bowler = match.bowling?.active;
  const recentBalls = match.recentBalls || [];

  return (
    <div style={styles.container} className="fade-in">
      {/* ─── Match Title Bar ─── */}
      <div style={styles.titleBar}>
        <h2 style={styles.matchTitle}>{title}</h2>
        <div style={styles.metaRow}>
          <span style={styles.metaText}>Date & Time: {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span style={styles.metaDot}>•</span>
          <span style={{ ...styles.metaText, color: 'var(--teal)' }}>
            <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
            {venue}
          </span>
        </div>
      </div>

      {/* ─── Tab Navigation ─── */}
      <div style={styles.tabContainer} className="glass-card">
        <div className="tabs-container" style={{ marginBottom: 0, borderBottom: '2px solid var(--border-color)' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Summary Tab (Default — CricketGuru-inspired) ─── */}
        {activeTab === 'summary' && (
          <div style={styles.summaryContainer} className="fade-in">
            {/* Live Score Row */}
            <div style={styles.liveScoreRow}>
              <div style={styles.teamScoreBlock}>
                <div style={{ ...styles.teamAvatar, backgroundColor: team1.color }}>
                  {team1.shortName.substring(0, 2)}
                </div>
                <span style={styles.teamNameText}>{team1.shortName}</span>
                <span style={styles.scoreValue}>{t1Runs}-{t1Wkts}</span>
                <span style={styles.oversValue}>({t1Overs.toFixed(1)})</span>
              </div>
            </div>

            {/* Status Text */}
            <div style={styles.statusBar}>
              {!isFinished && <span className="pulse-indicator" style={{ marginRight: '6px' }} />}
              <span style={styles.statusText}>{status}</span>
            </div>

            {/* Batsmen Table */}
            {(striker || nonStriker) && (
              <div style={styles.summaryTableWrapper}>
                <table>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.thBatter}>Batter</th>
                      <th style={styles.thNum}>R</th>
                      <th style={styles.thNum}>B</th>
                      <th style={styles.thNum}>4s</th>
                      <th style={styles.thNum}>6s</th>
                      <th style={styles.thNum}>SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {striker && (
                      <tr onClick={() => onPlayerClick && onPlayerClick(striker.id)} style={{ cursor: 'pointer' }}>
                        <td style={styles.tdName}>{striker.name} *</td>
                        <td style={styles.tdBold}>{striker.runs}</td>
                        <td>{striker.balls}</td>
                        <td>{striker.fours}</td>
                        <td>{striker.sixes}</td>
                        <td>{striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(2) : '0.00'}</td>
                      </tr>
                    )}
                    {nonStriker && (
                      <tr onClick={() => onPlayerClick && onPlayerClick(nonStriker.id)} style={{ cursor: 'pointer' }}>
                        <td style={styles.tdName}>{nonStriker.name}</td>
                        <td style={styles.tdBold}>{nonStriker.runs}</td>
                        <td>{nonStriker.balls}</td>
                        <td>{nonStriker.fours}</td>
                        <td>{nonStriker.sixes}</td>
                        <td>{nonStriker.balls > 0 ? ((nonStriker.runs / nonStriker.balls) * 100).toFixed(2) : '0.00'}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bowler Table */}
            {bowler && (
              <div style={styles.summaryTableWrapper}>
                <table>
                  <thead>
                    <tr style={styles.tableHeaderRowBowl}>
                      <th style={styles.thBatter}>Bowler</th>
                      <th style={styles.thNum}>O</th>
                      <th style={styles.thNum}>M</th>
                      <th style={styles.thNum}>R</th>
                      <th style={styles.thNum}>W</th>
                      <th style={styles.thNum}>ECO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.tdName}>{bowler.name}</td>
                      <td>{bowler.overs}</td>
                      <td>{bowler.maidens}</td>
                      <td>{bowler.runs}</td>
                      <td style={styles.tdBold}>{bowler.wkts}</td>
                      <td>{bowler.overs > 0 ? (bowler.runs / bowler.overs).toFixed(2) : '0.00'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Key Stats + Recent Balls Row */}
            <div style={styles.statsRow}>
              {/* Key Stats */}
              <div style={styles.keyStatsCard}>
                <div style={styles.keyStatsHeader}>Key Stats</div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>CRR:</span>
                  <span style={{ ...styles.statVal, color: 'var(--emerald)' }}>{crr}</span>
                </div>
                {rrr && (
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>RRR:</span>
                    <span style={{ ...styles.statVal, color: 'var(--red-accent)' }}>{rrr}</span>
                  </div>
                )}
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Toss:</span>
                  <span style={styles.statVal}>{toss}</span>
                </div>
              </div>

              {/* Recent Balls */}
              <div style={styles.recentBallsCard}>
                <span style={styles.recentLabel}>Recent:</span>
                <div style={styles.ballsRow}>
                  {recentBalls.map((ball, i) => {
                    let className = 'ball-circle';
                    if (ball === 'W') className += ' wicket';
                    else if (ball === '4') className += ' four';
                    else if (ball === '6') className += ' six';
                    return (
                      <span key={i} className={className}>{ball}</span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Other Tabs ─── */}
        {activeTab === 'live' && (
          <LiveTab match={match} onPlayerClick={onPlayerClick} />
        )}
        {activeTab === 'scorecard' && (
          <ScorecardTab match={match} onPlayerClick={onPlayerClick} />
        )}
        {activeTab === 'info' && (
          <div style={styles.infoTabContainer} className="fade-in">
            <div style={styles.infoLayout}>
              <div style={styles.infoCard}>
                <div style={styles.cardHeader}>
                  <Users size={16} color="var(--emerald)" />
                  <h4>Playing XI Squads</h4>
                </div>
                <div style={styles.squadsSplit}>
                  <div style={styles.squadColumn}>
                    <h5 style={{ color: team1.color, borderBottom: `2px solid ${team1.color}`, paddingBottom: '4px', marginBottom: '8px' }}>
                      {team1.name}
                    </h5>
                    <ul style={styles.playerList}>
                      {team1.squad.map((player, idx) => (
                        <li key={player.id} style={styles.playerListItem} onClick={() => onPlayerClick(player.id)}>
                          <span style={styles.playerName}>{player.name}</span>
                          <span style={styles.playerRole}>{player.role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={styles.squadColumn}>
                    <h5 style={{ color: team2.color, borderBottom: `2px solid ${team2.color}`, paddingBottom: '4px', marginBottom: '8px' }}>
                      {team2.name}
                    </h5>
                    <ul style={styles.playerList}>
                      {team2.squad.map((player, idx) => (
                        <li key={player.id} style={styles.playerListItem} onClick={() => onPlayerClick(player.id)}>
                          <span style={styles.playerName}>{player.name}</span>
                          <span style={styles.playerRole}>{player.role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.cardHeader}>
                  <Info size={16} color="var(--emerald)" />
                  <h4>Match Details</h4>
                </div>
                <div style={styles.detailsList}>
                  {[
                    ['Series', title.split(' - ')[0]],
                    ['Match', title.split(' - ')[1] || 'Match Details'],
                    ['Venue', venue],
                    ['Format', format],
                    ['Umpires', 'Richard Kettleborough, Nitin Menon'],
                    ['Third Umpire', 'Chris Gaffaney'],
                    ['Match Referee', 'Javagal Srinath'],
                  ].map(([label, value]) => (
                    <div key={label} style={styles.detailItem}>
                      <span style={styles.detailLabel}>{label}</span>
                      <span style={styles.detailValue}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'odds' && <OddsTab match={match} />}
        {activeTab === 'analytics' && <AnalyticsTab match={match} />}
        {activeTab === 'fantasy' && <FantasyTab match={match} />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  emptyContainer: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },

  /* ─── Title Bar ─── */
  titleBar: {
    padding: '0.5rem 0',
  },
  matchTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    color: '#fff',
    marginBottom: '4px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  metaDot: {
    color: 'var(--text-muted)',
    fontSize: '0.6rem',
  },

  /* ─── Tab Container ─── */
  tabContainer: {
    padding: '0',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    overflow: 'hidden',
  },

  /* ─── Summary Tab ─── */
  summaryContainer: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  liveScoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  teamScoreBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  teamAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.75rem',
  },
  teamNameText: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
  },
  scoreValue: {
    fontSize: '1.6rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    color: '#fff',
  },
  oversValue: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.82rem',
    color: 'var(--amber)',
    fontWeight: '600',
  },
  statusText: {
    color: 'var(--amber)',
  },

  /* ─── Summary Tables ─── */
  summaryTableWrapper: {
    overflowX: 'auto',
  },
  tableHeaderRow: {
    background: 'rgba(16, 185, 129, 0.08)',
  },
  tableHeaderRowBowl: {
    background: 'rgba(139, 92, 246, 0.08)',
  },
  thBatter: {
    textAlign: 'left',
    minWidth: '140px',
  },
  thNum: {
    textAlign: 'center',
    minWidth: '40px',
  },
  tdName: {
    color: 'var(--teal)',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tdBold: {
    fontWeight: '700',
    color: '#fff',
  },

  /* ─── Stats Row ─── */
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  keyStatsCard: {
    background: 'rgba(139, 92, 246, 0.06)',
    border: '1px solid rgba(139, 92, 246, 0.1)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
  },
  keyStatsHeader: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
    paddingBottom: '0.4rem',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.82rem',
    padding: '0.25rem 0',
  },
  statLabel: {
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  statVal: {
    fontWeight: '600',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
  },
  recentBallsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  recentLabel: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  ballsRow: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },

  /* ─── Info Tab ─── */
  infoTabContainer: {
    padding: '1.25rem',
  },
  infoLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '1rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '8px',
  },
  squadsSplit: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  squadColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  playerList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  playerListItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 6px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  playerName: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--teal)',
  },
  playerRole: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    fontSize: '0.82rem',
  },
  detailLabel: {
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  detailValue: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'right',
  },
};
