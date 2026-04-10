import { evaluate } from 'mathjs';
import { GraphPoint, MathPoint } from '../AreaGraph.types';

export const getSamplePoints = (expression: string, startX: number, endX: number, step: number) => {
  const points: GraphPoint[] = [];
  let minY = Infinity;
  let maxY = -Infinity;

  for (let x = startX; x <= endX; x += step) {
    try {
      const y = evaluate(expression, { x });
      if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
        points.push({ x, y });
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    } catch {}
  }

  if (minY === Infinity) minY = 0;
  if (maxY === -Infinity) maxY = 1;
  
  return { points, minY, maxY };
};

export const getMathPoints = (expression: string, a: number, n: number, h: number): MathPoint[] => {
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = a + i * h;
    try {
      const y = evaluate(expression, { x });
      if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
        return { x, y, i };
      }
    } catch {}
    return null;
  }).filter((p): p is MathPoint => p !== null);
};
