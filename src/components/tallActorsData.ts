export type TallActor = {
  name: string;
  heightInches: number;
  photo: string;
  flag: string;
  country: string;
  age: number;
};

export const formatHeight = (inches: number): string => {
  const feet = Math.floor(inches / 12);
  const remaining = inches % 12;
  return `${feet}'${remaining}"`;
};

export const TALL_ACTORS: TallActor[] = [
  { name: 'Danny DeVito', heightInches: 59, photo: 'danny_devito.webp', flag: '🇺🇸', country: 'United States', age: 80 },
  { name: 'Kevin Hart', heightInches: 62, photo: 'kevin_hart.jpg', flag: '🇺🇸', country: 'United States', age: 45 },
  { name: 'Tom Holland', heightInches: 68, photo: 'tom_holland.jpg', flag: '🇬🇧', country: 'United Kingdom', age: 28 },
  { name: 'Zac Efron', heightInches: 68, photo: 'zac_efron.webp', flag: '🇺🇸', country: 'United States', age: 37 },
  { name: 'Robert Downey Jr.', heightInches: 69, photo: 'robert_downey.webp', flag: '🇺🇸', country: 'United States', age: 60 },
  { name: 'Brad Pitt', heightInches: 71, photo: 'brad_pitt.jpg', flag: '🇺🇸', country: 'United States', age: 61 },
  { name: 'Leonardo DiCaprio', heightInches: 72, photo: 'leonardo_dicaprio.jpg', flag: '🇺🇸', country: 'United States', age: 50 },
  { name: 'Chris Evans', heightInches: 72, photo: 'chris_evans.webp', flag: '🇺🇸', country: 'United States', age: 43 },
  { name: 'Chris Hemsworth', heightInches: 75, photo: 'chris_hemsworth.webp', flag: '🇦🇺', country: 'Australia', age: 41 },
  { name: 'Jason Momoa', heightInches: 76, photo: 'jason_momoa.webp', flag: '🇺🇸', country: 'United States', age: 45 },
  { name: 'Liam Neeson', heightInches: 76, photo: 'liam_neeson.webp', flag: '🇮🇪', country: 'Ireland', age: 72 },
];

export const TALL_ACTORS_SORTED = [...TALL_ACTORS].sort((a, b) => a.heightInches - b.heightInches);
