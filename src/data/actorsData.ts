export interface ActorData {
  number: number;
  characterName: string;
  ageInSeries: number;
  actorName: string;
  currentAge: number;
}

export const actorsData: ActorData[] = [
  { number: 1, characterName: 'Daenerys Targaryen', ageInSeries: 25, actorName: 'Emilia Clarke', currentAge: 40 },
  { number: 2, characterName: 'Jon Snow', ageInSeries: 25, actorName: 'Kit Harington', currentAge: 40 },
  { number: 3, characterName: 'Sansa Stark', ageInSeries: 15, actorName: 'Sophie Turner', currentAge: 30 },
  { number: 4, characterName: 'Bran Stark', ageInSeries: 12, actorName: 'Isaac Hempstead Wright', currentAge: 27 },
  { number: 5, characterName: 'Cersei Lannister', ageInSeries: 38, actorName: 'Lena Headey', currentAge: 53 },
  { number: 6, characterName: 'Tyrion Lannister', ageInSeries: 42, actorName: 'Peter Dinklage', currentAge: 57 },
  { number: 7, characterName: 'Jaime Lannister', ageInSeries: 36, actorName: 'Nikolaj Coster-Waldau', currentAge: 51 },
  { number: 8, characterName: 'Khal Drogo', ageInSeries: 32, actorName: 'Jason Momoa', currentAge: 47 },
  { number: 9, characterName: 'Ned Stark', ageInSeries: 52, actorName: 'Sean Bean', currentAge: 67 },
  { number: 10, characterName: 'Robb Stark', ageInSeries: 25, actorName: 'Richard Madden', currentAge: 40 },
  { number: 11, characterName: 'Brienne of Tarth', ageInSeries: 30, actorName: 'Gwendoline Christie', currentAge: 45 },
  { number: 12, characterName: 'Margaery Tyrell', ageInSeries: 29, actorName: 'Natalie Dormer', currentAge: 44 },
  { number: 13, characterName: 'Melisandre', ageInSeries: 34, actorName: 'Carice van Houten', currentAge: 49 },
  { number: 14, characterName: 'Theon Greyjoy', ageInSeries: 25, actorName: 'Alfie Allen', currentAge: 40 },
  { number: 15, characterName: 'Jorah Mormont', ageInSeries: 50, actorName: 'Iain Glen', currentAge: 65 },
  { number: 16, characterName: 'Ygritte', ageInSeries: 24, actorName: 'Rose Leslie', currentAge: 39 },
  { number: 17, characterName: 'Sandor Clegane', ageInSeries: 42, actorName: 'Rory McCann', currentAge: 57 },
  { number: 18, characterName: 'Missandei', ageInSeries: 22, actorName: 'Nathalie Emmanuel', currentAge: 37 },
  { number: 19, characterName: 'Samwell Tarly', ageInSeries: 23, actorName: 'John Bradley', currentAge: 38 },
  { number: 20, characterName: 'Petyr Baelish', ageInSeries: 43, actorName: 'Aidan Gillen', currentAge: 58 },
  { number: 21, characterName: 'Gendry', ageInSeries: 24, actorName: 'Joe Dempsie', currentAge: 39 },
  { number: 22, characterName: 'Tormund Giantsbane', ageInSeries: 33, actorName: 'Kristofer Hivju', currentAge: 48 },
  { number: 23, characterName: 'Tywin Lannister', ageInSeries: 65, actorName: 'Charles Dance', currentAge: 80 },
  { number: 24, characterName: 'Catelyn Stark', ageInSeries: 54, actorName: 'Michelle Fairley', currentAge: 69 },
  { number: 25, characterName: 'Grey Worm', ageInSeries: 21, actorName: 'Jacob Anderson', currentAge: 36 },
  { number: 26, characterName: 'Gregor Clegane', ageInSeries: 23, actorName: 'Hafþór Júlíus Björnsson', currentAge: 38 },
  { number: 27, characterName: 'Joffrey Baratheon', ageInSeries: 19, actorName: 'Jack Gleeson', currentAge: 34 },
  { number: 28, characterName: 'Varys', ageInSeries: 47, actorName: 'Conleth Hill', currentAge: 62 },
  { number: 29, characterName: 'Bronn', ageInSeries: 43, actorName: 'Jerome Flynn', currentAge: 58 },
  { number: 30, characterName: 'Arya Stark', ageInSeries: 14, actorName: 'Maisie Williams', currentAge: 29 },
];

export const getActorData = (number: number): ActorData | undefined => {
  return actorsData.find(actor => actor.number === number);
};
