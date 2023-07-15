import { DataNode } from 'types/api.types';

export function popLine(node: DataNode): Array<any> {
  if (!node.population || Object.keys(node.population).length === 0) {
    return [];
  }

  return Object.entries(node.population).map(([year, pop]) => ({year: year, pop: pop}));
}
