export const MATH_KEYS = [
  'sin(','cos(','tan(','exp(','ln(','log10(','^','sqrt(','pow(','pi',
  'e','x','(',')','DEL','AC','7','8','9','*','/','4','5','6','+',
  '-','1','2','3','0','.','{','}','LEFT','RIGHT','CALC'
];

export const MATH_LABELS: Record<string, string> = {
  pi: 'π', 
  'sqrt(': '√', 
  'pow(': 'xⁿ', 
  'exp(': 'eˣ',
  'log10(': 'log', 
  'LEFT': '←', 
  'RIGHT': '→', 
  'CALC': 'CALCULAR'
};

export const isOp = (k: string) => ['+','-','*','/','LEFT','RIGHT','{','}'].includes(k);
export const isNum = (k: string) => /^[0-9.]$/.test(k);
export const isFn = (k: string) => ['sin(','cos(','tan(','ln(','log10('].includes(k);
export const isNav = (k: string) => ['LEFT','RIGHT'].includes(k);
