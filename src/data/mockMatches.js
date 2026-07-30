export const TEAMS = {
  IND: {
    id: 'IND',
    name: 'India',
    shortName: 'IND',
    color: '#00529b',
    secondaryColor: '#ff9933',
    squad: [
      { id: 'ind_1', name: 'Rohit Sharma', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 262, runs: 10856, hs: '264', avg: 49.12, sr: 92.43, hundred: 31, fifty: 55 }, bowl: { mat: 262, wkts: 8, best: '2/27', avg: 64.3, econ: 5.21, sr: 74.0 } } },
      { id: 'ind_2', name: 'Yashasvi Jaiswal', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 23, runs: 1120, hs: '214*', avg: 56.0, sr: 140.2 }, bowl: { mat: 23, wkts: 0, best: '0/0', avg: 0, econ: 8.0, sr: 0 } } },
      { id: 'ind_3', name: 'Virat Kohli', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm medium', stats: { bat: { mat: 295, runs: 13906, hs: '183', avg: 58.18, sr: 93.54, hundred: 50, fifty: 72 }, bowl: { mat: 295, wkts: 5, best: '1/15', avg: 120.4, econ: 6.2, sr: 116.0 } } },
      { id: 'ind_4', name: 'Rishabh Pant', role: 'Wicketkeeper', batting: 'Left-hand bat', bowling: 'None', stats: { bat: { mat: 35, runs: 1250, hs: '125*', avg: 38.5, sr: 135.6, hundred: 1, fifty: 8 }, bowl: { mat: 35, wkts: 0, best: 'None', avg: 0, econ: 0, sr: 0 } } },
      { id: 'ind_5', name: 'Suryakumar Yadav', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm medium-fast', stats: { bat: { mat: 68, runs: 2432, hs: '117', avg: 42.6, sr: 168.5, hundred: 4, fifty: 20 }, bowl: { mat: 68, wkts: 0, best: '0/5', avg: 0, econ: 9.0, sr: 0 } } },
      { id: 'ind_6', name: 'Hardik Pandya', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm fast-medium', stats: { bat: { mat: 86, runs: 1769, hs: '92*', avg: 34.0, sr: 110.3, hundred: 0, fifty: 11 }, bowl: { mat: 86, wkts: 84, best: '4/38', avg: 35.6, econ: 5.56, sr: 38.4 } } },
      { id: 'ind_7', name: 'Ravindra Jadeja', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 197, runs: 2888, hs: '87', avg: 32.44, sr: 85.2, hundred: 0, fifty: 13 }, bowl: { mat: 197, wkts: 220, best: '5/36', avg: 37.3, econ: 4.88, sr: 45.8 } } },
      { id: 'ind_8', name: 'Axar Patel', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 57, runs: 489, hs: '64*', avg: 19.5, sr: 104.2, hundred: 0, fifty: 2 }, bowl: { mat: 57, wkts: 60, best: '3/24', avg: 31.8, econ: 4.43, sr: 43.0 } } },
      { id: 'ind_9', name: 'Kuldeep Yadav', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Left-arm wrist spin', stats: { bat: { mat: 103, runs: 182, hs: '19', avg: 8.2, sr: 60.5 }, bowl: { mat: 103, wkts: 172, best: '6/25', avg: 24.8, econ: 4.96, sr: 30.0 } } },
      { id: 'ind_10', name: 'Jasprit Bumrah', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bat: { mat: 89, runs: 85, hs: '16*', avg: 5.1, sr: 65.3 }, bowl: { mat: 89, wkts: 149, best: '6/19', avg: 23.55, econ: 4.59, sr: 30.7 } } },
      { id: 'ind_11', name: 'Arshdeep Singh', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Left-arm medium-fast', stats: { bat: { mat: 52, runs: 32, hs: '12', avg: 4.0, sr: 80.0 }, bowl: { mat: 52, wkts: 83, best: '4/9', avg: 19.1, econ: 8.34, sr: 13.7 } } }
    ]
  },
  AUS: {
    id: 'AUS',
    name: 'Australia',
    shortName: 'AUS',
    color: '#ffcd00',
    secondaryColor: '#006643',
    squad: [
      { id: 'aus_1', name: 'Travis Head', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 65, runs: 2393, hs: '152', avg: 42.7, sr: 103.8, hundred: 3, fifty: 16 }, bowl: { mat: 65, wkts: 18, best: '2/12', avg: 38.5, econ: 5.8, sr: 40.0 } } },
      { id: 'aus_2', name: 'David Warner', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 161, runs: 6932, hs: '179', avg: 45.3, sr: 97.2, hundred: 22, fifty: 33 }, bowl: { mat: 161, wkts: 0, best: 'None', avg: 0, econ: 0, sr: 0 } } },
      { id: 'aus_3', name: 'Mitchell Marsh', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm medium', stats: { bat: { mat: 89, runs: 2450, hs: '102*', avg: 34.5, sr: 94.8, hundred: 2, fifty: 15 }, bowl: { mat: 89, wkts: 57, best: '5/27', avg: 36.8, econ: 5.6, sr: 39.0 } } },
      { id: 'aus_4', name: 'Steve Smith', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 155, runs: 5446, hs: '164', avg: 43.91, sr: 87.33, hundred: 12, fifty: 32 }, bowl: { mat: 155, wkts: 28, best: '3/16', avg: 34.2, econ: 5.26, sr: 39.0 } } },
      { id: 'aus_5', name: 'Glenn Maxwell', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 138, runs: 3895, hs: '201*', avg: 35.4, sr: 126.9, hundred: 4, fifty: 23 }, bowl: { mat: 138, wkts: 70, best: '4/40', avg: 38.2, econ: 5.4, sr: 42.4 } } },
      { id: 'aus_6', name: 'Marcus Stoinis', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm medium-fast', stats: { bat: { mat: 70, runs: 1480, hs: '146*', avg: 28.5, sr: 94.0, hundred: 1, fifty: 6 }, bowl: { mat: 70, wkts: 46, best: '3/16', avg: 42.0, econ: 6.0, sr: 42.0 } } },
      { id: 'aus_7', name: 'Matthew Wade', role: 'Wicketkeeper', batting: 'Left-hand bat', bowling: 'None', stats: { bat: { mat: 97, runs: 1867, hs: '100', avg: 26.3, sr: 82.5 }, bowl: { mat: 97, wkts: 0, best: 'None', avg: 0, econ: 0, sr: 0 } } },
      { id: 'aus_8', name: 'Pat Cummins', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bat: { mat: 88, runs: 420, hs: '36', avg: 11.5, sr: 78.4 }, bowl: { mat: 88, wkts: 141, best: '5/70', avg: 28.6, econ: 5.22, sr: 32.8 } } },
      { id: 'aus_9', name: 'Mitchell Starc', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Left-arm fast', stats: { bat: { mat: 121, runs: 520, hs: '52*', avg: 12.4, sr: 75.3 }, bowl: { mat: 121, wkts: 236, best: '6/28', avg: 22.9, econ: 5.43, sr: 25.3 } } },
      { id: 'aus_10', name: 'Adam Zampa', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 99, runs: 125, hs: '15', avg: 6.2, sr: 55.4 }, bowl: { mat: 99, wkts: 169, best: '5/19', avg: 28.0, econ: 5.48, sr: 30.6 } } },
      { id: 'aus_11', name: 'Josh Hazlewood', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Right-arm fast-medium', stats: { bat: { mat: 85, runs: 90, hs: '11*', avg: 4.8, sr: 60.0 }, bowl: { mat: 85, wkts: 132, best: '6/52', avg: 26.8, econ: 4.79, sr: 33.5 } } }
    ]
  },
  ENG: {
    id: 'ENG',
    name: 'England',
    shortName: 'ENG',
    color: '#d41130',
    secondaryColor: '#0a192f',
    squad: [
      { id: 'eng_1', name: 'Jos Buttler', role: 'Wicketkeeper', batting: 'Right-hand bat', bowling: 'None', stats: { bat: { mat: 181, runs: 5040, hs: '162*', avg: 39.7, sr: 117.1, hundred: 11, fifty: 26 } } },
      { id: 'eng_2', name: 'Phil Salt', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 24, runs: 850, hs: '119', avg: 38.6, sr: 165.4 } } },
      { id: 'eng_3', name: 'Will Jacks', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 18, runs: 420, hs: '108*', avg: 28.0, sr: 154.0 } } },
      { id: 'eng_4', name: 'Jonny Bairstow', role: 'Batsman', batting: 'Right-hand bat', bowling: 'None', stats: { bat: { mat: 108, runs: 3861, hs: '141*', avg: 42.9, sr: 104.1 } } },
      { id: 'eng_5', name: 'Harry Brook', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm medium', stats: { bat: { mat: 15, runs: 410, hs: '80', avg: 34.2, sr: 143.5 } } },
      { id: 'eng_6', name: 'Liam Livingstone', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm legbreak/offbreak', stats: { bat: { mat: 38, runs: 850, hs: '103', avg: 29.3, sr: 148.5 }, bowl: { mat: 38, wkts: 22, best: '3/17', avg: 31.4, econ: 7.9, sr: 23.8 } } },
      { id: 'eng_7', name: 'Moeen Ali', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 138, runs: 2355, hs: '128', avg: 25.1, sr: 99.4 }, bowl: { mat: 138, wkts: 111, best: '4/46', avg: 47.3, econ: 5.29, sr: 53.6 } } },
      { id: 'eng_8', name: 'Sam Curran', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Left-arm fast-medium', stats: { bat: { mat: 32, runs: 450, hs: '95*', avg: 23.6, sr: 132.5 }, bowl: { mat: 32, wkts: 34, best: '5/10', avg: 28.0, econ: 8.2, sr: 20.4 } } },
      { id: 'eng_9', name: 'Adil Rashid', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 135, runs: 710, hs: '38', avg: 12.5, sr: 70.3 }, bowl: { mat: 135, wkts: 199, best: '5/27', avg: 32.5, econ: 5.67, sr: 34.4 } } },
      { id: 'eng_10', name: 'Jofra Archer', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bat: { mat: 25, runs: 120, hs: '27*', avg: 12.0, sr: 95.0 }, bowl: { mat: 25, wkts: 42, best: '6/40', avg: 24.5, econ: 4.88, sr: 30.1 } } },
      { id: 'eng_11', name: 'Reece Topley', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Left-arm fast-medium', stats: { bat: { mat: 30, runs: 25, hs: '6', avg: 3.1, sr: 50.0 }, bowl: { mat: 30, wkts: 45, best: '6/24', avg: 25.4, econ: 5.38, sr: 28.3 } } }
    ]
  },
  CSK: {
    id: 'CSK',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    color: '#fdb714',
    secondaryColor: '#005ca9',
    squad: [
      { id: 'csk_1', name: 'Ruturaj Gaikwad', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 68, runs: 2380, hs: '108*', avg: 41.5, sr: 137.9 } } },
      { id: 'csk_2', name: 'Rachin Ravindra', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 15, runs: 320, hs: '61', avg: 24.6, sr: 158.4 } } },
      { id: 'csk_3', name: 'Shivam Dube', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Right-arm medium', stats: { bat: { mat: 51, runs: 1350, hs: '95*', avg: 32.8, sr: 145.2 } } },
      { id: 'csk_4', name: 'Daryl Mitchell', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 14, runs: 318, hs: '63', avg: 28.9, sr: 142.6 } } },
      { id: 'csk_5', name: 'Ravindra Jadeja', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 240, runs: 2950, hs: '62*', avg: 27.4, sr: 129.5 }, bowl: { mat: 240, wkts: 160, best: '5/16', avg: 29.8, econ: 7.56, sr: 23.4 } } },
      { id: 'csk_6', name: 'MS Dhoni', role: 'Wicketkeeper', batting: 'Right-hand bat', stats: { bat: { mat: 264, runs: 5243, hs: '84*', avg: 39.1, sr: 137.5 } } },
      { id: 'csk_7', name: 'Mitchell Santner', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 30, runs: 170, hs: '22', avg: 18.5, sr: 120.0 }, bowl: { mat: 30, wkts: 28, best: '4/11', avg: 26.5, econ: 7.02, sr: 22.0 } } },
      { id: 'csk_8', name: 'Shardul Thakur', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast-medium', stats: { bat: { mat: 95, runs: 320, hs: '68', avg: 12.0, sr: 140.0 }, bowl: { mat: 95, wkts: 92, best: '4/36', avg: 28.5, econ: 9.12, sr: 18.5 } } },
      { id: 'csk_9', name: 'Deepak Chahar', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm medium-fast', stats: { bat: { mat: 80, runs: 110, hs: '39', avg: 11.0, sr: 135.0 }, bowl: { mat: 80, wkts: 77, best: '4/13', avg: 27.3, econ: 7.95, sr: 20.6 } } },
      { id: 'csk_10', name: 'Matheesha Pathirana', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bat: { mat: 20, runs: 10, hs: '4', avg: 2.0, sr: 50.0 }, bowl: { mat: 20, wkts: 34, best: '4/15', avg: 18.2, econ: 7.88, sr: 13.8 } } },
      { id: 'csk_11', name: 'Tushar Deshpande', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm medium-fast', stats: { bat: { mat: 36, wkts: 42, best: '4/27', avg: 27.1, econ: 9.24, sr: 17.6 } } }
    ]
  },
  MI: {
    id: 'MI',
    name: 'Mumbai Indians',
    shortName: 'MI',
    color: '#004ba0',
    secondaryColor: '#d6a014',
    squad: [
      { id: 'mi_1', name: 'Rohit Sharma', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 257, runs: 6628, hs: '109*', avg: 29.7, sr: 131.2 } } },
      { id: 'mi_2', name: 'Ishan Kishan', role: 'Wicketkeeper', batting: 'Left-hand bat', stats: { bat: { mat: 105, runs: 2640, hs: '99', avg: 28.4, sr: 135.8 } } },
      { id: 'mi_3', name: 'Suryakumar Yadav', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 150, runs: 3594, hs: '103*', avg: 32.1, sr: 145.3 } } },
      { id: 'mi_4', name: 'Hardik Pandya', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm fast-medium', stats: { bat: { mat: 137, runs: 2520, hs: '91', avg: 28.6, sr: 146.2 }, bowl: { mat: 137, wkts: 64, best: '3/17', avg: 33.2, econ: 8.92, sr: 22.3 } } },
      { id: 'mi_5', name: 'Tilak Varma', role: 'Batsman', batting: 'Left-hand bat', stats: { bat: { mat: 38, runs: 1150, hs: '84*', avg: 39.6, sr: 142.5 } } },
      { id: 'mi_6', name: 'Tim David', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 40, runs: 780, hs: '46', avg: 26.5, sr: 170.2 } } },
      { id: 'mi_7', name: 'Romario Shepherd', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm fast-medium', stats: { bat: { mat: 15, runs: 180, hs: '39*', avg: 20.0, sr: 185.0 }, bowl: { mat: 15, wkts: 10, best: '3/32', avg: 36.4, econ: 10.4, sr: 21.0 } } },
      { id: 'mi_8', name: 'Gerald Coetzee', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 12, wkts: 15, best: '3/18', avg: 26.2, econ: 9.88, sr: 15.9 } } },
      { id: 'mi_9', name: 'Piyush Chawla', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Right-arm legbreak', stats: { bowl: { mat: 192, wkts: 192, best: '4/17', avg: 26.8, econ: 7.96, sr: 20.1 } } },
      { id: 'mi_10', name: 'Jasprit Bumrah', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 133, wkts: 165, best: '5/10', avg: 22.5, econ: 7.3, sr: 18.4 } } },
      { id: 'mi_11', name: 'Nuwan Thushara', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast-medium', stats: { bowl: { mat: 10, wkts: 12, best: '3/22', avg: 25.8, econ: 8.9, sr: 17.3 } } }
    ]
  }
};

