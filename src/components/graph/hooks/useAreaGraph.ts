import { useState } from 'react';
import { Dimensions } from 'react-native';
import { getSamplePoints, getMathPoints } from '../utils/graphMath';
import { createMapper } from '../utils/graphMapping';
import { MathPoint } from '../AreaGraph.types';

export const useAreaGraph = (
  expression: string, 
  a: number, 
  b: number, 
  n: number = 4, 
  width: number = Dimensions.get('window').width - 60, 
  height: number = 240
) => {
  const [selectedPoint, setSelectedPoint] = useState<MathPoint | null>(null);

  const padding = 40;
  const rangeX = Math.abs(b - a) || 2;

  const startX = Math.min(a, b) - rangeX * 0.3;
  const endX = Math.max(a, b) + rangeX * 0.3;
  const step = (endX - startX) / 100;

  const { points, minY, maxY } = getSamplePoints(expression, startX, endX, step);

  const h = (b - a) / n;
  const mathPoints = getMathPoints(expression, a, n, h);

  const rangeY = maxY - minY || 1;
  const drawMinY = minY - rangeY * 0.2;
  const drawMaxY = maxY + rangeY * 0.2;

  const { mapX, mapY } = createMapper(
    startX, endX,
    drawMinY, drawMaxY,
    width, height,
    padding
  );

  const yZero = mapY(0);
  const xZero = mapX(0);

  let curvePath = '';
  if (points.length > 0) {
    curvePath = `M ${mapX(points[0].x)} ${mapY(points[0].y)} ` + 
      points.slice(1).map(p => `L ${mapX(p.x)} ${mapY(p.y)}`).join(' ');
  }

  return {
    mapX, mapY, yZero, xZero,
    points, mathPoints, curvePath,
    selectedPoint, setSelectedPoint,
    config: { width, height, a, b }
  };
};
