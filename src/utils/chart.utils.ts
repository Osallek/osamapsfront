import { DataNode, DataPopulations } from 'types/api.types';

export function popLine(node: DataNode<DataPopulations>): Array<any> {
  if (!node.population || !node.population.population || Object.keys(node.population.population).length === 0) {
    return [];
  }

  return Object.entries(node.population.population).map(([year, pop]) => ({ year: year, pop: pop }));
}

export function popRankLine(nodes: Array<Record<number, number>>): Array<any> {
  if (!nodes || Object.keys(nodes).length === 0) {
    return [];
  }

  const data: Array<any> = [];

  for (const year of Object.keys(nodes[0])) {
    const d: any = { year };
    for (let i = 0; i < nodes.length; i++) {
      d['data' + i] = nodes[i][Number(year)];
    }

    data.push(d);
  }

  return data;
}
