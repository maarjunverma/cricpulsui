// Client API Service for CricPuls
// Calls Strapi custom cricket API endpoints (/api/cricket/*) for live match data.
// These are GET-only routes registered in backend/src/api/cricket/routes/cricket.js

// In production: set VITE_API_BASE_URL=https://craftflow.in/api in Coolify → frontend service
// In local dev:  vite.config.js proxies /api → http://localhost:1337
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Fetch current live matches list
// Client fallback matches with full detail if server is unreachable
export const CLIENT_FALLBACK_MATCHES = [
  {
    id: '129469',
    title: 'IND VS ENG 2ND ODI INDIA TOUR OF ENGLAND 2026',
    slug: 'ind-vs-eng-2nd-odi-india-tour-of-england-2026',
    status: 'LIVE',
    statusText: 'IND 284/5 (46.2) - In Progress',
    team1: { name: 'India', shortName: 'IND', color: '#00529b', squad: [] },
    team2: { name: 'England', shortName: 'ENG', color: '#d41130', squad: [] },
    venue: "Lord's Cricket Ground, London",
    format: 'ODI',
    scoreLines: ['IND 284/5 (46.2)'],
    currentScore: 'IND 284/5 (46.2)',
  },
  {
    id: '152460',
    title: 'WI VS NZ 3RD ODI NEW ZEALAND TOUR OF WEST INDIES 2026',
    slug: 'wi-vs-nz-3rd-odi-new-zealand-tour-of-west-indies-2026',
    status: 'LIVE',
    statusText: 'WI 212/4 (42.4) - WI need 31 runs in 44 balls',
    team1: { name: 'New Zealand', shortName: 'NZ', color: '#111827', squad: [] },
    team2: { name: 'West Indies', shortName: 'WI', color: '#7c1d2d', squad: [] },
    venue: 'Kensington Oval, Bridgetown',
    format: 'ODI',
    scoreLines: ['NZ 242/8 (50.0)', 'WI 212/4 (42.4)'],
    currentScore: 'WI 212/4 (42.4)',
  },
  {
    id: '150942',
    title: 'SFU VS WAF CHALLENGER MAJOR LEAGUE CRICKET 2026',
    slug: 'sfu-vs-waf-challenger-loser-of-q-v-winner-of-e-major-league-cricket-2026',
    status: 'LIVE',
    statusText: 'SFU 174/4 (17.5) - In Progress',
    team1: { name: 'San Francisco Unicorns', shortName: 'SFU', color: '#0ea5e9', squad: [] },
    team2: { name: 'Washington Freedom', shortName: 'WAF', color: '#dc2626', squad: [] },
    venue: 'Grand Prairie Stadium, Dallas',
    format: 'T20',
    scoreLines: ['SFU 174/4 (17.5)'],
    currentScore: 'SFU 174/4 (17.5)',
  },
  {
    id: '158062',
    title: 'ZIM VS BAN 2ND T20I BANGLADESH TOUR OF ZIMBABWE 2026',
    slug: 'zim-vs-ban-2nd-t20i-bangladesh-tour-of-zimbabwe-2026',
    status: 'LIVE',
    statusText: 'BAN 142/5 (16.4) - BAN trail by 34 runs',
    team1: { name: 'Zimbabwe', shortName: 'ZIM', color: '#dc2626', squad: [] },
    team2: { name: 'Bangladesh', shortName: 'BAN', color: '#15803d', squad: [] },
    venue: 'Harare Sports Club, Harare',
    format: 'T20',
    scoreLines: ['ZIM 175/7 (20.0)', 'BAN 142/5 (16.4)'],
    currentScore: 'BAN 142/5 (16.4)',
  },
  {
    id: '156948',
    title: 'JKS VS GAM 1ST MATCH LPL 2026',
    slug: 'jks-vs-gam-1st-match-lpl-2026',
    status: 'LIVE',
    statusText: 'GAM 86/2 (9.4) - Target 193',
    team1: { name: 'Jaffna Kings', shortName: 'JKS', color: '#2563eb', squad: [] },
    team2: { name: 'Galle Marvels', shortName: 'GAM', color: '#f59e0b', squad: [] },
    venue: 'R. Premadasa Stadium, Colombo',
    format: 'T20',
    scoreLines: ['JKS 192/6 (20.0)', 'GAM 86/2 (9.4)'],
    currentScore: 'GAM 86/2 (9.4)',
  },
];