export const INITIAL_LIVE_MATCHES = [
  {
    id: 'live_1',
    title: 'ICC Men\'s T20 World Cup - Final',
    venue: 'Kensington Oval, Bridgetown, Barbados',
    format: 'T20',
    status: 'LIVE',
    toss: 'India won the toss & elected to bat first',
    team1: TEAMS.IND,
    team2: TEAMS.AUS,
    battingFirst: 'IND',
    innings: 1, // Currently in 1st Innings
    isFinished: false,
    score: {
      team1: { runs: 164, wickets: 3, overs: 17.2, extra: 6 },
      team2: { runs: 0, wickets: 0, overs: 0.0, extra: 0 }
    },
    batting: {
      striker: { id: 'ind_3', name: 'Virat Kohli', runs: 74, balls: 48, fours: 6, sixes: 3 },
      nonStriker: { id: 'ind_6', name: 'Hardik Pandya', runs: 12, balls: 8, fours: 1, sixes: 0 }
    },
    bowling: {
      active: { id: 'aus_9', name: 'Mitchell Starc', overs: 3.2, maidens: 0, runs: 32, wkts: 1 }
    },
    scorecard: {
      team1: [
        { id: 'ind_1', name: 'Rohit Sharma', status: 'c Wade b Cummins', runs: 29, balls: 18, fours: 4, sixes: 1 },
        { id: 'ind_2', name: 'Yashasvi Jaiswal', status: 'b Hazlewood', runs: 42, balls: 28, fours: 5, sixes: 2 },
        { id: 'ind_3', name: 'Virat Kohli', status: 'Not out', runs: 74, balls: 48, fours: 6, sixes: 3 },
        { id: 'ind_4', name: 'Rishabh Pant', status: 'c Smith b Starc', runs: 11, balls: 10, fours: 1, sixes: 0 },
        { id: 'ind_6', name: 'Hardik Pandya', status: 'Not out', runs: 12, balls: 8, fours: 1, sixes: 0 }
      ],
      team2: []
    },
    bowlersCard: {
      team1: [
        { id: 'aus_9', name: 'Mitchell Starc', overs: 3.2, maidens: 0, runs: 32, wkts: 1, econ: 9.6 },
        { id: 'aus_11', name: 'Josh Hazlewood', overs: 4, maidens: 0, runs: 28, wkts: 1, econ: 7.0 },
        { id: 'aus_8', name: 'Pat Cummins', overs: 4, maidens: 0, runs: 40, wkts: 1, econ: 10.0 },
        { id: 'aus_10', name: 'Adam Zampa', overs: 4, maidens: 0, runs: 35, wkts: 0, econ: 8.75 },
        { id: 'aus_3', name: 'Mitchell Marsh', overs: 2, maidens: 0, runs: 23, wkts: 0, econ: 11.5 }
      ],
      team2: []
    },
    recentBalls: ['4', '1', 'Wd', '6', 'W', '1', '2'],
    commentary: [
      { ball: '17.2', event: '2 runs', text: 'Starc bowls a full delivery on the pads. Kohli flicks it away towards deep mid-wicket for a brace.' },
      { ball: '17.1', event: '1 run', text: 'Hardik drives a length delivery down to long-on for a single.' },
      { ball: '16.6', event: '1 run', text: 'Zampa finishes the over. Kohli pushes it softly to sweeper cover to keep the strike.' },
      { ball: '16.5', event: 'Wicket!', text: 'OUT! Rishabh Pant goes big but hoists it straight into the hands of Steve Smith at deep mid-wicket! Starc strikes back. Pant c Smith b Starc 11(10).' },
      { ball: '16.4', event: '6 runs', text: 'SIX! BOOM! Pant kneels down and slog sweeps it clean over the square leg boundary for a massive six!' },
      { ball: '16.3', event: 'Wide', text: 'Wide. Starc sprays this one down the leg side. Wicketkeeper collects.' }
    ],
    odds: {
      back: '1.75',
      lay: '1.78',
      team: 'IND',
      sessionRuns: '192-195',
      sessionOddsBack: '1.90',
      sessionOddsLay: '1.92'
    }
  },
  {
    id: 'live_2',
    title: 'Indian Premier League - Match 45',
    venue: 'Wankhede Stadium, Mumbai',
    format: 'T20',
    status: 'LIVE',
    toss: 'CSK won the toss & elected to bowl first',
    team1: TEAMS.MI,
    team2: TEAMS.CSK,
    battingFirst: 'MI',
    innings: 2, // Second Innings
    isFinished: false,
    score: {
      team1: { runs: 182, wickets: 6, overs: 20.0, extra: 8 },
      team2: { runs: 145, wickets: 3, overs: 15.4, extra: 4 }
    },
    batting: {
      striker: { id: 'csk_3', name: 'Shivam Dube', runs: 45, balls: 24, fours: 2, sixes: 4 },
      nonStriker: { id: 'csk_5', name: 'Ravindra Jadeja', runs: 12, balls: 9, fours: 0, sixes: 0 }
    },
    bowling: {
      active: { id: 'mi_10', name: 'Jasprit Bumrah', overs: 2.4, maidens: 0, runs: 18, wkts: 2 }
    },
    scorecard: {
      team1: [
        { id: 'mi_1', name: 'Rohit Sharma', status: 'c Dhoni b Pathirana', runs: 64, balls: 40, fours: 7, sixes: 3 },
        { id: 'mi_2', name: 'Ishan Kishan', status: 'c Jadeja b Chahar', runs: 20, balls: 14, fours: 3, sixes: 0 },
        { id: 'mi_3', name: 'Suryakumar Yadav', status: 'c Mitchell b Deshpande', runs: 45, balls: 28, fours: 4, sixes: 2 },
        { id: 'mi_4', name: 'Hardik Pandya', status: 'c Gaikwad b Pathirana', runs: 15, balls: 12, fours: 1, sixes: 1 },
        { id: 'mi_5', name: 'Tilak Varma', status: 'Run out', runs: 18, balls: 14, fours: 1, sixes: 0 },
        { id: 'mi_6', name: 'Tim David', status: 'Not out', runs: 12, balls: 10, fours: 1, sixes: 0 },
        { id: 'mi_7', name: 'Romario Shepherd', status: 'Not out', runs: 8, balls: 2, fours: 0, sixes: 1 }
      ],
      team2: [
        { id: 'csk_1', name: 'Ruturaj Gaikwad', status: 'c Kishan b Bumrah', runs: 32, balls: 22, fours: 4, sixes: 1 },
        { id: 'csk_2', name: 'Rachin Ravindra', status: 'b Coetzee', runs: 18, balls: 12, fours: 2, sixes: 1 },
        { id: 'csk_4', name: 'Daryl Mitchell', status: 'c Shepherd b Bumrah', runs: 38, balls: 27, fours: 3, sixes: 1 },
        { id: 'csk_3', name: 'Shivam Dube', status: 'Not out', runs: 45, balls: 24, fours: 2, sixes: 4 },
        { id: 'csk_5', name: 'Ravindra Jadeja', status: 'Not out', runs: 12, balls: 9, fours: 0, sixes: 0 }
      ]
    },
    bowlersCard: {
      team1: [
        { id: 'csk_9', name: 'Deepak Chahar', overs: 4, maidens: 0, runs: 36, wkts: 1, econ: 9.0 },
        { id: 'csk_8', name: 'Shardul Thakur', overs: 4, maidens: 0, runs: 42, wkts: 0, econ: 10.5 },
        { id: 'csk_11', name: 'Tushar Deshpande', overs: 4, maidens: 0, runs: 32, wkts: 1, econ: 8.0 },
        { id: 'csk_10', name: 'Matheesha Pathirana', overs: 4, maidens: 0, runs: 28, wkts: 2, econ: 7.0 },
        { id: 'csk_5', name: 'Ravindra Jadeja', overs: 4, maidens: 0, runs: 36, wkts: 1, econ: 9.0 }
      ],
      team2: [
        { id: 'mi_10', name: 'Jasprit Bumrah', overs: 2.4, maidens: 0, runs: 18, wkts: 2, econ: 6.75 },
        { id: 'mi_8', name: 'Gerald Coetzee', overs: 3, maidens: 0, runs: 32, wkts: 1, econ: 10.6 },
        { id: 'mi_9', name: 'Piyush Chawla', overs: 4, maidens: 0, runs: 28, wkts: 0, econ: 7.0 },
        { id: 'mi_7', name: 'Romario Shepherd', overs: 3, maidens: 0, runs: 39, wkts: 0, econ: 13.0 },
        { id: 'mi_4', name: 'Hardik Pandya', overs: 3, maidens: 0, runs: 24, wkts: 0, econ: 8.0 }
      ]
    },
    recentBalls: ['6', '0', '1', '4', '1', '2'],
    commentary: [
      { ball: '15.4', event: '2 runs', text: 'Dube strokes it to sweeper cover and pushes hard for the second run. Sturdy running!' },
      { ball: '15.3', event: '1 run', text: 'Jadeja pushes a quick length delivery to cover point for a single.' },
      { ball: '15.2', event: '4 runs', text: 'FOUR! Shot! Bumrah misses the yorker by a margin, and Dube whips it through mid-wicket for a boundary!' }
    ],
    odds: {
      back: '2.10',
      lay: '2.14',
      team: 'CSK',
      sessionRuns: '185-188',
      sessionOddsBack: '1.85',
      sessionOddsLay: '1.88'
    }
  }
];

