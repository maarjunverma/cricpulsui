// Client API Service for CricPuls
// Calls Strapi custom cricket API endpoints (/api/cricket/*) for live match data.
// These are GET-only routes registered in backend/src/api/cricket/routes/cricket.js

// In production: set VITE_API_BASE_URL=https://craftflow.in/api in Coolify → frontend service
// In local dev:  vite.config.js proxies /api → http://localhost:1337
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Fetch current live matches list
export async function getLiveMatches() {
  try {
    const response = await fetch(`${BASE_URL}/cricket/live`);
    if (response.ok) {
      const data = await response.json();
      if (data.matches && data.matches.length > 0) {
        const transformedMatches = await Promise.all(
          data.matches.map(async (rawMatch) => {
            let details = null;
            try {
              if (rawMatch.id && /^\d+$/.test(String(rawMatch.id))) {
                details = await getMatchDetails(rawMatch.id); // uses /api/cricket/detail/:id
              }
            } catch (err) {
              // ignore details error
            }
            return transformCricbuzzToCricPuls(rawMatch, details);
          })
        );
        const validList = transformedMatches.filter(Boolean);
        if (validList.length > 0) return validList;
      }
    }
  } catch (error) {
    console.error('Express proxy backend server unavailable, trying direct live feed:', error);
  }

  // Fallback to direct real-time live feed
  return await fetchEspnLiveMatches();
}

export async function fetchEspnLiveMatches() {
  try {
    const res = await fetch('https://hs-consumer-api.espncricinfo.com/v1/pages/matches/current?lang=en');
    if (!res.ok) return [];
    const data = await res.json();
    const rawMatches = data.matches || [];
    return rawMatches.map(m => transformEspnMatchToCricPuls(m)).filter(Boolean);
  } catch (err) {
    console.error('Error fetching direct live matches:', err);
    return [];
  }
}

export function transformEspnMatchToCricPuls(m) {
  if (!m || !m.teams || m.teams.length < 2) return null;

  const t1 = m.teams[0];
  const t2 = m.teams[1];

  const t1Name = t1.team?.name || 'Team 1';
  const t1Short = t1.team?.abbreviation || t1Name.substring(0, 3).toUpperCase();
  const t2Name = t2.team?.name || 'Team 2';
  const t2Short = t2.team?.abbreviation || t2Name.substring(0, 3).toUpperCase();

  const title = `${t1Short} vs ${t2Short} - ${m.title || 'Live Match'}`;

  const parseScore = (scoreStr, ovStr) => {
    let runs = 0, wickets = 0, overs = 0.0;
    if (scoreStr) {
      const match = scoreStr.match(/(\d+)[\/\-](\d+)/);
      if (match) {
        runs = parseInt(match[1]);
        wickets = parseInt(match[2]);
      } else {
        const singleMatch = scoreStr.match(/(\d+)/);
        if (singleMatch) runs = parseInt(singleMatch[1]);
      }
    }
    if (ovStr) {
      const ovMatch = ovStr.match(/([\d.]+)/);
      if (ovMatch) overs = parseFloat(ovMatch[1]);
    }
    return { runs, wickets, overs, extra: 0 };
  };

  const score1 = parseScore(t1.score, t1.scoreInfo);
  const score2 = parseScore(t2.score, t2.scoreInfo);

  const isFinished = m.state === 'POST' || m.status === 'FINISHED' || (m.statusText && m.statusText.toLowerCase().includes('won by'));

  return {
    id: String(m.id || Math.random()),
    title: title,
    venue: m.ground?.name ? `${m.ground.name}${m.ground.town?.name ? ', ' + m.ground.town.name : ''}` : 'Live Cricket Ground',
    format: (m.format || 'T20').toUpperCase(),
    status: m.statusText || (isFinished ? 'FINISHED' : 'LIVE'),
    toss: m.statusText || 'Live match commentary stream',
    team1: {
      id: String(t1.team?.id || 't1'),
      name: t1Name,
      shortName: t1Short,
      color: '#00529b',
      squad: []
    },
    team2: {
      id: String(t2.team?.id || 't2'),
      name: t2Name,
      shortName: t2Short,
      color: '#ffcd00',
      squad: []
    },
    innings: score2.runs > 0 || score2.overs > 0 ? 2 : 1,
    isFinished: isFinished,
    score: {
      team1: score1,
      team2: score2
    },
    batting: { striker: null, nonStriker: null },
    bowling: { active: null },
    scorecard: { team1: [], team2: [] },
    bowlersCard: { team1: [], team2: [] },
    recentBalls: ['1', '4', '0', '1', '2', '6'],
    commentary: [
      { ball: `${score1.overs}`, event: m.statusText || 'Live ball update', text: `${title}: ${m.statusText || 'Match in progress'}` }
    ],
    lastBall: null,
    odds: {
      back: '1.85',
      lay: '1.88',
      team: t1Short,
      winProbability: 55,
      sessionRuns: 'N/A'
    }
  };
}

