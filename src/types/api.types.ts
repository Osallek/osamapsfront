export type Api = {
  pop: Data;
  density: Data;
  deathPerCapita: Data;
  birthPerCapita: Data;
  death: Data;
  birth: Data;
  area: Data;
  common: Data;
}

export type Data = {
  communes: Communes;
  departements: Departements;
  regions: Regions;
}

export type IdName<I, N> = {
  id: I;
  name: N;
}

export type DataNodes = {
  level: Level;
  jenks: DataJenks;
}

export type DataJenks = {
  population: Record<number, Array<number>>;
  density: Record<number, Array<number>>;
  birth: Record<number, Array<number>>;
  death: Record<number, Array<number>>;
  birthPerCapita: Record<number, Array<number>>;
  deathPerCapita: Record<number, Array<number>>;
  area: Array<number>;
}

export type Communes = DataNodes & {
  communes: Record<string, Commune>;
}

export type Departements = DataNodes & {
  departements: Record<string, Departement>;
}

export type Regions = DataNodes & {
  regions: Record<string, Region>;
}

export type DataNode<P extends DataPopulations> = IdName<string, string> & {
  level: Level;
  area?: number;
  population: P;
  areaCountryRanks?: number;
}

export type DataPopulations = {
  population: Record<number, number>;
  countryRanks: Record<number, number>;
  density: Record<number, number>;
  densityCountryRanks: Record<number, number>;
  percentCountry: Record<number, number>;
  birth: Record<number, number>;
  death: Record<number, number>;
  birthCountryRanks: Record<number, number>;
  deathCountryRanks: Record<number, number>;
  birthPercentCountry: Record<number, number>;
  deathPercentCountry: Record<number, number>;
  birthPerCapita: Record<number, number>;
  deathPerCapita: Record<number, number>;
  birthPerCapitaCountryRanks: Record<number, number>;
  deathPerCapitaCountryRanks: Record<number, number>;
}

export type DepartementPopulations = DataPopulations & {
  regionRanks: Record<number, number>;
  densityRegionRanks: Record<number, number>;
  percentRegion: Record<number, number>;
  birthRegionRanks: Record<number, number>;
  deathRegionRanks: Record<number, number>;
  birthPercentRegion: Record<number, number>;
  deathPercentRegion: Record<number, number>;
  birthPerCapitaRegionRanks: Record<number, number>;
  deathPerCapitaRegionRanks: Record<number, number>;
}

export type CommunePopulations = DepartementPopulations & {
  departementRanks: Record<number, number>;
  densityDepartementRanks: Record<number, number>;
  percentDepartement: Record<number, number>;
  birthDepartementRanks: Record<number, number>;
  deathDepartementRanks: Record<number, number>;
  birthPercentDepartement: Record<number, number>;
  deathPercentDepartement: Record<number, number>;
  birthPerCapitaDepartementRanks: Record<number, number>;
  deathPerCapitaDepartementRanks: Record<number, number>;
}

export type Commune = DataNode<CommunePopulations> & {
  departement: string;
  zipCode: string;
  areaRegionRanks?: number;
  areaDepartementRanks?: number;
  point?: Point;
}

export type Departement = DataNode<DepartementPopulations> & {
  chefLieu: string;
  region: string;
  communes: Array<string>;
  areaRegionRanks?: number;
}

export type Region = DataNode<DataPopulations> & {
  chefLieu: string;
  departements: Array<string>;
}

export enum Level {
  COMMUNE = 'COMMUNE',
  DEPARTEMENT = 'DEPARTEMENT',
  REGION = 'REGION',
}

export type Point = {
  lat: number;
  lon: number;
}

export type AddressCollection = {
  features: Array<AddressFeature>;
}

export type AddressFeature = {
  geometry: Geometry;
  properties: AddressProperties;
}

export type Geometry = {
  coordinates: Array<number>;
}

export type AddressProperties = {
  label: string,
  id: string,
  context: string,
  type: AddressType,
}

export enum AddressType {
  housenumber = 'housenumber',
  street  = 'street',
  locality = 'locality',
  municipality = 'municipality',
}
