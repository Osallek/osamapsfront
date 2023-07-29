import {
  Commune, CommunePopulations, DataNode, DataPopulations, Departement, DepartementPopulations, Level, Region
} from 'types/api.types';
import { DataLevel } from 'types/maps.types';

export function popLine(node: DataNode<DataPopulations>): Array<any> {
  if (!node.population || !node.population.population || Object.keys(node.population.population).length === 0) {
    return [];
  }

  return Object.entries(node.population.population).map(([year, pop]) => ({ year, pop }));
}

export function recordLine(nodes: Record<number, number>): Array<any> {
  if (!nodes || Object.keys(nodes).length === 0) {
    return [];
  }

  return Object.entries(nodes).map(([year, pop]) => ({ year, pop }));
}

export function densityLine(node: DataNode<DataPopulations>): Array<any> {
  if (!node.population || !node.population.density || Object.keys(node.population.density).length === 0) {
    return [];
  }

  return recordLine(node.population.density);
}

export function birthDeathLine(node: DataNode<DataPopulations>): Array<any> {
  if (!node.population || !node.population.birth || Object.keys(node.population.birth).length === 0) {
    return [];
  }

  return Object.entries(node.population.birth)
               .map(([year, birth]) => ({
                 year, birth, death: node.population.death ? node.population.death[Number(year)] : undefined
               }));
}

export function birthDeathPerCapitaLine(node: DataNode<DataPopulations>): Array<any> {
  if (!node.population || !node.population.birthPerCapita || Object.keys(node.population.birthPerCapita).length === 0) {
    return [];
  }

  return Object.entries(node.population.birthPerCapita)
               .map(([year, birth]) => ({
                 year, birth,
                 death: node.population.deathPerCapita ? node.population.deathPerCapita[Number(year)] : undefined
               }));
}

export function birthDeathRank(level: DataLevel, node: Region | Departement | Commune): Array<any> {
  if (!node.population || !node.population.birth || Object.keys(node.population.birth).length === 0) {
    return [];
  }

  switch (level) {
    case DataLevel.COUNTRY:
      return Object.entries(node.population.birthCountryRanks)
                   .map(([year, birth]) => ({
                     year, birth, death: node.population.deathCountryRanks ? node.population.deathCountryRanks[Number(
                       year)] : undefined
                   }));
    case DataLevel.REGION:
      return Object.entries((node.population as DepartementPopulations).birthRegionRanks)
                   .map(([year, birth]) => ({
                     year, birth,
                     death: (node.population as DepartementPopulations).deathRegionRanks ? (node.population as DepartementPopulations).deathRegionRanks[Number(
                       year)] : undefined
                   }));
    case DataLevel.DEPARTEMENT:
      return Object.entries((node.population as CommunePopulations).birthDepartementRanks)
                   .map(([year, birth]) => ({
                     year, birth,
                     death: (node.population as CommunePopulations).deathDepartementRanks ? (node.population as CommunePopulations).deathDepartementRanks[Number(
                       year)] : undefined
                   }));
  }
}

export function birthDeathPerCapitaRank(level: DataLevel, node: Region | Departement | Commune): Array<any> {
  if (!node.population || !node.population.birthPerCapita || Object.keys(node.population.birthPerCapita).length === 0) {
    return [];
  }

  switch (level) {
    case DataLevel.COUNTRY:
      return Object.entries(node.population.birthPerCapitaCountryRanks)
                   .map(([year, birth]) => ({
                     year, birth,
                     death: node.population.deathPerCapitaCountryRanks ? node.population.deathPerCapitaCountryRanks[Number(
                       year)] : undefined
                   }));
    case DataLevel.REGION:
      return Object.entries((node.population as DepartementPopulations).birthPerCapitaRegionRanks)
                   .map(([year, birth]) => ({
                     year, birth,
                     death: (node.population as DepartementPopulations).deathPerCapitaRegionRanks ? (node.population as DepartementPopulations).deathPerCapitaRegionRanks[Number(
                       year)] : undefined
                   }));
    case DataLevel.DEPARTEMENT:
      return Object.entries((node.population as CommunePopulations).birthPerCapitaDepartementRanks)
                   .map(([year, birth]) => ({
                     year, birth,
                     death: (node.population as CommunePopulations).deathPerCapitaDepartementRanks ? (node.population as CommunePopulations).deathPerCapitaDepartementRanks[Number(
                       year)] : undefined
                   }));
  }
}

export function percentData(node: DataNode<DataPopulations>, level: DataLevel): Array<any> {
  if (!node.population) {
    return [];
  }

  switch (level) {
    case DataLevel.COUNTRY:
      return Object.entries(node.population.percentCountry)
                   .map(([year, pop]) => ({ year: year, pop: pop, other: 100 - pop, id: node.id, name: node.name }));

    case DataLevel.REGION:
      switch (node.level) {
        case Level.DEPARTEMENT:
        case Level.COMMUNE:
          return Object.entries((node.population as DepartementPopulations).percentRegion)
                       .map(
                         ([year, pop]) => ({ year: year, pop: pop, other: 100 - pop, id: node.id, name: node.name }));
      }
      break;

    case DataLevel.DEPARTEMENT:
      switch (node.level) {
        case Level.COMMUNE:
          return Object.entries((node.population as CommunePopulations).percentDepartement).map(
            ([year, pop]) => ({ year: year, pop: pop, other: 100 - pop, id: node.id, name: node.name }));
      }
      break;
  }

  return [];
}

export function percentBars(): Array<any> {
  return [{ dataKey: 'pop', stackId: 'a', fill: '#8884d8' }, { dataKey: 'other', stackId: 'a', fill: '#82ca9d' }];
}