// Fetch current live matches list via unified /api/cricket/proxy
export async function getLiveMatches() {
  try {
    let response = await fetch(`${BASE_URL}/cricket/proxy?type=live`);
    if (!response.ok) {
      try {
        response = await fetch('http://localhost:5000/api/cricket/proxy?type=live');
      } catch (_) {}
    }
    if (response && response.ok) {
      const data = await response.json();
      if (data.matches && data.matches.length > 0) {
        // Direct transform — does NOT waste RapidAPI credits fetching scorecards in a loop
        const transformedMatches = data.matches
          .map((rawMatch) => transformCricbuzzToCricPuls(rawMatch, null))
          .filter(Boolean);
        if (transformedMatches.length > 0) return transformedMatches;
      }
    }
  } catch (error) {
    console.warn('Backend proxy request error, using test live stream:', error);
  }

  // Fallback to client test feed transformed into CricPuls data model
  return CLIENT_FALLBACK_MATCHES.map((m) => transformCricbuzzToCricPuls(m, null));
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
    winProbability: 55,
    projectedWinner: t1Short
  };
}

export const CLIENT_FALLBACK_FINISHED = [
  {
    id: '150920',
    title: 'LAKR VS SFU QUALIFIER 1V2 MAJOR LEAGUE CRICKET 2026',
    venue: 'Church Street Park, Morrisville',
    format: 'T20',
    status: 'FINISHED',
    category: 'finished',
    date: 'July 22, 2026',
    time: 'Finished',
    team1: { name: 'LA Knight Riders', shortName: 'LAKR', color: '#552583' },
    team2: { name: 'SF Unicorns', shortName: 'SFU', color: '#0ea5e9' },
    result: 'LAKR won by 18 runs',
    score: {
      team1: { runs: 185, wickets: 5, overs: 20.0 },
      team2: { runs: 167, wickets: 9, overs: 20.0 },
    },
    isFinished: true,
  },
  {
    id: '157670',
    title: 'SRW VS TBW SEMI FINAL 1 WOMENS T20 BLAST 2026',
    venue: 'New Road, Worcester',
    format: 'T20',
    status: 'FINISHED',
    category: 'finished',
    date: 'July 21, 2026',
    time: 'Finished',
    team1: { name: 'The Blaze', shortName: 'TBW', color: '#ea580c' },
    team2: { name: 'South East Stars', shortName: 'SRW', color: '#4338ca' },
    result: 'SRW won by 6 wickets',
    score: {
      team1: { runs: 138, wickets: 8, overs: 20.0 },
      team2: { runs: 142, wickets: 4, overs: 18.2 },
    },
    isFinished: true,
  },
  {
    id: '157110',
    title: 'IND VS ENG 1ST ODI INDIA TOUR OF ENGLAND 2026',
    venue: 'The Oval, London',
    format: 'ODI',
    status: 'FINISHED',
    category: 'finished',
    date: 'July 19, 2026',
    time: 'Finished',
    team1: { name: 'England', shortName: 'ENG', color: '#d41130' },
    team2: { name: 'India', shortName: 'IND', color: '#00529b' },
    result: 'India won by 4 wickets',
    score: {
      team1: { runs: 278, wickets: 9, overs: 50.0 },
      team2: { runs: 282, wickets: 6, overs: 48.2 },
    },
    isFinished: true,
  },
  {
    id: '158140',
    title: 'AUS VS WI 2ND T20I AUSTRALIA TOUR OF WEST INDIES 2026',
    venue: 'Sabina Park, Kingston',
    format: 'T20',
    status: 'FINISHED',
    category: 'finished',
    date: 'July 18, 2026',
    time: 'Finished',
    team1: { name: 'Australia', shortName: 'AUS', color: '#ffcd00' },
    team2: { name: 'West Indies', shortName: 'WI', color: '#7c1d2d' },
    result: 'Australia won by 34 runs',
    score: {
      team1: { runs: 196, wickets: 5, overs: 20.0 },
      team2: { runs: 162, wickets: 9, overs: 20.0 },
    },
    isFinished: true,
  },
];

