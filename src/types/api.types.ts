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
}

export type DepartementPopulations = DataPopulations & {
  regionRanks: Record<number, number>;
  densityRegionRanks: Record<number, number>;
  percentRegion: Record<number, number>;
}

export type CommunePopulations = DepartementPopulations & {
  departementRanks: Record<number, number>;
  densityDepartementRanks: Record<number, number>;
  percentDepartement: Record<number, number>;
}

export type Commune = DataNode<CommunePopulations> & {
  departement: string;
  zipCode: string;
  areaRegionRanks?: number;
  areaDepartementRanks?: number;
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
