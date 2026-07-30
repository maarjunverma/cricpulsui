import React from 'react';
import { X, User, Shield, Briefcase, Zap } from 'lucide-react';

export default function PlayerProfileModal({ player, teamName, onClose }) {
  if (!player) return null;

  const { name, role, batting, bowling, stats } = player;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} className="glass-card fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>

        {/* Profile Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={styles.meta}>
            <h3 style={styles.playerName}>{name}</h3>
            <span style={styles.teamBadge}>{teamName}</span>
          </div>
        </div>

        {/* Bio Info Grid */}
        <div style={styles.bioGrid}>
          <div style={styles.bioItem}>
            <Briefcase size={14} color="var(--teal)" />
            <div style={styles.bioText}>
              <span style={styles.bioLabel}>Role</span>
              <span style={styles.bioVal}>{role}</span>
            </div>
          </div>
          <div style={styles.bioItem}>
            <Zap size={14} color="var(--emerald)" />
            <div style={styles.bioText}>
              <span style={styles.bioLabel}>Batting Style</span>
              <span style={styles.bioVal}>{batting || 'Right-hand bat'}</span>
            </div>
          </div>
          <div style={styles.bioItem}>
            <User size={14} color="var(--red-accent)" />
            <div style={styles.bioText}>
              <span style={styles.bioLabel}>Bowling Style</span>
              <span style={styles.bioVal}>{bowling || 'None'}</span>
            </div>
          </div>
          <div style={styles.bioItem}>
            <Shield size={14} color="var(--amber)" />
            <div style={styles.bioText}>
              <span style={styles.bioLabel}>Country/Team</span>
              <span style={styles.bioVal}>{teamName}</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <h4 style={styles.statsHeading}>Career Statistics</h4>
          
          {stats ? (
            <div style={styles.tablesWrapper}>
              {/* Batting Stats */}
              {stats.bat && (
                <div style={styles.statsTableContainer}>
                  <span style={styles.tableTitle}>Batting Stats</span>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Mat</th>
                        <th>Runs</th>
                        <th>HS</th>
                        <th>Avg</th>
                        <th>SR</th>
                        {stats.bat.hundred !== undefined && <th>100s</th>}
                        {stats.bat.fifty !== undefined && <th>50s</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{stats.bat.mat || stats.bat.mat === 0 ? stats.bat.mat : '—'}</td>
                        <td style={{ fontWeight: '700', color: '#fff' }}>{stats.bat.runs || stats.bat.runs === 0 ? stats.bat.runs : '—'}</td>
                        <td>{stats.bat.hs || '—'}</td>
                        <td style={{ color: 'var(--emerald)', fontWeight: '600' }}>{stats.bat.avg || '—'}</td>
                        <td style={{ color: 'var(--teal)', fontWeight: '600' }}>{stats.bat.sr || '—'}</td>
                        {stats.bat.hundred !== undefined && <td>{stats.bat.hundred}</td>}
                        {stats.bat.fifty !== undefined && <td>{stats.bat.fifty}</td>}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bowling Stats */}
              {stats.bowl && stats.bowl.mat > 0 && (
                <div style={styles.statsTableContainer}>
                  <span style={styles.tableTitle}>Bowling Stats</span>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Mat</th>
                        <th>Wkts</th>
                        <th>BBI</th>
                        <th>Avg</th>
                        <th>Econ</th>
                        <th>SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{stats.bowl.mat}</td>
                        <td style={{ fontWeight: '700', color: '#fff' }}>{stats.bowl.wkts}</td>
                        <td>{stats.bowl.best || '—'}</td>
                        <td style={{ color: 'var(--red-accent)', fontWeight: '600' }}>{stats.bowl.avg || '—'}</td>
                        <td style={{ color: 'var(--amber)', fontWeight: '600' }}>{stats.bowl.econ || '—'}</td>
                        <td>{stats.bowl.sr || '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.noStats}>
              No career statistics available for this player.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    width: '100%',
    maxWidth: '520px',
    background: 'linear-gradient(135deg, #0e1726 0%, #070c14 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '1.75rem',
    position: 'relative',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    color: 'var(--text-secondary)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--teal), var(--emerald))',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: '800',
    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  playerName: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'var(--font-heading)',
  },
  teamBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--teal)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  bioGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '12px 1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  bioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  bioText: {
    display: 'flex',
    flexDirection: 'column',
  },
  bioLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  bioVal: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff',
  },
  statsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  statsHeading: {
    fontSize: '0.95rem',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '6px',
    fontWeight: '700',
  },
  tablesWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  statsTableContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  tableTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.8rem',
  },
  noStats: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    padding: '1rem 0',
  }
};
