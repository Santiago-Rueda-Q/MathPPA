import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LatexRenderer from '../latex/LatexRenderer';
import { styles } from './MathKeyboard.styles';

interface Props {
  expression: string;
  cursorPosition: number;
  onPress: (val: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onCalculate: () => void;
  onMoveCursor: (dir: 'left' | 'right') => void;
}

export default function MathKeyboard({ 
  expression, cursorPosition, onPress, onDelete, onClear, onCalculate, onMoveCursor 
}: Props) {
  
  const keys = [
    ['sin(', 'cos(', 'tan(', 'exp(', 'ln('],
    ['log10(', '^', 'sqrt(', 'pow(', 'pi'],
    ['e', 'x', '(', ')', 'DEL'],
    ['AC', '7', '8', '9', '*'],
    ['/', '4', '5', '6', '+'],
    ['-', '1', '2', '3', '0'],
    ['.', '{', '}', 'LEFT', 'RIGHT'],
    ['=', 'CALC'], // Added a big calc button or something
  ];

  // Simplified layout for 5 columns
  const flatKeys = [
    'sin(', 'cos(', 'tan(', 'exp(', 'ln(',
    'log10(', '^', 'sqrt(', 'pow(', 'pi',
    'e', 'x', '(', ')', 'DEL',
    'AC', '7', '8', '9', '*',
    '/', '4', '5', '6', '+',
    '-', '1', '2', '3', '0',
    '.', '{', '}', 'LEFT', 'RIGHT',
    'CALC'
  ];

  const getButtonStyles = (key: string) => {
    if (key === 'DEL') return [styles.button, styles.delButton];
    if (key === 'AC') return [styles.button, styles.acButton];
    if (key === 'CALC') return [styles.button, styles.equalButton, styles.fullWidthButton];
    if (['LEFT', 'RIGHT', '{', '}'].includes(key)) return [styles.button, styles.opButton];
    if (['+', '-', '*', '/'].includes(key)) return [styles.button, styles.opButton];
    if (['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].includes(key)) return [styles.button, styles.numButton];
    return styles.button;
  };

  const getLabel = (key: string) => {
    switch (key) {
      case 'pi': return 'π';
      case 'sqrt(': return '√';
      case 'pow(': return 'xⁿ';
      case 'exp(': return 'eˣ';
      case 'log10(': return 'log';
      case 'sin(': return 'sin';
      case 'cos(': return 'cos';
      case 'tan(': return 'tan';
      case 'LEFT': return '←';
      case 'RIGHT': return '→';
      case 'CALC': return 'CALCULAR';
      default: return key;
    }
  };

  const getPreviewLatex = () => {
    if (!expression) return '';
    try {
      // Inyectamos el cursor visual en la posición real de la memoria
      const before = expression.substring(0, cursorPosition);
      const after = expression.substring(cursorPosition);
      
      // El cursor de color esmeralda solo para la vista
      const withCursor = before + '\\textcolor{#10B981}{|}' + after;

      // Traducimos a formato LaTeX legible
      let tex = withCursor
        .replace(/sqrt\(([^)]*)\)/g, '\\sqrt{$1}')
        .replace(/sin\(([^)]*)\)/g, '\\sin($1)')
        .replace(/cos\(([^)]*)\)/g, '\\cos($1)')
        .replace(/tan\(([^)]*)\)/g, '\\tan($1)')
        .replace(/ln\(([^)]*)\)/g, '\\ln($1)')
        .replace(/sec\(([^)]*)\)/g, '\\sec($1)')
        .replace(/csc\(([^)]*)\)/g, '\\csc($1)')
        .replace(/log10\(([^)]*)\)/g, '\\log_{10}($1)')
        .replace(/exp\(([^)]*)\)/g, 'e^{$1}')
        .replace(/\^/g, '^') // Ya manejamos { } en el estado
        .replace(/pi/g, '\\pi ')
        .replace(/\*/g, ' \\cdot ')
        .replace(/\//g, ' \\div ');

      // El estado ya contiene {} y (), así que el renderizado será perfecto
      return tex;
    } catch {
      return expression;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <View style={styles.latexPreview}>
            <LatexRenderer latex={getPreviewLatex() || 'f(x)'} fontSize={22} color="#FFFFFF" center />
        </View>
        <Text style={styles.rawPreview} numberOfLines={1}>
           {expression.substring(0, cursorPosition)}
           <Text style={{color: '#10B981'}}>|</Text>
           {expression.substring(cursorPosition)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {flatKeys.map((key) => (
          <TouchableOpacity 
            key={key} 
            style={getButtonStyles(key)}
            onPress={() => {
              if (key === 'DEL') onDelete();
              else if (key === 'AC') onClear();
              else if (key === 'LEFT') onMoveCursor('left');
              else if (key === 'RIGHT') onMoveCursor('right');
              else if (key === 'CALC') onCalculate();
              else onPress(key);
            }}
          >
            <Text style={[
              styles.buttonText,
              ['sin(', 'cos(', 'tan(', 'ln(', 'log', 'sec', 'csc'].includes(key) && styles.fnText,
              ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].includes(key) && styles.numText,
              ['LEFT', 'RIGHT'].includes(key) && { fontSize: 20 }
            ]}>
              {getLabel(key)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
