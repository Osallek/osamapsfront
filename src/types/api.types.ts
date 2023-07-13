export type Data = {
  communes: Record<string, Commune>;
  departements: Record<string, Departement>;
  regions: Record<string, Region>;
}

export type IdName<I, N> = {
  id: I;
  name: N;
}

export type DataNode = IdName<string, string> & {
  level: Level;
  area: number;
  population: Record<number, number>;
}

export type Commune = DataNode & {
  departement: string;
  zipCode: string;
}

export type Departement = DataNode & {
  chefLieu: string;
  region: string;
  communes: Array<string>;
}

export type Region = DataNode & {
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
