import React, { useEffect } from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text } from 'react-native';
import { styles } from './CalculatorScreen.styles';
import { useCalculatorScreen } from './hooks/useCalculatorScreen';
import CalculatorForm from './components/CalculatorForm';
import CalculatorResult from './components/CalculatorResult';
import BrandHeader from '../../components/shared/BrandHeader';
import MathKeyboard from '../../components/calculator/MathKeyboard';

export default function CalculatorScreen({ route }: any) {
  const {
    expression, cursorPosition, a, b, n, method, result, loading, error,
    showKeyboard, setShowKeyboard,
    setA, setB, setN, setMethod, reset,
    insertAtCursor, moveCursor, deleteAtCursor,
    loadFromRoute, handleCalculate,
  } = useCalculatorScreen(route?.params);

  useEffect(() => { loadFromRoute(route?.params); }, [route?.params]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <BrandHeader />
        <Text style={styles.subtitle}>Métodos numéricos interactivos</Text>

        <CalculatorForm
          expression={expression} showKeyboard={showKeyboard}
          a={a} b={b} n={n} method={method} loading={loading}
          onChangeA={setA} onChangeB={setB} onChangeN={setN} onChangeMethod={setMethod}
          onShowKeyboard={() => setShowKeyboard(true)}
          onCalculate={handleCalculate}
        />

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {result && <CalculatorResult result={result} />}
      </ScrollView>

      <Modal visible={showKeyboard} transparent animationType="slide"
        onRequestClose={() => setShowKeyboard(false)}>
        <TouchableWithoutFeedback onPress={() => setShowKeyboard(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <MathKeyboard
                expression={expression} cursorPosition={cursorPosition}
                onPress={insertAtCursor} onDelete={deleteAtCursor}
                onClear={reset} onMoveCursor={moveCursor}
                onCalculate={handleCalculate}
              />
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
