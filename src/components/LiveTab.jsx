import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, X, SlidersHorizontal, Bot, BrainCircuit, Send } from 'lucide-react';
import CricketField from './CricketField';
import TeamFlag from './TeamFlag';
import { playBallEvent } from '../services/audioService';
import {
  generateGeminiBallCommentary,
  askGeminiCricketQuestion,
  getGeminiApiKey,
  setGeminiApiKey
} from '../services/geminiCommentaryService';
import { getUIText } from '../services/translations';

export default function LiveTab({ match, onPlayerClick, appLanguage = 'en', onLanguageChange }) {
  const selectedLang = appLanguage === 'hi' ? 'hi' : 'en';

  const [copiedBall, setCopiedBall] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getGeminiApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Gemini Interactive Question State
  const [customQuestion, setCustomQuestion] = useState('');
  const [geminiAnswer, setGeminiAnswer] = useState(null);
  const [isGeminiThinking, setIsGeminiThinking] = useState(false);

  // Gemini Commentary Feed State
  const [geminiCommentaryList, setGeminiCommentaryList] = useState([]);

  // Sound effects triggered ball-by-ball
  useEffect(() => {
    if (match?.lastBall) {
      playBallEvent(match.lastBall.event);
    }
  }, [match?.lastBall]);

  // Generate Gemini text commentary whenever match commentary updates
  useEffect(() => {
    if (!match?.commentary || match.commentary.length === 0) return;

    let active = true;

    async function loadGeminiCommentary() {
      const matchContext = `${match.team1?.shortName || 'T1'} vs ${match.team2?.shortName || 'T2'}, Over ${match.overs || '0.0'}, Win Prob: ${match.winProbability || 50}%`;
      const bowler = match.bowling?.active?.name || 'Bowler';
      const batter = match.batting?.striker?.name || 'Batter';

      const results = await Promise.all(
        match.commentary.slice(0, 15).map(async (comm) => {
          const isWkt = comm.category === 'W' || String(comm.event).toUpperCase().includes('W');
          const runs = comm.category === '6' ? 6 : comm.category === '4' ? 4 : parseInt(comm.event, 10) || 0;

          const geminiData = await generateGeminiBallCommentary({
            ball: comm.ball,
            event: comm.event || comm.category || '0',
            runs,
            isWicket: isWkt,
            bowlerName: bowler,
            batterName: batter,
            matchSituation: matchContext,
            language: selectedLang,
            apiKey: apiKeyInput
          });

          return {
            ...comm,
            geminiText: geminiData.text,
            tactics: geminiData.tactics,
            winShift: geminiData.winShift,
            source: geminiData.source
          };
        })
      );

      if (active) {
        setGeminiCommentaryList(results);
      }
    }

    loadGeminiCommentary();

    return () => {
      active = false;
    };
  }, [match?.commentary, selectedLang, apiKeyInput]);

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2500);
  };

  const handleCopyCommentary = (text, ballKey) => {
    navigator.clipboard?.writeText(text);
    setCopiedBall(ballKey);
    setTimeout(() => {
      setCopiedBall(null);
    }, 2000);
  };

  const handleAskGemini = async (promptQuery) => {
    const q = promptQuery || customQuestion;
    if (!q || !q.trim()) return;

    setIsGeminiThinking(true);
    setGeminiAnswer(null);

    const matchContext = `${match?.team1?.name} vs ${match?.team2?.name}, Score: ${match?.score?.team1?.runs || 0}/${match?.score?.team1?.wickets || 0} vs ${match?.score?.team2?.runs || 0}/${match?.score?.team2?.wickets || 0}, Overs: ${match?.overs || 0}, Batter: ${match?.batting?.striker?.name || 'Active'}, Bowler: ${match?.bowling?.active?.name || 'Active'}`;
    const answer = await askGeminiCricketQuestion(q, matchContext, apiKeyInput);
    
    setIsGeminiThinking(false);
    setGeminiAnswer({ question: q, answer });
    setCustomQuestion('');
  };

  if (!match) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>No active match selected or loading live Cricbuzz feed...</p>
      </div>
    );
  }

  const { batting, bowling, recentBalls = [], commentary = [] } = match;
  const winProbability = match.winProbability ?? 50;
  const striker = batting?.striker;
  const nonStriker = batting?.nonStriker;
  const activeBowler = bowling?.active;

  const getBallClass = (ball) => {
    if (ball === 'W') return 'ball-w';
    if (ball === '4') return 'ball-4';
    if (ball === '6') return 'ball-6';
    if (ball === '0') return 'ball-0';
    return 'ball-runs';
  };

  return (
    <div style={styles.container} className="fade-in">
      {/* 2D Interactive Pitch Visualization */}
      <div style={styles.fieldSection} className="glass-card">
        <CricketField lastBall={match.lastBall} />
      </div>

      <div style={styles.infoSection}>
        {/* Batsmen / Bowler Active Stats Card */}
        <div style={styles.scoreOverview} className="glass-card">
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>{getUIText('batter', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('runs', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('balls', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('fours', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('sixes', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('strikeRate', appLanguage)}</th>
                </tr>
              </thead>
              <tbody>
                {striker && (
                  <tr style={styles.trActive}>
                    <td 
                      style={styles.tdPlayerLink}
                      onClick={() => onPlayerClick && onPlayerClick(striker.id)}
                    >
                      <span style={{ color: 'var(--emerald)', marginRight: '4px' }}>*</span>
                      {striker.name}
                    </td>
                    <td style={{...styles.textRight, fontWeight: '700', color: 'var(--text-primary)'}}>{striker.runs}</td>
                    <td style={styles.textRight}>{striker.balls}</td>
                    <td style={styles.textRight}>{striker.fours}</td>
                    <td style={styles.textRight}>{striker.sixes}</td>
                    <td style={{...styles.textRight, color: 'var(--emerald)'}}>
                      {striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : (striker.sr || '0.0')}
                    </td>
                  </tr>
                )}
                {nonStriker && (
                  <tr style={styles.tr}>
                    <td 
                      style={styles.tdPlayerLink}
                      onClick={() => onPlayerClick && onPlayerClick(nonStriker.id)}
                    >
                      {nonStriker.name}
                    </td>
                    <td style={{...styles.textRight, fontWeight: '700'}}>{nonStriker.runs}</td>
                    <td style={styles.textRight}>{nonStriker.balls}</td>
                    <td style={styles.textRight}>{nonStriker.fours}</td>
                    <td style={styles.textRight}>{nonStriker.sixes}</td>
                    <td style={{...styles.textRight, color: 'var(--emerald)'}}>
                      {nonStriker.balls > 0 ? ((nonStriker.runs / nonStriker.balls) * 100).toFixed(1) : (nonStriker.sr || '0.0')}
                    </td>
                  </tr>
                )}
                {!striker && !nonStriker && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      {getUIText('noActiveBatsmen', appLanguage)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ ...styles.tableResponsive, marginTop: '1rem' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>{getUIText('bowler', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('overs', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('maidens', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('runs', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('wickets', appLanguage)}</th>
                  <th style={{...styles.th, ...styles.textRight}}>{getUIText('economy', appLanguage)}</th>
                </tr>
              </thead>
              <tbody>
                {activeBowler ? (
                  <tr style={styles.tr}>
                    <td 
                      style={styles.tdPlayerLink}
                      onClick={() => onPlayerClick && onPlayerClick(activeBowler.id)}
                    >
                      {activeBowler.name}
                    </td>
                    <td style={{...styles.textRight, fontWeight: '700'}}>
                      {typeof activeBowler.overs === 'number' ? activeBowler.overs.toFixed(1) : (activeBowler.overs || '0.0')}
                    </td>
                    <td style={styles.textRight}>{activeBowler.maidens || 0}</td>
                    <td style={styles.textRight}>{activeBowler.runs || 0}</td>
                    <td style={{...styles.textRight, color: 'var(--red-accent)', fontWeight: '700'}}>{activeBowler.wkts || 0}</td>
                    <td style={{...styles.textRight, color: 'var(--emerald)'}}>
                      {parseFloat(activeBowler.overs) > 0 ? (activeBowler.runs / (Math.floor(parseFloat(activeBowler.overs)) + (parseFloat(activeBowler.overs) % 1) * 1.666)).toFixed(2) : (activeBowler.economy || '0.00')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      {getUIText('noActiveBowler', appLanguage)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Balls Tracker Card */}
        <div style={styles.recentContainer} className="glass-card">
          <span style={styles.recentLabel}>{getUIText('recentBalls', appLanguage)}</span>
          <div style={styles.ballsList}>
            {recentBalls.map((ball, idx) => (
              <span 
                key={idx} 
                className={`ball-circle ${getBallClass(ball)}`}
              >
                {ball}
              </span>
            ))}
            {recentBalls.length === 0 && <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>{getUIText('startsOfOver', appLanguage)}</span>}
          </div>
        </div>

        {/* Win Probability Bar with Official Team Flags */}
        {winProbability !== undefined && match.team1 && match.team2 && (
          <div style={styles.probCard} className="glass-card">
            <div style={styles.probLabelRow}>
              <span style={{ fontWeight: '700', color: match.team1.color || 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <TeamFlag team={match.team1} size={18} />
                {match.team1.shortName || match.team1.name || 'T1'} ({winProbability}%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {getUIText('winProbability', appLanguage)}
              </span>
              <span style={{ fontWeight: '700', color: match.team2.color || 'var(--amber)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <TeamFlag team={match.team2} size={18} />
                {match.team2.shortName || match.team2.name || 'T2'} ({100 - winProbability}%)
              </span>
            </div>
            <div style={styles.barOuter}>
              <div 
                style={{ 
                  ...styles.barInnerTeam1, 
                  width: `${winProbability}%`,
                  background: match.team1.color || 'var(--teal)'
                }}
              />
              <div 
                style={{ 
                  ...styles.barInnerTeam2, 
                  width: `${100 - winProbability}%`,
                  background: match.team2.color || 'var(--amber)'
                }}
              />
            </div>
          </div>
        )}

        {/* ─── GOOGLE GEMINI AI COMMENTARY CARD (TEXT-ONLY) ─── */}
        <div className="glass-card gemini-comm-card" style={styles.geminiCard}>
          {/* Header */}
          <div style={styles.geminiHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={styles.geminiBadge}>
                <Bot size={16} color="#34d399" />
                <span style={{ fontWeight: '800', letterSpacing: '0.02em' }}>
                  GOOGLE GEMINI AI
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.8, color: '#38bdf8' }}>
                  2.0 FLASH
                </span>
              </div>

              {/* Language Pill */}
              <button
                type="button"
                onClick={() => onLanguageChange && onLanguageChange(selectedLang === 'en' ? 'hi' : 'en')}
                style={styles.langPill}
                title="Switch Language"
              >
                <span>{selectedLang === 'en' ? '🌐 English' : '🇮🇳 हिंदी'}</span>
                <span style={{ color: 'var(--emerald)', fontSize: '0.75rem' }}>⇄</span>
              </button>
            </div>

            {/* Persona and Settings Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  ...styles.iconBtn,
                  background: showSettings ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: showSettings ? 'var(--emerald)' : 'rgba(255, 255, 255, 0.1)'
                }}
                title="Gemini AI Settings & API Key"
              >
                <SlidersHorizontal size={15} />
              </button>
            </div>
          </div>

          {/* Collapsible Gemini Settings Drawer */}
          {showSettings && (
            <div style={styles.settingsDrawer}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                  Gemini Commentary Configuration
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowSettings(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* API Key Input */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Custom Google Gemini API Key (Optional)
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy... (Leave empty to use built-in engine)"
                    style={{
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#fff',
                      fontSize: '0.8rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    style={{
                      background: 'var(--emerald)',
                      color: '#000',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {apiKeySaved ? 'Saved!' : 'Save'}
                  </button>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  Stored securely in your local browser storage.
                </span>
              </div>
            </div>
          )}

          {/* Gemini Quick Analysis Chips */}
          <div style={styles.quickPrompts}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>
              Ask Gemini AI:
            </span>
            {[
              { id: 'tactics', label: 'Tactical Blueprint', query: 'What is the bowler and batter tactical blueprint right now?' },
              { id: 'prediction', label: 'Win Probability Prediction', query: 'Predict the winner and explain the statistical momentum shift.' },
              { id: 'pitch', label: 'Pitch & Over Breakdown', query: 'How is the surface behaving and what should be the death overs plan?' }
            ].map(chip => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleAskGemini(chip.query)}
                style={styles.promptChip}
              >
                <Sparkles size={11} color="#34d399" />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Gemini On-Demand AI Query Box */}
          <div style={styles.askGeminiRow}>
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskGemini(customQuestion)}
              placeholder="Ask Gemini AI anything about this match..."
              style={styles.queryInput}
            />
            <button
              type="button"
              onClick={() => handleAskGemini(customQuestion)}
              disabled={isGeminiThinking}
              style={styles.sendBtn}
            >
              {isGeminiThinking ? (
                <Sparkles size={14} className="spin-slow" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>

          {/* Gemini Answer Banner */}
          {geminiAnswer && (
            <div style={styles.geminiAnswerBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: '700' }}>
                <BrainCircuit size={14} />
                <span>Gemini Match Intelligence: "{geminiAnswer.question}"</span>
              </div>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: '#f1f5f9', lineHeight: '1.5' }}>
                {geminiAnswer.answer}
              </p>
            </div>
          )}

          {/* Ball-by-Ball Text Feed */}
          <div style={styles.commFeed}>
            {(geminiCommentaryList.length > 0 ? geminiCommentaryList : commentary).map((comm, idx) => {
              const isWicket = comm.category === 'W' || String(comm.event).toUpperCase().includes('W');
              const isBoundary = comm.category === '4' || comm.category === '6';
              const isSix = comm.category === '6';

              return (
                <div key={`${comm.ball}-${idx}`} style={styles.commItem}>
                  {/* Meta Bar */}
                  <div style={styles.commMeta}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={styles.commBall}>{comm.ball}</span>
                      <span 
                        style={{
                          ...styles.commEvent,
                          ...(isWicket ? styles.commWicket : {}),
                          ...(isBoundary ? styles.commBoundary : {}),
                          ...(isSix ? styles.commSix : {})
                        }}
                      >
                        {comm.event || (isWicket ? 'WICKET' : isBoundary ? (isSix ? '6 RUNS' : '4 RUNS') : 'LIVE')}
                      </span>
                      {comm.winShift && (
                        <span style={styles.winShiftBadge}>
                          {comm.winShift}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        {comm.source || 'Gemini Flash'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCommentary(comm.geminiText || comm.text, comm.ball)}
                        style={styles.miniActionBtn}
                        title="Copy commentary text"
                      >
                        {copiedBall === comm.ball ? (
                          <Check size={13} color="var(--emerald)" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Gemini Commentary Text (Pure Text) */}
                  <p style={styles.commText}>
                    {comm.geminiText || comm.text}
                  </p>

                  {/* Gemini Tactical Breakdown Card */}
                  {comm.tactics && (
                    <div style={styles.tacticalCard}>
                      <span style={{ color: '#34d399', fontWeight: '700', marginRight: '6px' }}>
                        Tactical Breakdown:
                      </span>
                      <span style={{ color: '#94a3b8' }}>
                        {comm.tactics.replace('Tactical Insight:', '').replace('Tactical Breakdown:', '').trim()}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
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
    gap: '1rem',
  },
  fieldSection: {
    padding: '0.75rem',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  scoreOverview: {
    padding: '1.25rem',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
  },
  tableResponsive: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  thRow: {
    borderBottom: '1px solid var(--border-color)',
  },
  th: {
    textAlign: 'left',
    padding: '0.4rem 0.5rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  trActive: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    background: 'rgba(16, 185, 129, 0.04)',
  },
  tdPlayerLink: {
    padding: '0.5rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    cursor: 'pointer',
  },
  textRight: {
    textAlign: 'right',
    padding: '0.5rem',
  },
  recentContainer: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  recentLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },
  ballsList: {
    display: 'flex',
    gap: '0.4rem',
    alignItems: 'center',
    overflowX: 'auto',
  },
  probCard: {
    padding: '0.85rem 1.25rem',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
  },
  probLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
  },
  barOuter: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
    display: 'flex',
  },
  barInnerTeam1: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
  barInnerTeam2: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
  geminiCard: {
    padding: '1.25rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 13, 22, 0.98) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
  },
  geminiHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  geminiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))',
    border: '1px solid rgba(52, 211, 153, 0.4)',
    color: '#34d399',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '0.78rem',
  },
  langPill: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    color: '#e2e8f0',
    padding: '4px 10px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '600',
  },
  iconBtn: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
    padding: '6px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  settingsDrawer: {
    background: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  quickPrompts: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '0.85rem',
  },
  promptChip: {
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#cbd5e1',
    padding: '3px 9px',
    borderRadius: '14px',
    fontSize: '0.72rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  },
  askGeminiRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '1rem',
  },
  queryInput: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '0.82rem',
    outline: 'none',
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
  },
  geminiAnswerBox: {
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.25)',
    borderRadius: '10px',
    padding: '0.85rem 1rem',
    marginBottom: '1.25rem',
  },
  commFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  commItem: {
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background 0.2s',
  },
  commMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.45rem',
  },
  commBall: {
    fontWeight: '800',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
  },
  commEvent: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '2px 7px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.06)',
    color: 'var(--text-secondary)',
  },
  commBoundary: {
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--emerald)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  commSix: {
    background: 'rgba(245, 158, 11, 0.15)',
    color: 'var(--amber)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
  },
  commWicket: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: 'var(--red-accent)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  winShiftBadge: {
    fontSize: '0.68rem',
    fontWeight: '600',
    color: '#38bdf8',
    background: 'rgba(6, 182, 212, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  commText: {
    margin: 0,
    fontSize: '0.86rem',
    color: '#e2e8f0',
    lineHeight: '1.5',
  },
  tacticalCard: {
    marginTop: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    fontSize: '0.78rem',
    lineHeight: '1.45',
  },
  miniActionBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    transition: 'color 0.15s',
  }
};
