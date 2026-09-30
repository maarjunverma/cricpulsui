/**
 * matchDetailsHelper.js
 * Comprehensive cricket squads, ground venues, pitch reports, and match metadata helper
 */

export const TEAM_SQUADS_DATABASE = {
  IND: {
    name: 'India',
    shortName: 'IND',
    color: '#00529b',
    captain: 'Rohit Sharma',
    wicketKeeper: 'Rishabh Pant',
    squad: [
      { id: 'ind_1', name: 'Rohit Sharma', role: 'Batsman', isCaptain: true, batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 262, runs: 10856, hs: '264', avg: 49.12, sr: 92.43, hundred: 31, fifty: 55 } } },
      { id: 'ind_2', name: 'Yashasvi Jaiswal', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 23, runs: 1120, hs: '214*', avg: 56.0, sr: 140.2 } } },
      { id: 'ind_3', name: 'Virat Kohli', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm medium', stats: { bat: { mat: 295, runs: 13906, hs: '183', avg: 58.18, sr: 93.54, hundred: 50, fifty: 72 } } },
      { id: 'ind_4', name: 'Shubman Gill', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 47, runs: 2328, hs: '208', avg: 58.2, sr: 101.7, hundred: 6, fifty: 13 } } },
      { id: 'ind_5', name: 'Rishabh Pant', role: 'Wicketkeeper', isKeeper: true, batting: 'Left-hand bat', bowling: 'None', stats: { bat: { mat: 35, runs: 1250, hs: '125*', avg: 38.5, sr: 135.6, hundred: 1, fifty: 8 } } },
      { id: 'ind_6', name: 'Hardik Pandya', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm fast-medium', stats: { bat: { mat: 86, runs: 1769, hs: '92*', avg: 34.0, sr: 110.3 }, bowl: { mat: 86, wkts: 84, best: '4/38', avg: 35.6, econ: 5.56 } } },
      { id: 'ind_7', name: 'Ravindra Jadeja', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 197, runs: 2888, hs: '87', avg: 32.44, sr: 85.2 }, bowl: { mat: 197, wkts: 220, best: '5/36', avg: 37.3, econ: 4.88 } } },
      { id: 'ind_8', name: 'Axar Patel', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 57, runs: 489, hs: '64*', avg: 19.5, sr: 104.2 }, bowl: { mat: 57, wkts: 60, best: '3/24', avg: 31.8, econ: 4.43 } } },
      { id: 'ind_9', name: 'Kuldeep Yadav', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Left-arm wrist spin', stats: { bowl: { mat: 103, wkts: 172, best: '6/25', avg: 24.8, econ: 4.96 } } },
      { id: 'ind_10', name: 'Jasprit Bumrah', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 89, wkts: 149, best: '6/19', avg: 23.55, econ: 4.59 } } },
      { id: 'ind_11', name: 'Arshdeep Singh', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Left-arm medium-fast', stats: { bowl: { mat: 52, wkts: 83, best: '4/9', avg: 19.1, econ: 8.34 } } },
      { id: 'ind_12', name: 'Mohammed Siraj', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 41, wkts: 68, best: '6/21', avg: 22.7, econ: 5.12 } } },
    ]
  },
  AUS: {
    name: 'Australia',
    shortName: 'AUS',
    color: '#ffcd00',
    captain: 'Mitchell Marsh',
    wicketKeeper: 'Alex Carey',
    squad: [
      { id: 'aus_1', name: 'Travis Head', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 65, runs: 2393, hs: '152', avg: 42.7, sr: 103.8, hundred: 3, fifty: 16 } } },
      { id: 'aus_2', name: 'David Warner', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 161, runs: 6932, hs: '179', avg: 45.3, sr: 97.2, hundred: 22, fifty: 33 } } },
      { id: 'aus_3', name: 'Mitchell Marsh', role: 'All-rounder', isCaptain: true, batting: 'Right-hand bat', bowling: 'Right-arm medium', stats: { bat: { mat: 89, runs: 2450, hs: '102*', avg: 34.5, sr: 94.8 }, bowl: { mat: 89, wkts: 57, best: '5/27', avg: 36.8, econ: 5.6 } } },
      { id: 'aus_4', name: 'Steve Smith', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 155, runs: 5446, hs: '164', avg: 43.91, sr: 87.33, hundred: 12, fifty: 32 } } },
      { id: 'aus_5', name: 'Glenn Maxwell', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 138, runs: 3895, hs: '201*', avg: 35.4, sr: 126.9 }, bowl: { mat: 138, wkts: 70, best: '4/40', avg: 38.2, econ: 5.4 } } },
      { id: 'aus_6', name: 'Marcus Stoinis', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm medium-fast', stats: { bat: { mat: 70, runs: 1480, hs: '146*', avg: 28.5, sr: 94.0 }, bowl: { mat: 70, wkts: 46, best: '3/16', avg: 42.0, econ: 6.0 } } },
      { id: 'aus_7', name: 'Alex Carey', role: 'Wicketkeeper', isKeeper: true, batting: 'Left-hand bat', bowling: 'None', stats: { bat: { mat: 76, runs: 1812, hs: '106', avg: 34.1, sr: 88.5 } } },
      { id: 'aus_8', name: 'Pat Cummins', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 88, wkts: 141, best: '5/70', avg: 28.6, econ: 5.22 } } },
      { id: 'aus_9', name: 'Mitchell Starc', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Left-arm fast', stats: { bowl: { mat: 121, wkts: 236, best: '6/28', avg: 22.9, econ: 5.43 } } },
      { id: 'aus_10', name: 'Adam Zampa', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm legbreak', stats: { bowl: { mat: 99, wkts: 169, best: '5/19', avg: 28.0, econ: 5.48 } } },
      { id: 'aus_11', name: 'Josh Hazlewood', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Right-arm fast-medium', stats: { bowl: { mat: 85, wkts: 132, best: '6/52', avg: 26.8, econ: 4.79 } } },
    ]
  },
  ENG: {
    name: 'England',
    shortName: 'ENG',
    color: '#d41130',
    captain: 'Jos Buttler',
    wicketKeeper: 'Jos Buttler',
    squad: [
      { id: 'eng_1', name: 'Jos Buttler', role: 'Wicketkeeper', isCaptain: true, isKeeper: true, batting: 'Right-hand bat', bowling: 'None', stats: { bat: { mat: 181, runs: 5040, hs: '162*', avg: 39.7, sr: 117.1, hundred: 11, fifty: 26 } } },
      { id: 'eng_2', name: 'Phil Salt', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 24, runs: 850, hs: '119', avg: 38.6, sr: 165.4 } } },
      { id: 'eng_3', name: 'Will Jacks', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 18, runs: 420, hs: '108*', avg: 28.0, sr: 154.0 } } },
      { id: 'eng_4', name: 'Harry Brook', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm medium', stats: { bat: { mat: 15, runs: 410, hs: '80', avg: 34.2, sr: 143.5 } } },
      { id: 'eng_5', name: 'Jonny Bairstow', role: 'Batsman', batting: 'Right-hand bat', bowling: 'None', stats: { bat: { mat: 108, runs: 3861, hs: '141*', avg: 42.9, sr: 104.1 } } },
      { id: 'eng_6', name: 'Liam Livingstone', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm legbreak/offbreak', stats: { bat: { mat: 38, runs: 850, hs: '103', avg: 29.3, sr: 148.5 }, bowl: { mat: 38, wkts: 22, best: '3/17', avg: 31.4, econ: 7.9 } } },
      { id: 'eng_7', name: 'Moeen Ali', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 138, runs: 2355, hs: '128', avg: 25.1, sr: 99.4 }, bowl: { mat: 138, wkts: 111, best: '4/46', avg: 47.3, econ: 5.29 } } },
      { id: 'eng_8', name: 'Sam Curran', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Left-arm fast-medium', stats: { bat: { mat: 32, runs: 450, hs: '95*', avg: 23.6, sr: 132.5 }, bowl: { mat: 32, wkts: 34, best: '5/10', avg: 28.0, econ: 8.2 } } },
      { id: 'eng_9', name: 'Jofra Archer', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 25, wkts: 42, best: '6/40', avg: 24.5, econ: 4.88 } } },
      { id: 'eng_10', name: 'Adil Rashid', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm legbreak', stats: { bowl: { mat: 135, wkts: 199, best: '5/27', avg: 32.5, econ: 5.67 } } },
      { id: 'eng_11', name: 'Mark Wood', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 66, wkts: 108, best: '5/34', avg: 28.2, econ: 5.34 } } },
    ]
  },
  SA: {
    name: 'South Africa',
    shortName: 'SA',
    color: '#007a4d',
    captain: 'Aiden Markram',
    wicketKeeper: 'Quinton de Kock',
    squad: [
      { id: 'sa_1', name: 'Quinton de Kock', role: 'Wicketkeeper', isKeeper: true, batting: 'Left-hand bat', bowling: 'None', stats: { bat: { mat: 155, runs: 6774, hs: '178', avg: 45.7, sr: 96.6, hundred: 21, fifty: 30 } } },
      { id: 'sa_2', name: 'Reeza Hendricks', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 35, runs: 1040, hs: '102', avg: 29.7, sr: 130.4 } } },
      { id: 'sa_3', name: 'Aiden Markram', role: 'Batsman', isCaptain: true, batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 68, runs: 2145, hs: '175', avg: 36.9, sr: 98.4 }, bowl: { mat: 68, wkts: 20, best: '3/38', avg: 41.2, econ: 5.8 } } },
      { id: 'sa_4', name: 'Heinrich Klaasen', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 54, runs: 1723, hs: '174', avg: 40.0, sr: 111.6, hundred: 4, fifty: 6 } } },
      { id: 'sa_5', name: 'David Miller', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 173, runs: 4458, hs: '139', avg: 42.4, sr: 103.3, hundred: 6, fifty: 24 } } },
      { id: 'sa_6', name: 'Tristan Stubbs', role: 'Batsman', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 28, runs: 650, hs: '76', avg: 32.5, sr: 155.0 } } },
      { id: 'sa_7', name: 'Marco Jansen', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Left-arm fast', stats: { bat: { mat: 23, runs: 412, hs: '75', avg: 31.6, sr: 112.5 }, bowl: { mat: 23, wkts: 35, best: '5/39', avg: 34.0, econ: 6.2 } } },
      { id: 'sa_8', name: 'Keshav Maharaj', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Slow left-arm orthodox', stats: { bowl: { mat: 44, wkts: 55, best: '4/33', avg: 31.7, econ: 4.65 } } },
      { id: 'sa_9', name: 'Kagiso Rabada', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 101, wkts: 157, best: '6/16', avg: 27.7, econ: 5.08 } } },
      { id: 'sa_10', name: 'Anrich Nortje', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 33, wkts: 49, best: '4/18', avg: 27.2, econ: 5.75 } } },
      { id: 'sa_11', name: 'Lungi Ngidi', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast-medium', stats: { bowl: { mat: 56, wkts: 88, best: '6/58', avg: 28.0, econ: 5.78 } } },
    ]
  },
  PAK: {
    name: 'Pakistan',
    shortName: 'PAK',
    color: '#006629',
    captain: 'Babar Azam',
    wicketKeeper: 'Mohammad Rizwan',
    squad: [
      { id: 'pak_1', name: 'Saim Ayub', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 23, runs: 580, hs: '78', avg: 26.3, sr: 138.2 } } },
      { id: 'pak_2', name: 'Mohammad Rizwan', role: 'Wicketkeeper', isKeeper: true, batting: 'Right-hand bat', bowling: 'None', stats: { bat: { mat: 74, runs: 2088, hs: '131*', avg: 40.1, sr: 88.5, hundred: 3, fifty: 13 } } },
      { id: 'pak_3', name: 'Babar Azam', role: 'Batsman', isCaptain: true, batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 117, runs: 5729, hs: '158', avg: 56.7, sr: 88.7, hundred: 19, fifty: 32 } } },
      { id: 'pak_4', name: 'Fakhar Zaman', role: 'Batsman', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 82, runs: 3492, hs: '210*', avg: 46.5, sr: 93.4, hundred: 11, fifty: 16 } } },
      { id: 'pak_5', name: 'Iftikhar Ahmed', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 28, runs: 614, hs: '109*', avg: 38.3, sr: 106.5 }, bowl: { mat: 28, wkts: 16, best: '3/29', avg: 36.0, econ: 5.4 } } },
      { id: 'pak_6', name: 'Shadab Khan', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm legbreak', stats: { bat: { mat: 70, runs: 855, hs: '86', avg: 26.7, sr: 84.5 }, bowl: { mat: 70, wkts: 85, best: '4/27', avg: 34.0, econ: 5.2 } } },
      { id: 'pak_7', name: 'Imad Wasim', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 55, runs: 986, hs: '63*', avg: 42.8, sr: 110.2 }, bowl: { mat: 55, wkts: 44, best: '5/14', avg: 44.4, econ: 4.88 } } },
      { id: 'pak_8', name: 'Shaheen Shah Afridi', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Left-arm fast', stats: { bowl: { mat: 53, wkts: 104, best: '6/35', avg: 23.9, econ: 5.54 } } },
      { id: 'pak_9', name: 'Naseem Shah', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 18, wkts: 32, best: '5/33', avg: 19.8, econ: 4.82 } } },
      { id: 'pak_10', name: 'Haris Rauf', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 37, wkts: 69, best: '5/18', avg: 26.4, econ: 5.98 } } },
      { id: 'pak_11', name: 'Mohammad Amir', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Left-arm fast-medium', stats: { bowl: { mat: 61, wkts: 81, best: '5/30', avg: 29.6, econ: 4.77 } } },
    ]
  },
  MINY: {
    name: 'MI New York',
    shortName: 'MINY',
    color: '#004ba0',
    captain: 'Kieron Pollard',
    wicketKeeper: 'Nicholas Pooran',
    squad: [
      { id: 'miny_1', name: 'Monank Patel', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 18, runs: 420, hs: '68', avg: 28.0, sr: 125.0 } } },
      { id: 'miny_2', name: 'Shayan Jahangir', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 14, runs: 340, hs: '100*', avg: 30.9, sr: 132.0 } } },
      { id: 'miny_3', name: 'Nicholas Pooran', role: 'Wicketkeeper', isKeeper: true, batting: 'Left-hand bat', stats: { bat: { mat: 88, runs: 2150, hs: '137*', avg: 31.6, sr: 154.0 } } },
      { id: 'miny_4', name: 'Kieron Pollard', role: 'All-rounder', isCaptain: true, batting: 'Right-hand bat', bowling: 'Right-arm medium', stats: { bat: { mat: 620, runs: 12400, hs: '104', avg: 31.0, sr: 150.0 }, bowl: { mat: 620, wkts: 315, best: '4/15', avg: 28.0, econ: 8.2 } } },
      { id: 'miny_5', name: 'Dewald Brevis', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 45, runs: 1100, hs: '162', avg: 28.5, sr: 152.0 } } },
      { id: 'miny_6', name: 'Tim David', role: 'Batsman', batting: 'Right-hand bat', stats: { bat: { mat: 190, runs: 4200, hs: '92*', avg: 32.0, sr: 162.0 } } },
      { id: 'miny_7', name: 'Rashid Khan', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm legbreak', stats: { bowl: { mat: 410, wkts: 580, best: '5/3', avg: 18.2, econ: 6.4 } } },
      { id: 'miny_8', name: 'Trent Boult', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Left-arm fast-medium', stats: { bowl: { mat: 215, wkts: 260, best: '4/18', avg: 22.0, econ: 7.9 } } },
      { id: 'miny_9', name: 'Kagiso Rabada', role: 'Bowler', batting: 'Left-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 195, wkts: 245, best: '4/21', avg: 23.5, econ: 8.1 } } },
      { id: 'miny_10', name: 'Nosthush Kenjige', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Slow left-arm orthodox', stats: { bowl: { mat: 35, wkts: 38, best: '3/16', avg: 24.0, econ: 7.2 } } },
      { id: 'miny_11', name: 'Ehsan Adil', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast-medium', stats: { bowl: { mat: 28, wkts: 30, best: '3/22', avg: 27.0, econ: 8.5 } } },
    ]
  },
  WAF: {
    name: 'Washington Freedom',
    shortName: 'WAF',
    color: '#dc2626',
    captain: 'Steve Smith',
    wicketKeeper: 'Andries Gous',
    squad: [
      { id: 'waf_1', name: 'Travis Head', role: 'Batsman', batting: 'Left-hand bat', stats: { bat: { mat: 140, runs: 3950, hs: '152', avg: 32.0, sr: 158.0 } } },
      { id: 'waf_2', name: 'Steve Smith', role: 'Batsman', isCaptain: true, batting: 'Right-hand bat', stats: { bat: { mat: 245, runs: 5350, hs: '125*', avg: 31.0, sr: 128.0 } } },
      { id: 'waf_3', name: 'Rachin Ravindra', role: 'All-rounder', batting: 'Left-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 65, runs: 1450, hs: '116', avg: 29.0, sr: 142.0 }, bowl: { mat: 65, wkts: 38, best: '3/22', avg: 28.0, econ: 7.6 } } },
      { id: 'waf_4', name: 'Glenn Maxwell', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm offbreak', stats: { bat: { mat: 420, runs: 9600, hs: '154*', avg: 28.0, sr: 153.0 }, bowl: { mat: 420, wkts: 160, best: '4/18', avg: 30.0, econ: 7.8 } } },
      { id: 'waf_5', name: 'Andries Gous', role: 'Wicketkeeper', isKeeper: true, batting: 'Right-hand bat', stats: { bat: { mat: 42, runs: 1120, hs: '80*', avg: 33.0, sr: 144.0 } } },
      { id: 'waf_6', name: 'Obus Pienaar', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Slow left-arm orthodox', stats: { bat: { mat: 60, runs: 980, hs: '64', avg: 25.0, sr: 130.0 } } },
      { id: 'waf_7', name: 'Marco Jansen', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Left-arm fast', stats: { bowl: { mat: 95, wkts: 112, best: '5/32', avg: 24.5, econ: 8.3 } } },
      { id: 'waf_8', name: 'Ian Holland', role: 'All-rounder', batting: 'Right-hand bat', bowling: 'Right-arm medium', stats: { bowl: { mat: 48, wkts: 44, best: '3/19', avg: 28.0, econ: 7.9 } } },
      { id: 'waf_9', name: 'Lockie Ferguson', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Right-arm fast', stats: { bowl: { mat: 155, wkts: 185, best: '5/21', avg: 23.0, econ: 7.7 } } },
      { id: 'waf_10', name: 'Saurabh Netravalkar', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Left-arm fast-medium', stats: { bowl: { mat: 52, wkts: 72, best: '5/18', avg: 20.1, econ: 7.1 } } },
      { id: 'waf_11', name: 'Amila Aponso', role: 'Bowler', batting: 'Right-hand bat', bowling: 'Slow left-arm orthodox', stats: { bowl: { mat: 65, wkts: 74, best: '4/11', avg: 22.0, econ: 6.9 } } },
    ]
  },
};

export const VENUE_DETAILS_DATABASE = {
  "Grand Prairie Stadium, Dallas": {
    name: "Grand Prairie Stadium",
    city: "Dallas, Texas",
    country: "USA",
    capacity: "15,000",
    pitchReport: "Batting-friendly surface with consistent bounce and true carry. True pace off the deck makes it ideal for stroke play. Dew expected in the 2nd innings.",
    weather: "28°C, Clear night skies, 42% humidity, 0% rain probability",
    boundaries: "Straight: 72m | Square: 65m | Deep Midwicket: 75m",
    avgFirstInnings: "178 runs (T20)",
    tossTrend: "Teams winning toss bowl first (72% win rate)",
    umpires: "Jermaine Lindo, Rushane Samuels",
    thirdUmpire: "Billy Taylor",
    referee: "Simon Taufel"
  },
  "Lord's Cricket Ground, London": {
    name: "Lord's Cricket Ground",
    city: "London",
    country: "England",
    capacity: "31,100",
    pitchReport: "Traditional English surface with natural Lord's slope (2.5m). Seamers get sharp movement in first hour under cloud cover. Flattens out beautifully for batting on Days 2 & 3.",
    weather: "21°C, Overcast morning with sunny intervals later, 65% humidity",
    boundaries: "Straight: 76m | Square: 68m | Mound Stand: 72m",
    avgFirstInnings: "312 runs (Test) / 255 runs (ODI)",
    tossTrend: "Captains prefer to bat first to avoid Day 4/5 deterioration",
    umpires: "Richard Kettleborough, Nitin Menon",
    thirdUmpire: "Kumar Dharmasena",
    referee: "Javagal Srinath"
  },
  "Wankhede Stadium, Mumbai": {
    name: "Wankhede Stadium",
    city: "Mumbai, Maharashtra",
    country: "India",
    capacity: "33,108",
    pitchReport: "Red soil wicket providing excellent bounce and carry. High-scoring venue with short boundaries. Heavy evening dew makes chasing very favorable.",
    weather: "31°C, Warm & humid evening, 76% humidity, gentle coastal sea breeze",
    boundaries: "Straight: 68m | Square: 62m | Fine Leg: 58m",
    avgFirstInnings: "192 runs (T20)",
    tossTrend: "Win toss and chase (dew makes defending difficult)",
    umpires: "Anil Chaudhary, KN Ananthapadmanabhan",
    thirdUmpire: "Virender Sharma",
    referee: "Manu Nayyar"
  },
  "The Oval, London": {
    name: "Kennington Oval",
    city: "London",
    country: "England",
    capacity: "27,500",
    pitchReport: "True bounce and pace. Known as one of the best batting pitches in England with exceptional value for shots. Spinners come into play in later stages.",
    weather: "23°C, Pleasant sunshine, 50% humidity",
    boundaries: "Straight: 74m | Square: 67m",
    avgFirstInnings: "288 runs (ODI)",
    tossTrend: "Batting first produces 58% winning percentage",
    umpires: "Michael Gough, Alex Wharf",
    thirdUmpire: "Richard Illingworth",
    referee: "David Boon"
  },
  "Church Street Park, Morrisville": {
    name: "Church Street Park",
    city: "Morrisville, North Carolina",
    country: "USA",
    capacity: "4,500",
    pitchReport: "Hard turf track offering high pace and spin grip in the middle overs. Par score is around 165.",
    weather: "26°C, Mild breeze, 55% humidity",
    boundaries: "Straight: 70m | Square: 64m",
    avgFirstInnings: "166 runs (T20)",
    tossTrend: "Balanced win ratio between batting and chasing",
    umpires: "Vijaya Mallela, Aditya Gajjar",
    thirdUmpire: "Leslie Reifer",
    referee: "Roshan Mahanama"
  },
  "Gaddafi Stadium, Lahore": {
    name: "Gaddafi Stadium",
    city: "Lahore",
    country: "Pakistan",
    capacity: "27,000",
    pitchReport: "Flat subcontinent batting paradise. Quick outfield and minimal lateral seam movement. Spinners play a crucial role during middle overs.",
    weather: "34°C, Dry and clear skies, 38% humidity",
    boundaries: "Straight: 75m | Square: 65m",
    avgFirstInnings: "295 runs (ODI) / 185 runs (T20)",
    tossTrend: "Batting first provides substantial psychological advantage",
    umpires: "Aleem Dar, Ahsan Raza",
    thirdUmpire: "Asif Yaqoob",
    referee: "Ranjan Madugalle"
  },
  "Eden Park, Auckland": {
    name: "Eden Park",
    city: "Auckland",
    country: "New Zealand",
    capacity: "42,000",
    pitchReport: "Unique rugby-dimension layout with extraordinarily short straight boundaries (55m) and long square boundaries. High-scoring thriller venue.",
    weather: "18°C, Crisp sea air, 60% humidity",
    boundaries: "Straight: 55m | Square: 78m | Covers: 72m",
    avgFirstInnings: "182 runs (T20)",
    tossTrend: "Teams prefer chasing on small straight grounds",
    umpires: "Chris Gaffaney, Shaun Haig",
    thirdUmpire: "Wayne Knights",
    referee: "Jeff Crowe"
  },
  "Sabina Park, Kingston": {
    name: "Sabina Park",
    city: "Kingston",
    country: "Jamaica",
    capacity: "20,000",
    pitchReport: "Historically fast and bouncy pitch. Good seam carry with tennis-ball bounce. Variable bounce develops as pitch wears down.",
    weather: "29°C, Tropical sunshine with sea breeze, 70% humidity",
    boundaries: "Straight: 71m | Square: 66m",
    avgFirstInnings: "172 runs (T20)",
    tossTrend: "Chasing teams have slightly higher success rate",
    umpires: "Gregory Brathwaite, Patrick Gustard",
    thirdUmpire: "Nigel Duguid",
    referee: "Sir Richie Richardson"
  }
};

/**
 * Extracts and enhances match details with full squads, ground stats, and match meta
 */
export function getEnrichedMatchDetails(match) {
  if (!match) return null;

  const t1Key = (match.team1?.shortName || match.team1?.name || '').toUpperCase();
  const t2Key = (match.team2?.shortName || match.team2?.name || '').toUpperCase();

  // 1. Resolve squads
  const dbT1 = TEAM_SQUADS_DATABASE[t1Key] || Object.values(TEAM_SQUADS_DATABASE).find(t => t.name.toLowerCase() === (match.team1?.name || '').toLowerCase());
  const dbT2 = TEAM_SQUADS_DATABASE[t2Key] || Object.values(TEAM_SQUADS_DATABASE).find(t => t.name.toLowerCase() === (match.team2?.name || '').toLowerCase());

  const team1Squad = (match.team1?.squad && match.team1.squad.length > 0)
    ? match.team1.squad
    : (dbT1?.squad || generateFallbackSquad(match.team1?.name || 'Team 1', t1Key));

  const team2Squad = (match.team2?.squad && match.team2.squad.length > 0)
    ? match.team2.squad
    : (dbT2?.squad || generateFallbackSquad(match.team2?.name || 'Team 2', t2Key));

  // 2. Resolve Venue / Ground details
  const venueKey = Object.keys(VENUE_DETAILS_DATABASE).find(k => 
    (match.venue || '').toLowerCase().includes(k.split(',')[0].toLowerCase())
  );
  const venueInfo = (venueKey && VENUE_DETAILS_DATABASE[venueKey]) || {
    name: match.venue || 'International Cricket Stadium',
    city: (match.venue && match.venue.includes(',')) ? match.venue.split(',')[1].trim() : 'Host City',
    country: 'International Venue',
    capacity: '28,000',
    pitchReport: 'Balanced wicket offering genuine pace with new ball and gradual assistance for spinners in later overs.',
    weather: '26°C, Fine cricket weather, 48% humidity',
    boundaries: 'Straight: 72m | Square: 66m',
    avgFirstInnings: match.format === 'T20' ? '175 runs' : match.format === 'ODI' ? '280 runs' : '315 runs',
    tossTrend: 'Balanced outcomes for both batting and bowling first',
    umpires: 'Elite Panel ICC Umpires',
    thirdUmpire: 'TV Umpire (DRS Available)',
    referee: 'ICC Match Referee'
  };

  // 3. Resolve Head to Head stats
  const headToHead = {
    total: 18,
    team1Wins: 10,
    team2Wins: 7,
    noResult: 1,
    lastFive: [
      { winner: match.team1?.shortName || 'T1', margin: '4 wkts', date: '2025' },
      { winner: match.team2?.shortName || 'T2', margin: '14 runs', date: '2024' },
      { winner: match.team1?.shortName || 'T1', margin: '6 wkts', date: '2024' },
      { winner: match.team1?.shortName || 'T1', margin: '22 runs', date: '2023' },
      { winner: match.team2?.shortName || 'T2', margin: '3 wkts', date: '2023' }
    ]
  };

  return {
    ...match,
    team1: {
      ...match.team1,
      name: match.team1?.name || 'Team 1',
      shortName: match.team1?.shortName || t1Key || 'T1',
      color: match.team1?.color || dbT1?.color || '#00529b',
      captain: dbT1?.captain || (team1Squad[0]?.name),
      wicketKeeper: dbT1?.wicketKeeper || (team1Squad.find(p => p.role === 'Wicketkeeper')?.name || team1Squad[4]?.name),
      squad: team1Squad
    },
    team2: {
      ...match.team2,
      name: match.team2?.name || 'Team 2',
      shortName: match.team2?.shortName || t2Key || 'T2',
      color: match.team2?.color || dbT2?.color || '#dc2626',
      captain: dbT2?.captain || (team2Squad[0]?.name),
      wicketKeeper: dbT2?.wicketKeeper || (team2Squad.find(p => p.role === 'Wicketkeeper')?.name || team2Squad[4]?.name),
      squad: team2Squad
    },
    venueInfo,
    headToHead,
    matchDate: match.date || 'Upcoming Match Date',
    matchTime: match.time || '19:30 IST / 14:00 GMT'
  };
}

/**
 * Fallback squad generator for lesser-known or dynamically added teams
 */
function generateFallbackSquad(teamName, prefix) {
  const roles = [
    { role: 'Batsman', isCaptain: true },
    { role: 'Batsman' },
    { role: 'Batsman' },
    { role: 'Batsman' },
    { role: 'Wicketkeeper', isKeeper: true },
    { role: 'All-rounder' },
    { role: 'All-rounder' },
    { role: 'Bowler' },
    { role: 'Bowler' },
    { role: 'Bowler' },
    { role: 'Bowler' },
  ];

  return roles.map((r, i) => ({
    id: `${prefix || 'tm'}_${i + 1}`,
    name: `${teamName} Player ${i + 1}`,
    role: r.role,
    isCaptain: !!r.isCaptain,
    isKeeper: !!r.isKeeper,
    batting: i % 3 === 0 ? 'Left-hand bat' : 'Right-hand bat',
    bowling: r.role === 'Bowler' || r.role === 'All-rounder' ? (i % 2 === 0 ? 'Right-arm fast' : 'Slow left-arm') : 'None',
    stats: {
      bat: { mat: 25 + i * 3, runs: 450 + i * 80, hs: `${75 + i}`, avg: (30 + i * 0.8).toFixed(1), sr: (120 + i * 2).toFixed(1) },
      bowl: r.role === 'Bowler' || r.role === 'All-rounder' ? { mat: 25 + i * 3, wkts: 20 + i * 4, best: '3/22', avg: 26.5, econ: 7.4 } : null
    }
  }));
}