export const CLIENT_FALLBACK_UPCOMING = [
  {
    id: '150931',
    title: 'MINY VS WAF ELIMINATOR 3V4 MAJOR LEAGUE CRICKET 2026',
    venue: 'Grand Prairie Stadium, Dallas',
    format: 'T20',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'July 24, 2026',
    time: '20:00 IST',
    countdown: 'Tonight',
    team1: { name: 'MI New York', shortName: 'MINY', color: '#004ba0' },
    team2: { name: 'Washington Freedom', shortName: 'WAF', color: '#dc2626' },
    isFinished: false,
  },
  {
    id: '157686',
    title: 'The Ashes 2026 - 1st Test',
    venue: "Lord's Cricket Ground, London",
    format: 'TEST',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'July 25, 2026',
    time: '15:30 IST',
    countdown: 'Tomorrow',
    team1: { name: 'England', shortName: 'ENG', color: '#d41130' },
    team2: { name: 'Australia', shortName: 'AUS', color: '#ffcd00' },
    isFinished: false,
  },
  {
    id: '158220',
    title: 'India vs South Africa - 1st T20I',
    venue: 'Wankhede Stadium, Mumbai',
    format: 'T20',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'July 28, 2026',
    time: '19:00 IST',
    countdown: 'In 3 Days',
    team1: { name: 'India', shortName: 'IND', color: '#00529b' },
    team2: { name: 'South Africa', shortName: 'SA', color: '#007a4d' },
    isFinished: false,
  },
  {
    id: '158330',
    title: 'Pakistan vs Australia - 2nd ODI',
    venue: 'Gaddafi Stadium, Lahore',
    format: 'ODI',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'July 30, 2026',
    time: '14:30 IST',
    countdown: 'In 5 Days',
    team1: { name: 'Pakistan', shortName: 'PAK', color: '#006629' },
    team2: { name: 'Australia', shortName: 'AUS', color: '#ffcd00' },
    isFinished: false,
  },
  {
    id: '158410',
    title: 'New Zealand vs Sri Lanka - 1st T20I',
    venue: 'Eden Park, Auckland',
    format: 'T20',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'Aug 02, 2026',
    time: '12:30 IST',
    countdown: 'In 1 Week',
    team1: { name: 'New Zealand', shortName: 'NZ', color: '#111827' },
    team2: { name: 'Sri Lanka', shortName: 'SL', color: '#1e3a8a' },
    isFinished: false,
  },
  {
    id: '158520',
    title: 'MI vs CSK - IPL 2026 Clásico',
    venue: 'Wankhede Stadium, Mumbai',
    format: 'T20',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'Aug 05, 2026',
    time: '19:30 IST',
    countdown: 'In 10 Days',
    team1: { name: 'Mumbai Indians', shortName: 'MI', color: '#004ba0' },
    team2: { name: 'Chennai Super Kings', shortName: 'CSK', color: '#facc15' },
    isFinished: false,
  },
  {
    id: '158630',
    title: 'KKR vs RCB - IPL 2026',
    venue: 'Eden Gardens, Kolkata',
    format: 'T20',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'Aug 08, 2026',
    time: '19:30 IST',
    countdown: 'In 2 Weeks',
    team1: { name: 'Kolkata Knight Riders', shortName: 'KKR', color: '#3b0764' },
    team2: { name: 'Royal Challengers Bengaluru', shortName: 'RCB', color: '#dc2626' },
    isFinished: false,
  },
  {
    id: '158740',
    title: 'Surrey vs Hampshire - County Championship',
    venue: 'The Oval, London',
    format: 'TEST',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'Aug 12, 2026',
    time: '15:30 IST',
    countdown: 'In 2 Weeks',
    team1: { name: 'Surrey', shortName: 'SUR', color: '#854d0e' },
    team2: { name: 'Hampshire', shortName: 'HAM', color: '#1e40af' },
    isFinished: false,
  },
  {
    id: '158850',
    title: 'Lancashire vs Yorkshire - Roses Match',
    venue: 'Emirates Old Trafford, Manchester',
    format: 'TEST',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'Aug 16, 2026',
    time: '15:30 IST',
    countdown: 'In 3 Weeks',
    team1: { name: 'Lancashire', shortName: 'LANCS', color: '#dc2626' },
    team2: { name: 'Yorkshire', shortName: 'YORKS', color: '#38bdf8' },
    isFinished: false,
  },
  {
    id: '158960',
    title: 'Guyana vs Trinbago - CPL 2026',
    venue: 'Providence Stadium, Guyana',
    format: 'T20',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'Aug 20, 2026',
    time: '04:30 IST',
    countdown: 'In 3 Weeks',
    team1: { name: 'Guyana Warriors', shortName: 'GAW', color: '#16a34a' },
    team2: { name: 'Trinbago Knight Riders', shortName: 'TKR', color: '#991b1b' },
    isFinished: false,
  },
  {
    id: '159070',
    title: 'Hobart Hurricanes vs Perth Scorchers',
    venue: 'Blundstone Arena, Hobart',
    format: 'T20',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'Aug 24, 2026',
    time: '13:45 IST',
    countdown: 'In 1 Month',
    team1: { name: 'Hobart Hurricanes', shortName: 'HBH', color: '#7c3aed' },
    team2: { name: 'Perth Scorchers', shortName: 'PRS', color: '#ea580c' },
    isFinished: false,
  },
  {
    id: '159180',
    title: 'England vs Pakistan - 3rd Test',
    venue: 'Edgbaston, Birmingham',
    format: 'TEST',
    status: 'UPCOMING',
    category: 'upcoming',
    date: 'Aug 28, 2026',
    time: '15:30 IST',
    countdown: 'In 1 Month',
    team1: { name: 'England', shortName: 'ENG', color: '#d41130' },
    team2: { name: 'Pakistan', shortName: 'PAK', color: '#006629' },
    isFinished: false,
  },
];

