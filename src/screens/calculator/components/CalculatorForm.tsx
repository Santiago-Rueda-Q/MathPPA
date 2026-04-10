import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Method } from '../../../types';
import { styles } from '../CalculatorScreen.styles';
import { theme } from '../../../theme';

const METHODS = ['trapecio', 'simpson', 'romberg'] as const;

interface Props {
  a: string; b: string; n: string; method: Method;
  loading: boolean;
  onChangeA: (v: string) => void;
  onChangeB: (v: string) => void;
  onChangeN: (v: string) => void;
  onChangeMethod: (m: Method) => void;
  onShowKeyboard: () => void;
  onCalculate: () => void;
  expression: string;
  showKeyboard: boolean;
}

export default function CalculatorForm({
  a, b, n, method, loading, expression, showKeyboard,
  onChangeA, onChangeB, onChangeN, onChangeMethod, onShowKeyboard, onCalculate
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Expresión f(x)</Text>
      <TouchableOpacity
        style={[styles.input, showKeyboard && styles.inputActive]}
        onPress={onShowKeyboard}
      >
        <Text style={[styles.inputText, !expression && styles.placeholderText]}>
          {expression || 'Ej. x^2 + sin(x)'}
        </Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Límite a</Text>
          <TextInput style={styles.textInput} value={a} onChangeText={onChangeA}
            keyboardType="numeric" placeholder="0" placeholderTextColor={theme.colors.text.muted} />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Límite b</Text>
          <TextInput style={styles.textInput} value={b} onChangeText={onChangeB}
            keyboardType="numeric" placeholder="1" placeholderTextColor={theme.colors.text.muted} />
        </View>
      </View>

      <Text style={styles.label}>Iteraciones (n)</Text>
      <TextInput style={styles.textInput} value={n} onChangeText={onChangeN}
        keyboardType="numeric" placeholder="10" placeholderTextColor={theme.colors.text.muted} />

      <Text style={styles.label}>Método</Text>
      <View style={styles.methodsRow}>
        {METHODS.map(m => (
          <TouchableOpacity
            key={m}
            style={[styles.methodBtn, method === m && styles.methodBtnActive]}
            onPress={() => onChangeMethod(m)}
          >
            <Text style={[styles.methodText, method === m && styles.methodTextActive]}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.calcBtn} onPress={onCalculate}>
        <Text style={styles.calcBtnText}>{loading ? 'Calculando...' : 'Calcular'}</Text>
      </TouchableOpacity>
    </View>
  );
}
