import { useState } from 'react';
import { useCalculator } from '../../../hooks/useCalculator';
import { Method } from '../../../types';

export const useCalculatorScreen = (routeParams: any) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const calculator = useCalculator();

  const loadFromRoute = (params: any) => {
    if (!params?.exercise) return;
    const { exercise, method: mId } = params;
    calculator.setExpression(exercise.expression);
    calculator.setA(exercise.a.toString());
    calculator.setB(exercise.b.toString());
    calculator.setN(exercise.n.toString());
    if (mId) calculator.setMethod(mId as Method);
    setShowKeyboard(false);
  };

  const handleCalculate = () => {
    calculator.calculate();
    setShowKeyboard(false);
  };

  return {
    ...calculator,
    showKeyboard,
    setShowKeyboard,
    loadFromRoute,
    handleCalculate,
  };
};
