import { STATES_AND_CITIES } from './citiesData';

export interface StateData {
  name: string;
  cities: string[];
}

export interface CountryData {
  name: string;
  states: StateData[];
}

// India: built from the existing STATES_AND_CITIES dataset (28 states + 8 UTs)
const indiaStates: StateData[] = Object.entries(STATES_AND_CITIES).map(
  ([name, cities]) => ({ name, cities })
);

export const countriesData: CountryData[] = [
  {
    name: 'India',
    states: indiaStates,
  },
  {
    name: 'USA',
    states: [
      { name: 'California', cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Long Beach', 'Oakland', 'Fresno', 'Sacramento'] },
      { name: 'Texas', cities: ['Houston', 'San Antonio', 'Dallas', 'Fort Worth', 'Austin', 'El Paso', 'Arlington'] },
      { name: 'New York', cities: ['New York'] },
      { name: 'Illinois', cities: ['Chicago'] },
      { name: 'Pennsylvania', cities: ['Philadelphia'] },
      { name: 'Arizona', cities: ['Phoenix', 'Mesa', 'Tucson'] },
      { name: 'Florida', cities: ['Jacksonville', 'Miami', 'Tampa'] },
      { name: 'Ohio', cities: ['Columbus'] },
      { name: 'North Carolina', cities: ['Charlotte', 'Raleigh'] },
      { name: 'Colorado', cities: ['Denver', 'Colorado Springs'] },
      { name: 'Michigan', cities: ['Detroit'] },
      { name: 'Nevada', cities: ['Las Vegas'] },
      { name: 'Indiana', cities: ['Indianapolis'] },
      { name: 'Washington', cities: ['Seattle'] },
      { name: 'Tennessee', cities: ['Nashville', 'Memphis'] },
      { name: 'Oregon', cities: ['Portland'] },
      { name: 'Missouri', cities: ['Kansas City'] },
      { name: 'Maryland', cities: ['Baltimore'] },
      { name: 'Massachusetts', cities: ['Boston'] },
      { name: 'Louisiana', cities: ['New Orleans'] },
      { name: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa'] },
      { name: 'Nebraska', cities: ['Omaha'] },
      { name: 'New Mexico', cities: ['Albuquerque'] },
      { name: 'Virginia', cities: ['Virginia Beach'] },
      { name: 'Wisconsin', cities: ['Milwaukee'] },
      { name: 'Minnesota', cities: ['Minneapolis'] },
    ],
  },
  {
    name: 'UK',
    states: [
      { name: 'England', cities: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Liverpool', 'Newcastle', 'Sheffield', 'Bristol', 'Leicester', 'Nottingham', 'Coventry', 'Bradford', 'Southampton', 'Plymouth', 'Reading', 'Derby', 'Stoke-on-Trent', 'Wolverhampton', 'Brighton', 'Oxford', 'Cambridge', 'York', 'Bath', 'Norwich'] },
      { name: 'Scotland', cities: ['Glasgow', 'Edinburgh', 'Aberdeen'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea'] },
      { name: 'Northern Ireland', cities: ['Belfast'] },
    ],
  },
  {
    name: 'Canada',
    states: [
      { name: 'Ontario', cities: ['Toronto', 'Hamilton', 'Kitchener', 'London', 'Oshawa', 'Windsor', 'Sudbury', 'Kingston', 'Barrie'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Sherbrooke', 'Saguenay', 'Trois-Rivières'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Kelowna', 'Abbotsford'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton'] },
      { name: 'Manitoba', cities: ['Winnipeg'] },
      { name: 'Saskatchewan', cities: ['Saskatoon', 'Regina'] },
      { name: 'Nova Scotia', cities: ['Halifax'] },
    ],
  },
  {
    name: 'Australia',
    states: [
      { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Albury'] },
      { name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'] },
      { name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Logan City', 'Townsville', 'Cairns', 'Toowoomba'] },
      { name: 'Western Australia', cities: ['Perth'] },
      { name: 'South Australia', cities: ['Adelaide'] },
      { name: 'Australian Capital Territory', cities: ['Canberra'] },
      { name: 'Tasmania', cities: ['Hobart', 'Launceston'] },
      { name: 'Northern Territory', cities: ['Darwin'] },
    ],
  },
  {
    name: 'UAE',
    states: [
      { name: 'Dubai', cities: ['Dubai'] },
      { name: 'Abu Dhabi', cities: ['Abu Dhabi', 'Al Ain'] },
      { name: 'Sharjah', cities: ['Sharjah'] },
      { name: 'Ajman', cities: ['Ajman'] },
      { name: 'Ras Al Khaimah', cities: ['Ras Al Khaimah'] },
      { name: 'Fujairah', cities: ['Fujairah'] },
      { name: 'Umm Al Quwain', cities: ['Umm Al Quwain'] },
    ],
  },
  {
    name: 'Singapore',
    states: [
      { name: 'Central Region', cities: ['Singapore'] },
    ],
  },
  {
    name: 'Germany',
    states: [
      { name: 'Bavaria', cities: ['Munich', 'Nuremberg'] },
      { name: 'Berlin', cities: ['Berlin'] },
      { name: 'Hamburg', cities: ['Hamburg'] },
      { name: 'North Rhine-Westphalia', cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg'] },
      { name: 'Hesse', cities: ['Frankfurt'] },
      { name: 'Baden-Württemberg', cities: ['Stuttgart'] },
      { name: 'Saxony', cities: ['Leipzig', 'Dresden'] },
      { name: 'Bremen', cities: ['Bremen'] },
      { name: 'Lower Saxony', cities: ['Hanover'] },
    ],
  },
  {
    name: 'France',
    states: [
      { name: 'Île-de-France', cities: ['Paris'] },
      { name: 'Provence-Alpes-Côte d\'Azur', cities: ['Marseille', 'Nice', 'Toulon'] },
      { name: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Saint-Étienne'] },
      { name: 'Occitanie', cities: ['Toulouse', 'Montpellier'] },
      { name: 'Pays de la Loire', cities: ['Nantes'] },
      { name: 'Grand Est', cities: ['Strasbourg', 'Reims'] },
      { name: 'Nouvelle-Aquitaine', cities: ['Bordeaux'] },
      { name: 'Hauts-de-France', cities: ['Lille'] },
      { name: 'Bretagne', cities: ['Rennes'] },
      { name: 'Normandie', cities: ['Le Havre'] },
    ],
  },
  {
    name: 'Netherlands',
    states: [
      { name: 'North Holland', cities: ['Amsterdam'] },
      { name: 'South Holland', cities: ['Rotterdam', 'The Hague'] },
      { name: 'Utrecht', cities: ['Utrecht'] },
      { name: 'North Brabant', cities: ['Eindhoven', 'Tilburg', 'Breda'] },
      { name: 'Groningen', cities: ['Groningen'] },
      { name: 'Flevoland', cities: ['Almere'] },
      { name: 'Gelderland', cities: ['Nijmegen'] },
    ],
  },
  {
    name: 'New Zealand',
    states: [
      { name: 'Auckland', cities: ['Auckland'] },
      { name: 'Wellington', cities: ['Wellington'] },
      { name: 'Canterbury', cities: ['Christchurch'] },
      { name: 'Waikato', cities: ['Hamilton'] },
      { name: 'Bay of Plenty', cities: ['Tauranga', 'Rotorua'] },
      { name: 'Hawke\'s Bay', cities: ['Napier-Hastings'] },
      { name: 'Otago', cities: ['Dunedin'] },
      { name: 'Manawatū-Whanganui', cities: ['Palmerston North'] },
      { name: 'Nelson', cities: ['Nelson'] },
    ],
  },
  {
    name: 'Ireland',
    states: [
      { name: 'Leinster', cities: ['Dublin', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan'] },
      { name: 'Munster', cities: ['Cork', 'Limerick', 'Waterford'] },
      { name: 'Connacht', cities: ['Galway'] },
    ],
  },
];
