import { useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { Answers } from '../utils/exerciseMath';

const INITIAL_INPUTS = { h: '', fa: '', fb: '', sum: '', result: '' };
const MARGIN = 0.01;

export const useQuizSteps = () => {
  const [stepInputs, setStepInputs] = useState(INITIAL_INPUTS);
  const [isStepCorrect, setIsStepCorrect] = useState([false, false, false, false, false]);
  const [isStepWrong, setIsStepWrong]     = useState([false, false, false, false, false]);
  const [activeStep, setActiveStep]       = useState(1);

  const resetQuiz = () => {
    setStepInputs(INITIAL_INPUTS);
    setIsStepCorrect([false, false, false, false, false]);
    setIsStepWrong([false, false, false, false, false]);
    setActiveStep(1);
  };

  const clearWrong = (stepNum: number) => {
    setIsStepWrong(prev => { const s = [...prev]; s[stepNum] = false; return s; });
  };

  const updateInput = (key: keyof typeof INITIAL_INPUTS, val: string, stepNum: number) => {
    setStepInputs(prev => ({ ...prev, [key]: val }));
    clearWrong(stepNum);
  };

  const validateStep = (stepNum: number, answers: Answers, methodId: string) => {
    const { h, fa, fb, sum, result } = stepInputs;
    const close = (a: string, b: number) => Math.abs(parseFloat(a) - b) < MARGIN;

    const step3Answer = methodId === 'romberg' ? (answers.r11 ?? answers.sum) : answers.sum;

    const correct =
      stepNum === 1 ? close(h, answers.h) :
      stepNum === 2 ? close(fa, answers.fa) && close(fb, answers.fb) :
      stepNum === 3 ? close(sum, step3Answer) :
      stepNum === 4 ? close(result, answers.result) : false;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (correct) {
      setIsStepCorrect(prev => { const s = [...prev]; s[stepNum] = true; return s; });
      clearWrong(stepNum);
      if (activeStep === stepNum && activeStep < 4) setActiveStep(stepNum + 1);
    } else {
      setIsStepWrong(prev => { const s = [...prev]; s[stepNum] = true; return s; });
      setTimeout(() => clearWrong(stepNum), 1500);
    }
  };

  return { stepInputs, isStepCorrect, isStepWrong, activeStep, updateInput, validateStep, resetQuiz };
};
