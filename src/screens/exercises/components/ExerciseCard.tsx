import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Exercise } from '../../../data/exercises/types';
import { Answers } from '../utils/exerciseMath';
import { styles } from '../TutorScreen.styles';
import { theme } from '../../../theme';
import LatexRenderer from '../../../components/latex/LatexRenderer';
import AreaGraph from '../../../components/graph/AreaGraph';
import QuizStep from './QuizStep';
import { parse } from 'mathjs';

const formatBound = (val: number) => {
  if (Math.abs(val - Math.PI) < 0.0001) return '\\pi';
  if (Math.abs(val - Math.PI / 2) < 0.0001) return '\\frac{\\pi}{2}';
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(2);
};

const getLatexExpression = (expr: string) => {
  try {
    let tex = parse(expr).toTex();
    tex = tex.replace(/\\exp\s*\\left\((.*?)\\right\)/g, ' e^{$1} ')
             .replace(/\\exp\s*\((.*?)\)/g, ' e^{$1} ')
             .replace(/\\exp/g, ' e^ ');
    return tex;
  } catch { return expr; }
};

interface Props {
  exercise: Exercise;
  answers: Answers;
  activeStep: number;
  isStepCorrect: boolean[];
  isStepWrong: boolean[];
  stepInputs: { h: string; fa: string; fb: string; sum: string; result: string };
  updateInput: (key: any, val: string, step: number) => void;
  validateStep: (n: number, answers: Answers, methodId: string) => void;
  onGoToSolve: () => void;
  methodId: string;
}

export default function ExerciseCard({
  exercise, answers, activeStep,
  isStepCorrect, isStepWrong, stepInputs,
  updateInput, validateStep, onGoToSolve, methodId,
}: Props) {
  const isRomberg = methodId === 'romberg';

  const step1Title = isRomberg ? 'PASO 1: Primera aproximación R[0,0]' : 'PASO 1: Calcular h (tamaño del paso)';
  const step2Title = isRomberg ? 'PASO 2: Segunda aproximación R[1,0]' : 'PASO 2: Evaluar extremos';
  const step3Title = isRomberg ? 'PASO 3: Extrapolación de Richardson R[1,1]' : 'PASO 3: Suma de puntos intermedios';
  const step3Label = isRomberg ? 'R[1,1] = ' : 'Σ f(xᵢ) = ';
  return (
    <View style={styles.exerciseCard}>
      {/* Progress bar */}
      <View style={{ height: 4, backgroundColor: theme.colors.grey[700], borderRadius: 2, marginBottom: 15, flexDirection: 'row', overflow: 'hidden' }}>
        <View style={{ width: `${(activeStep / 4) * 100}%`, backgroundColor: theme.colors.primary, height: '100%' }} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.exTitle}>Nivel {exercise.level}: {exercise.title}</Text>
        <MaterialCommunityIcons
          name={isStepCorrect[4] ? 'trophy' : 'trophy-outline'}
          size={24}
          color={isStepCorrect[4] ? theme.colors.warning : theme.colors.accent}
        />
      </View>

      <Text style={styles.exDesc}>{exercise.description}</Text>

      <View style={{ marginVertical: 15 }}>
        <LatexRenderer
          latex={`\\int_{${formatBound(exercise.a)}}^{${formatBound(exercise.b)}} ${getLatexExpression(exercise.expression)} \\, dx`}
          fontSize={22} center color={theme.colors.primary}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <QuizStep
          stepNum={1} title={step1Title}
          visible={activeStep >= 1}
          isCorrect={isStepCorrect[1]} isWrong={isStepWrong[1]}
          successText={`¡Correcto! h = ${answers.h.toFixed(2)}`}
          errorText="¡Valor incorrecto! Revisa la fórmula h=(b-a)/n"
          inputs={[{ label: 'h = ', value: stepInputs.h, placeholder: '0.00', onChange: v => updateInput('h', v, 1) }]}
          onValidate={() => validateStep(1, answers, methodId)}
        />

        <QuizStep
          stepNum={2} title={step2Title}
          visible={activeStep >= 2}
          isCorrect={isStepCorrect[2]} isWrong={isStepWrong[2]}
          successText="¡Excelente evaluación!"
          errorText="¡Valores incorrectos! Evalúa f(x) en los límites"
          inputs={[
            { label: 'f(a) = ', value: stepInputs.fa, placeholder: 'f(a)', onChange: v => updateInput('fa', v, 2) },
            { label: 'f(b) = ', value: stepInputs.fb, placeholder: 'f(b)', onChange: v => updateInput('fb', v, 2) },
          ]}
          onValidate={() => validateStep(2, answers, methodId)}
        />

        <QuizStep
          stepNum={3} title={step3Title}
          visible={activeStep >= 3}
          isCorrect={isStepCorrect[3]} isWrong={isStepWrong[3]}
          successText="¡Suma correcta!"
          errorText="¡Suma incorrecta! Revisa los puntos intermedios"
          inputs={[{ label: step3Label, value: stepInputs.sum, placeholder: 'Suma', onChange: v => updateInput('sum', v, 3) }]}
          onValidate={() => validateStep(3, answers, methodId)}
        />

        <QuizStep
          stepNum={4} title="PASO 4: Resultado Final Integral"
          visible={activeStep >= 4}
          isCorrect={isStepCorrect[4]} isWrong={isStepWrong[4]}
          successText="¡Resultado correcto!"
          errorText="¡Resultado incorrecto! Aplica la fórmula final"
          inputs={[{ label: 'I ≈ ', value: stepInputs.result, placeholder: 'Resultado', onChange: v => updateInput('result', v, 4) }]}
          onValidate={() => validateStep(4, answers, methodId)}
        />
      </View>

      {isStepCorrect[4] && (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <MaterialCommunityIcons name="check-decagram" size={60} color={theme.colors.primary} />
          <Text style={{ color: theme.colors.primary, fontWeight: '900', fontSize: 18, marginTop: 10 }}>¡Excelente resolución!</Text>
          <TouchableOpacity style={[styles.btnSolve, { width: '100%' }]} onPress={onGoToSolve}>
            <Text style={styles.btnLabel}>VER DETALLES EN CALCULADORA</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <AreaGraph expression={exercise.expression} a={exercise.a} b={exercise.b} n={exercise.n} height={140} />
      </View>
    </View>
  );
}
