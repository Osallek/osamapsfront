import { Api, DataJenksNode, Level } from 'types/api.types';
import { getGradient } from 'utils/colors.utils';
import { flatten } from 'utils/object.utils';

function getExpression(data: DataJenksNode, level: Level, stateField: string): Array<any> {
  let nbColors: number;

  switch (level) {
    case Level.COMMUNE:
      nbColors = data.nbCommunes;
      break;
    case Level.DEPARTEMENT:
      nbColors = data.nbDepartements;
      break;
    case Level.REGION:
      nbColors = data.nbRegions;
      break;
  }

  const gradient = getGradient(nbColors + 1);

  const colors: Array<{ value: number, color: string }> = [];
  gradient.forEach((color, index) => {
    colors.push({ value: index, color });
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

export function getAreaExpression(data: DataJenksNode, level: Level): any {
  return getExpression(data, level, 'area');
}

export function getYearExpression(data: Record<number, DataJenksNode>, level: Level, year: number, field: string): any {
  if (year === undefined) {
    return 'transparent';
  }

  return getExpression(data[year], level, `${ field }.${ year }`);
}

export function getFeatureState(data: Api, level: Level, id: string, current: any): any {
  const newState = { ...current };
  Object.entries(data.jenks).forEach(([type, second]) => {
    if ((second as DataJenksNode).nbRegions) {
      const node = second as DataJenksNode;
      switch (level) {
        case Level.COMMUNE:
          if (node.communes[id] !== undefined) {
            newState[type] = node.communes[id];
          }
          break;
        case Level.DEPARTEMENT:
          if (node.departements[id] !== undefined) {
            newState[type] = node.departements[id];
          }
          break;
        case Level.REGION:
          if (node.regions[id] !== undefined) {
            newState[type] = node.regions[id];
          }
          break;
      }
    } else {
      const record = second as Record<string, DataJenksNode>;
      newState[type] = {};
      switch (level) {
        case Level.COMMUNE:
          Object.entries(record).forEach(([year, value]) => {
            if (value.communes[id] !== undefined) {
              newState[type][year] = value.communes[id];
            }
          });
          break;
        case Level.DEPARTEMENT:
          Object.entries(record).forEach(([year, value]) => {
            if (value.departements[id] !== undefined) {
              newState[type][year] = value.departements[id];
            }
          });
          break;
        case Level.REGION:
          Object.entries(record).forEach(([year, value]) => {
            if (value.regions[id] !== undefined) {
              newState[type][year] = value.regions[id];
            }
          });
          break;
      }
    }
  });

  newState['loaded'] = true;

  return flatten(newState);
}
