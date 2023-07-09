import Gradient from 'javascript-color-gradient';

export function getGradient(midPoints: number, minColor: string = "#e2bc74", maxColor: string = "#DA1D1D"): Array<string> {
  return new Gradient().setColorGradient(minColor, maxColor).setMidpoint(midPoints).getColors();
}
