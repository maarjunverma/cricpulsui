import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Users, 
  MapPin, 
  Info, 
  Calendar, 
  Clock, 
  Shield, 
  Trophy, 
  Wind, 
  Compass, 
  Check, 
  Bell, 
  ExternalLink, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getEnrichedMatchDetails } from '../services/matchDetailsHelper';
import TeamFlag from './TeamFlag';

export default function MatchDetailModal({ match, onClose, onGoToLive, onPlayerClick }) {
  if (!match) return null;

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const enrichedMatch = getEnrichedMatchDetails(match);
  const [activeTab, setActiveTab] = useState('squads'); // 'squads' | 'venue' | 'info'
  const [selectedTeamTab, setSelectedTeamTab] = useState('team1'); // 'team1' | 'team2' | 'both'
  const [isReminderSet, setIsReminderSet] = useState(() => {
    return localStorage.getItem(`cricai_reminder_${match.id}`) === 'true';
  });
  const [expandedPlayerId, setExpandedPlayerId] = useState(null);

  const { team1, team2, venueInfo, headToHead, format, status, category, countdown, matchDate, matchTime } = enrichedMatch;

  const toggleReminder = () => {
    const nextState = !isReminderSet;
    setIsReminderSet(nextState);
    if (nextState) {
      localStorage.setItem(`cricai_reminder_${match.id}`, 'true');
    } else {
      localStorage.removeItem(`cricai_reminder_${match.id}`);
    }
  };

  const getFormatBadgeColor = (fmt) => {
    if (fmt === 'T20') return '#14b8a6';
    if (fmt === 'ODI') return '#10b981';
    return '#ef4444';
  };

  return createPortal(
    <div style={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div 
        style={styles.modal} 
        className="glass-card modal-content-responsive" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Modal Top Bar ─── */}
        <div style={styles.modalHeader}>
          <div style={styles.headerTitleWrap}>
            <span style={{
              ...styles.formatPill,
              color: getFormatBadgeColor(format),
              borderColor: `${getFormatBadgeColor(format)}55`,
              background: `${getFormatBadgeColor(format)}15`
            }}>
              {format}
            </span>
            <span style={styles.tournamentText}>
              {match?.title?.split(' - ')[0] || match?.title || 'Match Preview'}
            </span>
          </div>
          <button 
            style={styles.closeBtn} 
            onClick={onClose}
            aria-label="Close match details modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* ─── Matchup Header Banner ─── */}
        <div style={styles.matchupBanner}>
          <div style={styles.teamsRow}>
            {/* Team 1 */}
            <div style={styles.teamCol}>
              <TeamFlag team={team1} size={48} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)' }} />
              <span style={styles.teamNameText}>{team1.name}</span>
              {match.score?.team1 && (
                <span style={styles.teamScoreText}>
                  {match.score.team1.runs}/{match.score.team1.wickets}
                  <span style={styles.oversText}> ({match.score.team1.overs} ov)</span>
                </span>
              )}
            </div>

            {/* VS / Status Middle */}
            <div style={styles.middleBadgeCol}>
              <span style={styles.vsBadge}>VS</span>
              {category === 'live' && (
                <span style={styles.statusLivePill}>
                  <span className="pulse-indicator" style={{ width: 6, height: 6 }} />
                  LIVE
                </span>
              )}
              {category === 'upcoming' && (
                <span style={styles.statusUpcomingPill}>
                  <Clock size={11} />
                  {countdown || 'Upcoming'}
                </span>
              )}
              {category === 'finished' && (
                <span style={styles.statusFinishedPill}>
                  {match.result || 'Finished'}
                </span>
              )}
            </div>

            {/* Team 2 */}
            <div style={styles.teamCol}>
              <TeamFlag team={team2} size={48} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)' }} />
              <span style={styles.teamNameText}>{team2.name}</span>
              {match.score?.team2 && (
                <span style={styles.teamScoreText}>
                  {match.score.team2.runs}/{match.score.team2.wickets}
                  <span style={styles.oversText}> ({match.score.team2.overs} ov)</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Subtitle: Venue & Date */}
          <div style={styles.quickInfoRow}>
            <span style={styles.quickInfoItem}>
              <MapPin size={13} color="var(--emerald)" />
              {venueInfo.name}, {venueInfo.city}
            </span>
            <span style={styles.quickInfoDivider}>•</span>
            <span style={styles.quickInfoItem}>
              <Calendar size={13} color="var(--teal)" />
              {matchDate} ({matchTime})
            </span>
          </div>
        </div>

        {/* ─── Modal Tab Bar ─── */}
        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveTab('squads')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'squads' ? styles.tabBtnActive : {})
            }}
          >
            <Users size={15} />
            <span>Squads & Playing XI</span>
          </button>
          <button
            onClick={() => setActiveTab('venue')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'venue' ? styles.tabBtnActive : {})
            }}
          >
            <MapPin size={15} />
            <span>Ground & Pitch Report</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'info' ? styles.tabBtnActive : {})
            }}
          >
            <Info size={15} />
            <span>Head-to-Head & Info</span>
          </button>
        </div>

        {/* ─── Modal Scrollable Body ─── */}
        <div style={styles.modalBody}>
          {/* TAB 1: SQUADS */}
          {activeTab === 'squads' && (
            <div style={styles.tabContent}>
              {/* Mobile Team Toggle */}
              <div style={styles.squadFilterRow} className="squad-team-filter">
                <button
                  onClick={() => setSelectedTeamTab('team1')}
                  style={{
                    ...styles.squadTeamBtn,
                    ...(selectedTeamTab === 'team1' ? { ...styles.squadTeamBtnActive, borderColor: team1.color, color: '#fff' } : {})
                  }}
                >
                  <TeamFlag team={team1} size={16} />
                  {team1.name} ({team1.squad?.length || 11})
                </button>
                <button
                  onClick={() => setSelectedTeamTab('team2')}
                  style={{
                    ...styles.squadTeamBtn,
                    ...(selectedTeamTab === 'team2' ? { ...styles.squadTeamBtnActive, borderColor: team2.color, color: '#fff' } : {})
                  }}
                >
                  <TeamFlag team={team2} size={16} />
                  {team2.name} ({team2.squad?.length || 11})
                </button>
                <button
                  onClick={() => setSelectedTeamTab('both')}
                  style={{
                    ...styles.squadTeamBtn,
                    ...(selectedTeamTab === 'both' ? styles.squadTeamBtnActive : {})
                  }}
                >
                  Both Squads
                </button>
              </div>

              {/* Squads Columns */}
              <div style={styles.squadsGrid}>
                {/* Team 1 Squad Column */}
                {(selectedTeamTab === 'team1' || selectedTeamTab === 'both') && (
                  <div style={styles.squadColCard}>
                    <div style={{ ...styles.squadColHeader, borderLeftColor: team1.color }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TeamFlag team={team1} size={26} />
                        <div>
                          <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: '700' }}>
                            {team1.name}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Captain: {team1.captain} • Keeper: {team1.wicketKeeper}
                          </span>
                        </div>
                      </div>
                      <span style={{ ...styles.squadCountBadge, background: `${team1.color}25`, color: team1.color }}>
                        {team1.squad?.length} Players
                      </span>
                    </div>

                    <div style={styles.playersList}>
                      {team1.squad?.map((player, idx) => {
                        const isExpanded = expandedPlayerId === player.id;
                        return (
                          <div 
                            key={player.id} 
                            style={{
                              ...styles.playerItem,
                              ...(isExpanded ? styles.playerItemExpanded : {})
                            }}
                            onClick={() => setExpandedPlayerId(isExpanded ? null : player.id)}
                          >
                            <div style={styles.playerMainRow}>
                              <span style={styles.playerIndex}>{idx + 1}</span>
                              <div style={styles.playerInfo}>
                                <div style={styles.playerNameRow}>
                                  <span style={styles.playerName}>{player.name}</span>
                                  {player.isCaptain && <span style={styles.captainBadge}>C</span>}
                                  {player.isKeeper && <span style={styles.keeperBadge}>WK</span>}
                                </div>
                                <span style={styles.playerRoleText}>{player.role}</span>
                              </div>
                              <span style={styles.playerStyleBadge}>
                                {player.batting?.split(' ')[0] || 'RHB'}
                              </span>
                            </div>

                            {/* Expanded Stats Drawer */}
                            {isExpanded && player.stats && (
                              <div style={styles.playerStatsDrawer}>
                                <div style={styles.statMiniGrid}>
                                  {player.stats.bat && (
                                    <>
                                      <div style={styles.statMiniBox}>
                                        <span style={styles.statMiniVal}>{player.stats.bat.mat || '—'}</span>
                                        <span style={styles.statMiniLbl}>Matches</span>
                                      </div>
                                      <div style={styles.statMiniBox}>
                                        <span style={{ ...styles.statMiniVal, color: 'var(--emerald)' }}>{player.stats.bat.runs || '0'}</span>
                                        <span style={styles.statMiniLbl}>Runs</span>
                                      </div>
                                      <div style={styles.statMiniBox}>
                                        <span style={styles.statMiniVal}>{player.stats.bat.avg || '—'}</span>
                                        <span style={styles.statMiniLbl}>Avg</span>
                                      </div>
                                      <div style={styles.statMiniBox}>
                                        <span style={styles.statMiniVal}>{player.stats.bat.sr || '—'}</span>
                                        <span style={styles.statMiniLbl}>SR</span>
                                      </div>
                                    </>
                                  )}
                                  {player.stats.bowl && (
                                    <div style={styles.statMiniBox}>
                                      <span style={{ ...styles.statMiniVal, color: 'var(--teal)' }}>{player.stats.bowl.wkts || '0'}</span>
                                      <span style={styles.statMiniLbl}>Wkts</span>
                                    </div>
                                  )}
                                </div>
                                <span style={styles.bowlingStyleText}>
                                  Bowling: {player.bowling || 'None'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Team 2 Squad Column */}
                {(selectedTeamTab === 'team2' || selectedTeamTab === 'both') && (
                  <div style={styles.squadColCard}>
                    <div style={{ ...styles.squadColHeader, borderLeftColor: team2.color }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TeamFlag team={team2} size={26} />
                        <div>
                          <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: '700' }}>
                            {team2.name}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Captain: {team2.captain} • Keeper: {team2.wicketKeeper}
                          </span>
                        </div>
                      </div>
                      <span style={{ ...styles.squadCountBadge, background: `${team2.color}25`, color: team2.color }}>
                        {team2.squad?.length} Players
                      </span>
                    </div>

                    <div style={styles.playersList}>
                      {team2.squad?.map((player, idx) => {
                        const isExpanded = expandedPlayerId === player.id;
                        return (
                          <div 
                            key={player.id} 
                            style={{
                              ...styles.playerItem,
                              ...(isExpanded ? styles.playerItemExpanded : {})
                            }}
                            onClick={() => setExpandedPlayerId(isExpanded ? null : player.id)}
                          >
                            <div style={styles.playerMainRow}>
                              <span style={styles.playerIndex}>{idx + 1}</span>
                              <div style={styles.playerInfo}>
                                <div style={styles.playerNameRow}>
                                  <span style={styles.playerName}>{player.name}</span>
                                  {player.isCaptain && <span style={styles.captainBadge}>C</span>}
                                  {player.isKeeper && <span style={styles.keeperBadge}>WK</span>}
                                </div>
                                <span style={styles.playerRoleText}>{player.role}</span>
                              </div>
                              <span style={styles.playerStyleBadge}>
                                {player.batting?.split(' ')[0] || 'RHB'}
                              </span>
                            </div>

                            {/* Expanded Stats Drawer */}
                            {isExpanded && player.stats && (
                              <div style={styles.playerStatsDrawer}>
                                <div style={styles.statMiniGrid}>
                                  {player.stats.bat && (
                                    <>
                                      <div style={styles.statMiniBox}>
                                        <span style={styles.statMiniVal}>{player.stats.bat.mat || '—'}</span>
                                        <span style={styles.statMiniLbl}>Matches</span>
                                      </div>
                                      <div style={styles.statMiniBox}>
                                        <span style={{ ...styles.statMiniVal, color: 'var(--emerald)' }}>{player.stats.bat.runs || '0'}</span>
                                        <span style={styles.statMiniLbl}>Runs</span>
                                      </div>
                                      <div style={styles.statMiniBox}>
                                        <span style={styles.statMiniVal}>{player.stats.bat.avg || '—'}</span>
                                        <span style={styles.statMiniLbl}>Avg</span>
                                      </div>
                                      <div style={styles.statMiniBox}>
                                        <span style={styles.statMiniVal}>{player.stats.bat.sr || '—'}</span>
                                        <span style={styles.statMiniLbl}>SR</span>
                                      </div>
                                    </>
                                  )}
                                  {player.stats.bowl && (
                                    <div style={styles.statMiniBox}>
                                      <span style={{ ...styles.statMiniVal, color: 'var(--teal)' }}>{player.stats.bowl.wkts || '0'}</span>
                                      <span style={styles.statMiniLbl}>Wkts</span>
                                    </div>
                                  )}
                                </div>
                                <span style={styles.bowlingStyleText}>
                                  Bowling: {player.bowling || 'None'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GROUND & VENUE */}
          {activeTab === 'venue' && (
            <div style={styles.tabContent}>
              <div style={styles.venueFeatureCard}>
                <div style={styles.venueHeaderRow}>
                  <div style={styles.venueIconCircle}>
                    <MapPin size={24} color="#10b981" />
                  </div>
                  <div>
                    <h3 style={styles.stadiumHeading}>{venueInfo.name}</h3>
                    <span style={styles.stadiumSubheading}>
                      📍 {venueInfo.city}, {venueInfo.country} • Capacity: {venueInfo.capacity} spectators
                    </span>
                  </div>
                </div>

                {/* Pitch Report Box */}
                <div style={styles.venueBlock}>
                  <div style={styles.blockTitleRow}>
                    <Compass size={16} color="var(--emerald)" />
                    <h4 style={styles.blockTitle}>Pitch & Surface Report</h4>
                  </div>
                  <p style={styles.blockParagraph}>
                    {venueInfo.pitchReport}
                  </p>
                  <div style={styles.statPillsRow}>
                    <div style={styles.statPill}>
                      <span style={styles.statPillLabel}>Avg 1st Innings</span>
                      <span style={styles.statPillVal}>{venueInfo.avgFirstInnings}</span>
                    </div>
                    <div style={styles.statPill}>
                      <span style={styles.statPillLabel}>Toss Strategy</span>
                      <span style={styles.statPillVal}>{venueInfo.tossTrend}</span>
                    </div>
                  </div>
                </div>

                {/* Weather Box */}
                <div style={styles.venueBlock}>
                  <div style={styles.blockTitleRow}>
                    <Wind size={16} color="var(--teal)" />
                    <h4 style={styles.blockTitle}>Live Weather & Conditions</h4>
                  </div>
                  <p style={styles.blockParagraph}>
                    {venueInfo.weather}
                  </p>
                </div>

                {/* Boundary & Dimensions */}
                <div style={styles.venueBlock}>
                  <div style={styles.blockTitleRow}>
                    <Shield size={16} color="#f59e0b" />
                    <h4 style={styles.blockTitle}>Ground Dimensions & Outfield</h4>
                  </div>
                  <p style={styles.blockParagraph}>
                    {venueInfo.boundaries}
                  </p>
                </div>

                {/* Match Officials */}
                <div style={styles.venueBlock}>
                  <div style={styles.blockTitleRow}>
                    <Users size={16} color="var(--text-secondary)" />
                    <h4 style={styles.blockTitle}>Match Officials</h4>
                  </div>
                  <div style={styles.officialsGrid}>
                    <div style={styles.officialItem}>
                      <span style={styles.officialLabel}>On-Field Umpires:</span>
                      <span style={styles.officialVal}>{venueInfo.umpires}</span>
                    </div>
                    <div style={styles.officialItem}>
                      <span style={styles.officialLabel}>Third Umpire (TV):</span>
                      <span style={styles.officialVal}>{venueInfo.thirdUmpire}</span>
                    </div>
                    <div style={styles.officialItem}>
                      <span style={styles.officialLabel}>Match Referee:</span>
                      <span style={styles.officialVal}>{venueInfo.referee}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MATCH INFO & HEAD-TO-HEAD */}
          {activeTab === 'info' && (
            <div style={styles.tabContent}>
              {/* Head-to-Head Card */}
              <div style={styles.venueBlock}>
                <div style={styles.blockTitleRow}>
                  <Trophy size={16} color="var(--emerald)" />
                  <h4 style={styles.blockTitle}>Head to Head Record (Recent History)</h4>
                </div>

                <div style={styles.h2hBarContainer}>
                  <div style={styles.h2hStatsRow}>
                    <span style={{ color: team1.color, fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <TeamFlag team={team1} size={16} />
                      {team1.shortName}: {headToHead.team1Wins} Wins
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      Total {headToHead.total} Played ({headToHead.noResult} NR)
                    </span>
                    <span style={{ color: team2.color, fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <TeamFlag team={team2} size={16} />
                      {team2.shortName}: {headToHead.team2Wins} Wins
                    </span>
                  </div>
                  <div style={styles.h2hTrack}>
                    <div 
                      style={{ 
                        ...styles.h2hFillTeam1, 
                        width: `${(headToHead.team1Wins / headToHead.total) * 100}%`,
                        backgroundColor: team1.color 
                      }} 
                    />
                    <div 
                      style={{ 
                        ...styles.h2hFillTeam2, 
                        width: `${(headToHead.team2Wins / headToHead.total) * 100}%`,
                        backgroundColor: team2.color 
                      }} 
                    />
                  </div>
                </div>

                <div style={styles.lastMeetingsWrap}>
                  <span style={styles.lastMeetingsTitle}>Last 5 Encounters:</span>
                  <div style={styles.meetingsRow}>
                    {headToHead.lastFive.map((m, i) => (
                      <span key={i} style={styles.meetingChip}>
                        <strong>{m.winner}</strong> ({m.margin})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Details Key Table */}
              <div style={styles.venueBlock}>
                <div style={styles.blockTitleRow}>
                  <Info size={16} color="var(--teal)" />
                  <h4 style={styles.blockTitle}>Match Summary & Scheduling</h4>
                </div>
                <div style={styles.detailsTable}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Series / Tour</span>
                    <span style={styles.detailVal}>{match.title.split(' - ')[0] || 'Bilateral Tour'}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Match Number</span>
                    <span style={styles.detailVal}>{match.title.split(' - ')[1] || 'Fixture'}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Match Format</span>
                    <span style={styles.detailVal}>{format} (Overs: {format === 'T20' ? '20' : format === 'ODI' ? '50' : 'Multi-day'})</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Scheduled Date</span>
                    <span style={styles.detailVal}>{matchDate}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Match Timing</span>
                    <span style={styles.detailVal}>{matchTime}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Toss</span>
                    <span style={styles.detailVal}>{match.toss || 'Toss scheduled 30 minutes before start'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Modal Footer Actions ─── */}
        <div style={styles.modalFooter}>
          {category === 'upcoming' ? (
            <button
              onClick={toggleReminder}
              style={{
                ...styles.reminderBtn,
                ...(isReminderSet ? styles.reminderBtnActive : {})
              }}
            >
              {isReminderSet ? (
                <>
                  <Check size={16} />
                  <span>Reminder Scheduled!</span>
                </>
              ) : (
                <>
                  <Bell size={16} />
                  <span>Remind Me / Add to Calendar</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                if (onGoToLive) onGoToLive(match.id);
                onClose();
              }}
              style={styles.liveActionBtn}
            >
              <Sparkles size={16} />
              <span>Go to Live Scorecard & AI Commentary</span>
            </button>
          )}

          <button style={styles.secondaryCloseBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.82)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '0.6rem',
  },
  modal: {
    background: 'linear-gradient(145deg, rgba(13, 27, 42, 0.98) 0%, rgba(10, 18, 28, 0.98) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '860px',
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(16, 185, 129, 0.15)',
    overflow: 'hidden',
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.85rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(0, 0, 0, 0.25)',
  },
  headerTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  formatPill: {
    fontSize: '0.72rem',
    fontWeight: '800',
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid',
    letterSpacing: '0.04em',
  },
  tournamentText: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'var(--font-heading)',
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-secondary)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  matchupBanner: {
    padding: '1.25rem',
    background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, rgba(0, 0, 0, 0) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  teamsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '1rem',
  },
  teamCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.35rem',
    flex: 1,
    textAlign: 'center',
  },
  teamFlagCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '800',
    fontSize: '0.9rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.15)',
  },
  teamNameText: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
  },
  teamScoreText: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: 'var(--emerald)',
  },
  oversText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  middleBadgeCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.35rem',
    minWidth: '80px',
  },
  vsBadge: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
  },
  statusLivePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#ef4444',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '700',
  },
  statusUpcomingPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(20, 184, 166, 0.15)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    color: 'var(--teal)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  statusFinishedPill: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: 'var(--text-secondary)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  quickInfoRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.6rem',
    marginTop: '0.85rem',
    flexWrap: 'wrap',
  },
  quickInfoItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
  },
  quickInfoDivider: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
  tabBar: {
    display: 'flex',
    background: 'rgba(0, 0, 0, 0.35)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0 0.5rem',
    overflowX: 'auto',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.8rem 1.1rem',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    fontSize: '0.86rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  tabBtnActive: {
    color: 'var(--emerald)',
    borderBottomColor: 'var(--emerald)',
    background: 'rgba(16, 185, 129, 0.06)',
  },
  modalBody: {
    padding: '1.25rem',
    overflowY: 'auto',
    flex: 1,
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  squadFilterRow: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    paddingBottom: '2px',
  },
  squadTeamBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-secondary)',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  squadTeamBtnActive: {
    background: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'var(--emerald)',
    color: 'var(--emerald)',
  },
  teamDotSmall: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  squadsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    gap: '1rem',
  },
  squadColCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  squadColHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: 'rgba(0, 0, 0, 0.25)',
    borderLeft: '4px solid',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  squadCountBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  playersList: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  playerItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.65rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  playerItemExpanded: {
    background: 'rgba(16, 185, 129, 0.06)',
  },
  playerMainRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  playerIndex: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    width: '16px',
    textAlign: 'center',
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  playerNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  playerName: {
    fontSize: '0.86rem',
    fontWeight: '600',
    color: '#fff',
  },
  captainBadge: {
    fontSize: '0.65rem',
    fontWeight: '800',
    background: '#f59e0b',
    color: '#000',
    padding: '1px 4px',
    borderRadius: '4px',
  },
  keeperBadge: {
    fontSize: '0.65rem',
    fontWeight: '800',
    background: 'var(--teal)',
    color: '#000',
    padding: '1px 4px',
    borderRadius: '4px',
  },
  playerRoleText: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  playerStyleBadge: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  playerStatsDrawer: {
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  statMiniGrid: {
    display: 'flex',
    gap: '0.5rem',
  },
  statMiniBox: {
    flex: 1,
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '6px',
    padding: '4px 6px',
    textAlign: 'center',
  },
  statMiniVal: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#fff',
    display: 'block',
  },
  statMiniLbl: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  bowlingStyleText: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  venueFeatureCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  venueHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(16, 185, 129, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  venueIconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stadiumHeading: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#fff',
    margin: '0 0 0.25rem 0',
    fontFamily: 'var(--font-heading)',
  },
  stadiumSubheading: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  venueBlock: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '1.1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  blockTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  blockTitle: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
  },
  blockParagraph: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    margin: 0,
  },
  statPillsRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.4rem',
    flexWrap: 'wrap',
  },
  statPill: {
    background: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '6px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statPillLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  statPillVal: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--emerald)',
  },
  officialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
    gap: '0.6rem',
    marginTop: '0.25rem',
  },
  officialItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    background: 'rgba(0, 0, 0, 0.25)',
    padding: '8px 10px',
    borderRadius: '6px',
  },
  officialLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  officialVal: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#fff',
  },
  h2hBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  h2hStatsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  h2hTrack: {
    height: '10px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
  },
  h2hFillTeam1: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  h2hFillTeam2: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  lastMeetingsWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap',
  },
  lastMeetingsTitle: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  meetingsRow: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  meetingChip: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    padding: '3px 8px',
    fontSize: '0.74rem',
    color: 'var(--text-secondary)',
  },
  detailsTable: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.55rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    fontSize: '0.84rem',
  },
  detailLabel: {
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  detailVal: {
    color: '#fff',
    fontWeight: '600',
  },
  modalFooter: {
    padding: '0.85rem 1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.6rem',
    flexWrap: 'wrap',
  },
  reminderBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.65rem 1.2rem',
    borderRadius: '8px',
    background: 'rgba(20, 184, 166, 0.15)',
    border: '1px solid rgba(20, 184, 166, 0.4)',
    color: 'var(--teal)',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  reminderBtnActive: {
    background: 'rgba(16, 185, 129, 0.25)',
    borderColor: 'var(--emerald)',
    color: '#34d399',
  },
  liveActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.65rem 1.25rem',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, var(--emerald) 0%, var(--teal) 100%)',
    border: 'none',
    color: '#000',
    fontSize: '0.88rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
    transition: 'all 0.2s',
  },
  secondaryCloseBtn: {
    padding: '0.65rem 1.1rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
