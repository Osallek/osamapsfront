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
  area: number;
  population: P;
}

export type DataPopulations = {
  population: Record<number, number>;
  countryRanks: Record<number, number>;
}

export type DepartementPopulations = DataPopulations & {
  regionRanks: Record<number, number>;
}

export type CommunePopulations = DepartementPopulations & {
  communeRanks: Record<number, number>;
}

export type Commune = DataNode<CommunePopulations> & {
  departement: string;
  zipCode: string;
}

export type Departement = DataNode<DepartementPopulations> & {
  chefLieu: string;
  region: string;
  communes: Array<string>;
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
