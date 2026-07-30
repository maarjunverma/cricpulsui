// Cricket Match Simulation Engine

const EVENT_WEIGHTS = [
  { event: '0', weight: 35 },
  { event: '1', weight: 35 },
  { event: '2', weight: 8 },
  { event: '3', weight: 1 },
  { event: '4', weight: 10 },
  { event: '6', weight: 5 },
  { event: 'W', weight: 3.5 },
  { event: 'Wd', weight: 1.5 },
  { event: 'Nb', weight: 1.0 }
];

// Flat list to pick a random event easily based on weights
const EVENT_POOL = [];
EVENT_WEIGHTS.forEach(({ event, weight }) => {
  for (let i = 0; i < weight * 10; i++) {
    EVENT_POOL.push(event);
  }
});

const COMMENTARY_TEMPLATES = {
  '0': [
    "{bowler} pitches it short. {batsman} defends it back to the bowler.",
    "Good length ball outside off, {batsman} leaves it alone.",
    "Slow yorker from {bowler}, {batsman} digs it out to mid-on.",
    "Dot ball. {batsman} tries to push it through covers but finds the fielder.",
    "Beaten! Good pace from {bowler}, whizzing past {batsman}'s outside edge."
  ],
  '1': [
    "{batsman} drives it down to long-on for a single.",
    "{batsman} nudges this length delivery to deep square leg for a single.",
    "Edged but safe, rolls down to third man. Single taken by {batsman}.",
    "Easy single. {batsman} taps it to point and runs quickly.",
    "{bowler} bowls it on the pads, {batsman} tucks it to fine leg for one."
  ],
  '2': [
    "{batsman} plays a beautiful flick through mid-wicket and hustles back for two.",
    "Cut away past point. {batsman} pushes hard and completes the double.",
    "In the gap! Swept away towards deep square leg. Two runs secured by {batsman}.",
    "Lofted over mid-off, doesn't quite time it but it falls in no-man's land. They run two.",
    "Excellent running! A soft push to cover, they call early and run two easily."
  ],
  '3': [
    "Terrific shot! Timed well through the covers, the fielder chases it down near the boundary, allowing {batsman} to run three.",
    "Slashed away! Off the backfoot through point. Excellent boundary riding saves one run. Three runs."
  ],
  '4': [
    "FOUR! Magnificent shot! {batsman} leans into a cover drive and hits it right through the gap.",
    "FOUR! Short and punished! {batsman} pulls it powerfully over mid-wicket for a boundary.",
    "FOUR! Edged and past slip! Runs away to the third man boundary.",
    "FOUR! Classic glance down the leg side. {batsman} just tickles it to the fine leg fence.",
    "FOUR! Smashed! {batsman} clears his front leg and hits it straight past the bowler."
  ],
  '6': [
    "SIX! Outstanding hit! {batsman} steps down the track and launches {bowler} high over long-on for a massive six!",
    "SIX! Picked up and deposited! Slog sweeps this off-spinner way back into the stands.",
    "SIX! What a strike! A short ball from {bowler}, {batsman} pulls it hook-shot style over fine leg for a maximum!",
    "SIX! Pure timing! {batsman} lofts it straight back over the bowler's head. Clean as a whistle!",
    "SIX! Helicopter shot! Smashed over deep mid-wicket. The crowd is going wild!"
  ],
  'W': [
    "OUT! Clean bowled! {bowler} bowls a ripping yorker, straight through {batsman}'s defense and rattles the stumps!",
    "OUT! Caught! {batsman} tries to go big over long-off, but doesn't get the distance. Caught comfortably by the fielder.",
    "OUT! Edged and taken! {bowler} gets it to straighten outside off, {batsman} pokes at it, and the wicketkeeper makes no mistake.",
    "OUT! LBW! Plumb! {bowler} gets this one to jag back in. {batsman} is struck on the pad, the umpire raises the finger immediately.",
    "OUT! Run Out! Miscommunication in the middle. {batsman} hits it to point and calls for a single, but a direct hit catches him short!"
  ],
  'Wd': [
    "Wide ball. {bowler} sprays it well down the leg side. Re-bowl required.",
    "Wide ball. Too high! Bouncer sails over {batsman}'s head. Umpire signals wide."
  ],
  'Nb': [
    "No ball! {bowler} oversteps. Free hit coming up! (Extras updated)",
    "No ball! High full toss above the waist. Free hit for {batsman}!"
  ]
};

