import React from 'react';
import { StyleSheet, View } from 'react-native';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Props {
  latex: string;
  fontSize?: number;
  color?: string;
  center?: boolean;
}

export default function LatexRenderer({ latex, fontSize = 16, color = '#FFFFFF', center = false }: Props) {
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

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    paddingVertical: 5,
  }
});
