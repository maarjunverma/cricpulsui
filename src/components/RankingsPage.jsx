import React, { useState } from 'react';
import { MOCK_RANKINGS } from '../data/mockMatches';
import { Award, Shield, User } from 'lucide-react';

export default function RankingsPage({ onPlayerClick }) {
  const [format, setFormat] = useState('T20'); // 'TEST', 'ODI', 'T20'
  const [category, setCategory] = useState('TEAMS'); // 'TEAMS', 'BATTING', 'BOWLING', 'ALL_ROUNDERS'

  const rankingsData = MOCK_RANKINGS[format][category];

  // Helper to map player name to squad profile IDs if they exist (for clickability)
  const findPlayerId = (name) => {
    // Basic mapping check
    if (name === 'Travis Head') return 'aus_1';
    if (name === 'Suryakumar Yadav') return 'ind_5';
    if (name === 'Phil Salt') return 'eng_2';
    if (name === 'Yashasvi Jaiswal') return 'ind_2';
    if (name === 'Hardik Pandya') return 'ind_6';
    if (name === 'Marcus Stoinis') return 'aus_6';
    if (name === 'Liam Livingstone') return 'eng_6';
    if (name === 'Jasprit Bumrah') return 'ind_10';
    if (name === 'Adam Zampa') return 'aus_10';
    if (name === 'Josh Hazlewood') return 'aus_11';
    if (name === 'Pat Cummins') return 'aus_8';
    if (name === 'Steve Smith') return 'aus_4';
    if (name === 'Glenn Maxwell') return 'aus_5';
    if (name === 'Ravindra Jadeja') return 'ind_7';
    if (name === 'Adil Rashid') return 'eng_9';
    return null;
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.headerRow}>
        <h2 style={styles.title}>ICC Rankings</h2>

        {/* Format Selectors */}
        <div style={styles.formatSelectors}>
          <button 
            onClick={() => setFormat('TEST')} 
            style={{...styles.formatBtn, ...(format === 'TEST' ? styles.formatBtnActive : {})}}
          >
            TEST
          </button>
          <button 
            onClick={() => setFormat('ODI')} 
            style={{...styles.formatBtn, ...(format === 'ODI' ? styles.formatBtnActive : {})}}
          >
            ODI
          </button>
          <button 
            onClick={() => setFormat('T20')} 
            style={{...styles.formatBtn, ...(format === 'T20' ? styles.formatBtnActive : {})}}
          >
            T20
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="tabs-container">
        <button 
          onClick={() => setCategory('TEAMS')} 
          className={`tab-btn ${category === 'TEAMS' ? 'active' : ''}`}
        >
          <Shield size={14} style={{ marginRight: '6px' }} />
          Teams
        </button>
        <button 
          onClick={() => setCategory('BATTING')} 
          className={`tab-btn ${category === 'BATTING' ? 'active' : ''}`}
        >
          <User size={14} style={{ marginRight: '6px' }} />
          Batting
        </button>
        <button 
          onClick={() => setCategory('BOWLING')} 
          className={`tab-btn ${category === 'BOWLING' ? 'active' : ''}`}
        >
          <User size={14} style={{ marginRight: '6px' }} />
          Bowling
        </button>
        <button 
          onClick={() => setCategory('ALL_ROUNDERS')} 
          className={`tab-btn ${category === 'ALL_ROUNDERS' ? 'active' : ''}`}
        >
          <User size={14} style={{ marginRight: '6px' }} />
          All-Rounders
        </button>
      </div>

      {/* Table Card */}
      <div style={styles.card} className="glass-card">
        <div style={styles.tableTitleRow}>
          <Award size={18} color="var(--teal)" />
          <h4 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ICC Men's {format} {category.replace('_', ' ')} Rankings
          </h4>
        </div>

        <table style={styles.table}>
          <thead>
            {category === 'TEAMS' ? (
              <tr>
                <th style={{ width: '15%' }}>Rank</th>
                <th style={{ width: '45%' }}>Team</th>
                <th style={styles.textRight}>Points</th>
                <th style={styles.textRight}>Rating</th>
              </tr>
            ) : (
              <tr>
                <th style={{ width: '15%' }}>Rank</th>
                <th style={{ width: '45%' }}>Player Name</th>
                <th style={{ width: '25%' }}>Team</th>
                <th style={styles.textRight}>Rating</th>
              </tr>
            )}
          </thead>
          <tbody>
            {rankingsData.map(item => {
              const playerId = category !== 'TEAMS' ? findPlayerId(item.name) : null;
              
              return (
                <tr key={item.rank} style={item.rank === 1 ? styles.rankOneRow : {}}>
                  <td style={styles.rankCol}>
                    <span style={{
                      ...styles.rankBadge,
                      ...(item.rank === 1 ? styles.rankBadgeOne : {})
                    }}>
                      {item.rank}
                    </span>
                  </td>
                  <td>
                    {category === 'TEAMS' ? (
                      <span style={styles.teamText}>{item.team}</span>
                    ) : (
                      playerId ? (
                        <span 
                          onClick={() => onPlayerClick(playerId)} 
                          style={styles.playerLink}
                        >
                          {item.name}
                        </span>
                      ) : (
                        <span style={styles.plainText}>{item.name}</span>
                      )
                    )}
                  </td>
                  {category === 'TEAMS' ? (
                    <>
                      <td style={styles.textRight}>{item.points.toLocaleString()}</td>
                      <td style={{ ...styles.textRight, fontWeight: '700', color: 'var(--emerald)' }}>{item.rating}</td>
                    </>
                  ) : (
                    <>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.team}</td>
                      <td style={{ ...styles.textRight, fontWeight: '700', color: 'var(--teal)' }}>{item.rating}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
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
  formatSelectors: {
    display: 'flex',
    gap: '6px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '3px',
    borderRadius: '8px',
  },
  formatBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    transition: 'all 0.2s',
  },
  formatBtnActive: {
    background: 'rgba(255,255,255,0.08)',
    color: 'var(--teal)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  card: {
    padding: '1.25rem',
  },
  tableTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '8px',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  textRight: {
    textAlign: 'right',
  },
  rankCol: {
    paddingLeft: '1.25rem',
  },
  rankBadge: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text-secondary)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.8rem',
  },
  rankBadgeOne: {
    background: 'linear-gradient(135deg, var(--amber), #ffaa00)',
    color: '#000',
    boxShadow: '0 0 8px rgba(255, 214, 0, 0.4)',
  },
  rankOneRow: {
    background: 'rgba(255, 214, 0, 0.02)',
  },
  teamText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: '0.9rem',
  },
  playerLink: {
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    transition: 'color 0.2s',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(255,255,255,0.1)',
  },
  playerLink: {
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  plainText: {
    fontWeight: '600',
    color: '#fff',
  }
};
