import { useState } from 'react';
import { applyInsertion, applyDelete, applyMoveCursor } from './utils/cursorManager';

export const useExpressionInput = (initial = 'x^2') => {
  const [expression, setExpressionRaw] = useState(initial);
  const [cursorPosition, setCursorPosition] = useState(initial.length);

  const setExpression = (expr: string) => {
    setExpressionRaw(expr);
    setCursorPosition(expr.length);
  };

  const insertAtCursor = (val: string) => {
    const result = applyInsertion(expression, cursorPosition, val);
    setExpressionRaw(result.expression);
    setCursorPosition(result.cursorPosition);
  };

  const deleteAtCursor = () => {
    const result = applyDelete(expression, cursorPosition);
    setExpressionRaw(result.expression);
    setCursorPosition(result.cursorPosition);
  };

  const moveCursor = (dir: 'left' | 'right') =>
    setCursorPosition(applyMoveCursor(expression, cursorPosition, dir));

  const reset = () => {
    setExpressionRaw('');
    setCursorPosition(0);
  };

  return { expression, cursorPosition, setExpression, insertAtCursor, deleteAtCursor, moveCursor, reset };
};