export const CLIENT_FALLBACK_FIXTURES = [
  ...CLIENT_FALLBACK_UPCOMING,
  ...CLIENT_FALLBACK_FINISHED,
];

// Fetch recently completed matches (Finished) via proxy
export async function getRecentMatches() {
  try {
    let response = await fetch(`${BASE_URL}/cricket/proxy?type=finished`);
    if (!response.ok) {
      try {
        response = await fetch('http://localhost:5000/api/cricket/proxy?type=finished');
      } catch (_) {}
    }
    if (response && response.ok) {
      const data = await response.json();
      if (data.matches && data.matches.length > 0) return data.matches;
    }
  } catch (error) {
    console.error('Error fetching recent matches in client:', error);
  }

  return CLIENT_FALLBACK_FINISHED;
}

// Fetch scheduled upcoming matches (Upcoming) via proxy
export async function getUpcomingMatches() {
  try {
    let response = await fetch(`${BASE_URL}/cricket/proxy?type=scheduled`);
    if (!response.ok) {
      try {
        response = await fetch('http://localhost:5000/api/cricket/proxy?type=scheduled');
      } catch (_) {}
    }
    if (response && response.ok) {
      const data = await response.json();
      if (data.matches && data.matches.length > 0) return data.matches;
    }
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
  }

  return CLIENT_FALLBACK_UPCOMING;
}

