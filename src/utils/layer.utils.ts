import { jenks } from 'simple-statistics';
import { DataNode } from 'types/api.types';
import { getGradient } from 'utils/colors.utils';

function onlyUnique(value: any, index: number, array: any[]) {
  return array.indexOf(value) === index;
}

export function getAreaExpression(data: Record<string, DataNode>): Array<any> {
  const clean = Object.values(data).map(value => value.area).filter(value => value !== undefined);
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
      expression.push(['<=', ['feature-state', 'area'], colors[i].value]);
      expression.push(colors[i].color);
    }
  }

  return expression;
}

export function getPopulationExpression(data: Record<string, DataNode>, year: number): Array<any> {
  const clean = Object.values(data).filter(v => v.population !== undefined).map(v => v.population[year]).filter(v => v !== undefined).filter(onlyUnique);
  const gradient = getGradient(Math.min(17, clean.length - 1));
  const j = jenks(clean, gradient.length + 1);

  const colors: Array<{ value: number, color: string }> = [];
  gradient.forEach((color, index) => {
    colors.push({ value: j[index + 1], color });
  });

  const expression: Array<any> = ['case'];
  for (let i = 0; i < colors.length; i++) {
    if (i === colors.length - 1) { //Last color as default
      expression.push(colors[i].color);
    } else {
      expression.push(['<=', ['feature-state', `population.${ year }`], colors[i].value]);
      expression.push(colors[i].color);
    }
  }

  return expression;
}
