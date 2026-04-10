import { useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { Exercise } from '../../../data/exercises/types';
import { trapecioExercises } from '../../../data/exercises/trapecio';
import { simpsonExercises } from '../../../data/exercises/simpson';
import { rombergExercises } from '../../../data/exercises/romberg';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const METHODS = [
  { id: 'trapecio', name: 'Trapecio', data: trapecioExercises },
  { id: 'simpson',  name: 'Simpson 1/3', data: simpsonExercises },
  { id: 'romberg',  name: 'Romberg', data: rombergExercises },
];

export const useTutorScreen = (navigation: any) => {
  const [selectedMethod, setSelectedMethod] = useState(METHODS[0]);
  const [currentLevel, setCurrentLevel]     = useState(1);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(trapecioExercises[0]);

  const changeMethod = (method: typeof METHODS[number], onReset: () => void) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMethod(method);
    setCurrentLevel(1);
    setSelectedExercise(method.data[0] ?? null);
    onReset();
  };

  const selectExercise = (level: number, onReset: () => void) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const ex = selectedMethod.data.find(e => e.level === level);
    if (ex) {
      setSelectedExercise(ex);
      setCurrentLevel(level);
      onReset();
    }
  };

  const goToSolve = () => {
    if (selectedExercise) {
      navigation.navigate('Calculadora', { exercise: selectedExercise, method: selectedMethod.id });
    }
  };

  return { selectedMethod, changeMethod, currentLevel, selectedExercise, selectExercise, goToSolve };
};
