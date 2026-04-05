import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BrandHeader from '../../components/shared/BrandHeader';
import LatexRenderer from '../../components/latex/LatexRenderer';
import { styles } from './TutorScreen.styles';

const Step = ({ index, title, description, formula, value, onChange, feedback, isActive }: any) => {
  return (
    <View style={[styles.stepCard, isActive && styles.stepCardActive, !isActive && styles.stepCardDisabled]}>
      <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>Paso {index + 1}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{description}</Text>
      {formula && <LatexRenderer latex={formula} fontSize={14} color="#185FA5" />}
      
      {isActive && (
        <>
          <TextInput 
            style={[styles.input, feedback === 'correct' && styles.inputCorrect, feedback === 'error' && styles.inputError]}
            value={value}
            onChangeText={onChange}
            placeholder="Introduce tu resultado"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
          {feedback === 'correct' && <Text style={styles.feedbackCorrect}>¡Excelente! 🎉</Text>}
          {feedback === 'error' && <Text style={styles.feedbackError}>Casi lo logras, revisa el cálculo 🧐</Text>}
        </>
      )}
    </View>
  );
};

export default function TutorScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState(['', '', '']);
  const [feedbacks, setFeedbacks] = useState<('none' | 'correct' | 'error')[]>(['none', 'none', 'none']);

  const expectedAnswers = ['1', '2', '1'];

  const validateStep = (idx: number) => {
    const val = parseFloat(values[idx]);
    const exp = parseFloat(expectedAnswers[idx]);
    
    if (isNaN(val)) return;

    if (Math.abs(val - exp) < 0.01) {
      const newFeedbacks = [...feedbacks];
      newFeedbacks[idx] = 'correct';
      setFeedbacks(newFeedbacks);
      
      if (idx < expectedAnswers.length - 1) {
        setTimeout(() => setCurrentStep(idx + 1), 800);
      }
    } else {
      const newFeedbacks = [...feedbacks];
      newFeedbacks[idx] = 'error';
      setFeedbacks(newFeedbacks);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <BrandHeader />
        <Text style={styles.subtitle}>Sigue los pasos para resolver la integral</Text>
        
        <View style={styles.exerciseHeader}>
          <LatexRenderer latex="\int_0^2 x^2 \, dx" fontSize={32} color="#FFFFFF" center />
          <Text style={styles.exerciseLimits}>n = 2</Text>
          <Text style={styles.exerciseMethod}>Método: Trapecio</Text>
        </View>

        <Step 
          index={0}
          title="Calcular h"
          description="Aplica la fórmula para el tamaño del paso:"
          formula="h = \frac{b - a}{n}"
          value={values[0]}
          onChange={(v: string) => {
            const nv = [...values]; nv[0] = v; setValues(nv);
            validateStep(0);
          }}
          feedback={feedbacks[0]}
          isActive={currentStep >= 0}
        />

        <Step 
          index={1}
          title="Extremos"
          description="Suma la evaluación de los límites principales:"
          formula="f(x_0) + f(x_n)"
          value={values[1]}
          onChange={(v: string) => {
            const nv = [...values]; nv[1] = v; setValues(nv);
            validateStep(1);
          }}
          feedback={feedbacks[1]}
          isActive={currentStep >= 1}
        />

        {currentStep === expectedAnswers.length - 1 && feedbacks[1] === 'correct' && (
          <View style={styles.congratsCard}>
            <Text style={styles.congratsTitle}>¡Felicidades!</Text>
            <Text style={styles.congratsBody}>Has completado este ejercicio guiado. ¡Ahora intenta con la calculadora!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
