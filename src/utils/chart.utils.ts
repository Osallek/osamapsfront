import { DataNode, DataPopulations } from 'types/api.types';

export function popLine(node: DataNode<DataPopulations>): Array<any> {
  if (!node.population || !node.population.population || Object.keys(node.population.population).length === 0) {
    return [];
  }

  return Object.entries(node.population.population).map(([year, pop]) => ({ year: year, pop: pop }));
}