export const MOCK_FIXTURES = [
  {
    id: 'fix_1',
    title: 'The Ashes 2026 - 1st Test',
    venue: 'Lord\'s Cricket Ground, London',
    format: 'TEST',
    status: 'UPCOMING',
    date: 'July 24, 2026',
    time: '15:30 IST',
    team1: TEAMS.ENG,
    team2: TEAMS.AUS,
    countdown: '7 Days'
  },
  {
    id: 'fix_2',
    title: 'Bilateral T20 Series - Match 1',
    venue: 'Melbourne Cricket Ground, Melbourne',
    format: 'T20',
    status: 'UPCOMING',
    date: 'July 28, 2026',
    time: '14:00 IST',
    team1: TEAMS.AUS,
    team2: TEAMS.IND,
    countdown: '11 Days'
  },
  {
    id: 'fix_3',
    title: 'ICC ODI Super League - Series',
    venue: 'Edgbaston, Birmingham',
    format: 'ODI',
    status: 'FINISHED',
    date: 'July 15, 2026',
    time: 'Finished',
    team1: TEAMS.ENG,
    team2: TEAMS.IND,
    result: 'India won by 4 wickets',
    score: {
      team1: { runs: 278, wickets: 9, overs: 50.0 },
      team2: { runs: 282, wickets: 6, overs: 48.2 }
    }
  },
  {
    id: 'fix_4',
    title: 'T20 Blast 2026 - North Group',
    venue: 'Old Trafford, Manchester',
    format: 'T20',
    status: 'FINISHED',
    date: 'July 12, 2026',
    time: 'Finished',
    team1: TEAMS.ENG,
    team2: TEAMS.AUS,
    result: 'Australia won by 8 wickets',
    score: {
      team1: { runs: 154, wickets: 8, overs: 20.0 },
      team2: { runs: 158, wickets: 2, overs: 16.4 }
    }
  }
];

