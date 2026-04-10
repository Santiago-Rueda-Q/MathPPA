export interface AreaGraphProps {
  expression: string;
  a: number;
  b: number;
  n?: number;
  width?: number;
  height?: number;
}

export interface GraphPoint {
  x: number;
  y: number;
}

export interface MathPoint extends GraphPoint {
  i: number;
}
