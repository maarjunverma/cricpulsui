import React, { useState } from 'react';

export default function ScorecardTab({ match, onPlayerClick }) {
  const { team1, team2, scorecard, bowlersCard, score, innings, isFinished } = match;
  const [selectedInnings, setSelectedInnings] = useState(1);

  const getInningsScore = (num) => {
    if (num === 1) {
      return `${score.team1.runs}/${score.team1.wickets} (${score.team1.overs.toFixed(1)} Ov)`;
    } else {
      if (innings === 1 && !isFinished) return 'Yet to bat';
      return `${score.team2.runs}/${score.team2.wickets} (${score.score && score.team2.overs ? score.team2.overs.toFixed(1) : score.team2.overs} Ov)`;
    }
  };

  const battingData = selectedInnings === 1 ? scorecard.team1 : scorecard.team2;
  const bowlingData = selectedInnings === 1 ? bowlersCard.team1 : bowlersCard.team2;
  const battingTeam = selectedInnings === 1 ? team1 : team2;
  const bowlingTeam = selectedInnings === 1 ? team2 : team1;
  const extras = selectedInnings === 1 ? score.team1.extra : score.team2.extra;

  // Fall of wickets & Partnerships from API if available
  const fowFromApi = selectedInnings === 1 ? match.fow?.team1 : match.fow?.team2;
  const fallOfWickets = (fowFromApi && fowFromApi.length > 0)
    ? fowFromApi.map(f => ({ id: f.id, name: f.name, runs: f.runs, status: `at ${f.over} ov` }))
    : battingData.filter(b => b.status !== 'Not out' && b.status !== 'yet to bat' && b.status !== 'batting' && b.status !== '');

  const partnershipsData = selectedInnings === 1 ? match.partnerships?.team1 : match.partnerships?.team2;

  return (
    <div style={styles.container} className="fade-in">
      {/* Innings Selector Buttons */}
      <div style={styles.toggleRow}>
        <button 
          onClick={() => setSelectedInnings(1)}
          style={{
            ...styles.toggleBtn,
            ...(selectedInnings === 1 ? styles.toggleBtnActive : {}),
            borderLeftColor: team1.color
          }}
        >
          <span style={styles.toggleTeamName}>{team1.name}</span>
          <span style={styles.toggleScore}>{getInningsScore(1)}</span>
        </button>
        <button 
          onClick={() => setSelectedInnings(2)}
          style={{
            ...styles.toggleBtn,
            ...(selectedInnings === 2 ? styles.toggleBtnActive : {}),
            borderLeftColor: team2.color
          }}
        >
          <span style={styles.toggleTeamName}>{team2.name}</span>
          <span style={styles.toggleScore}>{getInningsScore(2)}</span>
        </button>
      </div>

      {/* Batting Card */}
      <div style={styles.card} className="glass-card">
        <h4 style={styles.cardHeader}>Batting - {battingTeam.name}</h4>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Batsman</th>
                <th style={{ width: '30%' }}>Status</th>
                <th style={styles.textRight}>R</th>
                <th style={styles.textRight}>B</th>
                <th style={styles.textRight}>4s</th>
                <th style={styles.textRight}>6s</th>
                <th style={styles.textRight}>SR</th>
              </tr>
            </thead>
            <tbody>
              {battingData.map(player => (
                <tr key={player.id}>
                  <td 
                    onClick={() => onPlayerClick && onPlayerClick(player.id)} 
                    style={styles.playerLink}
                  >
                    {player.name} {player.iscaptain ? '(c)' : ''} {player.iskeeper ? '(wk)' : ''}
                  </td>
                  <td style={styles.dismissalText}>{player.status}</td>
                  <td style={{ ...styles.textRight, fontWeight: '700', color: '#fff' }}>{player.runs}</td>
                  <td style={styles.textRight}>{player.balls}</td>
                  <td style={styles.textRight}>{player.fours}</td>
                  <td style={styles.textRight}>{player.sixes}</td>
                  <td style={{ ...styles.textRight, color: 'var(--text-secondary)' }}>
                    {player.strkrate || (player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(1) : '0.0')}
                  </td>
                </tr>
              ))}
              {battingData.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                    Innings not started yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Extras & Totals row */}
        {battingData.length > 0 && (
          <div style={styles.summaryBox}>
            <div style={styles.summaryLine}>
              <span style={styles.summaryLabel}>Extras</span>
              <span style={styles.summaryVal}>
                {typeof extras === 'object' ? (extras.total ?? 0) : extras}{' '}
                {typeof extras === 'object' ? (
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>
                    (b {extras.byes || 0}, lb {extras.legbyes || 0}, w {extras.wides || 0}, nb {extras.noballs || 0}, p {extras.penalty || 0})
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>
                    (wd {Math.round((extras || 0)*0.7)}, nb {Math.round((extras || 0)*0.3)})
                  </span>
                )}
              </span>
            </div>
            <div style={styles.summaryLine}>
              <span style={styles.summaryLabel}>Total Score</span>
              <span style={{ ...styles.summaryVal, color: 'var(--emerald)', fontSize: '1.1rem' }}>
                {selectedInnings === 1 ? score.team1.runs : score.team2.runs}/
                {selectedInnings === 1 ? score.team1.wickets : score.team2.wickets}
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', marginLeft: '6px' }}>
                  ({typeof (selectedInnings === 1 ? score.team1.overs : score.team2.overs) === 'number' ? (selectedInnings === 1 ? score.team1.overs : score.team2.overs).toFixed(1) : (selectedInnings === 1 ? score.team1.overs : score.team2.overs)} Overs)
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bowling Card */}
      {battingData.length > 0 && (
        <div style={styles.card} className="glass-card">
          <h4 style={styles.cardHeader}>Bowling - {bowlingTeam.name}</h4>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Bowler</th>
                  <th style={styles.textRight}>O</th>
                  <th style={styles.textRight}>M</th>
                  <th style={styles.textRight}>R</th>
                  <th style={styles.textRight}>W</th>
                  <th style={styles.textRight}>Econ</th>
                </tr>
              </thead>
              <tbody>
                {bowlingData.map(bowler => (
                  <tr key={bowler.id}>
                    <td 
                      onClick={() => onPlayerClick && onPlayerClick(bowler.id)} 
                      style={styles.playerLink}
                    >
                      {bowler.name}
                    </td>
                    <td style={{ ...styles.textRight, color: '#fff', fontWeight: '600' }}>
                      {typeof bowler.overs === 'number' ? bowler.overs.toFixed(1) : bowler.overs}
                    </td>
                    <td style={styles.textRight}>{bowler.maidens}</td>
                    <td style={styles.textRight}>{bowler.runs}</td>
                    <td style={{ ...styles.textRight, color: 'var(--red-accent)', fontWeight: '700' }}>{bowler.wkts}</td>
                    <td style={{ ...styles.textRight, color: 'var(--emerald)' }}>
                      {bowler.economy || (bowler.overs > 0 ? (bowler.runs / bowler.overs).toFixed(2) : '0.00')}
                    </td>
                  </tr>
                ))}
                {bowlingData.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      No bowling data recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fall of Wickets */}
      {fallOfWickets.length > 0 && (
        <div style={styles.card} className="glass-card">
          <h4 style={styles.cardHeader}>Fall of Wickets</h4>
          <div style={styles.fowList}>
            {fallOfWickets.map((player, index) => (
              <div key={player.id || index} style={styles.fowItem}>
                <span style={styles.fowNum}>{index + 1}</span>
                <div style={styles.fowDetails}>
                  <span style={styles.fowName}>{player.name}</span>
                  <span style={styles.fowScore}>{player.runs} runs ({player.status})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partnerships */}
      {partnershipsData && partnershipsData.length > 0 && (
        <div style={styles.card} className="glass-card">
          <h4 style={styles.cardHeader}>Partnerships</h4>
          <div style={styles.fowList}>
            {partnershipsData.map((p, index) => (
              <div key={p.id || index} style={styles.fowItem}>
                <div style={styles.fowDetails}>
                  <span style={styles.fowName}>{p.bat1name} ({p.bat1runs}) &amp; {p.bat2name} ({p.bat2runs})</span>
                  <span style={styles.fowScore}>{p.totalruns} runs ({p.totalballs} balls)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  toggleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  toggleBtn: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderLeft: '4px solid #fff',
    borderRadius: '10px',
    padding: '12px',
    cursor: 'pointer',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    transition: 'var(--transition)',
  },
  toggleBtnActive: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  toggleTeamName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  toggleScore: {
    fontSize: '1.05rem',
    fontWeight: '800',
  },
  card: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  cardHeader: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    color: 'var(--emerald)',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '6px',
    fontWeight: '700',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  playerLink: {
    color: 'var(--teal)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  dismissalText: {
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
  },
  textRight: {
    textAlign: 'right',
  },
  summaryBox: {
    marginTop: '0.75rem',
    padding: '12px 1rem',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  summaryLine: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  summaryLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  summaryVal: {
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  fowList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '4px 0',
  },
  fowItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    padding: '6px 12px',
    borderRadius: '8px',
    flex: '1 1 200px',
  },
  fowNum: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'var(--red-accent)',
    color: '#fff',
    fontSize: '0.75rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
  },
  fowDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  fowName: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#fff',
  },
  fowScore: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
  }
};
