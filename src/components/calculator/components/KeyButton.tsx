import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { styles } from '../MathKeyboard.styles';
import { isOp, isNum, isFn, isNav, MATH_LABELS } from '../config/keyboard.config';

interface KeyButtonProps {
  keyVal: string;
  onPress: (keyVal: string) => void;
}

export default function KeyButton({ keyVal, onPress }: KeyButtonProps) {
  const getCustomStyle = () => {
    if (keyVal === 'DEL') return styles.delButton;
    if (keyVal === 'AC') return styles.acButton;
    if (keyVal === 'CALC') return [styles.equalButton, styles.fullWidthButton];
    return null;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getCustomStyle(),
        isOp(keyVal) && styles.opButton,
        isNum(keyVal) && styles.numButton
      ]}
      onPress={() => onPress(keyVal)}
    >
      <Text style={[
        styles.buttonText,
        isNum(keyVal) && styles.numText,
        isFn(keyVal) && styles.fnText,
        isNav(keyVal) && { fontSize: 20 }
      ]}>
        {MATH_LABELS[keyVal] || keyVal}
      </Text>
    </TouchableOpacity>
  );
}