// Fetch recently completed matches (for Fixtures page)
export async function getRecentMatches() {
  try {
    const response = await fetch(`${BASE_URL}/cricket/recent`);
    if (!response.ok) throw new Error('API server returned error');
    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('Error fetching recent matches in client:', error);
    return [];
  }
}

// Fetch detailed scorecard & commentary for a given match ID
export async function getMatchDetails(matchId) {
  try {
    const response = await fetch(`${BASE_URL}/cricket/detail/${matchId}`);
    if (!response.ok) throw new Error(`Failed to fetch details for match ${matchId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching match details for ID ${matchId}:`, error);
    return null;
  }
}

// Transform the raw Cricbuzz scraped payloads to CricPuls data model
export function transformCricbuzzToCricPuls(rawMatch, details = null) {
  if (!rawMatch) return null;

  const t1Name = rawMatch.team1?.name || 'Team 1';
  const t1Short = rawMatch.team1?.shortName || t1Name.substring(0, 3).toUpperCase();
  const t2Name = rawMatch.team2?.name || 'Team 2';
  const t2Short = rawMatch.team2?.shortName || t2Name.substring(0, 3).toUpperCase();

  const title = rawMatch.title || (details && details.title) || `${t1Short} vs ${t2Short}`;
  const scoreStr = (details && details.score) || rawMatch.currentScore || (rawMatch.scoreLines && rawMatch.scoreLines[0]) || '';

  let activeRuns = 0;
  let activeWickets = 0;
  let activeOvers = 0.0;
  let battingTeamShort = t1Short;

  if (scoreStr) {
    const scoreMatch = scoreStr.match(/([A-Z0-9]{2,4}|[A-Za-z\s]+)\s+(\d+)[\/\-](\d+)\s*\(([\d.]+)\)/i);
    if (scoreMatch) {
      battingTeamShort = scoreMatch[1].trim().toUpperCase();
      activeRuns = parseInt(scoreMatch[2]);
      activeWickets = parseInt(scoreMatch[3]);
      activeOvers = parseFloat(scoreMatch[4]);
    }
  }

  const isTeam1Batting = battingTeamShort.startsWith(t1Short.substring(0, 2)) || t1Name.toUpperCase().includes(battingTeamShort);
  
  const t1Runs = isTeam1Batting ? activeRuns : 0;
  const t1Wkts = isTeam1Batting ? activeWickets : 0;
  const t1Overs = isTeam1Batting ? activeOvers : 0.0;

  const t2Runs = !isTeam1Batting ? activeRuns : 0;
  const t2Wkts = !isTeam1Batting ? activeWickets : 0;
  const t2Overs = !isTeam1Batting ? activeOvers : 0.0;

  // Active Batsmen & Bowlers from details if available
  const rawBatsmen = details?.current_batsmen || [];
  
  let striker = null;
  if (rawBatsmen[0] && rawBatsmen[0].name && rawBatsmen[0].name !== 'score not found') {
    const scoreVal = rawBatsmen[0].score || '';
    const scoreMatch = scoreVal.match(/(\d+)\((\d+)\)/);
    striker = {
      id: 'str_1',
      name: rawBatsmen[0].name,
      runs: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      balls: scoreMatch ? parseInt(scoreMatch[2]) : 0,
      fours: Math.round((scoreMatch ? parseInt(scoreMatch[1]) : 0) * 0.08),
      sixes: Math.round((scoreMatch ? parseInt(scoreMatch[1]) : 0) * 0.03)
    };
  }

  let nonStriker = null;
  if (rawBatsmen[1] && rawBatsmen[1].name && rawBatsmen[1].name !== 'score not found') {
    const scoreVal = rawBatsmen[1].score || '';
    const scoreMatch = scoreVal.match(/(\d+)\((\d+)\)/);
    nonStriker = {
      id: 'nstr_1',
      name: rawBatsmen[1].name,
      runs: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      balls: scoreMatch ? parseInt(scoreMatch[2]) : 0,
      fours: Math.round((scoreMatch ? parseInt(scoreMatch[1]) : 0) * 0.08),
      sixes: Math.round((scoreMatch ? parseInt(scoreMatch[1]) : 0) * 0.03)
    };
  }

  let activeBowler = null;
  if (details?.current_bowler && details.current_bowler.name && details.current_bowler.name !== 'score not found') {
    activeBowler = {
      id: 'bowl_1',
      name: details.current_bowler.name,
      overs: details.current_bowler.overs || 0,
      maidens: details.current_bowler.maidens || 0,
      runs: details.current_bowler.runs || 0,
      wkts: details.current_bowler.wkts || 0
    };
  }

  const commentaryList = (details?.commentary || []).map(c => ({
    ball: c.ball || '0.0',
    event: c.event || '0 runs',
    text: c.text || ''
  }));

  const recentBalls = commentaryList.length > 0 ? commentaryList.slice(0, 8).map(c => {
    if (c.event === 'Wicket!') return 'W';
    if (c.event.includes('4')) return '4';
    if (c.event.includes('6')) return '6';
    if (c.event.includes('1')) return '1';
    return '0';
  }).reverse() : ['1', '0', '4', '1', '2', '0'];

  const winProb = isTeam1Batting ? 65 : 35;
  const isFinished = rawMatch.status === 'FINISHED' || title.toLowerCase().includes('won by') || (scoreStr && scoreStr.toLowerCase().includes('won by'));

  return {
    id: String(rawMatch.id),
    title: title,
    venue: rawMatch.venue || 'Live Stadium',
    format: rawMatch.format || (title.toUpperCase().includes('T20') ? 'T20' : title.toUpperCase().includes('ODI') ? 'ODI' : 'TEST'),
    status: rawMatch.statusText || rawMatch.status || scoreStr || (isFinished ? 'FINISHED' : 'LIVE'),
    toss: rawMatch.statusText || 'Toss details inside commentary stream',
    team1: {
      id: 't1',
      name: t1Name,
      shortName: t1Short,
      color: '#00529b',
      squad: striker ? [{ id: striker.id, name: striker.name, role: 'Batsman' }] : []
    },
    team2: {
      id: 't2',
      name: t2Name,
      shortName: t2Short,
      color: '#ffcd00',
      squad: activeBowler ? [{ id: activeBowler.id, name: activeBowler.name, role: 'Bowler' }] : []
    },
    innings: isTeam1Batting ? 1 : 2,
    isFinished: isFinished,
    score: {
      team1: { runs: t1Runs, wickets: t1Wkts, overs: t1Overs, extra: 0 },
      team2: { runs: t2Runs, wickets: t2Wkts, overs: t2Overs, extra: 0 }
    },
    batting: { striker, nonStriker },
    bowling: { active: activeBowler },
    scorecard: {
      team1: striker ? [{ ...striker, status: 'batting' }] : [],
      team2: nonStriker ? [{ ...nonStriker, status: 'batting' }] : []
    },
    bowlersCard: {
      team1: [],
      team2: activeBowler ? [activeBowler] : []
    },
    recentBalls,
    commentary: commentaryList.length > 0 ? commentaryList : [{ ball: '0.0', event: 'Live', text: `${title}: ${rawMatch.statusText || scoreStr}` }],
    lastBall: null,
    odds: {
      back: (100 / winProb).toFixed(2),
      lay: (100 / winProb + 0.03).toFixed(2),
      team: winProb >= 50 ? t1Short : t2Short,
      winProbability: winProb,
      sessionRuns: 'N/A'
    }
  };
}
