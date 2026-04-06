import { evaluate } from 'mathjs';
import { CalculationResult, CalculationStep } from '../../types';

export const calculateRomberg = (
  expression: string,
  a: number,
  b: number,
  maxIterations: number = 5
): CalculationResult => {
  const steps: CalculationStep[] = [];
  const R: number[][] = [];
  const f = (x: number) => evaluate(expression, { x });

  for (let i = 0; i < maxIterations; i++) {
    R[i] = [];
    const n = Math.pow(2, i);
    const h = (b - a) / n;

    if (i === 0) {
      R[0][0] = (h / 2) * (f(a) + f(b));
      steps.push({
        title: `Paso 1: Primera aproximación (n=1, h=${h.toFixed(4)})`,
        content: `R[0,0] = (h/2) * [f(a)+f(b)]`,
        latex: `R[0,0] = \\frac{h}{2} [f(a) + f(b)] = \\textcolor{#10B981}{\\frac{${h.toFixed(6)}}{2} [${f(a).toFixed(4)} + ${f(b).toFixed(4)}]} = ${R[0][0].toFixed(6)}`,
      });
    } else {
      let sum = 0;
      for (let k = 1; k <= Math.pow(2, i - 1); k++) {
        sum += f(a + (2 * k - 1) * h);
      }
      R[i][0] = 0.5 * R[i - 1][0] + h * sum;
      
      steps.push({
        title: `Paso ${i + 1}: Refinamiento del trapecio (n=${n}, h=${h.toFixed(6)})`,
        content: `R[${i},0] = 0.5 * R[${i-1},0] + h * Σf(points)`,
        latex: `R[${i},0] = 0.5 R[${i-1},0] + h \\sum_{k=1}^{2^{i-1}} f(a + (2k-1)h) = \\textcolor{#10B981}{0.5(${R[i-1][0].toFixed(6)}) + ${h.toFixed(6)}(${sum.toFixed(6)})} = ${R[i][0].toFixed(6)}`,
      });

      for (let j = 1; j <= i; j++) {
        R[i][j] = R[i][j - 1] + (R[i][j - 1] - R[i - 1][j - 1]) / (Math.pow(4, j) - 1);
        
        steps.push({
          title: `Paso ${i + 1}.${j}: Extrapolación de Richardson (Columna ${j})`,
          content: `Refinando el nivel ${i}...`,
          latex: `R_{${i},${j}} = R_{i,j-1} + \\frac{R_{i,j-1} - R_{i-1,j-1}}{4^j - 1} = \\textcolor{#10B981}{${R[i][j-1].toFixed(6)} + \\frac{${R[i][j-1].toFixed(6)} - ${R[i-1][j-1].toFixed(6)}}{4^${j} - 1}} = ${R[i][j].toFixed(6)}`,
        });
      }
    }
  }

  const resultValue = R[maxIterations - 1][maxIterations - 1];

  return {
    value: resultValue,
    steps,
    method: 'romberg',
    expression,
    bounds: { a, b },
    iterations: maxIterations,
  };
};
