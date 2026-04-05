import { evaluate } from 'mathjs';
import { CalculationResult, CalculationStep } from '../../types';

export const calculateTrapecio = (
  expression: string,
  a: number,
  b: number,
  n: number
): CalculationResult => {
  const h = (b - a) / n;
  const steps: CalculationStep[] = [];
  
  // Step 1: Divide the interval
  steps.push({
    title: 'Paso 1: Calcular h (tamaño del paso)',
    content: `h = (b - a) / n = (${b} - ${a}) / ${n} = ${h.toFixed(6)}`,
    latex: `h = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`,
  });

  // Step 2: Evaluate endpoints
  const f = (x: number) => evaluate(expression, { x });
  const f_a = f(a);
  const f_b = f(b);
  
  steps.push({
    title: 'Paso 2: Evaluar extremos del intervalo',
    content: `f(a) = f(${a}) = ${f_a.toFixed(6)}\nf(b) = f(${b}) = ${f_b.toFixed(6)}`,
    latex: `f(a) = f(${a}) = ${f_a.toFixed(6)} \\\\ f(b) = f(${b}) = ${f_b.toFixed(6)}`,
  });

  // Step 3: Sum the intermediate points
  let sum = 0;
  let sumString = '';
  for (let i = 1; i < n; i++) {
    const x_i = a + i * h;
    const f_i = f(x_i);
    sum += f_i;
    sumString += `f(${x_i.toFixed(2)}) = ${f_i.toFixed(6)}\n`;
  }
  
  if (n > 1) {
    steps.push({
      title: 'Paso 3: Evaluar y sumar puntos intermedios',
      content: sumString + `Sumatoria = ${sum.toFixed(6)}`,
      latex: `\\sum_{i=1}^{${n-1}} f(x_i) = ${sum.toFixed(6)}`,
    });
  }

  // Step 4: Combine to get the result
  const total = (h / 2) * (f_a + f_b + 2 * sum);
  
  steps.push({
    title: 'Paso 4: Aplicar la fórmula del trapecio',
    content: `I ≈ (h / 2) * [f(a) + f(b) + 2 * Σ f(x_i)]\nI ≈ (${h.toFixed(6)} / 2) * [${f_a.toFixed(6)} + ${f_b.toFixed(6)} + 2 * ${sum.toFixed(6)}]\nI ≈ ${total.toFixed(6)}`,
    latex: `I \\approx \\frac{h}{2} \\left[ f(a) + f(b) + 2 \\sum_{i=1}^{n-1} f(x_i) \\right] \\approx ${total.toFixed(6)}`,
  });

  return {
    value: total,
    steps,
    method: 'trapecio',
    expression,
    bounds: { a, b },
    iterations: n,
  };
};
