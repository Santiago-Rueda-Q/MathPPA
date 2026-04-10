const INSERTION_MAP: Record<string, { text: string; offset: number }> = {
  'sin(':   { text: 'sin()',   offset: 4 },
  'cos(':   { text: 'cos()',   offset: 4 },
  'tan(':   { text: 'tan()',   offset: 4 },
  'ln(':    { text: 'ln()',    offset: 3 },
  'sec(':   { text: 'sec()',   offset: 4 },
  'csc(':   { text: 'csc()',   offset: 4 },
  'log10(': { text: 'log10()', offset: 6 },
  'sqrt(':  { text: 'sqrt()',  offset: 5 },
  'exp(':   { text: 'exp()',   offset: 4 },
  'pow(':   { text: '^()',     offset: 2 },
  '^':      { text: '^{}',     offset: 2 },
};

export const resolveInsertion = (val: string) =>
  INSERTION_MAP[val] ?? { text: val, offset: val.length };

export const applyInsertion = (
  expression: string,
  cursorPosition: number,
  val: string
) => {
  const { text, offset } = resolveInsertion(val);
  const before = expression.substring(0, cursorPosition);
  const after = expression.substring(cursorPosition);
  return {
    expression: before + text + after,
    cursorPosition: cursorPosition + offset,
  };
};

export const applyDelete = (expression: string, cursorPosition: number) => {
  if (cursorPosition === 0) return { expression, cursorPosition };
  return {
    expression: expression.substring(0, cursorPosition - 1) + expression.substring(cursorPosition),
    cursorPosition: cursorPosition - 1,
  };
};

export const applyMoveCursor = (
  expression: string,
  cursorPosition: number,
  dir: 'left' | 'right'
) => {
  let newPos = cursorPosition + (dir === 'left' ? -1 : 1);
  if (dir === 'right') {
    const nextChar = expression[cursorPosition];
    if (['}', ')'].includes(nextChar)) newPos = cursorPosition + 1;
  }
  return Math.max(0, Math.min(expression.length, newPos));
};
