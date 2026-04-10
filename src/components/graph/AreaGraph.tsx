import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle, G, Rect } from 'react-native-svg';
import { useAreaGraph } from './hooks/useAreaGraph';
import { styles } from './AreaGraph.styles';
import { theme } from '../../theme';
import { AreaGraphProps } from './AreaGraph.types';

export default function AreaGraph(props: AreaGraphProps) {
  const { 
    mapX, mapY, yZero, xZero, 
    mathPoints, curvePath, selectedPoint, setSelectedPoint, 
    config: { width, height, a, b } 
  } = useAreaGraph(props.expression, props.a, props.b, props.n, props.width, props.height);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <G stroke={theme.colors.grey[500]} strokeWidth="0.5">
           <Line x1={0} y1={yZero} x2={width} y2={yZero} stroke={theme.colors.grey[200]} strokeWidth="1" />
           {xZero > 0 && xZero < width && (
             <Line x1={xZero} y1={0} x2={xZero} y2={height} stroke={theme.colors.grey[200]} strokeWidth="1" />
           )}
        </G>

        {mathPoints.map((p) => (
          <G key={p.i}>
            <Line 
              x1={mapX(p.x)} y1={yZero} x2={mapX(p.x)} y2={mapY(p.y)} 
              stroke={theme.colors.success} strokeWidth="0.8" strokeDasharray="4,4" opacity={0.4}
            />
            
            <Circle 
              cx={mapX(p.x)} cy={mapY(p.y)} r="15" fill="transparent" 
              onPress={() => setSelectedPoint(selectedPoint?.i === p.i ? null : p)}
            />

            <Circle 
              cx={mapX(p.x)} cy={mapY(p.y)} r="4" 
              fill={theme.colors.success} stroke={theme.colors.success}
              strokeWidth={selectedPoint?.i === p.i ? 2 : 0}
            />

            <SvgText x={mapX(p.x)} y={yZero + 18} fill={theme.colors.text.muted} fontSize="9" textAnchor="middle">
              x{p.i}
            </SvgText>
          </G>
        ))}

        {curvePath !== '' && (
          <Path d={curvePath} stroke={theme.colors.success} strokeWidth="2.5" fill="none" opacity={0.9} />
        )}

        {selectedPoint && (
          <G>
            <Rect 
              x={mapX(selectedPoint.x) - 45} y={mapY(selectedPoint.y) - 35} 
              width="90" height="30" rx="6" 
              fill={theme.colors.grey[700]} stroke={theme.colors.success} strokeWidth="1" 
            />
            <SvgText 
              x={mapX(selectedPoint.x)} y={mapY(selectedPoint.y) - 15} 
              fill={theme.colors.text.primary} fontSize="10" textAnchor="middle" fontWeight="bold"
            >
              x{selectedPoint.i}: ({selectedPoint.x.toFixed(2)}, {selectedPoint.y.toFixed(4)})
            </SvgText>
          </G>
        )}

        <SvgText x={mapX(a)} y={yZero - 10} fill={theme.colors.success} fontSize="11" fontWeight="900" textAnchor="middle">a</SvgText>
        <SvgText x={mapX(b)} y={yZero - 10} fill={theme.colors.success} fontSize="11" fontWeight="900" textAnchor="middle">b</SvgText>
      </Svg>
    </View>
  );
}
