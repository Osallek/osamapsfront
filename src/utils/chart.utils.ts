import { CommunePopulations, Data, DataNode, DataPopulations, DepartementPopulations, Level } from 'types/api.types';
import { DataLevel } from 'types/maps.types';

export function popLine(node: DataNode<DataPopulations>): Array<any> {
  if (!node.population || !node.population.population || Object.keys(node.population.population).length === 0) {
    return [];
  }

  return Object.entries(node.population.population).map(([year, pop]) => ({ year: year, pop: pop }));
}

export function recordLine(nodes: Record<number, number>): Array<any> {
  if (!nodes || Object.keys(nodes).length === 0) {
    return [];
  }

  return Object.entries(nodes).map(([year, pop]) => ({ year: year, pop: pop }));
}

export function densityLine(node: DataNode<DataPopulations>): Array<any> {
  if (!node.population || !node.population.density || Object.keys(node.population.density).length === 0) {
    return [];
  }

  return recordLine(node.population.density);
}

export function percentData(node: DataNode<DataPopulations>, level: DataLevel, data: Data): Array<any> {
  if (!node.population) {
    return [];
  }

  switch (level) {
    case DataLevel.COUNTRY:
      return Object.entries(node.population.percentCountry).map(([year, pop]) => ({ year: year, pop: pop, other: 100 - pop, id: node.id, name: node.name }));

    case DataLevel.REGION:
      switch (node.level) {
        case Level.DEPARTEMENT:
        case Level.COMMUNE:
          return Object.entries((node.population as DepartementPopulations).percentRegion)
            .map(([year, pop]) => ({ year: year, pop: pop, other: 100 - pop, id: node.id, name: node.name }));
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

export function percentBars(node: DataNode<DataPopulations>, level: DataLevel, data: Data, colors: Array<string>): Array<any> {
  return [{ dataKey: 'pop', stackId: 'a', fill: '#8884d8' }, { dataKey: 'other', stackId: 'a', fill: '#82ca9d' }];
}
