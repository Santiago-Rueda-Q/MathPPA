import { useState, useCallback } from 'react';
import { Method, CalculatorState, CalculationResult } from '../types';
import { calculateTrapecio } from '../engine/methods/trapecio';
import { calculateSimpson } from '../engine/methods/simpson';
import { calculateRomberg } from '../engine/methods/romberg';

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState & { cursorPosition: number }>({
    expression: 'x^2',
    cursorPosition: 3,
    a: '0',
    b: '1',
    n: '10',
    method: 'trapecio',
    result: null,
    loading: false,
    error: null,
  });

  const setExpression = (expression: string) => 
    setState(prev => ({ ...prev, expression, cursorPosition: expression.length }));

  const insertAtCursor = (val: string) => {
    setState(prev => {
      let insertion = val;
      let cursorOffset = val.length;

      // Smart handling for functions and exponents
      if (val === 'sin(' || val === 'cos(' || val === 'tan(' || val === 'ln(' || val === 'sec(' || val === 'csc(') {
        insertion = val + ')';
        cursorOffset = val.length; 
      } else if (val === 'log10(') {
        insertion = 'log10()';
        cursorOffset = 6;
      } else if (val === 'sqrt(') {
        insertion = 'sqrt()';
        cursorOffset = 5;
      } else if (val === 'exp(') {
        insertion = 'exp()';
        cursorOffset = 4;
      } else if (val === 'pow(') {
        insertion = '^()';
        cursorOffset = 2; // Position in ^()
      } else if (val === '^') {
        insertion = '^{}';
        cursorOffset = 2; // Position in ^{}
      }

      const before = prev.expression.substring(0, prev.cursorPosition);
      const after = prev.expression.substring(prev.cursorPosition);
      const newExpr = before + insertion + after;
      
      return {
        ...prev,
        expression: newExpr,
        cursorPosition: prev.cursorPosition + cursorOffset
      };
    });
  };

  const moveCursor = (dir: 'left' | 'right') => {
    setState(prev => {
      let newPos = prev.cursorPosition + (dir === 'left' ? -1 : 1);
      
      if (dir === 'right') {
         const nextChar = prev.expression[prev.cursorPosition];
         if (['}', ')'].includes(nextChar)) {
            newPos = prev.cursorPosition + 1;
         }
      }
      
      return {
        ...prev,
        cursorPosition: Math.max(0, Math.min(prev.expression.length, newPos))
      };
    });
  };

  const deleteAtCursor = () => {
    setState(prev => {
      if (prev.cursorPosition === 0) return prev;
      const before = prev.expression.substring(0, prev.cursorPosition - 1);
      const after = prev.expression.substring(prev.cursorPosition);
      return {
        ...prev,
        expression: before + after,
        cursorPosition: prev.cursorPosition - 1
      };
    });
  };

  const setA = (a: string) => setState(prev => ({ ...prev, a }));
  const setB = (b: string) => setState(prev => ({ ...prev, b }));
  const setN = (n: string) => setState(prev => ({ ...prev, n }));
  const setMethod = (method: Method) => setState(prev => ({ ...prev, method }));

  const calculate = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { expression, a, b, n, method } = state;
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      const numN = parseInt(n);

      if (isNaN(numA) || isNaN(numB) || isNaN(numN)) {
        throw new Error('Por favor ingresa números válidos');
      }

      let result: CalculationResult;

      switch (method) {
        case 'trapecio':
          result = calculateTrapecio(expression, numA, numB, numN);
          break;
        case 'simpson':
          result = calculateSimpson(expression, numA, numB, numN);
          break;
        case 'romberg':
          result = calculateRomberg(expression, numA, numB, numN);
          break;
        default:
          throw new Error('Método no soportado');
      }

      setState(prev => ({ ...prev, result, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, [state]);

  const reset = () => setState(prev => ({ 
    ...prev, 
    expression: '', 
    cursorPosition: 0,
    result: null, 
    error: null 
  }));

  return {
    ...state,
    setExpression,
    insertAtCursor,
    moveCursor,
    deleteAtCursor,
    setA,
    setB,
    setN,
    setMethod,
    calculate,
    reset,
  };
};