// Pick random event
function getBallEvent() {
  const idx = Math.floor(Math.random() * EVENT_POOL.length);
  return EVENT_POOL[idx];
}

// Generate text commentary
function generateCommentary(batsman, bowler, event) {
  const templates = COMMENTARY_TEMPLATES[event] || COMMENTARY_TEMPLATES['0'];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template
    .replace(/{batsman}/g, batsman)
    .replace(/{bowler}/g, bowler);
}

// Helper to convert overs (e.g. 17.2) to ball count
export function oversToBalls(overs) {
  const overInt = Math.floor(overs);
  const ballDecimal = Math.round((overs % 1) * 10);
  return overInt * 6 + ballDecimal;
}

// Helper to convert ball count to overs format
export function ballsToOvers(balls) {
  const overInt = Math.floor(balls / 6);
  const ballDecimal = balls % 6;
  return parseFloat(`${overInt}.${ballDecimal}`);
}

// Generate random dismissal string
function getRandomDismissal(bowlerName, fieldsmen) {
  const types = [
    `b ${bowlerName}`,
    `c ${fieldsmen[Math.floor(Math.random() * fieldsmen.length)]} b ${bowlerName}`,
    `lbw b ${bowlerName}`,
    `run out (${fieldsmen[Math.floor(Math.random() * fieldsmen.length)]})`
  ];
  return types[Math.floor(Math.random() * types.length)];
}

const PITCH_TYPES = ['Good Length', 'Yorker', 'Short Ball', 'Full Delivery', 'Bouncer', 'Full Toss'];
const SHOT_DIRECTIONS = [
  { name: 'Straight Drive / Long-on', angle: 340 },
  { name: 'Straight Drive / Long-off', angle: 20 },
  { name: 'Cover Drive / Covers', angle: 60 },
  { name: 'Square Cut / Point', angle: 90 },
  { name: 'Late Cut / Third Man', angle: 135 },
  { name: 'Fine Leg Glance', angle: 225 },
  { name: 'Pull Shot / Square Leg', angle: 270 },
  { name: 'Flick / Mid-wicket', angle: 300 }
];

function getShotDetails(event) {
  if (event === 'Wd' || event === 'Nb') {
    return {
      pitchType: event === 'Wd' ? 'Wide Delivery' : 'No Ball',
      shotDirection: 'None',
      shotAngle: 0,
      distance: 0
    };
  }

  const pitchType = PITCH_TYPES[Math.floor(Math.random() * PITCH_TYPES.length)];
  let eligibleShots = [...SHOT_DIRECTIONS];

  if (event === '6') {
    eligibleShots = SHOT_DIRECTIONS.filter(s => ['Flick / Mid-wicket', 'Pull Shot / Square Leg', 'Straight Drive / Long-on', 'Straight Drive / Long-off'].includes(s.name));
  }

  const shot = eligibleShots[Math.floor(Math.random() * eligibleShots.length)];
  let distance = 0;
  if (event === '6') {
    distance = Math.floor(Math.random() * 30) + 75;
  } else if (event === '4') {
    distance = Math.floor(Math.random() * 15) + 60;
  } else if (event === '3') {
    distance = Math.floor(Math.random() * 15) + 50;
  } else if (event === '2') {
    distance = Math.floor(Math.random() * 20) + 30;
  } else if (event === '1') {
    distance = Math.floor(Math.random() * 20) + 15;
  } else if (event === '0') {
    distance = Math.floor(Math.random() * 5);
  }

  return {
    pitchType,
    shotDirection: shot.name,
    shotAngle: shot.angle + Math.floor(Math.random() * 20 - 10),
    distance
  };
}


