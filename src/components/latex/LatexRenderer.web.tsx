import React from 'react';
import { View } from 'react-native';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { LatexRendererProps } from './LatexRenderer.types';
import { styles } from './LatexRenderer.styles';
import { theme } from '../../theme';

export default function LatexRenderer({ 
  latex, 
  fontSize = 16, 
  color = theme.colors.text.primary, 
  center = false 
}: LatexRendererProps) {
  return (
    <View style={[styles.webContainer, { justifyContent: center ? 'center' : 'flex-start' }]}>
      <div 
        style={{ 
          color, 
          fontSize: `${fontSize}px`,
          textAlign: center ? 'center' : 'left',
          padding: '10px 0'
        }}
        dangerouslySetInnerHTML={{ 
          __html: katex.renderToString(latex, { 
            throwOnError: false, 
            displayMode: true 
          }) 
        }} 
      />
    </View>
  );
}
