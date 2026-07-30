import React, { useState } from 'react';
import { TEAMS } from '../data/mockMatches';
import { Users, Info, ChevronRight } from 'lucide-react';

export default function TeamsPage({ onPlayerClick }) {
  const [selectedTeamId, setSelectedTeamId] = useState('IND');
  const teamList = Object.values(TEAMS);
  const activeTeam = TEAMS[selectedTeamId];

  return (
    <div style={styles.container} className="fade-in">
      <h2 style={styles.title}>CricPuls Teams & Squads</h2>
      
      <div style={styles.layout}>
        {/* Teams List (Left Sidebar) */}
        <div style={styles.teamsSection}>
          <h3 style={styles.sectionTitle}>Select Team</h3>
          <div style={styles.teamsGrid}>
            {teamList.map(team => {
              const isSelected = selectedTeamId === team.id;
              
              return (
                <div 
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  style={{
                    ...styles.teamCard,
                    ...(isSelected ? styles.teamCardActive : {}),
                    borderLeftColor: team.color
                  }}
                >
                  <div style={styles.teamBadgeRow}>
                    <div style={{...styles.teamLetterAvatar, backgroundColor: team.color}}>
                      {team.shortName.substring(0, 2)}
                    </div>
                    <div style={styles.teamTextCol}>
                      <span style={styles.teamName}>{team.name}</span>
                      <span style={styles.teamShort}>{team.shortName}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Squad Roster (Right Detail Panel) */}
        <div style={styles.squadSection} className="glass-card">
          <div style={styles.squadHeader}>
            <Users size={20} color="var(--teal)" />
            <h3 style={{ margin: 0 }}>{activeTeam.name} Roster ({activeTeam.squad.length} Players)</h3>
          </div>
          
          <div style={styles.playersGrid}>
            {activeTeam.squad.map(player => (
              <div 
                key={player.id}
                onClick={() => onPlayerClick(player.id)}
                style={styles.playerCard}
              >
                <div style={styles.playerAvatar}>
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={styles.playerInfo}>
                  <span style={styles.playerName}>{player.name}</span>
                  <span style={styles.playerRole}>{player.role}</span>
                </div>
                <div style={styles.playerAction}>
                  <Info size={14} color="var(--text-secondary)" />
                </div>
              </div>
            ))}
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
  title: {
    fontSize: '1.4rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    color: '#fff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '10px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1.25rem',
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    }
  },
  teamsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  sectionTitle: {
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
    fontWeight: '700',
  },
  teamsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  teamCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderLeft: '4px solid #fff',
    borderRadius: '12px',
    padding: '12px 1rem',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'var(--transition)',
  },
  teamCardActive: {
    background: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  teamBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  teamLetterAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.8rem',
  },
  teamTextCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  teamName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#fff',
  },
  teamShort: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  squadSection: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  squadHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '10px',
  },
  playersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
  },
  playerCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '10px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  playerAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(0, 229, 255, 0.1)',
    color: 'var(--teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  playerName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff',
  },
  playerRole: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
  },
  playerAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};
