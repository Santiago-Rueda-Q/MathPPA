import { useState, useCallback } from 'react';
import { Method, CalculationResult } from '../types';
import { calculateTrapecio } from '../engine/methods/trapecio';
import { calculateSimpson } from '../engine/methods/simpson';
import { calculateRomberg } from '../engine/methods/romberg';
import { sanitizeExpression } from './utils/expressionSanitizer';
import { useExpressionInput } from './useExpressionInput';

const METHOD_MAP: Record<Method, (expr: string, a: number, b: number, n: number) => CalculationResult> = {
  trapecio: calculateTrapecio,
  simpson:  calculateSimpson,
  romberg:  calculateRomberg,
};

export const useCalculator = () => {
  const expression = useExpressionInput('x^2');

  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [n, setN] = useState('10');
  const [method, setMethod] = useState<Method>('trapecio');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      const numN = parseInt(n);

      if (isNaN(numA) || isNaN(numB) || isNaN(numN))
        throw new Error('Por favor ingresa números válidos');

      let effectiveN = numN;
      if (method === 'romberg' && numN > 10) {
        setError('Romberg: el número de niveles se ha limitado a 10 para evitar cálculos excesivos.');
        effectiveN = 10;
      }

      const executor = METHOD_MAP[method];
      if (!executor) throw new Error('Método no soportado');

      setResult(executor(sanitizeExpression(expression.expression), numA, numB, effectiveN));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [a, b, n, method, expression.expression]);

  const reset = () => {
    expression.reset();
    setResult(null);
    setError(null);
  };

  return {
    ...expression,
    a, setA,
    b, setB,
    n, setN,
    method, setMethod,
    result, loading, error,
    calculate, reset,
  };
};
