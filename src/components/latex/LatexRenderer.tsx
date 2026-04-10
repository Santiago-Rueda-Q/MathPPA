import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLatexRenderer } from './hooks/useLatexRenderer';
import { LatexRendererProps } from './LatexRenderer.types';
import { styles } from './LatexRenderer.styles';
import { theme } from '../../theme';

export default function LatexRenderer({ 
  latex, 
  fontSize = 16, 
  color = theme.colors.text.primary, 
  center = false 
}: LatexRendererProps) {
  const { height, html, handleMessage } = useLatexRenderer(latex, fontSize, color, center);

  return (
    <View style={[styles.container, { minHeight: fontSize * 2, height }]}>
      <WebView 
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        backgroundColor="transparent"
        scrollEnabled={false}
        onMessage={handleMessage}
      />
    </View>
  );
}
