import React, { useMemo } from 'react';
import { Sparkles, Swords, Trophy, Compass } from 'lucide-react';

export default function FantasyTab({ match }) {
  const { team1, team2, score, innings, isFinished } = match;

  // Generate Fantasy Dream XI based on player career ratings and live performance
  const fantasySquad = useMemo(() => {
    const allPlayers = [];
    
    // Combine squads and calculate a "fantasy rating"
    const processSquad = (team, oppositeTeam) => {
      team.squad.forEach(player => {
        let livePoints = 0;
        
        // Check if player has live stats in scorecard
        const scorecardPlayer = match.scorecard.team1.find(p => p.id === player.id) || 
                                match.scorecard.team2.find(p => p.id === player.id);
        if (scorecardPlayer) {
          livePoints += scorecardPlayer.runs * 1;
          livePoints += scorecardPlayer.fours * 1;
          livePoints += scorecardPlayer.sixes * 2;
        }

        // Check if player has bowling stats
        const bowlerPlayer = match.bowlersCard.team1.find(p => p.id === player.id) ||
                             match.bowlersCard.team2.find(p => p.id === player.id);
        if (bowlerPlayer) {
          livePoints += bowlerPlayer.wkts * 25;
          livePoints += bowlerPlayer.maidens * 8;
        }

        // Base rating from career stats
        const careerAvg = player.stats?.bat?.avg || 25;
        const careerWkts = player.stats?.bowl?.wkts || 0;
        const baseRating = Math.round(careerAvg + (careerWkts * 0.5) + (livePoints * 0.8));

        allPlayers.push({
          ...player,
          teamShort: team.shortName,
          teamColor: team.color,
          fantasyPoints: 20 + livePoints + Math.round(baseRating / 3),
          rawScore: baseRating
        });
      });
    };

    processSquad(team1, team2);
    processSquad(team2, team1);

    // Sort players by rating and categorize to make a balanced XI (1 WK, 4 Bat, 3 AR, 3 Bowl)
    const wks = allPlayers.filter(p => p.role === 'Wicketkeeper').sort((a, b) => b.rawScore - a.rawScore);
    const bats = allPlayers.filter(p => p.role === 'Batsman').sort((a, b) => b.rawScore - a.rawScore);
    const ars = allPlayers.filter(p => p.role === 'All-rounder').sort((a, b) => b.rawScore - a.rawScore);
    const bowls = allPlayers.filter(p => p.role === 'Bowler').sort((a, b) => b.rawScore - a.rawScore);

    const dreamXI = [];
    if (wks[0]) dreamXI.push({ ...wks[0], label: 'WK' });
    
    // Add top 4 batsmen
    bats.slice(0, 4).forEach(p => dreamXI.push({ ...p, label: 'BAT' }));
    // Add top 3 all-rounders
    ars.slice(0, 3).forEach(p => dreamXI.push({ ...p, label: 'AR' }));
    // Add top 3 bowlers
    bowls.slice(0, 3).forEach(p => dreamXI.push({ ...p, label: 'BOWL' }));

    // Sort Dream XI by fantasyPoints to assign C and VC
    dreamXI.sort((a, b) => b.fantasyPoints - a.fantasyPoints);
    if (dreamXI[0]) dreamXI[0].badge = 'C'; // Captain
    if (dreamXI[1]) dreamXI[1].badge = 'VC'; // Vice Captain

    return dreamXI;
  }, [team1, team2, match.scorecard, match.bowlersCard]);

  // Static key matchups for visual interest
  const matchups = useMemo(() => {
    if (team1.shortName === 'IND' || team2.shortName === 'IND') {
      return [
        {
          batsman: 'Virat Kohli',
          batsmanTeam: 'IND',
          bowler: 'Mitchell Starc',
          bowlerTeam: 'AUS',
          stats: { runs: 124, balls: 96, dismissals: 3, sr: 129.2 }
        },
        {
          batsman: 'Travis Head',
          batsmanTeam: 'AUS',
          bowler: 'Jasprit Bumrah',
          bowlerTeam: 'IND',
          stats: { runs: 58, balls: 72, dismissals: 4, sr: 80.5 }
        }
      ];
    }
    // Fallback for franchise match
    return [
      {
        batsman: 'Shivam Dube',
        batsmanTeam: 'CSK',
        bowler: 'Jasprit Bumrah',
        bowlerTeam: 'MI',
        stats: { runs: 42, balls: 36, dismissals: 2, sr: 116.7 }
      },
      {
        batsman: 'Rohit Sharma',
        batsmanTeam: 'MI',
        bowler: 'Matheesha Pathirana',
        bowlerTeam: 'CSK',
        stats: { runs: 38, balls: 24, dismissals: 1, sr: 158.3 }
      }
    ];
  }, [team1, team2]);

  // Projected score calculations
  const calculateProjections = () => {
    const isT20 = match.format === 'T20';
    const totalOvers = isT20 ? 20 : 50;

    if (innings === 1) {
      const curOvers = score.team1.overs;
      const runs = score.team1.runs;
      const rr = curOvers > 0 ? runs / curOvers : 7.5;
      const projectedMin = Math.round(rr * totalOvers - 5);
      const projectedMax = Math.round(rr * totalOvers + 10);
      return { label: 'Projected 1st Inn Score', value: `${projectedMin} - ${projectedMax}` };
    } else {
      if (isFinished) {
        return { label: 'Match Result', value: match.status.split(' - ')[1] || 'Completed' };
      }
      const runsNeeded = score.team1.runs + 1 - score.team2.runs;
      const curOvers = score.team2.overs;
      const ballsRemaining = (totalOvers - curOvers) * 6;
      return { label: 'Required Runs', value: `${runsNeeded} needed off ${Math.round(ballsRemaining)} balls` };
    }
  };

  const projection = calculateProjections();

  return (
    <div style={styles.container} className="fade-in">
      
      {/* Analytics Gauge and Projections */}
      <div style={styles.gridRow}>
        <div style={styles.card} className="glass-card">
          <div style={styles.cardHeader}>
            <Compass size={16} color="var(--amber)" />
            <h4>CricPuls Smart Projections</h4>
          </div>
          
          <div style={styles.projectionBox}>
            <span style={styles.projLabel}>{projection.label}</span>
            <span style={styles.projValue} className="text-gradient">{projection.value}</span>
            
            {/* Simple circular gauge */}
            <div style={styles.gaugeContainer}>
              <svg viewBox="0 0 100 50" style={styles.gaugeSvg}>
                {/* Arc */}
                <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round" />
                <path 
                  d="M 10,50 A 40,40 0 0,1 90,50" 
                  fill="none" 
                  stroke="var(--amber)" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray="125"
                  strokeDashoffset={125 - (125 * (match.odds?.winProbability || 50)) / 100}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
              </svg>
              <div style={styles.gaugeText}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LIVE ODDS FAV</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>{match.odds?.team || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Head to Head Player Matchups */}
        <div style={styles.card} className="glass-card">
          <div style={styles.cardHeader}>
            <Swords size={16} color="var(--red-accent)" />
            <h4>Player Head-to-Head Matchups</h4>
          </div>
          
          <div style={styles.matchupList}>
            {matchups.map((m, idx) => (
              <div key={idx} style={styles.matchupItem}>
                <div style={styles.matchupRow}>
                  <div style={styles.playerPill}>
                    <div style={{ ...styles.playerAvatarMini, background: m.batsmanTeam === team1.shortName ? team1.color : team2.color }}>
                      {m.batsman.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={styles.matchupPlayerName}>{m.batsman}</span>
                  </div>
                  <span style={styles.vsText}>VS</span>
                  <div style={styles.playerPill}>
                    <span style={styles.matchupPlayerName}>{m.bowler}</span>
                    <div style={{ ...styles.playerAvatarMini, background: m.bowlerTeam === team1.shortName ? team1.color : team2.color }}>
                      {m.bowler.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>

                <div style={styles.matchupStatsGrid}>
                  <div style={styles.mStat}>
                    <span style={styles.mStatLabel}>Runs</span>
                    <span style={styles.mStatVal}>{m.stats.runs}</span>
                  </div>
                  <div style={styles.mStat}>
                    <span style={styles.mStatLabel}>Balls</span>
                    <span style={styles.mStatVal}>{m.stats.balls}</span>
                  </div>
                  <div style={styles.mStat}>
                    <span style={styles.mStatLabel}>Outs</span>
                    <span style={{ ...styles.mStatVal, color: 'var(--red-accent)' }}>{m.stats.dismissals}</span>
                  </div>
                  <div style={styles.mStat}>
                    <span style={styles.mStatLabel}>Strike Rate</span>
                    <span style={{ ...styles.mStatVal, color: 'var(--teal)' }}>{m.stats.sr}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Fantasy Dream XI */}
      <div style={styles.card} className="glass-card">
        <div style={styles.cardHeader}>
          <Sparkles size={16} color="var(--teal)" />
          <h4 style={{ margin: 0 }}>CricPuls Dream XI Recommendation</h4>
          <span style={styles.dreamXIBadge}>AI Suggested</span>
        </div>

        <p style={styles.infoDesc}>Suggested lineup based on tournament weight, career stats, and match form.</p>

        <div style={styles.dreamXIGrid}>
          {fantasySquad.map(player => (
            <div key={player.id} style={styles.dreamXIPlayerCard}>
              <div style={styles.playerTopRow}>
                <span style={styles.roleTag}>{player.label}</span>
                {player.badge && (
                  <span style={{
                    ...styles.badgeTag,
                    background: player.badge === 'C' ? 'var(--amber)' : 'var(--teal)',
                    color: '#000'
                  }}>
                    {player.badge}
                  </span>
                )}
              </div>

              <div style={{ ...styles.playerHexAvatar, borderColor: player.teamColor }}>
                {player.name.split(' ').map(n => n[0]).join('')}
              </div>

              <span style={styles.dreamPlayerName}>{player.name}</span>
              
              <div style={styles.playerPointsRow}>
                <span style={styles.teamTag}>{player.teamShort}</span>
                <span style={styles.ptsVal}>{player.fantasyPoints} Pts</span>
              </div>
            </div>
          ))}
        </div>
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
  gridRow: {
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
    paddingBottom: '8px',
  },
  dreamXIBadge: {
    marginLeft: 'auto',
    fontSize: '0.65rem',
    fontWeight: '700',
    background: 'rgba(0, 229, 255, 0.1)',
    border: '1px solid rgba(0, 229, 255, 0.3)',
    color: 'var(--teal)',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  projectionBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 0',
    gap: '4px',
  },
  projLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  projValue: {
    fontSize: '1.5rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
  },
  gaugeContainer: {
    position: 'relative',
    width: '120px',
    height: '60px',
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
  },
  gaugeSvg: {
    width: '100%',
    height: '100%',
  },
  gaugeText: {
    position: 'absolute',
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  matchupList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  matchupItem: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: '10px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  matchupRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0,0,0,0.15)',
    padding: '4px 8px',
    borderRadius: '20px',
    maxWidth: '130px',
  },
  playerAvatarMini: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.55rem',
    fontWeight: '800',
    color: '#fff',
  },
  matchupPlayerName: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#fff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  vsText: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
  },
  matchupStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '4px',
    textAlign: 'center',
    background: 'rgba(0,0,0,0.1)',
    padding: '6px',
    borderRadius: '8px',
  },
  mStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  mStatLabel: {
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  mStatVal: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#fff',
  },
  infoDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  dreamXIGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))',
    gap: '10px',
  },
  dreamXIPlayerCard: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    transition: 'all 0.2s',
    cursor: 'pointer',
    ':hover': {
      borderColor: 'rgba(255,255,255,0.1)',
      transform: 'translateY(-2px)'
    }
  },
  playerTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '4px',
  },
  roleTag: {
    fontSize: '0.55rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    background: 'rgba(255,255,255,0.05)',
    padding: '1px 4px',
    borderRadius: '3px',
  },
  badgeTag: {
    fontSize: '0.55rem',
    fontWeight: '800',
    padding: '1px 3px',
    borderRadius: '3px',
  },
  playerHexAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid transparent',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  dreamPlayerName: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    marginBottom: '4px',
  },
  playerPointsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '0.65rem',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    paddingTop: '4px',
  },
  teamTag: {
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  ptsVal: {
    color: 'var(--emerald)',
    fontWeight: '700',
  }
};
