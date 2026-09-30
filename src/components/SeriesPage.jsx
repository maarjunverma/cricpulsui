import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, ChevronRight, Award, Layers, Users, Star, ArrowUpRight } from 'lucide-react';

const ALL_SERIES = [
  {
    id: 'county-2026',
    name: 'County Championship Division One 2026',
    shortName: 'County Div 1',
    category: 'Domestic',
    status: 'LIVE NOW',
    isLive: true,
    region: 'England & Wales',
    dateRange: 'Apr 2026 - Sep 2026',
    teamsCount: 10,
    matchesCount: 72,
    leadTeam: 'Surrey',
    leadPoints: 142,
    description: 'Premier first-class cricket competition in England and Wales featuring top international and domestic talent.',
    featuredMatches: [
      { id: '142739', name: 'Surrey vs Somerset', status: 'Day 3 - Stumps', ground: 'The Cooper Associates Ground' },
      { id: '142728', name: 'Glamorgan vs Essex', status: 'Day 3 - Stumps', ground: 'Sophia Gardens' },
    ],
    standings: [
      { pos: 1, team: 'Surrey', p: 12, w: 7, l: 2, d: 3, pts: 142 },
      { pos: 2, team: 'Somerset', p: 12, w: 6, l: 2, d: 4, pts: 134 },
      { pos: 3, team: 'Essex', p: 12, w: 5, l: 3, d: 4, pts: 121 },
      { pos: 4, team: 'Warwickshire', p: 12, w: 4, l: 4, d: 4, pts: 108 },
    ]
  },
  {
    id: 'ind-eng-2026',
    name: 'India Tour of England 2026',
    shortName: 'IND vs ENG',
    category: 'International',
    status: 'ONGOING',
    isLive: true,
    region: 'England',
    dateRange: 'Jul 2026 - Aug 2026',
    teamsCount: 2,
    matchesCount: 5,
    leadTeam: 'India lead 1-0',
    leadPoints: null,
    description: 'Bilateral marquee series featuring 3 ODIs and 5 Test matches between India and England.',
    featuredMatches: [
      { id: '129469', name: 'IND vs ENG 2nd ODI', status: 'In Progress', ground: "Lord's, London" },
      { id: '157110', name: 'IND vs ENG 1st ODI', status: 'India won by 4 wkts', ground: 'The Oval, London' },
    ],
    standings: []
  },
  {
    id: 'mlc-2026',
    name: 'Major League Cricket 2026',
    shortName: 'MLC T20',
    category: 'T20 Leagues',
    status: 'PLAYOFFS',
    isLive: true,
    region: 'USA',
    dateRange: 'Jul 2026 - Aug 2026',
    teamsCount: 6,
    matchesCount: 25,
    leadTeam: 'Washington Freedom',
    leadPoints: 12,
    description: 'The premier franchise T20 league in the United States entering high-voltage playoffs stage.',
    featuredMatches: [
      { id: '150942', name: 'SFU vs WAF Challenger', status: 'In Progress', ground: 'Grand Prairie Stadium, Dallas' },
      { id: '150920', name: 'LAKR vs SFU Qualifier', status: 'LAKR won by 18 runs', ground: 'Church Street Park' },
    ],
    standings: [
      { pos: 1, team: 'Washington Freedom', p: 7, w: 6, l: 1, d: 0, pts: 12 },
      { pos: 2, team: 'SF Unicorns', p: 7, w: 5, l: 2, d: 0, pts: 10 },
      { pos: 3, team: 'LA Knight Riders', p: 7, w: 4, l: 3, d: 0, pts: 8 },
      { pos: 4, team: 'MI New York', p: 7, w: 3, l: 4, d: 0, pts: 6 },
    ]
  },
  {
    id: 'lpl-2026',
    name: 'Lanka Premier League 2026',
    shortName: 'LPL 2026',
    category: 'T20 Leagues',
    status: 'GROUP STAGE',
    isLive: true,
    region: 'Sri Lanka',
    dateRange: 'Jul 2026 - Aug 2026',
    teamsCount: 5,
    matchesCount: 24,
    leadTeam: 'Jaffna Kings',
    leadPoints: 8,
    description: 'Fifth edition of the Sri Lankan top-tier T20 tournament across Colombo, Kandy and Dambulla.',
    featuredMatches: [
      { id: '156948', name: 'Jaffna Kings vs Galle Marvels', status: 'Live', ground: 'R. Premadasa Stadium' },
    ],
    standings: [
      { pos: 1, team: 'Jaffna Kings', p: 5, w: 4, l: 1, d: 0, pts: 8 },
      { pos: 2, team: 'Galle Marvels', p: 5, w: 3, l: 2, d: 0, pts: 6 },
      { pos: 3, team: 'Colombo Strikers', p: 5, w: 2, l: 3, d: 0, pts: 4 },
      { pos: 4, team: 'Kandy Falcons', p: 5, w: 2, l: 3, d: 0, pts: 4 },
    ]
  },
  {
    id: 't20-wc-2026',
    name: 'ICC Men\'s T20 World Cup 2026',
    shortName: 'T20 World Cup',
    category: 'International',
    status: 'UPCOMING',
    isLive: false,
    region: 'India & Sri Lanka',
    dateRange: 'Feb 2026 - Mar 2026',
    teamsCount: 20,
    matchesCount: 55,
    leadTeam: 'Defending: India',
    leadPoints: null,
    description: 'The flagship biennial international twenty-over championship featuring 20 global teams.',
    featuredMatches: [],
    standings: []
  },
  {
    id: 'the-ashes-2026',
    name: 'The Ashes 2026-27 (Australia vs England)',
    shortName: 'The Ashes',
    category: 'International',
    status: 'UPCOMING',
    isLive: false,
    region: 'Australia',
    dateRange: 'Nov 2026 - Jan 2027',
    teamsCount: 2,
    matchesCount: 5,
    leadTeam: 'Urn Holder: Australia',
    leadPoints: null,
    description: 'Historic Test cricket rivalry contested across five iconic Australian cricket grounds.',
    featuredMatches: [],
    standings: []
  }
];

