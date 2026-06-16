export type Athlete = {
  name: string;
  color: string;
  sport: string;
  flag: string;
  emoji: string;
};

export type YearSnapshot = {
  year: number;
  earnings: Record<string, number>;
};

export const ATHLETES: Athlete[] = [
  { name: 'Mike Tyson', color: '#B71C1C', sport: 'Boxing', flag: '🇺🇸', emoji: '🥊' },
  { name: 'Michael Jordan', color: '#880E4F', sport: 'Basketball', flag: '🇺🇸', emoji: '🏀' },
  { name: 'Evander Holyfield', color: '#D84315', sport: 'Boxing', flag: '🇺🇸', emoji: '🥊' },
  { name: 'Jack Nicklaus', color: '#795548', sport: 'Golf', flag: '🇺🇸', emoji: '⛳' },
  { name: 'Arnold Palmer', color: '#F9A825', sport: 'Golf', flag: '🇺🇸', emoji: '⛳' },
  { name: 'Andre Agassi', color: '#7E57C2', sport: 'Tennis', flag: '🇺🇸', emoji: '🎾' },
  { name: 'Pete Sampras', color: '#0097A7', sport: 'Tennis', flag: '🇺🇸', emoji: '🎾' },
  { name: 'Shaquille O\'Neal', color: '#4527A0', sport: 'Basketball', flag: '🇺🇸', emoji: '🏀' },
  { name: 'Tiger Woods', color: '#1B5E20', sport: 'Golf', flag: '🇺🇸', emoji: '⛳' },
  { name: 'Michael Schumacher', color: '#E65100', sport: 'F1', flag: '🇩🇪', emoji: '🏎️' },
  { name: 'David Beckham', color: '#1565C0', sport: 'Soccer', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', emoji: '⚽' },
  { name: 'Kobe Bryant', color: '#8E24AA', sport: 'Basketball', flag: '🇺🇸', emoji: '🏀' },
  { name: 'Roger Federer', color: '#4E342E', sport: 'Tennis', flag: '🇨🇭', emoji: '🎾' },
  { name: 'LeBron James', color: '#6A1B9A', sport: 'Basketball', flag: '🇺🇸', emoji: '🏀' },
  { name: 'Manny Pacquiao', color: '#558B2F', sport: 'Boxing', flag: '🇵🇭', emoji: '🥊' },
  { name: 'Floyd Mayweather', color: '#F57F17', sport: 'Boxing', flag: '🇺🇸', emoji: '🥊' },
  { name: 'Cristiano Ronaldo', color: '#C62828', sport: 'Soccer', flag: '🇵🇹', emoji: '⚽' },
  { name: 'Lionel Messi', color: '#0D47A1', sport: 'Soccer', flag: '🇦🇷', emoji: '⚽' },
  { name: 'Neymar', color: '#2E7D32', sport: 'Soccer', flag: '🇧🇷', emoji: '⚽' },
  { name: 'Conor McGregor', color: '#37474F', sport: 'MMA', flag: '🇮🇪', emoji: '🥋' },
  { name: 'Canelo Alvarez', color: '#AD1457', sport: 'Boxing', flag: '🇲🇽', emoji: '🥊' },
  { name: 'Kylian Mbappé', color: '#00695C', sport: 'Soccer', flag: '🇫🇷', emoji: '⚽' },
  { name: 'Stephen Curry', color: '#EF6C00', sport: 'Basketball', flag: '🇺🇸', emoji: '🏀' },
  { name: 'Giannis Antetokounmpo', color: '#006064', sport: 'Basketball', flag: '🇬🇷', emoji: '🏀' },
];

export const YEAR_SNAPSHOTS: YearSnapshot[] = [
  { year: 1990, earnings: { 'Mike Tyson': 28, 'Michael Jordan': 18, 'Jack Nicklaus': 14, 'Arnold Palmer': 12, 'Evander Holyfield': 10, 'Andre Agassi': 5 } },
  { year: 1993, earnings: { 'Michael Jordan': 40, 'Evander Holyfield': 24, 'Mike Tyson': 5, 'Jack Nicklaus': 13, 'Arnold Palmer': 11, 'Andre Agassi': 12, 'Pete Sampras': 8 } },
  { year: 1996, earnings: { 'Mike Tyson': 75, 'Michael Jordan': 52, 'Evander Holyfield': 25, 'Andre Agassi': 20, 'Pete Sampras': 17, 'Jack Nicklaus': 12, 'Arnold Palmer': 10 } },
  { year: 1998, earnings: { 'Michael Jordan': 78, 'Mike Tyson': 30, 'Evander Holyfield': 19, 'Andre Agassi': 22, 'Pete Sampras': 18, 'Tiger Woods': 26, 'Jack Nicklaus': 11 } },
  { year: 2000, earnings: { 'Tiger Woods': 53, 'Michael Jordan': 33, 'Mike Tyson': 30, 'Shaquille O\'Neal': 24, 'Andre Agassi': 22, 'Pete Sampras': 20, 'Michael Schumacher': 30 } },
  { year: 2002, earnings: { 'Tiger Woods': 62, 'Michael Schumacher': 50, 'Shaquille O\'Neal': 30, 'David Beckham': 20, 'Kobe Bryant': 18, 'Andre Agassi': 18, 'Michael Jordan': 35, 'Pete Sampras': 15 } },
  { year: 2004, earnings: { 'Tiger Woods': 80, 'Michael Schumacher': 50, 'Kobe Bryant': 22, 'Shaquille O\'Neal': 25, 'David Beckham': 30, 'LeBron James': 15, 'Andre Agassi': 20 } },
  { year: 2006, earnings: { 'Tiger Woods': 90, 'Kobe Bryant': 26, 'LeBron James': 24, 'David Beckham': 35, 'Roger Federer': 20, 'Cristiano Ronaldo': 15, 'Lionel Messi': 5, 'Michael Schumacher': 20 } },
  { year: 2008, earnings: { 'Tiger Woods': 115, 'Roger Federer': 35, 'Cristiano Ronaldo': 30, 'Lionel Messi': 20, 'Kobe Bryant': 38, 'LeBron James': 32, 'David Beckham': 30, 'Manny Pacquiao': 30 } },
  { year: 2010, earnings: { 'Tiger Woods': 90, 'Roger Federer': 58, 'Kobe Bryant': 48, 'LeBron James': 43, 'Cristiano Ronaldo': 38, 'Lionel Messi': 32, 'David Beckham': 40, 'Manny Pacquiao': 70, 'Floyd Mayweather': 60 } },
  { year: 2012, earnings: { 'Tiger Woods': 80, 'Floyd Mayweather': 85, 'Manny Pacquiao': 60, 'Roger Federer': 55, 'Cristiano Ronaldo': 42, 'Lionel Messi': 40, 'Kobe Bryant': 52, 'LeBron James': 53, 'David Beckham': 35 } },
  { year: 2014, earnings: { 'Floyd Mayweather': 105, 'Tiger Woods': 65, 'Cristiano Ronaldo': 52, 'Lionel Messi': 50, 'Kobe Bryant': 52, 'LeBron James': 64, 'Roger Federer': 67, 'Manny Pacquiao': 55 } },
  { year: 2015, earnings: { 'Floyd Mayweather': 300, 'Manny Pacquiao': 160, 'Cristiano Ronaldo': 79, 'Lionel Messi': 73, 'Roger Federer': 67, 'LeBron James': 64, 'Tiger Woods': 50 } },
  { year: 2016, earnings: { 'Floyd Mayweather': 50, 'Cristiano Ronaldo': 88, 'Lionel Messi': 81, 'LeBron James': 77, 'Roger Federer': 68, 'Stephen Curry': 47, 'Tiger Woods': 45 } },
  { year: 2017, earnings: { 'Floyd Mayweather': 275, 'Cristiano Ronaldo': 93, 'Lionel Messi': 80, 'LeBron James': 86, 'Roger Federer': 65, 'Stephen Curry': 47, 'Conor McGregor': 35 } },
  { year: 2018, earnings: { 'Cristiano Ronaldo': 108, 'Lionel Messi': 111, 'LeBron James': 85, 'Neymar': 90, 'Roger Federer': 77, 'Stephen Curry': 76, 'Conor McGregor': 99, 'Canelo Alvarez': 45 } },
  { year: 2019, earnings: { 'Lionel Messi': 127, 'Roger Federer': 93, 'Cristiano Ronaldo': 109, 'Neymar': 75, 'LeBron James': 89, 'Stephen Curry': 79, 'Conor McGregor': 47, 'Canelo Alvarez': 94 } },
  { year: 2020, earnings: { 'Roger Federer': 106, 'Lionel Messi': 104, 'Cristiano Ronaldo': 105, 'LeBron James': 88, 'Neymar': 95, 'Stephen Curry': 74, 'Conor McGregor': 48, 'Canelo Alvarez': 35 } },
  { year: 2021, earnings: { 'Conor McGregor': 180, 'Lionel Messi': 130, 'Cristiano Ronaldo': 120, 'Neymar': 95, 'LeBron James': 97, 'Stephen Curry': 92, 'Canelo Alvarez': 90, 'Roger Federer': 90, 'Giannis Antetokounmpo': 70, 'Kylian Mbappé': 43 } },
  { year: 2022, earnings: { 'Lionel Messi': 130, 'LeBron James': 121, 'Cristiano Ronaldo': 115, 'Neymar': 95, 'Stephen Curry': 92, 'Roger Federer': 90, 'Giannis Antetokounmpo': 80, 'Canelo Alvarez': 85, 'Tiger Woods': 68, 'Conor McGregor': 50 } },
  { year: 2023, earnings: { 'Cristiano Ronaldo': 136, 'Lionel Messi': 135, 'Kylian Mbappé': 120, 'LeBron James': 119, 'Canelo Alvarez': 110, 'Neymar': 105, 'Stephen Curry': 100, 'Giannis Antetokounmpo': 80, 'Conor McGregor': 60 } },
  { year: 2024, earnings: { 'Cristiano Ronaldo': 260, 'Lionel Messi': 135, 'LeBron James': 128, 'Kylian Mbappé': 125, 'Canelo Alvarez': 100, 'Giannis Antetokounmpo': 80, 'Stephen Curry': 57, 'Neymar': 85, 'Conor McGregor': 55 } },
  { year: 2025, earnings: { 'Cristiano Ronaldo': 275, 'Lionel Messi': 140, 'LeBron James': 130, 'Kylian Mbappé': 128, 'Canelo Alvarez': 105, 'Giannis Antetokounmpo': 85, 'Stephen Curry': 60, 'Neymar': 80, 'Conor McGregor': 50 } },
];

export function getEarningsAtYear(year: number): Record<string, number> {
  const snapshots = YEAR_SNAPSHOTS;
  if (year <= snapshots[0].year) return { ...snapshots[0].earnings };
  if (year >= snapshots[snapshots.length - 1].year) return { ...snapshots[snapshots.length - 1].earnings };

  let lowerIdx = 0;
  for (let i = 0; i < snapshots.length - 1; i++) {
    if (snapshots[i].year <= year && snapshots[i + 1].year >= year) {
      lowerIdx = i;
      break;
    }
  }

  const lower = snapshots[lowerIdx];
  const upper = snapshots[lowerIdx + 1];
  const t = (year - lower.year) / (upper.year - lower.year);

  const result: Record<string, number> = {};
  const allNames = new Set([...Object.keys(lower.earnings), ...Object.keys(upper.earnings)]);
  for (const name of allNames) {
    const lv = lower.earnings[name] ?? 0;
    const uv = upper.earnings[name] ?? 0;
    result[name] = lv + (uv - lv) * t;
  }
  return result;
}
