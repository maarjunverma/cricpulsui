import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Copy, Check, MoreVertical, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import CricketField from './CricketField';
import { playBallEvent } from '../services/audioService';
import {
  SUPPORTED_LANGUAGES,
  COMMENTARY_PERSONAS,
  generateRegionalBallCommentary,
  generateAIOverSummary,
  speakRegionalCommentary,
  stopSpeech,
  isSpeechActive
} from '../services/aiCommentaryService';
import { getUIText } from '../services/translations';

export default function LiveTab({ match, onPlayerClick, appLanguage = 'en', onLanguageChange }) {
  // Commentary language is driven directly by the user's App Language selection (English or Hindi)
  const selectedLang = appLanguage === 'hi' ? 'hi' : 'en';

  const [selectedPersona, setSelectedPersona] = useState(() => {
    return localStorage.getItem('cricpuls_comm_persona') || 'hype';
  });
  const [autoSpeak, setAutoSpeak] = useState(() => {
    return localStorage.getItem('cricpuls_comm_autospeak') === 'true';
  });
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSpeakingBall, setActiveSpeakingBall] = useState(null);
  const [copiedBall, setCopiedBall] = useState(null);
  const [showOriginalEnglish, setShowOriginalEnglish] = useState(false);

  // Stop active speech if language switches
  useEffect(() => {
    stopSpeech();
    setActiveSpeakingBall(null);
  }, [selectedLang]);

  // Sound effects triggered ball-by-ball
  useEffect(() => {
    if (match?.lastBall) {
      playBallEvent(match.lastBall.event);

      // Auto speak newest ball in selected language if enabled
      if (autoSpeak && match.commentary && match.commentary.length > 0) {
        const latestComm = match.commentary[0];
        const regional = generateRegionalBallCommentary(latestComm, selectedLang, selectedPersona, match);
        setActiveSpeakingBall(latestComm.ball);
        speakRegionalCommentary({
          text: regional.nativeText,
          phoneticText: regional.phoneticText,
          langCode: selectedLang,
          rate: speechRate,
          pitch: speechPitch,
          onStart: () => setActiveSpeakingBall(latestComm.ball),
          onEnd: () => setActiveSpeakingBall(null),
          onError: () => setActiveSpeakingBall(null)
        });
      }
    }
  }, [match?.lastBall, autoSpeak, selectedLang, selectedPersona, speechRate, speechPitch]);

  // Cleanup speech when tab unmounts
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleLangChange = (langCode) => {
    const validLang = langCode === 'hi' ? 'hi' : 'en';
    if (onLanguageChange) {
      onLanguageChange(validLang);
    }
    stopSpeech();
    setActiveSpeakingBall(null);
  };

  const handlePersonaChange = (personaId) => {
    setSelectedPersona(personaId);
    localStorage.setItem('cricpuls_comm_persona', personaId);
  };

  const handleToggleAutoSpeak = () => {
    const nextVal = !autoSpeak;
    setAutoSpeak(nextVal);
    localStorage.setItem('cricpuls_comm_autospeak', String(nextVal));
    if (!nextVal) {
      stopSpeech();
      setActiveSpeakingBall(null);
    }
  };

  const handleSpeakBall = (commItem, regional) => {
    if (activeSpeakingBall === commItem.ball) {
      stopSpeech();
      setActiveSpeakingBall(null);
      return;
    }

    setActiveSpeakingBall(commItem.ball);
    speakRegionalCommentary({
      text: regional.nativeText,
      phoneticText: regional.phoneticText,
      langCode: selectedLang,
      rate: speechRate,
      pitch: speechPitch,
      onStart: () => setActiveSpeakingBall(commItem.ball),
      onEnd: () => setActiveSpeakingBall(null),
      onError: () => setActiveSpeakingBall(null)
    });
  };

  const handleSpeakLatest = () => {
    if (!match?.commentary || match.commentary.length === 0) return;
    const latest = match.commentary[0];
    const regional = generateRegionalBallCommentary(latest, selectedLang, selectedPersona, match);
    handleSpeakBall(latest, regional);
  };

  const handleCopyCommentary = (text, ballKey) => {
    navigator.clipboard?.writeText(text);
    setCopiedBall(ballKey);
    setTimeout(() => {
      setCopiedBall(null);
    }, 2000);
  };

  if (!match) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>No active match selected or loading live Cricbuzz feed...</p>
      </div>
    );
  }

  const { batting, bowling, recentBalls, commentary = [] } = match;
  const winProbability = match.winProbability ?? 50;
  const striker = batting?.striker;
  const nonStriker = batting?.nonStriker;
  const activeBowler = bowling?.active;

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
  const aiOverSummary = generateAIOverSummary(match, selectedLang);

  const getBallClass = (ballEvent) => {
    if (ballEvent === '4') return 'four';
    if (ballEvent === '6') return 'six';
    if (ballEvent === 'W') return 'wicket';
    if (ballEvent === 'Wd' || ballEvent === 'Nb') return 'extras';
    return '';
  };

  return (
    <div style={styles.mainSplit} className="live-main-split fade-in">
      <div style={styles.leftCol}>
      
        {/* Active Batsmen & Bowler Card */}
        <div style={styles.gridSection}>
          {/* Batsmen Box */}
          <div style={styles.card} className="glass-card">
            <h4 style={styles.cardTitle}>{getUIText('batting', appLanguage)}</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>{getUIText('batter', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('runs', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('balls', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('fours', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('sixes', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('strikeRate', appLanguage)}</th>
                </tr>
              </thead>
              <tbody>
                {striker && (
                  <tr style={styles.activeRow}>
                    <td 
                      onClick={() => onPlayerClick(striker.id)} 
                      style={styles.playerLink}
                    >
                      {striker.name} <span style={styles.strikerDot}>*</span>
                    </td>
                    <td style={{...styles.textRight, fontWeight: '700'}}>{striker.runs}</td>
                    <td style={styles.textRight}>{striker.balls}</td>
                    <td style={styles.textRight}>{striker.fours}</td>
                    <td style={styles.textRight}>{striker.sixes}</td>
                    <td style={{...styles.textRight, color: 'var(--teal)'}}>
                      {striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : '0.0'}
                    </td>
                  </tr>
                )}
                {nonStriker && (
                  <tr>
                    <td 
                      onClick={() => onPlayerClick(nonStriker.id)} 
                      style={styles.playerLink}
                    >
                      {nonStriker.name}
                    </td>
                    <td style={{...styles.textRight, fontWeight: '600'}}>{nonStriker.runs}</td>
                    <td style={styles.textRight}>{nonStriker.balls}</td>
                    <td style={styles.textRight}>{nonStriker.fours}</td>
                    <td style={styles.textRight}>{nonStriker.sixes}</td>
                    <td style={{...styles.textRight, color: 'var(--text-secondary)'}}>
                      {nonStriker.balls > 0 ? ((nonStriker.runs / nonStriker.balls) * 100).toFixed(1) : '0.0'}
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

          {/* Bowler Box */}
          <div style={styles.card} className="glass-card">
            <h4 style={styles.cardTitle}>{getUIText('bowling', appLanguage)}</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>{getUIText('bowler', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('overs', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('maidens', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('runs', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('wickets', appLanguage)}</th>
                  <th style={styles.textRight}>{getUIText('economy', appLanguage)}</th>
                </tr>
              </thead>
              <tbody>
                {activeBowler ? (
                  <tr style={styles.activeRow}>
                    <td 
                      onClick={() => onPlayerClick(activeBowler.id)} 
                      style={styles.playerLink}
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

        {/* Win Probability Bar */}
        {winProbability !== undefined && (
          <div style={styles.probCard} className="glass-card">
            <div style={styles.probLabelRow}>
              <span style={{ fontWeight: '700', color: match.team1.color }}>
                {match.team1.shortName} ({winProbability}%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {getUIText('winProbability', appLanguage)}
              </span>
              <span style={{ fontWeight: '700', color: match.team2.color }}>
                {match.team2.shortName} ({100 - winProbability}%)
              </span>
            </div>
            <div style={styles.barOuter}>
              <div 
                style={{ 
                  ...styles.barInnerTeam1, 
                  width: `${winProbability}%`,
                  background: match.team1.color 
                }}
              />
              <div 
                style={{ 
                  ...styles.barInnerTeam2, 
                  width: `${100 - winProbability}%`,
                  background: match.team2.color 
                }}
              />
            </div>
          </div>
        )}

        {/* ─── AI COMMENTARY CARD ─── */}
        <div className="glass-card ai-comm-card">
          {/* Header with Title, Quick Language Pill, Audio and 3-Dot Settings Toggle */}
          <div style={styles.commHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div className="ai-comm-badge">
                <Sparkles size={13} />
                <span>{appLanguage === 'hi' ? 'एआई कमेंट्री' : 'AI Commentary'}</span>
              </div>

              {/* Quick Language Toggle Pill (English or Hindi) */}
              <button
                type="button"
                onClick={() => handleLangChange(selectedLang === 'en' ? 'hi' : 'en')}
                className="ai-lang-quick-btn"
                title={`Current: ${currentLangObj.name}. Click to switch to ${selectedLang === 'en' ? 'Hindi (हिंदी)' : 'English'}`}
              >
                <span>{currentLangObj.flag}</span>
                <span>{currentLangObj.label}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>({currentLangObj.name})</span>
                <span style={{ fontSize: '0.65rem', marginLeft: '2px', color: 'var(--emerald)' }}>⇄</span>
              </button>
            </div>

            {/* Master Audio Action Controls & 3-Dot Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Master Play/Stop Latest */}
              <button
                type="button"
                onClick={handleSpeakLatest}
                style={{
                  ...styles.ctrlBtn,
                  background: activeSpeakingBall ? 'rgba(239, 68, 68, 0.18)' : 'rgba(16, 185, 129, 0.15)',
                  borderColor: activeSpeakingBall ? 'var(--red-accent)' : 'var(--emerald)',
                  color: activeSpeakingBall ? '#fff' : 'var(--emerald)',
                }}
                title={activeSpeakingBall ? (appLanguage === 'hi' ? 'ऑडियो रोकें' : 'Stop voice playback') : (appLanguage === 'hi' ? 'लाइव हिंदी कमेंट्री सुनें' : `Listen in ${currentLangObj.name}`)}
              >
                {activeSpeakingBall ? (
                  <>
                    <div className="sound-equalizer">
                      <span className="eq-bar" />
                      <span className="eq-bar" />
                      <span className="eq-bar" />
                      <span className="eq-bar" />
                    </div>
                    <span>{getUIText('stop', appLanguage)}</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={15} />
                    <span>{getUIText('listenLive', appLanguage)} ({currentLangObj.code.toUpperCase()})</span>
                  </>
                )}
              </button>

              {/* 3-Dot Settings Toggle Button */}
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`ai-settings-toggle-btn ${showSettings ? 'active' : ''}`}
                title="Commentary & Voice Settings (Language, Pitch, Speed, Persona)"
              >
                <MoreVertical size={16} />
                {autoSpeak && <span className="ai-settings-active-dot" title="Auto-speak enabled" />}
              </button>
            </div>
          </div>

          {/* ─── Sleek 3-Dot Collapsible Settings Drawer ─── */}
          {showSettings && (
            <div className="ai-settings-panel">
              <div className="ai-settings-panel-header">
                <div className="ai-settings-panel-title">
                  <SlidersHorizontal size={15} />
                  <span>{getUIText('settingsTitle', appLanguage)}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowSettings(false)} 
                  className="ai-settings-close-btn"
                  title="Close settings"
                >
                  <X size={16} />
                </button>
              </div>

              {/* 1. Language Selection (Strictly English & Hindi) */}
              <div className="setting-section">
                <span className="setting-label">{getUIText('languageLabel', appLanguage)}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={`lang-pill-btn ${selectedLang === lang.code ? 'active' : ''}`}
                      style={{ justifyContent: 'center', padding: '8px 12px' }}
                    >
                      <span style={{ fontSize: '1.05rem' }}>{lang.flag}</span>
                      <span style={{ fontWeight: '700' }}>{lang.label}</span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>({lang.name})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Voice Pitch & Speed */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {/* Voice Speed */}
                <div className="setting-section">
                  <span className="setting-label">{getUIText('voiceSpeed', appLanguage)}</span>
                  <div className="segmented-control">
                    {[0.8, 1.0, 1.2, 1.5].map(speed => (
                      <button
                        type="button"
                        key={speed}
                        onClick={() => setSpeechRate(speed)}
                        className={`segment-item-btn ${speechRate === speed ? 'active' : ''}`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Pitch */}
                <div className="setting-section">
                  <span className="setting-label">{getUIText('voicePitch', appLanguage)}</span>
                  <div className="segmented-control">
                    {[
                      { val: 0.8, label: getUIText('deep', appLanguage) },
                      { val: 1.0, label: getUIText('normal', appLanguage) },
                      { val: 1.2, label: getUIText('high', appLanguage) }
                    ].map(pitch => (
                      <button
                        type="button"
                        key={pitch.val}
                        onClick={() => setSpeechPitch(pitch.val)}
                        className={`segment-item-btn ${speechPitch === pitch.val ? 'active' : ''}`}
                      >
                        {pitch.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Auto-Speak Live Balls Toggle */}
              <div className="toggle-switch-row">
                <div className="switch-label-group">
                  <span className="switch-main-text">{getUIText('autoSpeak', appLanguage)}</span>
                  <span className="switch-sub-text">
                    {appLanguage === 'hi' ? 'हर गेंद का हिंदी में लाइव वाचन करें' : 'Automatically announce each ball in English'}
                  </span>
                </div>
                <div 
                  onClick={handleToggleAutoSpeak}
                  className={`switch-ui ${autoSpeak ? 'on' : ''}`}
                  role="switch"
                  aria-checked={autoSpeak}
                  title="Toggle automatic speech on new balls"
                >
                  <span className="switch-knob" />
                </div>
              </div>

              {/* 4. Commentary Persona / Style */}
              <div className="setting-section">
                <span className="setting-label">{getUIText('commentaryStyle', appLanguage)}</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {COMMENTARY_PERSONAS.map(p => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handlePersonaChange(p.id)}
                      className={`persona-btn ${selectedPersona === p.id ? 'active' : ''}`}
                      title={p.desc}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. English Subtitles Toggle (Only shown when Hindi is selected) */}
              {selectedLang === 'hi' && (
                <div className="toggle-switch-row" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '8px' }}>
                  <div className="switch-label-group">
                    <span className="switch-main-text">{getUIText('englishSubtitles', appLanguage)}</span>
                    <span className="switch-sub-text">हिंदी के साथ मूल अंग्रेजी टेक्स्ट भी देखें</span>
                  </div>
                  <div 
                    onClick={() => setShowOriginalEnglish(!showOriginalEnglish)}
                    className={`switch-ui ${showOriginalEnglish ? 'on' : ''}`}
                    role="switch"
                    aria-checked={showOriginalEnglish}
                    title="Toggle English source subtitles"
                  >
                    <span className="switch-knob" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Tactical Over Pulse Box */}
          {aiOverSummary && (
            <div style={styles.aiInsightBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--teal)', fontWeight: '700', fontSize: '0.82rem' }}>
                <Sparkles size={14} />
                <span>{aiOverSummary.title}</span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.83rem', color: 'var(--text-primary)', lineHeight: '1.45' }}>
                {aiOverSummary.content}
              </p>
              <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--emerald)', fontStyle: 'italic' }}>
                {aiOverSummary.tip}
              </div>
            </div>
          )}

          {/* Ball-by-Ball Feed */}
          <div style={styles.commFeed}>
            {commentary.map((comm, idx) => {
              const regional = generateRegionalBallCommentary(comm, selectedLang, selectedPersona, match);
              const isSpeakingThis = activeSpeakingBall === comm.ball;
              const isWicket = regional.category === 'W';
              const isBoundary = regional.category === '4' || regional.category === '6';
              const isSix = regional.category === '6';

              return (
                <div 
                  key={`${comm.ball}-${idx}`} 
                  style={{
                    ...styles.commItem,
                    ...(isSpeakingThis ? styles.commItemSpeaking : {})
                  }}
                >
                  {/* Meta Row: Ball Number, Event Badge, Speech & Copy Actions */}
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
                        {comm.event || (isWicket ? (appLanguage === 'hi' ? 'विकेट' : 'Wicket') : isBoundary ? (isSix ? (appLanguage === 'hi' ? 'छक्का' : '6 runs') : (appLanguage === 'hi' ? 'चौका' : '4 runs')) : (appLanguage === 'hi' ? 'लाइव' : 'Live'))}
                      </span>
                    </div>

                    {/* Action buttons on each ball */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleSpeakBall(comm, regional)}
                        style={{
                          ...styles.miniActionBtn,
                          color: isSpeakingThis ? 'var(--emerald)' : 'var(--text-secondary)'
                        }}
                        title={isSpeakingThis ? (appLanguage === 'hi' ? 'रोकें' : 'Stop voice') : (appLanguage === 'hi' ? 'हिंदी में सुनें' : `Listen in ${currentLangObj.name}`)}
                      >
                        {isSpeakingThis ? (
                          <div className="sound-equalizer">
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                          </div>
                        ) : (
                          <Volume2 size={13} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyCommentary(regional.nativeText, comm.ball)}
                        style={styles.miniActionBtn}
                        title={appLanguage === 'hi' ? 'कमेंट्री क्लिपबोर्ड पर कॉपी करें' : 'Copy commentary to clipboard'}
                      >
                        {copiedBall === comm.ball ? (
                          <Check size={13} color="var(--emerald)" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Written Commentary: English or Hindi based on user selection */}
                  <div className="comm-native-text">
                    {regional.nativeText}
                  </div>

                  {/* Romanized Phonetics (Shown for Hindi to assist pronunciation) */}
                  {regional.phoneticText && selectedLang === 'hi' && (
                    <div className="comm-phonetic-text">
                      "{regional.phoneticText}"
                    </div>
                  )}

                  {/* Tactical AI Note */}
                  {regional.tacticalInsight && (
                    <div className="comm-tactical-note">
                      💡 {regional.tacticalInsight}
                    </div>
                  )}

                  {/* Optional English Source Display (Only if Hindi selected) */}
                  {showOriginalEnglish && comm.text && selectedLang === 'hi' && (
                    <div className="comm-original-text">
                      English source: {comm.text}
                    </div>
                  )}
                </div>
              );
            })}

            {commentary.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                {appLanguage === 'hi' ? 'लाइव बॉल कमेंट्री की प्रतीक्षा की जा रही है...' : 'Waiting for live ball commentary...'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pitch Map & Fielding Visual */}
      <div style={styles.rightCol}>
        <CricketField lastBall={match.lastBall} />
      </div>

    </div>
  );
}

const styles = {
  mainSplit: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1.25rem',
    alignItems: 'start',
    width: '100%',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minWidth: 0,
    width: '100%',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: 0,
    width: '100%',
  },
  gridSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    gap: '1rem',
    width: '100%',
  },
  card: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    overflowX: 'auto',
    maxWidth: '100%',
    boxSizing: 'border-box',
    WebkitOverflowScrolling: 'touch',
  },
  cardTitle: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    color: 'var(--emerald)',
    letterSpacing: '0.05em',
    fontWeight: '700',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '6px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  activeRow: {
    background: 'rgba(16, 185, 129, 0.04)',
  },
  playerLink: {
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  strikerDot: {
    color: 'var(--emerald)',
    fontWeight: '800',
  },
  textRight: {
    textAlign: 'right',
  },
  recentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '12px 1.25rem',
    flexWrap: 'wrap',
  },
  recentLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  ballsList: {
    display: 'flex',
    gap: '8px',
  },
  probCard: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  probLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barOuter: {
    height: '10px',
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
  },
  barInnerTeam1: {
    height: '100%',
    transition: 'width 0.5s ease-out',
  },
  barInnerTeam2: {
    height: '100%',
    transition: 'width 0.5s ease-out',
  },

  /* Commentary header & controls */
  commHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '10px',
  },
  ctrlBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  miniActionBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    padding: '3px 6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  aiInsightBox: {
    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(16, 185, 129, 0.04))',
    border: '1px solid rgba(20, 184, 166, 0.2)',
    borderRadius: '8px',
    padding: '10px 12px',
  },
  commFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '480px',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  commItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'all 0.2s ease',
  },
  commItemSpeaking: {
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid var(--emerald)',
    boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)',
  },
  commMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px',
  },
  commBall: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#fff',
    background: 'rgba(255,255,255,0.08)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  commEvent: {
    fontSize: '0.72rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
  },
  commWicket: {
    color: 'var(--red-accent)',
    fontWeight: '800',
  },
  commBoundary: {
    color: 'var(--teal)',
    fontWeight: '800',
  },
  commSix: {
    color: 'var(--emerald)',
    fontWeight: '800',
  },
};