export function simulateBall(match) {
  if (match.isFinished) return match;

  const matchCopy = JSON.parse(JSON.stringify(match));
  const battingTeam = matchCopy.innings === 1 ? matchCopy.team1 : matchCopy.team2;
  const bowlingTeam = matchCopy.innings === 1 ? matchCopy.team2 : matchCopy.team1;
  const battingKey = matchCopy.innings === 1 ? 'team1' : 'team2';
  const score = matchCopy.score[battingKey];

  // If both teams completed innings, finish match
  if (matchCopy.innings === 2 && score.runs > matchCopy.score.team1.runs) {
    matchCopy.isFinished = true;
    matchCopy.status = `FINISHED - ${battingTeam.name} won by ${10 - score.wickets} wickets`;
    return matchCopy;
  }

  // Get active players
  let striker = matchCopy.batting.striker;
  let nonStriker = matchCopy.batting.nonStriker;
  let bowler = matchCopy.bowling.active;

  if (!striker || !bowler) {
    // Initialize if empty (e.g. at start of innings)
    const battingSquad = battingTeam.squad;
    const bowlingSquad = bowlingTeam.squad;
    
    striker = { id: battingSquad[0].id, name: battingSquad[0].name, runs: 0, balls: 0, fours: 0, sixes: 0 };
    nonStriker = { id: battingSquad[1].id, name: battingSquad[1].name, runs: 0, balls: 0, fours: 0, sixes: 0 };
    
    // Bowler (typically a fast bowler from squad, let's take a bowler role)
    const bowlerSquad = bowlingSquad.filter(p => p.role === 'Bowler' || p.role === 'All-rounder');
    const selectedBowler = bowlerSquad[0] || bowlingSquad[bowlingSquad.length - 1];
    
    bowler = { id: selectedBowler.id, name: selectedBowler.name, overs: 0.0, maidens: 0, runs: 0, wkts: 0 };
    
    matchCopy.batting.striker = striker;
    matchCopy.batting.nonStriker = nonStriker;
    matchCopy.bowling.active = bowler;
  }

  const event = getBallEvent();
  let runAdded = 0;
  let wicketAdded = 0;
  let ballValid = true;
  let commentEventText = '';

  // Process ball event
  if (event === '0') {
    commentEventText = '0 runs';
  } else if (event === '1') {
    runAdded = 1;
    commentEventText = '1 run';
  } else if (event === '2') {
    runAdded = 2;
    commentEventText = '2 runs';
  } else if (event === '3') {
    runAdded = 3;
    commentEventText = '3 runs';
  } else if (event === '4') {
    runAdded = 4;
    commentEventText = '4 runs';
  } else if (event === '6') {
    runAdded = 6;
    commentEventText = '6 runs';
  } else if (event === 'W') {
    wicketAdded = 1;
    commentEventText = 'Wicket!';
  } else if (event === 'Wd') {
    runAdded = 1; // 1 run for wide
    ballValid = false;
    commentEventText = 'Wide';
  } else if (event === 'Nb') {
    runAdded = 1; // 1 run for no-ball
    ballValid = false;
    commentEventText = 'No ball';
  }

  // Update Inning Scores
  score.runs += runAdded;
  score.wickets += wicketAdded;
  
  if (event === 'Wd' || event === 'Nb') {
    score.extra += 1;
  }

  // Update Batsman Stats
  if (event !== 'Wd') {
    striker.balls += 1;
  }
  if (runAdded > 0 && event !== 'Wd' && event !== 'Nb') {
    striker.runs += runAdded;
    if (runAdded === 4) striker.fours += 1;
    if (runAdded === 6) striker.sixes += 1;
  }

  // Update Bowler Stats
  if (ballValid) {
    const bowlerBalls = Math.round((bowler.overs % 1) * 10) + 1;
    if (bowlerBalls === 6) {
      bowler.overs = Math.floor(bowler.overs) + 1 + 0.0;
    } else {
      bowler.overs = Math.floor(bowler.overs) + parseFloat(`0.${bowlerBalls}`);
    }
  }
  // Bowler concedes runs
  if (event !== 'Nb' && event !== 'Wd') {
    bowler.runs += runAdded;
  } else {
    bowler.runs += 1; // wide/no-ball adds to bowler runs
  }
  bowler.wkts += wicketAdded;

  // Add ball to recent tracker
  matchCopy.recentBalls.push(event);
  if (matchCopy.recentBalls.length > 8) {
    matchCopy.recentBalls.shift();
  }

  // Generate commentary text
  const commentaryText = generateCommentary(striker.name, bowler.name, event);

  // Attach last ball metadata for visualization and audio engine
  matchCopy.lastBall = {
    event,
    striker: striker.name,
    bowler: bowler.name,
    runs: runAdded,
    wicket: wicketAdded,
    ballValid,
    ...getShotDetails(event)
  };

  
  // Update overs in scorecard
  if (ballValid) {
    const curBalls = oversToBalls(score.overs) + 1;
    score.overs = ballsToOvers(curBalls);
  }

  // Put commentary at the top of the history
  matchCopy.commentary.unshift({
    ball: score.overs.toFixed(1),
    event: commentEventText,
    text: commentaryText
  });
  if (matchCopy.commentary.length > 25) {
    matchCopy.commentary.pop();
  }

  // Handle Wickets
  if (event === 'W') {
    // Add current striker to scorecard as dismissed
    const fieldsmen = bowlingTeam.squad.map(p => p.name);
    const dismissal = getRandomDismissal(bowler.name, fieldsmen);
    
    matchCopy.scorecard[battingKey].push({
      id: striker.id,
      name: striker.name,
      status: dismissal,
      runs: striker.runs,
      balls: striker.balls,
      fours: striker.fours,
      sixes: striker.sixes
    });

    // Check if team is all out
    if (score.wickets >= 10) {
      handleInningsEnd(matchCopy);
      return matchCopy;
    } else {
      // Bring in next batsman
      const nextBatsmanIndex = score.wickets + 1; // wicket 1 means 3rd batsman (index 2) comes in
      const nextPlayer = battingTeam.squad[nextBatsmanIndex];
      striker = {
        id: nextPlayer.id,
        name: nextPlayer.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0
      };
      matchCopy.batting.striker = striker;
    }
  }

  // Handle rotation of strike for runs
  if (runAdded === 1 || runAdded === 3) {
    const temp = striker;
    striker = nonStriker;
    nonStriker = temp;
    matchCopy.batting.striker = striker;
    matchCopy.batting.nonStriker = nonStriker;
  }

  // Handle end of Over (6 balls)
  const isOverComplete = ballValid && (oversToBalls(score.overs) % 6 === 0);
  if (isOverComplete) {
    // Update active bowler in bowler's card
    const existingBowlerIndex = matchCopy.bowlersCard[battingKey].findIndex(b => b.id === bowler.id);
    if (existingBowlerIndex !== -1) {
      matchCopy.bowlersCard[battingKey][existingBowlerIndex] = bowler;
    } else {
      matchCopy.bowlersCard[battingKey].push(bowler);
    }

    // Swap striker/non-striker strike at the end of the over
    const temp = striker;
    striker = nonStriker;
    nonStriker = temp;
    matchCopy.batting.striker = striker;
    matchCopy.batting.nonStriker = nonStriker;

    // Pick new bowler (not the current bowler)
    const bowlingSquad = bowlingTeam.squad.filter(p => p.role === 'Bowler' || p.role === 'All-rounder');
    const eligibleBowlers = bowlingSquad.filter(p => p.name !== bowler.name);
    const newBowlerModel = eligibleBowlers[Math.floor(Math.random() * eligibleBowlers.length)] || bowlingSquad[0];

    // Load from existing bowler cards or start new card
    const card = matchCopy.bowlersCard[battingKey].find(b => b.id === newBowlerModel.id);
    if (card) {
      bowler = JSON.parse(JSON.stringify(card));
    } else {
      bowler = {
        id: newBowlerModel.id,
        name: newBowlerModel.name,
        overs: 0.0,
        maidens: 0,
        runs: 0,
        wkts: 0
      };
    }
    matchCopy.bowling.active = bowler;
  }

  // Check target chased or maximum overs reached
  const maxOvers = matchCopy.format === 'T20' ? 20.0 : 50.0;
  
  if (matchCopy.innings === 2) {
    if (score.runs > matchCopy.score.team1.runs) {
      // Chasing team won!
      finishMatch(matchCopy, `${battingTeam.name} won by ${10 - score.wickets} wickets`);
      return matchCopy;
    } else if (score.wickets >= 10 || score.overs >= maxOvers) {
      // Chasing team lost or tie
      if (score.runs === matchCopy.score.team1.runs) {
        finishMatch(matchCopy, "Match tied!");
      } else {
        const runDiff = matchCopy.score.team1.runs - score.runs;
        finishMatch(matchCopy, `${bowlingTeam.name} won by ${runDiff} runs`);
      }
      return matchCopy;
    }
  } else {
    // 1st innings max overs reached
    if (score.overs >= maxOvers) {
      handleInningsEnd(matchCopy);
      return matchCopy;
    }
  }

  // Recalculate Live Odds / Session predictions
  updateLiveOddsAndSessions(matchCopy);

  return matchCopy;
}