export default function SeriesPage({ onSelectMatch, setCurrentTab }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSeriesId, setActiveSeriesId] = useState(ALL_SERIES[0].id);

  const categories = ['All', 'International', 'T20 Leagues', 'Domestic'];

  const filteredSeries = ALL_SERIES.filter(s => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  const activeSeries = ALL_SERIES.find(s => s.id === activeSeriesId) || ALL_SERIES[0];

  return (
    <div style={styles.container}>
      {/* ─── Page Title Header ─── */}
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.badgeRow}>
            <span style={styles.seriesBadge}>
              <Trophy size={14} color="#10b981" />
              <span>CRICKET TOURNAMENTS & SERIES</span>
            </span>
          </div>
          <h1 style={styles.pageTitle}>Cricket Series & Tours</h1>
          <p style={styles.pageSubtitle}>
            Browse ongoing international bilateral tours, premier T20 franchise leagues, and domestic championships.
          </p>
        </div>
      </div>

      {/* ─── Filter Pills ─── */}
      <div style={styles.filterRow}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.filterBtn,
              ...(selectedCategory === cat ? styles.filterBtnActive : {})
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── 2-Column Series Layout ─── */}
      <div style={styles.layoutGrid}>
        {/* Left List of Series */}
        <div style={styles.seriesList}>
          {filteredSeries.map(s => {
            const isSelected = s.id === activeSeriesId;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSeriesId(s.id)}
                style={{
                  ...styles.seriesCard,
                  ...(isSelected ? styles.seriesCardActive : {})
                }}
              >
                <div style={styles.cardTopRow}>
                  <span style={styles.seriesCategory}>{s.category}</span>
                  <span style={{
                    ...styles.statusTag,
                    color: s.isLive ? '#10b981' : '#94a3b8',
                    borderColor: s.isLive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                  }}>
                    {s.isLive && <span style={styles.liveDot} />}
                    {s.status}
                  </span>
                </div>

                <h3 style={styles.seriesCardName}>{s.name}</h3>

                <div style={styles.metaRow}>
                  <span style={styles.metaItem}>
                    <MapPin size={13} color="var(--text-muted)" />
                    {s.region}
                  </span>
                  <span style={styles.metaItem}>
                    <Calendar size={13} color="var(--text-muted)" />
                    {s.dateRange}
                  </span>
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.teamLeader}>
                    {s.leadTeam}
                  </span>
                  <ChevronRight size={16} color={isSelected ? 'var(--emerald)' : 'var(--text-muted)'} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Series Details */}
        <div style={styles.detailPane}>
          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <div style={styles.detailBadge}>
                <Trophy size={16} color="#10b981" />
                <span>{activeSeries.category}</span>
              </div>
              <span style={{
                ...styles.statusTagLarge,
                color: activeSeries.isLive ? '#10b981' : '#cbd5e1',
                borderColor: activeSeries.isLive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'
              }}>
                {activeSeries.isLive && <span style={styles.liveDot} />}
                {activeSeries.status}
              </span>
            </div>

            <h2 style={styles.detailTitle}>{activeSeries.name}</h2>
            <p style={styles.detailDesc}>{activeSeries.description}</p>

            <div style={styles.statsBar}>
              <div style={styles.statBox}>
                <span style={styles.statVal}>{activeSeries.teamsCount}</span>
                <span style={styles.statLbl}>Teams</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statVal}>{activeSeries.matchesCount}</span>
                <span style={styles.statLbl}>Matches</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statVal}>{activeSeries.region}</span>
                <span style={styles.statLbl}>Location</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statVal} title={activeSeries.dateRange}>{activeSeries.dateRange.split(' - ')[0]}</span>
                <span style={styles.statLbl}>Start</span>
              </div>
            </div>

            {/* Standings Table if available */}
            {activeSeries.standings.length > 0 && (
              <div style={styles.sectionWrap}>
                <h4 style={styles.sectionTitle}>Points Table Standings</h4>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.trHead}>
                        <th style={{ ...styles.th, textAlign: 'center', width: '32px' }}>#</th>
                        <th style={{ ...styles.th, textAlign: 'left' }}>Team</th>
                        <th style={styles.th}>P</th>
                        <th style={styles.th}>W</th>
                        <th style={styles.th}>L</th>
                        <th style={styles.th}>D</th>
                        <th style={{ ...styles.th, color: 'var(--emerald)', fontWeight: '700' }}>PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSeries.standings.map(row => (
                        <tr key={row.team} style={styles.trBody}>
                          <td style={{ ...styles.td, textAlign: 'center', color: row.pos === 1 ? 'var(--emerald)' : 'var(--text-muted)' }}>
                            {row.pos}
                          </td>
                          <td style={{ ...styles.td, textAlign: 'left', fontWeight: '600', color: '#fff' }}>
                            {row.team}
                          </td>
                          <td style={styles.td}>{row.p}</td>
                          <td style={styles.td}>{row.w}</td>
                          <td style={styles.td}>{row.l}</td>
                          <td style={styles.td}>{row.d}</td>
                          <td style={{ ...styles.td, color: 'var(--emerald)', fontWeight: '700' }}>{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Featured Matches in Series */}
            {activeSeries.featuredMatches.length > 0 && (
              <div style={styles.sectionWrap}>
                <h4 style={styles.sectionTitle}>Featured Series Matches</h4>
                <div style={styles.matchesList}>
                  {activeSeries.featuredMatches.map(m => (
                    <div 
                      key={m.id} 
                      style={styles.matchItem}
                      onClick={() => {
                        if (onSelectMatch) onSelectMatch(m.id);
                        if (setCurrentTab) setCurrentTab('live');
                      }}
                    >
                      <div>
                        <div style={styles.matchItemName}>{m.name}</div>
                        <div style={styles.matchItemGround}>{m.ground}</div>
                      </div>
                      <div style={styles.matchItemRight}>
                        <span style={styles.matchItemStatus}>{m.status}</span>
                        <ArrowUpRight size={16} color="var(--emerald)" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
  pageHeader: {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(13, 27, 42, 0.95) 100%)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  badgeRow: {
    display: 'flex',
    marginBottom: '0.5rem',
  },
  seriesBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#10b981',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#fff',
    margin: '0 0 0.35rem 0',
    fontFamily: 'var(--font-heading)',
  },
  pageSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    margin: 0,
    lineHeight: '1.5',
    maxWidth: '700px',
  },
  filterRow: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    paddingBottom: '2px',
  },
  filterBtn: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  filterBtnActive: {
    background: 'transparent',
    borderColor: 'var(--emerald)',
    color: 'var(--emerald)',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 380px) 1fr',
    gap: '1.25rem',
  },
  seriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  seriesCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  seriesCardActive: {
    borderColor: 'var(--emerald)',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  seriesCategory: {
    fontSize: '0.72rem',
    color: 'var(--emerald)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statusTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.7rem',
    fontWeight: '700',
    border: '1px solid transparent',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  seriesCardName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 0.5rem 0',
    lineHeight: '1.3',
  },
  metaRow: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginBottom: '0.75rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '0.6rem',
  },
  teamLeader: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  detailPane: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#10b981',
    textTransform: 'uppercase',
  },
  statusTagLarge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    border: '1px solid transparent',
    padding: '3px 10px',
    borderRadius: '14px',
  },
  detailTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
    fontFamily: 'var(--font-heading)',
  },
  detailDesc: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    margin: 0,
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.75rem',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.85rem',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statVal: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  statLbl: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginTop: '2px',
  },
  sectionWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.82rem',
  },
  trHead: {
    background: 'rgba(16, 185, 129, 0.08)',
  },
  th: {
    padding: '8px 10px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '0.75rem',
  },
  trBody: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  td: {
    padding: '8px 10px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  matchesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  matchItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.85rem 1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  matchItemName: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#fff',
  },
  matchItemGround: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  matchItemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  matchItemStatus: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--emerald)',
  },
};
