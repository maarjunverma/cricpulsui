import React from 'react';
import { Users } from 'lucide-react';

// Teams will be populated from Strapi CMS once deployed.
// Page shows an empty state until team data is available via API.

export default function TeamsPage({ onPlayerClick }) {
  return (
    <div style={styles.container} className="fade-in">
      <h2 style={styles.title}>CricPuls Teams &amp; Squads</h2>

      <div style={styles.emptyState}>
        <Users size={56} style={{ opacity: 0.25, marginBottom: '1rem', color: 'var(--teal)' }} />
        <p style={styles.emptyTitle}>Team Squads Coming Soon</p>
        <p style={styles.emptySubtitle}>
          Squad profiles and player stats will be available once team data is loaded from the live API.
        </p>
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
    margin: 0,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  emptyTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  emptySubtitle: {
    margin: '0.5rem 0 0',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    maxWidth: '360px',
    lineHeight: 1.6,
  },
};
