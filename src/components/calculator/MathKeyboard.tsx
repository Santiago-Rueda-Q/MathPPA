import React from 'react';
import { View, Text } from 'react-native';
import LatexRenderer from '../latex/LatexRenderer';
import { styles } from './MathKeyboard.styles';
import { theme } from '../../theme';
import { MATH_KEYS } from './config/keyboard.config';
import KeyButton from './components/KeyButton';
import { useMathKeyboard } from './hooks/useMathKeyboard';

interface Props {
  expression: string;
  cursorPosition: number;
  onPress: (val: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onCalculate: () => void;
  onMoveCursor: (dir: 'left' | 'right') => void;
}

export default function MathKeyboard(props: Props) {
  const { latex, handleKey } = useMathKeyboard(props);

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <View style={styles.latexPreview}>
            <LatexRenderer latex={latex || 'f(x)'} fontSize={22} color={theme.colors.text.primary} center />
        </View>
        <Text style={styles.rawPreview} numberOfLines={1}>
          {props.expression.slice(0, props.cursorPosition)}
          <Text style={{ color: theme.colors.success }}>|</Text>
          {props.expression.slice(props.cursorPosition)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {MATH_KEYS.map(k => (
          <KeyButton key={k} keyVal={k} onPress={handleKey} />
        ))}
      </View>
    </View>
  );
}
