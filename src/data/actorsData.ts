export interface ActorData {
  number: number;
  characterName: string;
  ageInSeries: number;
  actorName: string;
  currentAge: number;
}

export const actorsData: ActorData[] = [
  { number: 1, characterName: 'Daenerys Targaryen', ageInSeries: 25, actorName: 'Emilia Clarke', currentAge: 40 },
  { number: 2, characterName: 'Jon Snow', ageInSeries: 25, actorName: 'Kit Harington', currentAge: 39 },
  { number: 3, characterName: 'Sansa Stark', ageInSeries: 15, actorName: 'Sophie Turner', currentAge: 30 },
  { number: 4, characterName: 'Bran Stark', ageInSeries: 12, actorName: 'Isaac Hempstead Wright', currentAge: 26 },
  { number: 5, characterName: 'Arya Stark', ageInSeries: 14, actorName: 'Maisie Williams', currentAge: 29 },
  { number: 6, characterName: 'Tyrion Lannister', ageInSeries: 42, actorName: 'Peter Dinklage', currentAge: 57 },
  { number: 7, characterName: 'Jaime Lannister', ageInSeries: 41, actorName: 'Nikolaj Coster-Waldau', currentAge: 56 },
  { number: 8, characterName: 'Khal Drogo', ageInSeries: 32, actorName: 'Jason Momoa', currentAge: 47 },
  { number: 9, characterName: 'Stannis Baratheon', ageInSeries: 55, actorName: 'Stephen Dillane', currentAge: 70 },
  { number: 10, characterName: 'Gendry', ageInSeries: 26, actorName: 'Joe Dempsie', currentAge: 40 },
  { number: 11, characterName: 'Brienne of Tarth', ageInSeries: 29, actorName: 'Gwendoline Christie', currentAge: 43 },
  { number: 12, characterName: 'Margaery Tyrell', ageInSeries: 28, actorName: 'Natalie Dormer', currentAge: 42 },
  { number: 13, characterName: 'Melisandre', ageInSeries: 26, actorName: 'Carice van Houten', currentAge: 41 },
  { number: 14, characterName: 'Theon Greyjoy', ageInSeries: 25, actorName: 'Alfie Allen', currentAge: 39 },
  { number: 15, characterName: 'Roose Bolton', ageInSeries: 47, actorName: 'Michael McElhatton', currentAge: 61 },
  { number: 16, characterName: 'Samwell Tarly', ageInSeries: 14, actorName: 'John Bradley', currentAge: 36 },
  { number: 17, characterName: 'Petyr Baelish', ageInSeries: 40, actorName: 'Aidan Gillen', currentAge: 56 },
  { number: 18, characterName: 'Catelyn Stark', ageInSeries: 38, actorName: 'Michelle Fairley', currentAge: 67 },
  { number: 19, characterName: 'Ned Stark', ageInSeries: 42, actorName: 'Sean Bean', currentAge: 65 },
  { number: 20, characterName: 'Tywin Lannister', ageInSeries: 67, actorName: 'Charles Dance', currentAge: 78 },
  { number: 21, characterName: 'Tormund', ageInSeries: 45, actorName: 'Kristofer Hivju', currentAge: 46 },
  { number: 22, characterName: 'Missandei', ageInSeries: 18, actorName: 'Nathalie Emmanuel', currentAge: 35 },
  { number: 23, characterName: 'Bronn', ageInSeries: 35, actorName: 'Jerome Flynn', currentAge: 58 },
  { number: 24, characterName: 'Robb Stark', ageInSeries: 15, actorName: 'Richard Madden', currentAge: 38 },
  { number: 25, characterName: 'Cersei Lannister', ageInSeries: 36, actorName: 'Lena Headey', currentAge: 51 },
  { number: 26, characterName: 'Sandor Clegane', ageInSeries: 40, actorName: 'Rory McCann', currentAge: 55 },
  { number: 27, characterName: 'Lyanna Mormont', ageInSeries: 10, actorName: 'Bella Ramsey', currentAge: 21 },
  { number: 28, characterName: 'Maester Aemon', ageInSeries: 80, actorName: 'Iain Glen', currentAge: 80 },
  { number: 29, characterName: 'Davos Seaworth', ageInSeries: 45, actorName: 'Liam Cunningham', currentAge: 64 },
  { number: 30, characterName: 'Ygritte', ageInSeries: 16, actorName: 'Rose Leslie', currentAge: 37 },
];

export const getActorData = (number: number): ActorData | undefined => {
  return actorsData.find(actor => actor.number === number);
};
