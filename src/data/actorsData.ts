export interface ActorData {
  number: number;
  characterName: string;
  ageInSeries: number;
  actorName: string;
  currentAge: number;
}

export const actorsData: ActorData[] = [
  { number: 1, characterName: 'Daenerys Targaryen', ageInSeries: 16, actorName: 'Emilia Clarke', currentAge: 38 },
  { number: 2, characterName: 'Khal Drogo', ageInSeries: 40, actorName: 'Jason Momoa', currentAge: 45 },
  { number: 3, characterName: 'Sansa Stark', ageInSeries: 13, actorName: 'Sophie Turner', currentAge: 28 },
  { number: 4, characterName: 'Jaime Lannister', ageInSeries: 32, actorName: 'Nikolaj Coster-Waldau', currentAge: 49 },
  { number: 5, characterName: 'Cersei Lannister', ageInSeries: 36, actorName: 'Lena Headey', currentAge: 51 },
  { number: 6, characterName: 'Tyrion Lannister', ageInSeries: 30, actorName: 'Peter Dinklage', currentAge: 55 },
  { number: 7, characterName: 'Theon Greyjoy', ageInSeries: 16, actorName: 'Alfie Allen', currentAge: 38 },
  { number: 8, characterName: 'Arya Stark', ageInSeries: 11, actorName: 'Maisie Williams', currentAge: 27 },
  { number: 9, characterName: 'Ned Stark', ageInSeries: 42, actorName: 'Sean Bean', currentAge: 65 },
  { number: 10, characterName: 'Robb Stark', ageInSeries: 15, actorName: 'Richard Madden', currentAge: 38 },
  { number: 11, characterName: 'Brienne of Tarth', ageInSeries: 32, actorName: 'Gwendoline Christie', currentAge: 42 },
  { number: 12, characterName: 'Melisandre', ageInSeries: 40, actorName: 'Carice van Houten', currentAge: 45 },
  { number: 13, characterName: 'Margaery Tyrell', ageInSeries: 16, actorName: 'Natalie Dormer', currentAge: 42 },
  { number: 14, characterName: 'Sandor Clegane', ageInSeries: 40, actorName: 'Rory McCann', currentAge: 55 },
  { number: 15, characterName: 'Maester Aemon', ageInSeries: 80, actorName: 'Iain Glen', currentAge: 80 },
  { number: 16, characterName: 'Samwell Tarly', ageInSeries: 14, actorName: 'John Bradley', currentAge: 36 },
  { number: 17, characterName: 'Petyr Baelish', ageInSeries: 40, actorName: 'Aidan Gillen', currentAge: 56 },
  { number: 18, characterName: 'Gendry', ageInSeries: 13, actorName: 'Joe Dempsie', currentAge: 37 },
  { number: 19, characterName: 'Catelyn Stark', ageInSeries: 38, actorName: 'Michelle Fairley', currentAge: 67 },
  { number: 20, characterName: 'Tywin Lannister', ageInSeries: 67, actorName: 'Charles Dance', currentAge: 78 },
  { number: 21, characterName: 'Tormund', ageInSeries: 45, actorName: 'Kristofer Hivju', currentAge: 46 },
  { number: 22, characterName: 'Missandei', ageInSeries: 18, actorName: 'Nathalie Emmanuel', currentAge: 35 },
  { number: 23, characterName: 'Bronn', ageInSeries: 35, actorName: 'Jerome Flynn', currentAge: 58 },
  { number: 24, characterName: 'Bran Stark', ageInSeries: 10, actorName: 'Isaac Hempstead Wright', currentAge: 25 },
  { number: 25, characterName: 'Podrick Payne', ageInSeries: 12, actorName: 'Daniel Portman', currentAge: 32 },
  { number: 26, characterName: 'Lyanna Mormont', ageInSeries: 10, actorName: 'Bella Ramsey', currentAge: 21 },
  { number: 27, characterName: 'Davos Seaworth', ageInSeries: 45, actorName: 'Liam Cunningham', currentAge: 64 },
  { number: 28, characterName: 'Ygritte', ageInSeries: 16, actorName: 'Rose Leslie', currentAge: 37 },
  { number: 29, characterName: 'Stannis Baratheon', ageInSeries: 35, actorName: 'Stephen Dillane', currentAge: 67 },
  { number: 30, characterName: 'Varys', ageInSeries: 50, actorName: 'Conleth Hill', currentAge: 64 },
];

export const getActorData = (number: number): ActorData | undefined => {
  return actorsData.find(actor => actor.number === number);
};
