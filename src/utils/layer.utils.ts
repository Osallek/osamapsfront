import { DataJenks } from 'types/api.types';
import { getGradient } from 'utils/colors.utils';

function getExpression(breaks: Array<number>, stateField: string): Array<any> {
  const gradient = getGradient(breaks.length - 1);

  const colors: Array<{ value: number, color: string }> = [];
  gradient.forEach((color, index) => {
    colors.push({ value: breaks[index + 1], color });
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

export function getAreaExpression(data: DataJenks): any {
  return getExpression(data.area, 'area');
}

export function getYearExpression(data: Record<number, Array<number>>, year: number, field: string): any {
  if (year === undefined) {
    return 'transparent';
  }

  return getExpression(data[year], `${ field }.${ year }`);
}
