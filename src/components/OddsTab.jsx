import React, { useEffect, useState } from 'react';
import { TrendingUp, Award, DollarSign } from 'lucide-react';

export default function OddsTab({ match }) {
  const { team1, team2, odds, score, innings, isFinished } = match;
  const [oddsHistory, setOddsHistory] = useState([]);

  // Capture history of win probability to plot a dynamic SVG line chart
  useEffect(() => {
    if (odds && odds.winProbability !== undefined) {
      setOddsHistory(prev => {
        const next = [...prev, odds.winProbability];
        if (next.length > 20) next.shift(); // hold last 20 ticks
        return next;
      });
    }
  }, [odds]);

  // Generate SVG path for sparkline chart
  const getSparklinePath = () => {
    if (oddsHistory.length < 2) return '';
    const width = 400;
    const height = 80;
    const padding = 10;
    
    const xStep = (width - padding * 2) / (oddsHistory.length - 1);
    const yScale = (height - padding * 2) / 100; // probability is 0-100

    return oddsHistory.map((prob, idx) => {
      const x = padding + idx * xStep;
      // Invert Y because SVG coordinates start from top
      const y = height - (padding + prob * yScale);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  const currentOvers = innings === 1 ? score.team1.overs : score.team2.overs;

  // Session markers logic
  const getSessionStatus = (limitOver) => {
    if (currentOvers >= limitOver) {
      // Completed - let's check score at that point
      // (Mock runs based on current RR or random close values)
      const mockRunsScored = Math.round(limitOver * (odds?.winProbability > 50 ? 8.2 : 7.2));
      return { status: 'Completed', text: `YES (${mockRunsScored} Runs)` };
    }
    return { status: 'Active', text: 'Yes/No Open' };
  };

  return (
    <div style={styles.container} className="fade-in">
      {/* Odds Summary Card */}
      <div style={styles.grid}>
        <div style={styles.card} className="glass-card">
          <div style={styles.cardHeader}>
            <DollarSign size={16} color="var(--emerald)" />
            <h4>Match Odds (Market)</h4>
          </div>
          
          {odds ? (
            <div style={styles.marketWrapper}>
              <div style={styles.marketHeader}>
                <span>Market Team</span>
                <span style={{ textAlign: 'center' }}>Back (Yes)</span>
                <span style={{ textAlign: 'center' }}>Lay (No)</span>
              </div>

              {/* Team 1 Odds Line */}
              <div style={{
                ...styles.marketLine,
                ...(odds.team === team1.shortName ? styles.favoriteLine : {})
              }}>
                <div style={styles.teamLabelCol}>
                  <span style={styles.teamShortName}>{team1.shortName}</span>
                  {odds.team === team1.shortName && <span style={styles.favBadge}>FAV</span>}
                </div>
                <div style={styles.backBox}>
                  {odds.team === team1.shortName ? odds.back : (parseFloat(odds.back) + 0.35).toFixed(2)}
                </div>
                <div style={styles.layBox}>
                  {odds.team === team1.shortName ? odds.lay : (parseFloat(odds.lay) + 0.35).toFixed(2)}
                </div>
              </div>

              {/* Team 2 Odds Line */}
              <div style={{
                ...styles.marketLine,
                ...(odds.team === team2.shortName ? styles.favoriteLine : {})
              }}>
                <div style={styles.teamLabelCol}>
                  <span style={styles.teamShortName}>{team2.shortName}</span>
                  {odds.team === team2.shortName && <span style={styles.favBadge}>FAV</span>}
                </div>
                <div style={styles.backBox}>
                  {odds.team === team2.shortName ? odds.back : (parseFloat(odds.back) + 0.35).toFixed(2)}
                </div>
                <div style={styles.layBox}>
                  {odds.team === team2.shortName ? odds.lay : (parseFloat(odds.lay) + 0.35).toFixed(2)}
                </div>
              </div>
              <p style={styles.disclaimer}>*Rates are simulated and update dynamically ball-by-ball.</p>
            </div>
          ) : (
            <div style={styles.empty}>Odds suspended or unavailable.</div>
          )}
        </div>

        {/* Win Probability Sparkline graph */}
        <div style={styles.card} className="glass-card">
          <div style={styles.cardHeader}>
            <TrendingUp size={16} color="var(--teal)" />
            <h4>Market Trend Chart</h4>
          </div>
          <div style={styles.chartWrapper}>
            <div style={styles.chartLabels}>
              <span style={{ color: team1.color }}>{team1.shortName} Fav</span>
              <span>50-50</span>
              <span style={{ color: team2.color }}>{team2.shortName} Fav</span>
            </div>
            
            {oddsHistory.length >= 2 ? (
              <svg viewBox="0 0 400 80" style={styles.svg}>
                {/* Horizontal middle guide line */}
                <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                {/* Sparkline path */}
                <path 
                  d={getSparklinePath()} 
                  fill="none" 
                  stroke="url(#sparklineGrad)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="sparklineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--teal)" />
                    <stop offset="50%" stopColor="var(--emerald)" />
                    <stop offset="100%" stopColor="var(--amber)" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <div style={styles.chartEmpty}>
                Waiting for simulation cycles to collect trend points...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session/Fancy Market Card */}
      <div style={styles.card} className="glass-card">
        <div style={styles.cardHeader}>
          <Award size={16} color="var(--amber)" />
          <h4>Session & Fancy Market</h4>
        </div>
        
        {odds ? (
          <div style={styles.sessionTable}>
            <div style={styles.sessionRowHeader}>
              <span>Session Target (Overs)</span>
              <span>Predicted Score</span>
              <span style={{ textAlign: 'center' }}>No (Lay)</span>
              <span style={{ textAlign: 'center' }}>Yes (Back)</span>
              <span>Status</span>
            </div>

            {/* 6 Over Session */}
            <div style={styles.sessionLine}>
              <span style={styles.sessionTitle}>6 Over Session</span>
              <span style={styles.sessionTarget}>{odds.sessionRuns}</span>
              <div style={styles.noBox}>{odds.sessionOddsLay}</div>
              <div style={styles.yesBox}>{odds.sessionOddsBack}</div>
              <span style={{
                ...styles.sessionBadge,
                ...(getSessionStatus(6.0).status === 'Completed' ? styles.badgeCompleted : styles.badgeActive)
              }}>
                {getSessionStatus(6.0).text}
              </span>
            </div>

            {/* 10 Over Session */}
            <div style={styles.sessionLine}>
              <span style={styles.sessionTitle}>10 Over Session</span>
              <span style={styles.sessionTarget}>
                {Math.round(parseFloat(odds.sessionRuns.split('-')[0])*1.6)}-{Math.round(parseFloat(odds.sessionRuns.split('-')[1])*1.6)}
              </span>
              <div style={styles.noBox}>{odds.sessionOddsLay}</div>
              <div style={styles.yesBox}>{odds.sessionOddsBack}</div>
              <span style={{
                ...styles.sessionBadge,
                ...(getSessionStatus(10.0).status === 'Completed' ? styles.badgeCompleted : styles.badgeActive)
              }}>
                {getSessionStatus(10.0).text}
              </span>
            </div>

            {/* 15 Over Session */}
            <div style={styles.sessionLine}>
              <span style={styles.sessionTitle}>15 Over Session</span>
              <span style={styles.sessionTarget}>
                {Math.round(parseFloat(odds.sessionRuns.split('-')[0])*2.4)}-{Math.round(parseFloat(odds.sessionRuns.split('-')[1])*2.4)}
              </span>
              <div style={styles.noBox}>{odds.sessionOddsLay}</div>
              <div style={styles.yesBox}>{odds.sessionOddsBack}</div>
              <span style={{
                ...styles.sessionBadge,
                ...(getSessionStatus(15.0).status === 'Completed' ? styles.badgeCompleted : styles.badgeActive)
              }}>
                {getSessionStatus(15.0).text}
              </span>
            </div>

            {/* 20 Over Session */}
            <div style={styles.sessionLine}>
              <span style={styles.sessionTitle}>20 Over Session (1st Inn)</span>
              <span style={styles.sessionTarget}>
                {Math.round(parseFloat(odds.sessionRuns.split('-')[0])*3.1)}-{Math.round(parseFloat(odds.sessionRuns.split('-')[1])*3.1)}
              </span>
              <div style={styles.noBox}>{odds.sessionOddsLay}</div>
              <div style={styles.yesBox}>{odds.sessionOddsBack}</div>
              <span style={{
                ...styles.sessionBadge,
                ...(getSessionStatus(20.0).status === 'Completed' ? styles.badgeCompleted : styles.badgeActive)
              }}>
                {getSessionStatus(20.0).text}
              </span>
            </div>
          </div>
        ) : (
          <div style={styles.empty}>Sessions suspended.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1rem',
  },
  card: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '6px',
  },
  marketWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  marketHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontWeight: '600',
    padding: '4px 8px',
  },
  marketLine: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '8px',
    gap: '6px',
    transition: 'all 0.2s',
  },
  favoriteLine: {
    borderColor: 'rgba(0, 229, 255, 0.25)',
    background: 'rgba(0, 229, 255, 0.02)',
  },
  teamLabelCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  teamShortName: {
    fontWeight: '700',
    color: '#fff',
  },
  favBadge: {
    background: 'rgba(0, 229, 255, 0.1)',
    border: '1px solid rgba(0, 229, 255, 0.3)',
    color: 'var(--teal)',
    fontSize: '0.6rem',
    padding: '1px 4px',
    borderRadius: '4px',
    fontWeight: '700',
  },
  backBox: {
    background: '#2b5042',
    color: 'var(--emerald)',
    textAlign: 'center',
    padding: '8px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
  },
  layBox: {
    background: '#6b3243',
    color: 'var(--red-accent)',
    textAlign: 'center',
    padding: '8px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
  },
  disclaimer: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '2rem',
  },
  chartWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '6px 0',
  },
  chartLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  svg: {
    width: '100%',
    height: '80px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.02)',
  },
  chartEmpty: {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    textAlign: 'center',
    border: '1px dotted rgba(255,255,255,0.1)',
    borderRadius: '10px',
  },
  sessionTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sessionRowHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
    textTransform: 'uppercase',
    padding: '4px 8px',
  },
  sessionLine: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '8px',
    gap: '6px',
  },
  sessionTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff',
  },
  sessionTarget: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--amber)',
  },
  noBox: {
    background: 'rgba(255, 61, 113, 0.1)',
    border: '1px solid rgba(255, 61, 113, 0.2)',
    color: 'var(--red-accent)',
    borderRadius: '4px',
    textAlign: 'center',
    padding: '4px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  yesBox: {
    background: 'rgba(0, 255, 136, 0.1)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    color: 'var(--emerald)',
    borderRadius: '4px',
    textAlign: 'center',
    padding: '4px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  sessionBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '3px 6px',
    borderRadius: '6px',
    textAlign: 'center',
  },
  badgeCompleted: {
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--emerald)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
  },
  badgeActive: {
    background: 'rgba(0, 229, 255, 0.05)',
    color: 'var(--teal)',
    border: '1px solid rgba(0, 229, 255, 0.2)',
  }
};