function handleInningsEnd(match) {
  // Save remaining batsmen to scorecard as Not Out
  const battingKey = match.innings === 1 ? 'team1' : 'team2';
  const battingTeam = match.innings === 1 ? match.team1 : match.team2;
  const score = match.score[battingKey];

  if (match.batting.striker) {
    const exists = match.scorecard[battingKey].some(p => p.id === match.batting.striker.id);
    if (!exists) {
      match.scorecard[battingKey].push({
        ...match.batting.striker,
        status: 'Not out'
      });
    }
  }
  if (match.batting.nonStriker) {
    const exists = match.scorecard[battingKey].some(p => p.id === match.batting.nonStriker.id);
    if (!exists) {
      match.scorecard[battingKey].push({
        ...match.batting.nonStriker,
        status: 'Not out'
      });
    }
  }

  // Update bowler scorecard card
  if (match.bowling.active) {
    const bIndex = match.bowlersCard[battingKey].findIndex(b => b.id === match.bowling.active.id);
    if (bIndex !== -1) {
      match.bowlersCard[battingKey][bIndex] = match.bowling.active;
    } else {
      match.bowlersCard[battingKey].push(match.bowling.active);
    }
  }

  if (match.innings === 1) {
    match.innings = 2;
    match.status = `Innings Break - Target is ${score.runs + 1} runs`;
    
    // Reset active bats/bowlers for 2nd innings
    const nextBattingTeam = match.team2;
    const nextBowlingTeam = match.team1;
    
    match.batting = {
      striker: { id: nextBattingTeam.squad[0].id, name: nextBattingTeam.squad[0].name, runs: 0, balls: 0, fours: 0, sixes: 0 },
      nonStriker: { id: nextBattingTeam.squad[1].id, name: nextBattingTeam.squad[1].name, runs: 0, balls: 0, fours: 0, sixes: 0 }
    };
    
    const bowlSquad = nextBowlingTeam.squad.filter(p => p.role === 'Bowler' || p.role === 'All-rounder');
    const selectedBowl = bowlSquad[0] || nextBowlingTeam.squad[nextBowlingTeam.squad.length - 1];
    
    match.bowling = {
      active: { id: selectedBowl.id, name: selectedBowl.name, overs: 0.0, maidens: 0, runs: 0, wkts: 0 }
    };
    
    match.recentBalls = [];
    match.commentary.unshift({
      ball: '0.0',
      event: 'Innings End',
      text: `End of Innings. ${battingTeam.name} scored ${score.runs}/${score.wickets}. Target for ${nextBattingTeam.name} is ${score.runs + 1} runs.`
    });
  } else {
    // Innings 2 ended, end match
    if (match.score.team2.runs > match.score.team1.runs) {
      finishMatch(match, `${match.team2.name} won by ${10 - match.score.team2.wickets} wickets`);
    } else if (match.score.team2.runs === match.score.team1.runs) {
      finishMatch(match, "Match tied!");
    } else {
      finishMatch(match, `${match.team1.name} won by ${match.score.team1.runs - match.score.team2.runs} runs`);
    }
  }
}

