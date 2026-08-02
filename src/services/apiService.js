// Client API Service for CricPuls
// Queries the Express proxy scraper server and transforms live match JSON feeds

// Production API endpoint for CricPuls realtime data
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://craftflow.in/api';

// Fetch current live matches list
export async function getLiveMatches() {
  try {
    const response = await fetch(`${BASE_URL}/matches/live`);
    if (!response.ok) throw new Error('API server returned error');
    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('Error fetching live matches in client:', error);
    return [];
  }
}

// Fetch recently completed matches (for Fixtures page)
export async function getRecentMatches() {
  try {
    const response = await fetch(`${BASE_URL}/matches/recent`);
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
    const response = await fetch(`${BASE_URL}/matches/detail/${matchId}`);
    if (!response.ok) throw new Error(`Failed to fetch details for match ${matchId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching match details for ID ${matchId}:`, error);
    return null;
  }
}

// Transform the raw Cricbuzz scraped payloads to CricPuls data model
export function transformCricbuzzToCricPuls(rawMatch, details) {
  if (!details) return null;

  // Resolve team info from title: e.g. "India vs Australia, 1st T20I"
  const title = details.title || rawMatch.title || 'Live Match';
  let team1Name = 'Team 1';
  let team2Name = 'Team 2';

  const vsIndex = title.indexOf(' vs ');
  if (vsIndex !== -1) {
    const parts = title.split(' vs ');
    team1Name = parts[0].trim();
    // Team 2 is everything before the comma or details in second part
    const commaIndex = parts[1].indexOf(',');
    team2Name = commaIndex !== -1 ? parts[1].substring(0, commaIndex).trim() : parts[1].trim();
  }

  const team1Short = team1Name.substring(0, 3).toUpperCase();
  const team2Short = team2Name.substring(0, 3).toUpperCase();

  // Parse scores from score string: e.g. "IND 176/4 (18.2)" or "RSA 90-3 (12.4)"
  const scoreStr = details.score || '';
  let activeRuns = 0;
  let activeWickets = 0;
  let activeOvers = 0.0;
  let battingTeamShort = team1Short;

  const scoreMatch = scoreStr.match(/([A-Z0-9]{2,4}|[A-Za-z\s]+)\s+(\d+)[\/\-](\d+)\s*\(([\d.]+)\)/i);
  if (scoreMatch) {
    battingTeamShort = scoreMatch[1].trim().toUpperCase();
    activeRuns = parseInt(scoreMatch[2]);
    activeWickets = parseInt(scoreMatch[3]);
    activeOvers = parseFloat(scoreMatch[4]);
  }

  const isTeam1Batting = battingTeamShort.startsWith(team1Short.substring(0, 2)) || team1Name.toUpperCase().includes(battingTeamShort);
  
  const t1Runs = isTeam1Batting ? activeRuns : 0;
  const t1Wkts = isTeam1Batting ? activeWickets : 0;
  const t1Overs = isTeam1Batting ? activeOvers : 0.0;

  const t2Runs = !isTeam1Batting ? activeRuns : 0;
  const t2Wkts = !isTeam1Batting ? activeWickets : 0;
  const t2Overs = !isTeam1Batting ? activeOvers : 0.0;

  // Active Batsmen & Bowlers from details
  const rawBatsmen = details.current_batsmen || [];
  
  let striker = null;
  if (rawBatsmen[0] && rawBatsmen[0].name && rawBatsmen[0].name !== 'score not found') {
    const scoreVal = rawBatsmen[0].score || '';
    const scoreMatch = scoreVal.match(/(\d+)\((\d+)\)/);
    striker = {
      id: 'str_1',
      name: rawBatsmen[0].name,
      runs: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      balls: scoreMatch ? parseInt(scoreMatch[2]) : 0,
      fours: Math.round((scoreMatch ? parseInt(scoreMatch[1]) : 0) * 0.08), // estimate
      sixes: Math.round((scoreMatch ? parseInt(scoreMatch[1]) : 0) * 0.03) // estimate
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
      fours: Math.round((scoreMatch ? parseInt(scoreMatch[1]) : 0) * 0.08), // estimate
      sixes: Math.round((scoreMatch ? parseInt(scoreMatch[1]) : 0) * 0.03) // estimate
    };
  }

  let activeBowler = null;
  if (details.current_bowler && details.current_bowler.name && details.current_bowler.name !== 'score not found') {
    activeBowler = {
      id: 'bowl_1',
      name: details.current_bowler.name,
      overs: 2.0, // fallback
      maidens: 0,
      runs: 15,
      wkts: activeWickets // fallback
    };
  }

  // Parse commentary
  const commentaryList = (details.commentary || []).map(c => ({
    ball: c.ball || '0.0',
    event: c.event || '0 runs',
    text: c.text || ''
  }));

  // Match event recent balls
  const recentBalls = commentaryList.slice(0, 8).map(c => {
    if (c.event === 'Wicket!') return 'W';
    if (c.event.includes('4')) return '4';
    if (c.event.includes('6')) return '6';
    if (c.event.includes('1')) return '1';
    return '0';
  }).reverse();

  // Win probability
  const winProb = isTeam1Batting ? 65 : 35;

  let lastBall = null;
  if (commentaryList.length > 0) {
    const latestComm = commentaryList[0];
    const text = latestComm.text.toLowerCase();
    
    let shotDirection = 'Straight Drive / Long-on';
    let shotAngle = 340;
    if (text.includes('cover') || text.includes('drive')) {
      shotDirection = 'Cover Drive / Covers';
      shotAngle = 60;
    } else if (text.includes('point') || text.includes('cut')) {
      shotDirection = 'Square Cut / Point';
      shotAngle = 90;
    } else if (text.includes('pull') || text.includes('hook')) {
      shotDirection = 'Pull Shot / Square Leg';
      shotAngle = 270;
    } else if (text.includes('mid-wicket') || text.includes('flick')) {
      shotDirection = 'Flick / Mid-wicket';
      shotAngle = 300;
    }

    lastBall = {
      event: latestComm.event === 'Wicket!' ? 'W' : latestComm.event.includes('4') ? '4' : latestComm.event.includes('6') ? '6' : '1',
      striker: striker?.name || 'Batsman',
      bowler: activeBowler?.name || 'Bowler',
      runs: latestComm.event.includes('4') ? 4 : latestComm.event.includes('6') ? 6 : latestComm.event.includes('1') ? 1 : 0,
      wicket: latestComm.event === 'Wicket!' ? 1 : 0,
      ballValid: true,
      pitchType: 'Good Length',
      shotDirection,
      shotAngle,
      distance: latestComm.event.includes('6') ? 88 : latestComm.event.includes('4') ? 65 : 12
    };
  }

  // Create clean squad mock lists
  const team1Squad = striker ? [{ id: striker.id, name: striker.name, role: 'Batsman' }] : [];
  if (nonStriker) team1Squad.push({ id: nonStriker.id, name: nonStriker.name, role: 'Batsman' });
  const team2Squad = activeBowler ? [{ id: activeBowler.id, name: activeBowler.name, role: 'Bowler' }] : [];

  return {
    id: rawMatch.id,
    title: title,
    venue: 'Live Arena Stadium',
    format: title.toUpperCase().includes('T20') ? 'T20' : title.toUpperCase().includes('ODI') ? 'ODI' : 'TEST',
    status: details.score || 'LIVE',
    toss: 'Toss details inside commentary stream',
    team1: {
      id: 't1',
      name: team1Name,
      shortName: team1Short,
      color: '#00529b',
      squad: team1Squad
    },
    team2: {
      id: 't2',
      name: team2Name,
      shortName: team2Short,
      color: '#ffcd00',
      squad: team2Squad
    },
    innings: isTeam1Batting ? 1 : 2,
    isFinished: title.toLowerCase().includes('won by') || details.score.toLowerCase().includes('won by'),
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
    commentary: commentaryList,
    lastBall,
    odds: {
      back: (100 / winProb).toFixed(2),
      lay: (100 / winProb + 0.03).toFixed(2),
      team: winProb >= 50 ? team1Short : team2Short,
      winProbability: winProb,
      sessionRuns: 'N/A'
    }
  };
}
