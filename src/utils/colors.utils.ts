import Gradient from 'javascript-color-gradient';

export function getGradient(midPoints: number, minColor: string = "#e2bc74", maxColor: string = "#DA1D1D"): Array<string> {
  return new Gradient().setColorGradient(minColor, maxColor).setMidpoint(midPoints).getColors();
}

export function getRatioColor(ratio: number, minColor: string = "#e2bc74", maxColor: string = "#DA1D1D"): string {
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
