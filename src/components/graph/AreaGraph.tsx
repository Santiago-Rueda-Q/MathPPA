import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Rect } from 'react-native-svg';
import { evaluate } from 'mathjs';
import { theme } from '../../theme';

interface Props {
  expression: string;
  a: number;
  b: number;
  width?: number;
  height?: number;
}

export default function AreaGraph({ expression, a, b, width = Dimensions.get('window').width - 60, height = 200 }: Props) {
  const points: { x: number; y: number }[] = [];
  const padding = 20;
  
  // Calculate view range
  const rangeX = b - a;
  const startX = a - rangeX * 0.5;
  const endX = b + rangeX * 0.5;
  const stepX = (endX - startX) / 100;

  let minY = Infinity;
  let maxY = -Infinity;

  // 1. Calculate points and find Y range
  for (let x = startX; x <= endX; x += stepX) {
    try {
      const y = evaluate(expression, { x });
      if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
        points.push({ x, y });
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    } catch {}
  }

  // Add some buffer to Y
  const rangeY = maxY - minY || 1;
  const drawMinY = minY - rangeY * 0.2;
  const drawMaxY = maxY + rangeY * 0.2;

  // 2. Mapping functions
  const mapX = (x: number) => padding + ((x - startX) / (endX - startX)) * (width - 2 * padding);
  const mapY = (y: number) => height - padding - ((y - drawMinY) / (drawMaxY - drawMinY)) * (height - 2 * padding);

  // 3. Create paths
  let curvePath = '';
  let areaPath = '';

  const areaPoints = points.filter(p => p.x >= a && p.x <= b);
  
  if (points.length > 0) {
    curvePath = `M ${mapX(points[0].x)} ${mapY(points[0].y)} `;
    for (let i = 1; i < points.length; i++) {
      curvePath += `L ${mapX(points[i].x)} ${mapY(points[i].y)} `;
    }

    if (areaPoints.length > 0) {
      areaPath = `M ${mapX(areaPoints[0].x)} ${mapY(0)} `;
      for (const p of areaPoints) {
        areaPath += `L ${mapX(p.x)} ${mapY(p.y)} `;
      }
      areaPath += `L ${mapX(areaPoints[areaPoints.length - 1].x)} ${mapY(0)} Z`;
    }
  }

  const yZero = mapY(0);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Fill Area */}
        {areaPath !== '' && (
          <Path d={areaPath} fill={theme.colors.primary + '40'} />
        )}
        
        {/* X Axis */}
        <Line 
          x1={padding} y1={yZero} x2={width - padding} y2={yZero} 
          stroke={theme.colors.border} strokeWidth="1" 
        />
        
        {/* Limits labels */}
        <Line x1={mapX(a)} y1={yZero - 5} x2={mapX(a)} y2={yZero + 5} stroke={theme.colors.accent} strokeWidth="2" />
        <Line x1={mapX(b)} y1={yZero - 5} x2={mapX(b)} y2={yZero + 5} stroke={theme.colors.accent} strokeWidth="2" />
        
        <SvgText x={mapX(a)} y={yZero + 18} fill={theme.colors.accent} fontSize="10" textAnchor="middle">a={a}</SvgText>
        <SvgText x={mapX(b)} y={yZero + 18} fill={theme.colors.accent} fontSize="10" textAnchor="middle">b={b}</SvgText>

        {/* Function Curve */}
        {curvePath !== '' && (
          <Path d={curvePath} stroke={theme.colors.primary} strokeWidth="2" fill="none" />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginTop: 15,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  }
});