export const MOCK_RANKINGS = {
  T20: {
    TEAMS: [
      { rank: 1, team: 'India', rating: 268, points: 15432 },
      { rank: 2, team: 'Australia', rating: 259, points: 13904 },
      { rank: 3, team: 'England', rating: 254, points: 12210 },
      { rank: 4, team: 'South Africa', rating: 250, points: 11180 },
      { rank: 5, team: 'Pakistan', rating: 243, points: 13245 }
    ],
    BATTING: [
      { rank: 1, name: 'Travis Head', team: 'Australia', rating: 844 },
      { rank: 2, name: 'Suryakumar Yadav', team: 'India', rating: 805 },
      { rank: 3, name: 'Phil Salt', team: 'England', rating: 792 },
      { rank: 4, name: 'Babar Azam', team: 'Pakistan', rating: 755 },
      { rank: 5, name: 'Yashasvi Jaiswal', team: 'India', rating: 742 }
    ],
    BOWLING: [
      { rank: 1, name: 'Adil Rashid', team: 'England', rating: 718 },
      { rank: 2, name: 'Anrich Nortje', team: 'South Africa', rating: 692 },
      { rank: 3, name: 'Jasprit Bumrah', team: 'India', rating: 687 },
      { rank: 4, name: 'Adam Zampa', team: 'Australia', rating: 680 },
      { rank: 5, name: 'Rashid Khan', team: 'Afghanistan', rating: 668 }
    ],
    ALL_ROUNDERS: [
      { rank: 1, name: 'Hardik Pandya', team: 'India', rating: 242 },
      { rank: 2, name: 'Marcus Stoinis', team: 'Australia', rating: 228 },
      { rank: 3, name: 'Wanindu Hasaranga', team: 'Sri Lanka', rating: 220 },
      { rank: 4, name: 'Liam Livingstone', team: 'England', rating: 205 },
      { rank: 5, name: 'Shakib Al Hasan', team: 'Bangladesh', rating: 202 }
    ]
  },
  ODI: {
    TEAMS: [
      { rank: 1, team: 'India', rating: 122, points: 6412 },
      { rank: 2, team: 'Australia', rating: 118, points: 5890 },
      { rank: 3, team: 'South Africa', rating: 110, points: 4950 },
      { rank: 4, team: 'Pakistan', rating: 106, points: 5120 },
      { rank: 5, team: 'New Zealand', rating: 101, points: 4322 }
    ],
    BATTING: [
      { rank: 1, name: 'Babar Azam', team: 'Pakistan', rating: 824 },
      { rank: 2, name: 'Rohit Sharma', team: 'India', rating: 765 },
      { rank: 3, name: 'Shubman Gill', team: 'India', rating: 761 },
      { rank: 4, name: 'Virat Kohli', team: 'India', rating: 746 },
      { rank: 5, name: 'Harry Brook', team: 'England', rating: 728 }
    ],
    BOWLING: [
      { rank: 1, name: 'Keshav Maharaj', team: 'South Africa', rating: 716 },
      { rank: 2, name: 'Josh Hazlewood', team: 'Australia', rating: 688 },
      { rank: 3, name: 'Adam Zampa', team: 'Australia', rating: 686 },
      { rank: 4, name: 'Jasprit Bumrah', team: 'India', rating: 685 },
      { rank: 5, name: 'Kuldeep Yadav', team: 'India', rating: 665 }
    ],
    ALL_ROUNDERS: [
      { rank: 1, name: 'Mohammad Nabi', team: 'Afghanistan', rating: 320 },
      { rank: 2, name: 'Sikandar Raza', team: 'Zimbabwe', rating: 288 },
      { rank: 3, name: 'Assad Vala', team: 'PNG', rating: 248 },
      { rank: 4, name: 'Glenn Maxwell', team: 'Australia', rating: 235 },
      { rank: 5, name: 'Ravindra Jadeja', team: 'India', rating: 228 }
    ]
  },
  TEST: {
    TEAMS: [
      { rank: 1, team: 'Australia', rating: 124, points: 3720 },
      { rank: 2, team: 'India', rating: 120, points: 4210 },
      { rank: 3, team: 'England', rating: 111, points: 4440 },
      { rank: 4, team: 'South Africa', rating: 103, points: 2060 },
      { rank: 5, team: 'New Zealand', rating: 96, points: 2880 }
    ],
    BATTING: [
      { rank: 1, name: 'Kane Williamson', team: 'New Zealand', rating: 883 },
      { rank: 2, name: 'Joe Root', team: 'England', rating: 872 },
      { rank: 3, name: 'Yashasvi Jaiswal', team: 'India', rating: 840 },
      { rank: 4, name: 'Steve Smith', team: 'Australia', rating: 818 },
      { rank: 5, name: 'Virat Kohli', team: 'India', rating: 785 }
    ],
    BOWLING: [
      { rank: 1, name: 'Ravichandran Ashwin', team: 'India', rating: 870 },
      { rank: 2, name: 'Jasprit Bumrah', team: 'India', rating: 847 },
      { rank: 3, name: 'Josh Hazlewood', team: 'Australia', rating: 847 },
      { rank: 4, name: 'Pat Cummins', team: 'Australia', rating: 821 },
      { rank: 5, name: 'Kagiso Rabada', team: 'South Africa', rating: 812 }
    ],
    ALL_ROUNDERS: [
      { rank: 1, name: 'Ravindra Jadeja', team: 'India', rating: 444 },
      { rank: 2, name: 'Ravichandran Ashwin', team: 'India', rating: 322 },
      { rank: 3, name: 'Shakib Al Hasan', team: 'Bangladesh', rating: 310 },
      { rank: 4, name: 'Ben Stokes', team: 'England', rating: 280 },
      { rank: 5, name: 'Jason Holder', team: 'West Indies', rating: 275 }
    ]
  }
};
