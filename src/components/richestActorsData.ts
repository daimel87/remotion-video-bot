export type Actor = {
  name: string;
  netWorth: number; // in millions
  photo: string;
  flag: string;
  color: string;
};

export const ACTORS: Actor[] = [
  { name: 'Jerry Seinfeld', netWorth: 1100, photo: '', flag: '🇺🇸', color: '#E8B838' },
  { name: 'Tyler Perry', netWorth: 1000, photo: '', flag: '🇺🇸', color: '#7B1FA2' },
  { name: 'Dwayne Johnson', netWorth: 900, photo: '', flag: '🇺🇸', color: '#37474F' },
  { name: 'Tom Cruise', netWorth: 800, photo: '', flag: '🇺🇸', color: '#1565C0' },
  { name: 'Shah Rukh Khan', netWorth: 770, photo: '', flag: '🇮🇳', color: '#E65100' },
  { name: 'George Clooney', netWorth: 500, photo: '', flag: '🇺🇸', color: '#455A64' },
  { name: 'Robert De Niro', netWorth: 500, photo: '', flag: '🇺🇸', color: '#B71C1C' },
  { name: 'Arnold Schwarzenegger', netWorth: 450, photo: '', flag: '🇦🇹', color: '#2E7D32' },
  { name: 'Adam Sandler', netWorth: 440, photo: '', flag: '🇺🇸', color: '#F57F17' },
  { name: 'Mel Gibson', netWorth: 425, photo: '', flag: '🇺🇸', color: '#0D47A1' },
  { name: 'Jack Nicholson', netWorth: 400, photo: '', flag: '🇺🇸', color: '#880E4F' },
  { name: 'Sylvester Stallone', netWorth: 400, photo: '', flag: '🇺🇸', color: '#C62828' },
  { name: 'Keanu Reeves', netWorth: 380, photo: '', flag: '🇨🇦', color: '#1B5E20' },
  { name: 'Reese Witherspoon', netWorth: 400, photo: '', flag: '🇺🇸', color: '#AD1457' },
  { name: 'Will Smith', netWorth: 350, photo: '', flag: '🇺🇸', color: '#4527A0' },
  { name: 'Mark Wahlberg', netWorth: 400, photo: '', flag: '🇺🇸', color: '#00695C' },
];
