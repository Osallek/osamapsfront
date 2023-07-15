import { jenks } from 'simple-statistics';
import { Data, DataNode, Level } from 'types/api.types';
import { getGradient } from 'utils/colors.utils';
import { onlyUnique } from 'utils/object.utils';

const cache: Map<string, Array<any>> = new Map();
const memoizeExpression = (data: Data, level: Level, stateField: string, filter: (a: DataNode) => boolean, fn: (a: DataNode) => number) => {
  const key = level + stateField + fn.toString();

  if (!cache.has(key)) {
    cache.set(key, getExpression(data, level, stateField, filter, fn));
  }

  return cache.get(key) as Array<any>;
};

function getExpression(data: Data, level: Level, stateField: string, filter: (a: DataNode) => boolean, fn: (a: DataNode) => number): Array<any> {
  let nodes: Record<string, DataNode>;

  switch (level) {
    case Level.COMMUNE:
      nodes = data.communes;
      break;
    case Level.DEPARTEMENT:
      nodes = data.departements;
      break;
    case Level.REGION:
      nodes = data.regions;
      break;
  }

  const clean = Object.values(nodes).filter(filter).map(fn).filter(v => v !== undefined);
  const gradient = getGradient(Math.min(7, clean.length));
  const j = jenks(clean.filter(onlyUnique), gradient.length + 1);

  const colors: Array<{ value: number, color: string }> = [];
  gradient.forEach((color, index) => {
    colors.push({ value: j[index + 1], color });
  });

  const expression: Array<any> = ['case'];
  for (let i = 0; i < colors.length; i++) {
    if (i === colors.length - 1) { //Last color as default
      expression.push(colors[i].color);
    } else {
      expression.push(['<=', ['feature-state', stateField], colors[i].value]);
      expression.push(colors[i].color);
    }
  }

  return expression;
}

export function getAreaExpression(data: Data, level: Level): any {
  return memoizeExpression(data, level, 'area', v => !!v.area, v => v.area);
}

export function getPopulationExpression(data: Data, level: Level, year: number): any {
  if (year === undefined) {
    return 'transparent';
  }

  return memoizeExpression(data, level, `population.${ year }`, v => !!v.population, v => v.population[year]);
}
