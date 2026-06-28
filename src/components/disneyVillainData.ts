export type DisneyVillain = {
  villain: string;
  movie: string;
  image: string;
  color: string;
  silhouetteBrightness?: number;
};

export const VILLAINS: DisneyVillain[] = [
  {villain: 'Scar', movie: 'The Lion King', image: 'images/villains/Scar-1-.webp', color: '#8B4513', silhouetteBrightness: 0.7},
  {villain: 'Ursula', movie: 'The Little Mermaid', image: 'images/villains/ursula.jpg', color: '#4B0082'},
  {villain: 'Maleficent', movie: 'Sleeping Beauty', image: 'images/villains/Profile_-_Maleficent.webp', color: '#2D0A31'},
  {villain: 'Jafar', movie: 'Aladdin', image: 'images/villains/5e3d650c4d5da0b680a0b2a64b6ccb59.jpg', color: '#8B0000'},
  {villain: 'Cruella de Vil', movie: '101 Dalmatians', image: 'images/villains/Profile_-_Cruella.webp', color: '#1a1a1a'},
  {villain: 'Hades', movie: 'Hercules', image: 'images/villains/2cdbf744d6b85e4f1a5c8cbfd822e280.jpg', color: '#1a3a5c', silhouetteBrightness: 0.7},
  {villain: 'Captain Hook', movie: 'Peter Pan', image: 'images/villains/Captain_James_Hook_(Disney_animated_character).png', color: '#722F37'},
  {villain: 'Gaston', movie: 'Beauty and the Beast', image: 'images/villains/Profile_-_Gaston.webp', color: '#8B4513', silhouetteBrightness: 0.7},
  {villain: 'Dr. Facilier', movie: 'The Princess and the Frog', image: 'images/villains/501333f5d7abd1a1613ebd9e9d95b948.jpg', color: '#2E0854', silhouetteBrightness: 0.7},
  {villain: 'Mother Gothel', movie: 'Tangled', image: 'images/villains/0d6829cd39bb9a015757bb20cb2b06ea.jpg', color: '#3D0C02', silhouetteBrightness: 0.7},
];
