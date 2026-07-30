import React, { useState, useMemo } from 'react';
import { BarChart2, TrendingUp, Users } from 'lucide-react';

export default function AnalyticsTab({ match }) {
  const { team1, team2, score, scorecard, bowlersCard, innings, isFinished } = match;
  const [chartType, setChartType] = useState('worm'); // 'worm' or 'manhattan'

  // Deterministic LCG random number generator to make charts stable for a match
  const seedRandom = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return () => {
      const x = Math.sin(hash++) * 10000;
      return x - Math.floor(x);
    };
  };

  // Generate over-by-over runs and wickets history deterministically
  const matchHistory = useMemo(() => {
    const generateInningsHistory = (batKey, teamName, targetScore, wktCount, currentOvers, currentRuns) => {
      const completedOvers = Math.floor(currentOvers);
      const isFractional = currentOvers % 1 > 0;
      const totalOvers = completedOvers + (isFractional ? 1 : 0);
      
      if (totalOvers === 0) return { overs: [], cumulative: [], wickets: [] };

      const rand = seedRandom(match.id + batKey + teamName);
      
      // Generate rough distribution of runs per over
      // Average runs per over
      const avgRuns = totalOvers > 0 ? currentRuns / currentOvers : 7;
      let weights = Array.from({ length: totalOvers }, () => {
        // weights fluctuate around 1.0
        return 0.4 + rand() * 1.2;
      });

      // Normalize weights so they sum up to currentRuns
      const sumWeights = weights.reduce((a, b) => a + b, 0);
      let runsPerOver = weights.map(w => Math.round((w / sumWeights) * currentRuns));
      
      // Adjust rounding errors so the sum matches currentRuns exactly
      let sumRuns = runsPerOver.reduce((a, b) => a + b, 0);
      let diff = currentRuns - sumRuns;
      let iterations = 0;
      while (diff !== 0 && iterations < 100) {
        for (let i = 0; i < totalOvers && diff !== 0; i++) {
          if (diff > 0) {
            runsPerOver[i]++;
            diff--;
          } else if (diff < 0 && runsPerOver[i] > 0) {
            runsPerOver[i]--;
            diff++;
          }
        }
        iterations++;
      }

      // Distribute wickets across overs
      // Let's place wickets in overs with lower scores or random
      const wicketOvers = new Set();
      let wktsPlaced = 0;
      let wktAttempts = 0;
      while (wktsPlaced < wktCount && wktAttempts < 50) {
        const wktOverIndex = Math.floor(rand() * totalOvers);
        if (!wicketOvers.has(wktOverIndex)) {
          wicketOvers.add(wktOverIndex);
          wktsPlaced++;
        }
        wktAttempts++;
      }

      // Calculate cumulative runs
      const cumulative = [];
      let tempSum = 0;
      for (let i = 0; i < totalOvers; i++) {
        tempSum += runsPerOver[i];
        cumulative.push(tempSum);
      }

      return {
        overs: runsPerOver,
        cumulative,
        wickets: Array.from({ length: totalOvers }, (_, i) => wicketOvers.has(i) ? 1 : 0)
      };
    };

    const t1History = generateInningsHistory(
      'team1',
      team1.name,
      0,
      score.team1.wickets,
      score.team1.overs,
      score.team1.runs
    );

    const t2History = generateInningsHistory(
      'team2',
      team2.name,
      score.team1.runs,
      score.team2.wickets,
      score.team2.overs,
      score.team2.runs
    );

    return { team1: t1History, team2: t2History };
  }, [match.id, score.team1.runs, score.team1.overs, score.team1.wickets, score.team2.runs, score.team2.overs, score.team2.wickets]);

  // Calculate current partnership details
  const partnershipInfo = useMemo(() => {
    if (isFinished || !match.batting || !match.batting.striker) return null;

    const striker = match.batting.striker;
    const nonStriker = match.batting.nonStriker;

    const partnerRuns = (striker?.runs || 0) + (nonStriker?.runs || 0);
    const partnerBalls = (striker?.balls || 0) + (nonStriker?.balls || 0);

    const strikerPct = partnerRuns > 0 ? Math.round(((striker?.runs || 0) / partnerRuns) * 100) : 50;

    return {
      runs: partnerRuns,
      balls: partnerBalls,
      strikerName: striker?.name || 'Batsman 1',
      strikerRuns: striker?.runs || 0,
      strikerBalls: striker?.balls || 0,
      nonStrikerName: nonStriker?.name || 'Batsman 2',
      nonStrikerRuns: nonStriker?.runs || 0,
      nonStrikerBalls: nonStriker?.balls || 0,
      strikerPct
    };
  }, [match.batting, isFinished]);

  // SVG Chart variables
  const width = 500;
  const height = 220;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Max value calculation for scales
  const maxOvers = match.format === 'T20' ? 20 : 50;
  const maxRuns = Math.max(
    score.team1.runs,
    score.team2.runs,
    150 // default minimum baseline
  ) * 1.1; // 10% headroom

  const getWormPath = (cumulativeScores) => {
    if (cumulativeScores.length === 0) return '';
    const points = cumulativeScores.map((scoreVal, index) => {
      const x = padding + ((index + 1) / maxOvers) * chartWidth;
      const y = padding + chartHeight - (scoreVal / maxRuns) * chartHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    // Start at (padding, bottom of chart)
    return `M ${padding} ${padding + chartHeight} L ` + points.join(' ');
  };

  const getGridLines = () => {
    const lines = [];
    // Horizontal lines (runs)
    const runStep = Math.round(maxRuns / 4);
    for (let i = 0; i <= 4; i++) {
      const r = i * runStep;
      const y = padding + chartHeight - (r / maxRuns) * chartHeight;
      lines.push(
        <g key={`y-${i}`}>
          <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <text x={padding - 6} y={y + 4} fill="var(--text-muted)" fontSize="8.5" textAnchor="end">{r}</text>
        </g>
      );
    }
    // Vertical lines (overs)
    const overStep = maxOvers / 4;
    for (let i = 0; i <= 4; i++) {
      const o = i * overStep;
      const x = padding + (o / maxOvers) * chartWidth;
      lines.push(
        <g key={`x-${i}`}>
          <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <text x={x} y={height - padding + 14} fill="var(--text-muted)" fontSize="8.5" textAnchor="middle">{o} Ov</text>
        </g>
      );
    }
    return lines;
  };

  return (
    <div style={styles.container} className="fade-in">
      {/* Chart controls */}
      <div style={styles.chartHeader}>
        <div style={styles.chartTitleCol}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>Match Analytics</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Over-by-over score charts & comparisons</span>
        </div>

        <div style={styles.toggleGroup}>
          <button
            onClick={() => setChartType('worm')}
            style={{ ...styles.toggleBtn, ...(chartType === 'worm' ? styles.toggleBtnActive : {}) }}
          >
            <TrendingUp size={13} />
            <span>Worm Chart</span>
          </button>
          <button
            onClick={() => setChartType('manhattan')}
            style={{ ...styles.toggleBtn, ...(chartType === 'manhattan' ? styles.toggleBtnActive : {}) }}
          >
            <BarChart2 size={13} />
            <span>Manhattan</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Box */}
      <div style={styles.card} className="glass-card">
        <div style={styles.chartLegend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: team1.color }} />
            <span style={styles.legendText}>{team1.shortName}: {score.team1.runs}/{score.team1.wickets} ({score.team1.overs.toFixed(1)})</span>
          </div>
          {(innings === 2 || isFinished) && (
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, background: team2.color }} />
              <span style={styles.legendText}>{team2.shortName}: {score.team2.runs}/{score.team2.wickets} ({score.team2.overs.toFixed(1)})</span>
            </div>
          )}
        </div>

        <div style={styles.svgWrapper}>
          <svg viewBox={`0 0 ${width} ${height}`} style={styles.svg}>
            <defs>
              <linearGradient id="t1AreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={team1.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={team1.color} stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="t2AreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={team2.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={team2.color} stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid & Axes labels */}
            {getGridLines()}

            {/* Worm Chart plotting */}
            {chartType === 'worm' && (
              <>
                {/* Innings 1 Area & Path */}
                {matchHistory.team1.cumulative.length > 0 && (
                  <>
                    <path
                      d={`${getWormPath(matchHistory.team1.cumulative)} L ${padding + (matchHistory.team1.cumulative.length / maxOvers) * chartWidth} ${padding + chartHeight} Z`}
                      fill="url(#t1AreaGrad)"
                    />
                    <path
                      d={getWormPath(matchHistory.team1.cumulative)}
                      fill="none"
                      stroke={team1.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Innings 2 Area & Path */}
                {matchHistory.team2.cumulative.length > 0 && (
                  <>
                    <path
                      d={`${getWormPath(matchHistory.team2.cumulative)} L ${padding + (matchHistory.team2.cumulative.length / maxOvers) * chartWidth} ${padding + chartHeight} Z`}
                      fill="url(#t2AreaGrad)"
                    />
                    <path
                      d={getWormPath(matchHistory.team2.cumulative)}
                      fill="none"
                      stroke={team2.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Wicket dots on Worm */}
                {matchHistory.team1.wickets.map((wkt, idx) => {
                  if (!wkt) return null;
                  const x = padding + ((idx + 1) / maxOvers) * chartWidth;
                  const y = padding + chartHeight - (matchHistory.team1.cumulative[idx] / maxRuns) * chartHeight;
                  return <circle key={`w1-${idx}`} cx={x} cy={y} r="3.5" fill="var(--red-accent)" stroke="#fff" strokeWidth="1" />;
                })}

                {matchHistory.team2.wickets.map((wkt, idx) => {
                  if (!wkt) return null;
                  const x = padding + ((idx + 1) / maxOvers) * chartWidth;
                  const y = padding + chartHeight - (matchHistory.team2.cumulative[idx] / maxRuns) * chartHeight;
                  return <circle key={`w2-${idx}`} cx={x} cy={y} r="3.5" fill="var(--amber)" stroke="#fff" strokeWidth="1" />;
                })}
              </>
            )}

            {/* Manhattan Chart plotting */}
            {chartType === 'manhattan' && (
              <>
                {/* Plot side by side bar charts for each over */}
                {Array.from({ length: Math.max(matchHistory.team1.overs.length, matchHistory.team2.overs.length) }).map((_, idx) => {
                  const o1runs = matchHistory.team1.overs[idx] || 0;
                  const o2runs = matchHistory.team2.overs[idx] || 0;
                  
                  const xBase = padding + (idx / maxOvers) * chartWidth;
                  const barWidth = Math.max((chartWidth / maxOvers) * 0.4, 3);
                  
                  // Height scale based on max runs per over (say caps at 36, default max scale 24)
                  const maxOverRuns = 24;
                  const getBarYAndHeight = (runs) => {
                    const h = Math.min((runs / maxOverRuns) * chartHeight, chartHeight);
                    const y = padding + chartHeight - h;
                    return { y, h };
                  };

                  const t1Bar = getBarYAndHeight(o1runs);
                  const t2Bar = getBarYAndHeight(o2runs);

                  const t1Wkt = matchHistory.team1.wickets[idx];
                  const t2Wkt = matchHistory.team2.wickets[idx];

                  return (
                    <g key={`over-${idx}`}>
                      {/* Team 1 Bar */}
                      {idx < matchHistory.team1.overs.length && (
                        <>
                          <rect
                            x={xBase + 1}
                            y={t1Bar.y}
                            width={barWidth}
                            height={t1Bar.h}
                            fill={team1.color}
                            opacity="0.8"
                            rx="1"
                          />
                          {t1Wkt > 0 && (
                            <circle cx={xBase + 1 + barWidth/2} cy={t1Bar.y - 5} r="2.5" fill="var(--red-accent)" />
                          )}
                        </>
                      )}

                      {/* Team 2 Bar */}
                      {idx < matchHistory.team2.overs.length && (
                        <>
                          <rect
                            x={xBase + barWidth + 2}
                            y={t2Bar.y}
                            width={barWidth}
                            height={t2Bar.h}
                            fill={team2.color}
                            opacity="0.8"
                            rx="1"
                          />
                          {t2Wkt > 0 && (
                            <circle cx={xBase + barWidth + 2 + barWidth/2} cy={t2Bar.y - 5} r="2.5" fill="var(--amber)" />
                          )}
                        </>
                      )}
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Partnership analysis section */}
      {partnershipInfo && (
        <div style={styles.card} className="glass-card">
          <div style={styles.partnerHeader}>
            <Users size={16} color="var(--teal)" />
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>Current Partnership</h4>
            <span style={styles.partnerTotal}>
              <strong>{partnershipInfo.runs}</strong> runs off <strong>{partnershipInfo.balls}</strong> balls
            </span>
          </div>

          <div style={styles.partnerVisual}>
            <div style={styles.partnerNameCol}>
              <span style={styles.partnerName}>{partnershipInfo.strikerName}</span>
              <span style={styles.partnerStats}>{partnershipInfo.strikerRuns} ({partnershipInfo.strikerBalls})</span>
            </div>

            <div style={styles.barOuter}>
              <div
                style={{
                  ...styles.barInnerLeft,
                  width: `${partnershipInfo.strikerPct}%`,
                  background: team1.color
                }}
              />
              <div
                style={{
                  ...styles.barInnerRight,
                  width: `${100 - partnershipInfo.strikerPct}%`,
                  background: 'rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>

            <div style={{ ...styles.partnerNameCol, alignItems: 'flex-end' }}>
              <span style={styles.partnerName}>{partnershipInfo.nonStrikerName}</span>
              <span style={styles.partnerStats}>{partnershipInfo.nonStrikerRuns} ({partnershipInfo.nonStrikerBalls})</span>
            </div>
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
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chartTitleCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  toggleGroup: {
    display: 'flex',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '2px',
    borderRadius: '8px',
    gap: '2px',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  },
  toggleBtnActive: {
    background: 'rgba(255,255,255,0.08)',
    color: 'var(--teal)',
  },
  card: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  chartLegend: {
    display: 'flex',
    gap: '1.25rem',
    flexWrap: 'wrap',
    fontSize: '0.75rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendColor: {
    width: '10px',
    height: '10px',
    borderRadius: '3px',
  },
  legendText: {
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  svgWrapper: {
    width: '100%',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    padding: '6px 8px',
    border: '1px solid rgba(255,255,255,0.02)',
  },
  svg: {
    width: '100%',
    height: 'auto',
    overflow: 'visible',
  },
  partnerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '8px',
    flexWrap: 'wrap',
  },
  partnerTotal: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginLeft: 'auto',
  },
  partnerVisual: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 2fr 1.2fr',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 0',
  },
  partnerNameCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  partnerName: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100px',
  },
  partnerStats: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
  },
  barOuter: {
    height: '8px',
    borderRadius: '4px',
    overflow: 'hidden',
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
  },
  barInnerLeft: {
    height: '100%',
    transition: 'width 0.4s ease-out',
  },
  barInnerRight: {
    height: '100%',
    transition: 'width 0.4s ease-out',
  }
};
