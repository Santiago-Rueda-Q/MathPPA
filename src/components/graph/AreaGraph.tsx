import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle, G, Rect } from 'react-native-svg';
import { evaluate } from 'mathjs';

interface Props {
  expression: string;
  a: number;
  b: number;
  n?: number;
  width?: number;
  height?: number;
}

export default function AreaGraph({ 
  expression, a, b, n = 4, 
  width = Dimensions.get('window').width - 60, 
  height = 240 
}: Props) {
  const [selectedPoint, setSelectedPoint] = useState<{x: number, y: number, i: number} | null>(null);
  const padding = 40;
  
  // Calculate view range with buffer
  const rangeX = Math.abs(b - a) || 2;
  const startX = Math.min(a, b) - rangeX * 0.3;
  const endX = Math.max(a, b) + rangeX * 0.3;
  const stepX = (endX - startX) / 100;

  let minY = 0;
  let maxY = 1;
  const samplePoints: { x: number; y: number }[] = [];

  // 1. Sample function for bounds and curve
  for (let x = startX; x <= endX; x += stepX) {
    try {
      const y = evaluate(expression, { x });
      if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
        samplePoints.push({ x, y });
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    } catch {}
  }

  // 2. Calculate actual mathematical points (xi)
  const h = (b - a) / n;
  const mathPoints: { x: number; y: number; i: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const xi = a + i * h;
    try {
      const yi = evaluate(expression, { x: xi });
      mathPoints.push({ x: xi, y: yi, i });
    } catch {}
  }

  // Add buffer to Y
  const rangeY = maxY - minY || 1;
  const drawMinY = minY - rangeY * 0.2;
  const drawMaxY = maxY + rangeY * 0.2;

  // 3. Mapping functions
  const mapX = (x: number) => padding + ((x - startX) / (endX - startX)) * (width - 2 * padding);
  const mapY = (y: number) => height - padding - ((y - drawMinY) / (drawMaxY - drawMinY)) * (height - 2 * padding);

  const yZero = mapY(0);
  const xZero = mapX(0);

  // 4. Create Paths
  let curvePath = '';
  if (samplePoints.length > 0) {
    curvePath = `M ${mapX(samplePoints[0].x)} ${mapY(samplePoints[0].y)} `;
    samplePoints.forEach(p => {
      curvePath += `L ${mapX(p.x)} ${mapY(p.y)} `;
    });
  }

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Grid / Cartesian Planes */}
        <G stroke="#333" strokeWidth="0.5">
           {/* X Axis */}
           <Line x1={0} y1={yZero} x2={width} y2={yZero} stroke="#666" strokeWidth="1" />
           {/* Y Axis (if in range) */}
           {xZero > 0 && xZero < width && (
             <Line x1={xZero} y1={0} x2={xZero} y2={height} stroke="#666" strokeWidth="1" />
           )}
        </G>

        {/* Interactive Math Points (Dots) */}
        {mathPoints.map((p, idx) => (
          <G key={idx}>
            {/* Vertical Line */}
            <Line 
              x1={mapX(p.x)} y1={yZero} 
              x2={mapX(p.x)} y2={mapY(p.y)} 
              stroke="#10B981" 
              strokeWidth="0.8" 
              strokeDasharray="4,4"
              opacity={0.4}
            />
            
            {/* Hit Area for Touch */}
            <Circle 
              cx={mapX(p.x)} cy={mapY(p.y)} r="15" 
              fill="transparent" 
              onPress={() => setSelectedPoint(selectedPoint?.i === p.i ? null : p)}
            />

            {/* Visual Dot */}
            <Circle 
              cx={mapX(p.x)} cy={mapY(p.y)} r="4" 
              fill={selectedPoint?.i === p.i ? "#10B981" : "#10B981"} 
              stroke="#10B981"
              strokeWidth={selectedPoint?.i === p.i ? 2 : 0}
            />

            {/* Labels under x-axis */}
            <SvgText x={mapX(p.x)} y={yZero + 18} fill="#AAA" fontSize="9" textAnchor="middle">
              x{p.i}
            </SvgText>
          </G>
        ))}

        {/* Function Curve */}
        {curvePath !== '' && (
          <Path d={curvePath} stroke="#10B981" strokeWidth="2.5" fill="none" opacity={0.9} />
        )}

        {/* Tooltip Popup */}
        {selectedPoint && (
          <G>
            <Rect 
              x={mapX(selectedPoint.x) - 45} y={mapY(selectedPoint.y) - 35} 
              width="90" height="30" rx="6" 
              fill="#222" stroke="#10B981" strokeWidth="1" 
            />
            <SvgText 
              x={mapX(selectedPoint.x)} y={mapY(selectedPoint.y) - 15} 
              fill="#FFF" fontSize="10" textAnchor="middle" fontWeight="bold"
            >
              x{selectedPoint.i}: ({selectedPoint.x.toFixed(2)}, {selectedPoint.y.toFixed(4)})
            </SvgText>
          </G>
        )}

        {/* Boundary Labels (a / b) */}
        <SvgText x={mapX(a)} y={yZero - 10} fill="#10B981" fontSize="11" fontWeight="900" textAnchor="middle">a</SvgText>
        <SvgText x={mapX(b)} y={yZero - 10} fill="#10B981" fontSize="11" fontWeight="900" textAnchor="middle">b</SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    borderRadius: 12,
    marginTop: 15,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    padding: 5,
  }
});