function finishMatch(match, resultText) {
  match.isFinished = true;
  match.status = `FINISHED - ${resultText}`;
  match.batting = { striker: null, nonStriker: null };
  match.bowling = { active: null };
  match.commentary.unshift({
    ball: match.score.team2.overs.toFixed(1),
    event: 'Match Ended',
    text: `Match completed! ${resultText}.`
  });
}

function updateLiveOddsAndSessions(match) {
  if (match.isFinished) return;

  const t1runs = match.score.team1.runs;
  const t2runs = match.score.team2.runs;
  const overs = match.innings === 1 ? match.score.team1.overs : match.score.team2.overs;
  
  let winProb = 50; // default India/Team1 prob
  
  if (match.innings === 1) {
    // Based on runs scored per over vs wickets lost
    const rr = overs > 0 ? t1runs / overs : 6;
    const wktLossFactor = match.score.team1.wickets * 5;
    const strength = (rr * 8) - wktLossFactor;
    winProb = Math.min(Math.max(50 + (strength - 30), 10), 90);
  } else {
    // Innings 2: required run rate
    const maxOvers = match.format === 'T20' ? 20.0 : 50.0;
    const ballsRemaining = (maxOvers - overs) * 6;
    const runsNeeded = t1runs + 1 - t2runs;
    
    if (ballsRemaining > 0) {
      const reqRr = (runsNeeded / ballsRemaining) * 6;
      const wktLossFactor = match.score.team2.wickets * 8;
      const pressure = (reqRr * 10) + wktLossFactor - 40;
      winProb = Math.min(Math.max(100 - pressure, 5), 95); // Higher win probability for Chasing team
    }
  }

  // Generate odds from win probability
  // e.g. 50% means 1.95 - 1.98. 70% means 1.40 - 1.43
  const activeTeam = winProb >= 50 ? match.team1.shortName : match.team2.shortName;
  const prob = winProb >= 50 ? winProb : 100 - winProb;
  const rate = (100 / prob).toFixed(2);
  const layRate = (parseFloat(rate) + 0.03).toFixed(2);

  // Fluctuating session run predictions (e.g. 6-overs session runs)
  let sessionRunsMin = 48;
  if (match.innings === 1) {
    const curRr = overs > 0 ? t1runs / overs : 7.5;
    sessionRunsMin = Math.round(curRr * 6 + (Math.random() * 4 - 2));
  } else {
    const curRr = overs > 0 ? t2runs / overs : 7.5;
    sessionRunsMin = Math.round(curRr * 6 + (Math.random() * 4 - 2));
  }
  const sessionRunsMax = sessionRunsMin + 2;

  match.odds = {
    back: rate,
    lay: layRate,
    team: activeTeam,
    winProbability: winProb, // team1 percentage
    sessionRuns: `${sessionRunsMin}-${sessionRunsMax}`,
    sessionOddsBack: '1.85',
    sessionOddsLay: '1.88'
  };
}
