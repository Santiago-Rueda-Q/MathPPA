import { theme } from '../../../theme';

interface UseMathKeyboardProps {
  expression: string;
  cursorPosition: number;
  onPress: (val: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onCalculate: () => void;
  onMoveCursor: (dir: 'left' | 'right') => void;
}

export function useMathKeyboard({
  expression, cursorPosition, onPress, onDelete, onClear, onCalculate, onMoveCursor
}: UseMathKeyboardProps) {

  const latex = (() => {
    if (!expression) return '';
    try {
      const cursorColor = theme.colors.success;
      return (expression.slice(0, cursorPosition) + `\\textcolor{${cursorColor}}{|}` + expression.slice(cursorPosition))
        .replace(/sqrt\(([^)]*)\)/g, '\\sqrt{$1}')
        .replace(/(sin|cos|tan|ln|sec|csc)\(([^)]*)\)/g, '\\$1($2)')
        .replace(/log10\(([^)]*)\)/g, '\\log_{10}($1)')
        .replace(/exp\(([^)]*)\)/g, 'e^{$1}')
        .replace(/pi/g, '\\pi ')
        .replace(/\*/g, ' \\cdot ')
        .replace(/\//g, ' \\div ');
    } catch { 
      return expression; 
    }
  })();

  const handleKey = (k: string) => {
    if (k === 'DEL') return onDelete();
    if (k === 'AC') return onClear();
    if (k === 'LEFT') return onMoveCursor('left');
    if (k === 'RIGHT') return onMoveCursor('right');
    if (k === 'CALC') return onCalculate();
    return onPress(k);
  };

  return { latex, handleKey };
}
