import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useCalculator } from '../../hooks/useCalculator';
import { theme } from '../../theme';
import { StatusBar } from 'expo-status-bar';
import BrandHeader from '../../components/shared/BrandHeader';
import MathKeyboard from '../../components/calculator/MathKeyboard';
import LatexRenderer from '../../components/latex/LatexRenderer';
import AreaGraph from '../../components/graph/AreaGraph';
import { styles } from './CalculatorScreen.styles';

export default function CalculatorScreen() {
  const [showKeyboard, setShowKeyboard] = useState(false);

  const { 
    expression, cursorPosition, a, b, n, method, result, loading, error,
    setExpression, setA, setB, setN, setMethod, calculate, reset,
    insertAtCursor, moveCursor, deleteAtCursor
  } = useCalculator();

  const handleKeyPress = (val: string) => {
    insertAtCursor(val);
  };

  const handleDelete = () => {
    deleteAtCursor();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <BrandHeader />
        <Text style={styles.subtitle}>Métodos numéricos interactivos</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Expresión f(x)</Text>
          <TouchableOpacity 
            style={[styles.input, showKeyboard && styles.inputActive]}
            onPress={() => setShowKeyboard(true)}
          >
            <Text style={[styles.inputText, !expression && styles.placeholderText]}>
              {expression || "Ej. x^2 + sin(x)"}
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Límite a</Text>
              <TextInput 
                style={styles.textInput}
                value={a}
                onChangeText={setA}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.colors.text.muted}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Límite b</Text>
              <TextInput 
                style={styles.textInput}
                value={b}
                onChangeText={setB}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={theme.colors.text.muted}
              />
            </View>
          </View>

          <Text style={styles.label}>Iteraciones (n)</Text>
          <TextInput 
            style={styles.textInput}
            value={n}
            onChangeText={setN}
            keyboardType="numeric"
            placeholder="10"
            placeholderTextColor={theme.colors.text.muted}
          />

          <Text style={styles.label}>Método</Text>
          <View style={styles.methodsRow}>
            {(['trapecio', 'simpson', 'romberg'] as const).map(m => (
              <TouchableOpacity 
                key={m}
                style={[styles.methodBtn, method === m && styles.methodBtnActive]}
                onPress={() => setMethod(m)}
              >
                <Text style={[styles.methodText, method === m && styles.methodTextActive]}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Text style={styles.calcBtnText}>{loading ? 'Calculando...' : 'Calcular'}</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Resultado Final</Text>
            <LatexRenderer latex={`I = ${result.value.toFixed(6)}`} fontSize={24} color={theme.colors.primary} center />
            
            <AreaGraph 
               expression={result.expression} 
               a={result.bounds.a} 
               b={result.bounds.b} 
            />

            <View style={styles.divider} />
            <Text style={styles.stepsTitle}>Pasos de resolución:</Text>
            {result.steps.map((step, i) => (
              <View key={i} style={styles.stepContainer}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.latex && (
                  <LatexRenderer latex={step.latex} />
                )}
                {!step.latex && (
                   <Text style={styles.stepContent}>{step.content}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Keyboard Modal for properly covering TabBar and UX dismiss */}
      <Modal
        visible={showKeyboard}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowKeyboard(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowKeyboard(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
            <MathKeyboard 
              expression={expression}
              cursorPosition={cursorPosition}
              onPress={handleKeyPress}
              onDelete={handleDelete}
              onClear={reset}
              onMoveCursor={moveCursor}
              onCalculate={() => {
                calculate();
                setShowKeyboard(false);
              }}
            />
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
