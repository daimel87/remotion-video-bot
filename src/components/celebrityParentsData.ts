export type CelebrityPair = {
  parent: string;
  parentAge: number;
  parentImage: string;
  child: string;
  childAge: number;
  childImage: string;
};

export const PAIRS: CelebrityPair[] = [
  { parent: 'Will Smith', parentAge: 56, parentImage: 'images/celebrities/452749.jpg', child: 'Jaden Smith', childAge: 27, childImage: 'images/celebrities/images.jpg' },
  { parent: 'Johnny Depp', parentAge: 62, parentImage: 'images/celebrities/554045.webp', child: 'Lily-Rose Depp', childAge: 26, childImage: 'images/celebrities/images (1).jpg' },
  { parent: 'Tom Hanks', parentAge: 69, parentImage: 'images/celebrities/Tom_Hanks_TIFF_2019.jpg', child: 'Colin Hanks', childAge: 47, childImage: 'images/celebrities/173405_v9_bb.jpg' },
  { parent: 'Angelina Jolie', parentAge: 50, parentImage: 'images/celebrities/MV5BODg3MzYwMjE4N15BMl5BanBnXkFtZTcwMjU5NzAzNw@@._V1_.jpg', child: 'Shiloh Jolie', childAge: 20, childImage: 'images/celebrities/WIGZTI4YEZFXRIHQO2TS7HB774.avif' },
  { parent: 'Jada Pinkett Smith', parentAge: 53, parentImage: 'images/celebrities/321209.jpg', child: 'Willow Smith', childAge: 25, childImage: 'images/celebrities/gettyimages-1228837023.avif' },
  { parent: 'David Beckham', parentAge: 51, parentImage: 'images/celebrities/original-ellezza-beauty-david-beckham-biotherm-19252318-1-ita-it-david-beckham-nuovo-volto-biotherm-homme-jpg.avif', child: 'Brooklyn Beckham', childAge: 27, childImage: 'images/celebrities/Brooklyn-Beckham-At-The-2017-Serpentine-Gallery-Summer-Party-London.avif' },
  { parent: 'Sylvester Stallone', parentAge: 79, parentImage: 'images/celebrities/MV5BMTA3MDY2ODk4ODVeQTJeQWpwZ15BbWU4MDY1ODc3MTgx._V1_FMjpg_UX1000_.jpg', child: 'Sistine Stallone', childAge: 27, childImage: 'images/celebrities/1212319_v9_ba.jpg' },
  { parent: 'Arnold Schwarzenegger', parentAge: 77, parentImage: 'images/celebrities/Arnold_Schwarzenegger_2025_(cropped).jpg', child: 'Patrick Schwarzenegger', childAge: 31, childImage: 'images/celebrities/images (2).jpg' },
  { parent: 'Clint Eastwood', parentAge: 95, parentImage: 'images/celebrities/8TwdCfeOZH7ucRlfLZ6wObxa7cO.webp', child: 'Scott Eastwood', childAge: 39, childImage: 'images/celebrities/MV5BODQ4ODU5NjIxMF5BMl5BanBnXkFtZTgwNzIzNTIzNzM@._V1_FMjpg_UX1000_.jpg' },
  { parent: 'Sean Penn', parentAge: 64, parentImage: 'images/celebrities/image-w856.webp', child: 'Dylan Penn', childAge: 34, childImage: 'images/celebrities/MV5BOGNkYzAyMDgtMTBkYi00NzY5LWIwNTQtMWQyMzI1NGIyOTkxXkEyXkFqcGc@._V1_.jpg' },
  { parent: 'Cindy Crawford', parentAge: 59, parentImage: 'images/celebrities/MV5BMTk4ODYyMzgwOV5BMl5BanBnXkFtZTcwNzIzNDUwMw@@._V1_FMjpg_UX1000_.jpg', child: 'Kaia Gerber', childAge: 24, childImage: 'images/celebrities/GNLZZGG002GN5E6.jpg' },
  { parent: 'Demi Moore', parentAge: 62, parentImage: 'images/celebrities/Demi_Moore_at_the_2026_Cannes_Film_Festival_(cropped).jpg', child: 'Rumer Willis', childAge: 36, childImage: 'images/celebrities/gWleoY30Cj3fFuF5NT12O6mnov7.webp' },
  { parent: 'Goldie Hawn', parentAge: 79, parentImage: 'images/celebrities/GoldieHawnYoung.webp', child: 'Kate Hudson', childAge: 46, childImage: 'images/celebrities/165584_v9_bc.jpg' },
  { parent: 'Jon Voight', parentAge: 86, parentImage: 'images/celebrities/33783_v9_bc.jpg', child: 'Angelina Jolie', childAge: 50, childImage: 'images/celebrities/MV5BODg3MzYwMjE4N15BMl5BanBnXkFtZTcwMjU5NzAzNw@@._V1_.jpg' },
  { parent: 'Lenny Kravitz', parentAge: 61, parentImage: 'images/celebrities/Lenny-Kravitz-ID.webp', child: 'Zoë Kravitz', childAge: 36, childImage: 'images/celebrities/zoe-kravitz-quien-pareja-harry-styles.webp' },
  { parent: 'Tom Cruise', parentAge: 63, parentImage: 'images/celebrities/image-w856 (1).webp', child: 'Suri Cruise', childAge: 20, childImage: 'images/celebrities/MV5BZTVjYjU2ZmUtMmZkNi00MDNlLThiNTctZGQzNjk5OTQxZTEwXkEyXkFqcGc@._V1_.jpg' },
  { parent: 'Alec Baldwin', parentAge: 67, parentImage: 'images/celebrities/MV5BMjE1Njg4MzY3M15BMl5BanBnXkFtZTcwNTY3MjE3NA@@._V1_FMjpg_UX1000_.jpg', child: 'Ireland Baldwin', childAge: 29, childImage: 'images/celebrities/ireland-baldwin-today-square-200816-01.jpg' },
  { parent: 'Andy García', parentAge: 69, parentImage: 'images/celebrities/images (3).jpg', child: 'Daniella Garcia', childAge: 27, childImage: 'images/celebrities/daniella-garcia-lorido-440nw-9139438bi.jpg' },
  { parent: 'Heidi Klum', parentAge: 52, parentImage: 'images/celebrities/1013096.jpg', child: 'Leni Klum', childAge: 21, childImage: 'images/celebrities/leni-klum-defile-improvisacion-1639671358.avif' },
  { parent: 'Reese Witherspoon', parentAge: 50, parentImage: 'images/celebrities/American-actress-producer-Reese-Witherspoon-2022.webp', child: 'Ava Phillippe', childAge: 25, childImage: 'images/celebrities/Ava-Phillippe-1-1024x1024.jpg' },
  { parent: 'Mick Jagger', parentAge: 82, parentImage: 'images/celebrities/842_v9_bc.jpg', child: 'Georgia May Jagger', childAge: 33, childImage: 'images/celebrities/images (4).jpg' },
  { parent: 'Steven Tyler', parentAge: 77, parentImage: 'images/celebrities/Steve-Tyler.jpg', child: 'Liv Tyler', childAge: 48, childImage: 'images/celebrities/image-w856 (2).webp' },
  { parent: 'Kris Jenner', parentAge: 69, parentImage: 'images/celebrities/MAC_FY26_SeptemberStudioMoment_Beauty_Social_Kris_0177_GLOBAL_sRGB72-1.webp', child: 'Kendall Jenner', childAge: 29, childImage: 'images/celebrities/kendall-jenner.webp' },
  { parent: 'Pierce Brosnan', parentAge: 72, parentImage: 'images/celebrities/PierceBrosnan-byPhilipRomano.jpg', child: 'Dylan Brosnan', childAge: 28, childImage: 'images/celebrities/2570931-500w.jpg' },
  { parent: 'Denzel Washington', parentAge: 71, parentImage: 'images/celebrities/Denzel_Washington.webp', child: 'John David Washington', childAge: 41, childImage: 'images/celebrities/MV5BOTY4NDcyNDM5OF5BMl5BanBnXkFtZTgwMjk4Mzk0NTM@._V1_FMjpg_UX1000_.jpg' },
];
