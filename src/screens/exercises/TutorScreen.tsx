import React from 'react';
import { View, ScrollView } from 'react-native';
import { styles } from './TutorScreen.styles';
import { useTutorScreen, METHODS } from './hooks/useTutorScreen';
import { useQuizSteps } from './hooks/useQuizSteps';
import { calculateAnswers } from './utils/exerciseMath';
import TutorHeader from './components/TutorHeader';
import ExerciseMap from './components/ExerciseMap';
import ExerciseCard from './components/ExerciseCard';

export default function TutorScreen({ navigation }: any) {
  const { selectedMethod, changeMethod, currentLevel, selectedExercise, selectExercise, goToSolve } =
    useTutorScreen(navigation);

  const quiz = useQuizSteps();

  const answers = selectedExercise
    ? calculateAnswers(selectedExercise, selectedMethod.id)
    : { h: 0, fa: 0, fb: 0, sum: 0, result: 0 };

  return (
    <View style={styles.container}>
      <TutorHeader
        selectedMethodId={selectedMethod.id}
        methods={METHODS}
        onSelect={(m) => changeMethod(m, quiz.resetQuiz)}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <ExerciseMap
          currentLevel={currentLevel}
          onSelect={(level) => selectExercise(level, quiz.resetQuiz)}
        />

        {selectedExercise && (
          <ExerciseCard
            exercise={selectedExercise}
            answers={answers}
            activeStep={quiz.activeStep}
            isStepCorrect={quiz.isStepCorrect}
            isStepWrong={quiz.isStepWrong}
            stepInputs={quiz.stepInputs}
            updateInput={quiz.updateInput}
            validateStep={quiz.validateStep}
            onGoToSolve={goToSolve}
            methodId={selectedMethod.id}
          />
        )}
      </ScrollView>
    </View>
  );
}
