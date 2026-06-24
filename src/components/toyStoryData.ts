export type ToyStoryCharacter = {
  id: string;
  name: string;
  image: string;
};

export const CHARACTERS: ToyStoryCharacter[] = [
  { id: 'woody', name: 'Woody', image: 'images/toystory/woody.png' },
  { id: 'buzz', name: 'Buzz Lightyear', image: 'images/toystory/buzz.png' },
  { id: 'jessie', name: 'Jessie', image: 'images/toystory/jessie.png' },
  { id: 'forky', name: 'Forky', image: 'images/toystory/forky.png' },
  { id: 'rex', name: 'Rex', image: 'images/toystory/rex.png' },
  { id: 'hamm', name: 'Hamm', image: 'images/toystory/hamm.png' },
  { id: 'slinky', name: 'Slinky Dog', image: 'images/toystory/slinky.png' },
  { id: 'potato', name: 'Mr. Potato Head', image: 'images/toystory/potato.png' },
];
