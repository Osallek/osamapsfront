import { quantile } from 'simple-statistics';
import { DataNode } from 'types/api.types';
import { getGradient } from 'utils/colors.utils';

export function getAreaExpression(data: Record<string, DataNode>): Array<any> {
  const clean = Object.values(data).map(value => value.area).filter(value => value !== undefined);
  const regionGradient = getGradient(Math.min(5, Object.keys(clean).length));

  const colors: Array<{ value: number, color: string }> = [];
  regionGradient.forEach((color, index) => {
    colors.push({ value: quantile(clean, (index + 1) / regionGradient.length), color });
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
