import React from 'react';
import { View, Text } from 'react-native';
import { CalculationResult } from '../../../types';
import { theme } from '../../../theme';
import { styles } from '../CalculatorScreen.styles';
import LatexRenderer from '../../../components/latex/LatexRenderer';
import AreaGraph from '../../../components/graph/AreaGraph';

interface Props {
  result: CalculationResult;
}

export default function CalculatorResult({ result }: Props) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultLabel}>Resultado Final</Text>
      <LatexRenderer
        latex={`I = ${result.value.toFixed(6)}`}
        fontSize={24}
        color={theme.colors.primary}
        center
      />

      <AreaGraph
        expression={result.expression}
        a={result.bounds.a}
        b={result.bounds.b}
        n={result.iterations}
      />

      <View style={styles.divider} />
      <Text style={styles.stepsTitle}>Pasos de resolución:</Text>

      {result.steps.map((step, i) => (
        <View key={i} style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          {step.latex
            ? <LatexRenderer latex={step.latex} />
            : <Text style={styles.stepContent}>{step.content}</Text>
          }
        </View>
      ))}
    </View>
  );
}