// Fetch all fixtures (both upcoming and finished) via proxy
export async function getFixtures() {
  try {
    let response = await fetch(`${BASE_URL}/cricket/proxy?type=fixtures`);
    if (!response.ok) {
      try {
        response = await fetch('http://localhost:5000/api/cricket/proxy?type=fixtures');
      } catch (_) {}
    }
    if (response && response.ok) {
      const data = await response.json();
      if (data.matches && data.matches.length > 0) return data.matches;
    }
  } catch (error) {
    console.error('Error fetching fixtures:', error);
  }

  const [upcoming, recent] = await Promise.all([getUpcomingMatches(), getRecentMatches()]);
  return [...upcoming, ...recent];
}

// Fetch detailed scorecard & commentary for a given match ID via proxy
export async function getMatchDetails(matchId) {
  try {
    let response = await fetch(`${BASE_URL}/cricket/proxy?type=scorecard&id=${matchId}`);
    if (!response.ok) {
      try {
        response = await fetch(`http://localhost:5000/api/cricket/proxy?type=scorecard&id=${matchId}`);
      } catch (_) {}
    }
    if (response && response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(`Error fetching match details for ID ${matchId}:`, error);
  }
  return null;
}

// Fetch Redis budget & quota status
export async function getBudgetStatus() {
  try {
    let response = await fetch(`${BASE_URL}/cricket/proxy?type=status`);
    if (!response.ok) {
      try {
        response = await fetch('http://localhost:5000/api/cricket/proxy?type=status');
      } catch (_) {}
    }
    if (response && response.ok) {
      return await response.json();
    }
  } catch (_) {}
  return null;
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

  // Full scorecard mapping from RapidAPI hscard data
  let team1Scorecard = striker ? [{ ...striker, status: 'batting' }] : [];
  let team2Scorecard = nonStriker ? [{ ...nonStriker, status: 'batting' }] : [];
  let team1BowlersCard = [];
  let team2BowlersCard = activeBowler ? [activeBowler] : [];

  let score1 = { runs: t1Runs, wickets: t1Wkts, overs: t1Overs, extra: { total: 0, wides: 0, noballs: 0, legbyes: 0, byes: 0 } };
  let score2 = { runs: t2Runs, wickets: t2Wkts, overs: t2Overs, extra: { total: 0, wides: 0, noballs: 0, legbyes: 0, byes: 0 } };

  let fow1 = [];
  let fow2 = [];
  let partnerships1 = [];
  let partnerships2 = [];

  const rawScorecard = details?.scorecard || details?.scoreCard || [];
  if (Array.isArray(rawScorecard) && rawScorecard.length > 0) {
    rawScorecard.forEach((inngs, idx) => {
      const batShort = (inngs.batteamsname || inngs.batteamname || '').toUpperCase();
      const isTeam1 = batShort ? (batShort.includes(t1Short) || t1Short.includes(batShort)) : (inngs.inningsid === 1 || idx === 0);

      const mappedBatsmen = (inngs.batsman || []).map((b) => ({
        id: String(b.id || Math.random()),
        name: b.name || b.nickname || 'Unknown',
        status: b.outdec || (b.balls > 0 ? 'Not out' : 'yet to bat'),
        runs: b.runs ?? 0,
        balls: b.balls ?? 0,
        fours: b.fours ?? 0,
        sixes: b.sixes ?? 0,
        strkrate: b.strkrate || (b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0'),
        iscaptain: b.iscaptain || false,
        iskeeper: b.iskeeper || false,
      }));

      const mappedBowlers = (inngs.bowler || []).map((bw) => ({
        id: String(bw.id || Math.random()),
        name: bw.name || bw.nickname || 'Unknown',
        overs: typeof bw.overs === 'string' ? parseFloat(bw.overs) : (bw.overs ?? 0),
        maidens: bw.maidens ?? 0,
        runs: bw.runs ?? 0,
        wkts: bw.wickets ?? bw.wkts ?? 0,
        economy: bw.economy || (bw.overs > 0 ? (bw.runs / parseFloat(bw.overs)).toFixed(2) : '0.00'),
        dots: bw.dots ?? 0,
      }));

      const inngsScore = {
        runs: inngs.score ?? 0,
        wickets: inngs.wickets ?? 0,
        overs: typeof inngs.overs === 'string' ? parseFloat(inngs.overs) : (inngs.overs ?? 0),
        runrate: inngs.runrate || 0,
        extra: typeof inngs.extras === 'object' ? inngs.extras : { total: inngs.extras || 0 }
      };

      const inngsFow = (inngs.fow?.fow || []).map(f => ({
        id: String(f.batsmanid || Math.random()),
        name: f.batsmanname || 'Batsman',
        runs: f.runs ?? 0,
        over: f.overnbr ?? f.ballnbr ?? 0,
      }));

      const inngsPartnership = (inngs.partnership?.partnership || []).map(p => ({
        id: String(p.id || Math.random()),
        bat1name: p.bat1name,
        bat1runs: p.bat1runs,
        bat2name: p.bat2name,
        bat2runs: p.bat2runs,
        totalruns: p.totalruns,
        totalballs: p.totalballs,
      }));

      if (isTeam1) {
        team1Scorecard = mappedBatsmen;
        team2BowlersCard = mappedBowlers; // Team 2 bowled in Innings 1
        score1 = inngsScore;
        fow1 = inngsFow;
        partnerships1 = inngsPartnership;
      } else {
        team2Scorecard = mappedBatsmen;
        team1BowlersCard = mappedBowlers; // Team 1 bowled in Innings 2
        score2 = inngsScore;
        fow2 = inngsFow;
        partnerships2 = inngsPartnership;
      }
    });
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
  const matchStatus = details?.status || rawMatch.statusText || rawMatch.status || scoreStr;
  const isFinished = details?.ismatchcomplete || rawMatch.status === 'FINISHED' || title.toLowerCase().includes('won by') || (matchStatus && matchStatus.toLowerCase().includes('won by'));

  return {
    id: String(rawMatch.id),
    title: title,
    venue: rawMatch.venue || 'Live Stadium',
    format: rawMatch.format || (title.toUpperCase().includes('T20') ? 'T20' : title.toUpperCase().includes('ODI') ? 'ODI' : 'TEST'),
    status: matchStatus || (isFinished ? 'FINISHED' : 'LIVE'),
    category: isFinished ? 'finished' : (rawMatch.category || (rawMatch.status === 'UPCOMING' ? 'upcoming' : 'live')),
    toss: matchStatus || 'Toss details inside commentary stream',
    team1: {
      id: 't1',
      name: t1Name,
      shortName: t1Short,
      color: '#00529b',
      squad: team1Scorecard.map(b => ({ id: b.id, name: b.name, role: 'Player' }))
    },
    team2: {
      id: 't2',
      name: t2Name,
      shortName: t2Short,
      color: '#ffcd00',
      squad: team2Scorecard.map(b => ({ id: b.id, name: b.name, role: 'Player' }))
    },
    innings: (rawScorecard.length >= 2 || !isTeam1Batting) ? 2 : 1,
    isFinished: isFinished,
    score: {
      team1: score1,
      team2: score2
    },
    batting: { striker, nonStriker },
    bowling: { active: activeBowler },
    scorecard: {
      team1: team1Scorecard,
      team2: team2Scorecard
    },
    bowlersCard: {
      team1: team1BowlersCard,
      team2: team2BowlersCard
    },
    fow: {
      team1: fow1,
      team2: fow2
    },
    partnerships: {
      team1: partnerships1,
      team2: partnerships2
    },
    recentBalls,
    commentary: commentaryList.length > 0 ? commentaryList : [{ ball: '0.0', event: 'Live', text: `${title}: ${matchStatus || scoreStr}` }],
    lastBall: null,
    winProbability: winProb,
    projectedWinner: winProb >= 50 ? t1Short : t2Short
  };
}
