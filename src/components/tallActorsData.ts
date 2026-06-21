export type TallActor = {
  name: string;
  heightInches: number;
  photo: string;
  flag: string;
  country: string;
  age: number;
};

const formatHeight = (inches: number): string => {
  const feet = Math.floor(inches / 12);
  const remaining = inches % 12;
  return `${feet}'${remaining}"`;
};

export { formatHeight };

export const TALL_ACTORS: TallActor[] = [
  { name: 'Danny DeVito', heightInches: 59, photo: 'danny_devito.webp', flag: '🇺🇸', country: 'United States', age: 80 },
  { name: 'Kevin Hart', heightInches: 62, photo: 'kevin_hart.jpg', flag: '🇺🇸', country: 'United States', age: 45 },
  { name: 'Tom Cruise', heightInches: 67, photo: 'tom_cruise.webp', flag: '🇺🇸', country: 'United States', age: 62 },
  { name: 'Tom Holland', heightInches: 68, photo: 'tom_holland.jpg', flag: '🇬🇧', country: 'United Kingdom', age: 28 },
  { name: 'Zac Efron', heightInches: 68, photo: 'zac_efron.webp', flag: '🇺🇸', country: 'United States', age: 37 },
  { name: 'Mark Wahlberg', heightInches: 68, photo: 'mark_wahlberg.jpg', flag: '🇺🇸', country: 'United States', age: 54 },
  { name: 'Robert Downey Jr.', heightInches: 69, photo: 'robert_downey.webp', flag: '🇺🇸', country: 'United States', age: 60 },
  { name: 'Sylvester Stallone', heightInches: 69, photo: 'sylvester_stallone.jpg', flag: '🇺🇸', country: 'United States', age: 78 },
  { name: 'Adam Sandler', heightInches: 70, photo: 'adam_sandler.jpg', flag: '🇺🇸', country: 'United States', age: 58 },
  { name: 'Brad Pitt', heightInches: 71, photo: 'brad_pitt.jpg', flag: '🇺🇸', country: 'United States', age: 61 },
  { name: 'George Clooney', heightInches: 71, photo: 'george_clooney.jpg', flag: '🇺🇸', country: 'United States', age: 64 },
  { name: 'Chris Evans', heightInches: 72, photo: 'chris_evans.webp', flag: '🇺🇸', country: 'United States', age: 43 },
  { name: 'Leonardo DiCaprio', heightInches: 72, photo: 'leonardo_dicaprio.jpg', flag: '🇺🇸', country: 'United States', age: 50 },
  { name: 'Keanu Reeves', heightInches: 73, photo: 'keanu_reeves.jpg', flag: '🇨🇦', country: 'Canada', age: 60 },
  { name: 'Will Smith', heightInches: 74, photo: 'will_smith.jpg', flag: '🇺🇸', country: 'United States', age: 56 },
  { name: 'Arnold Schwarzenegger', heightInches: 74, photo: 'arnold_schwarzenegger.jpg', flag: '🇦🇹', country: 'Austria', age: 77 },
  { name: 'Chris Hemsworth', heightInches: 75, photo: 'chris_hemsworth.webp', flag: '🇦🇺', country: 'Australia', age: 41 },
  { name: 'Jason Momoa', heightInches: 76, photo: 'jason_momoa.webp', flag: '🇺🇸', country: 'United States', age: 45 },
  { name: 'Liam Neeson', heightInches: 76, photo: 'liam_neeson.webp', flag: '🇮🇪', country: 'Ireland', age: 72 },
  { name: 'Dwayne Johnson', heightInches: 77, photo: 'dwayne_johnson.webp', flag: '🇺🇸', country: 'United States', age: 53 },
];

export const TALL_ACTORS_SORTED = [...TALL_ACTORS].sort((a, b) => a.heightInches - b.heightInches);
