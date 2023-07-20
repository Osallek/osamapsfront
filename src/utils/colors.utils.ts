import Gradient from 'javascript-color-gradient';
import { DataNode, DataPopulations, Departement, Level, Region } from 'types/api.types';

export function getGradient(midPoints: number, minColor: string = "#E2BC74", maxColor: string = "#DA1D1D"): Array<string> {
  return new Gradient().setColorGradient(minColor, maxColor).setMidpoint(midPoints).getColors();
}

export function getDataGradient(node: DataNode<DataPopulations>): Array<string> {
  switch (node.level) {
    case Level.REGION:
      return getGradient((node as Region).departements.length, '#8884d8', '#82ca9d');
    case Level.DEPARTEMENT:
      return getGradient((node as Departement).communes.length, '#8884d8', '#82ca9d');
  }

  return getGradient(1);
}

export function stringToColour(str: string): string {
  let hash = 0;

  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });

  let colour = '#';

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    colour += value.toString(16).padStart(2, '0');
  }

  return colour;
}

export function getRatioColor(ratio: number, minColor: string = "#E2BC74", maxColor: string = "#DA1D1D"): string {
  const from = rgb(maxColor);
  const to = rgb(minColor);

  const r = Math.ceil(from.r * ratio + to.r * (1 - ratio));
  const g = Math.ceil(from.g * ratio + to.g * (1 - ratio));
  const b = Math.ceil(from.b * ratio + to.b * (1 - ratio));

  return "#" + hex(r) + hex(g) + hex(b);
}

function rgb(color: string) {
  const hex = color.replace("#", "");

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  }
}

function hex(num: number) {
  const hex = num.toString(16);
  return (hex.length == 1) ? '0' + hex : hex;
}
