import { evaluate } from 'mathjs';
import { CalculationResult, CalculationStep } from '../../types';

export const calculateSimpson = (
  expression: string,
  a: number,
  b: number,
  n: number
): CalculationResult => {
  // Simpson's 1/3 rule requires an even number of intervals (n)
  if (n % 2 !== 0) n += 1;
  const h = (b - a) / n;
  const steps: CalculationStep[] = [];
  
  steps.push({
    title: 'Paso 1: Calcular h (tamaño del paso)',
    content: `h = (b - a) / n = (${b} - ${a}) / ${n} = ${h.toFixed(6)}\n*n debe ser par, se usará n = ${n}.`,
    latex: `h = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`,
  });

  const f = (x: number) => evaluate(expression, { x });
  const f_a = f(a);
  const f_b = f(b);
  
  steps.push({
    title: 'Paso 2: Evaluar extremos del intervalo',
    content: `f(a) = f(${a}) = ${f_a.toFixed(6)}\nf(b) = f(${b}) = ${f_b.toFixed(6)}`,
    latex: `f(a) = f(${a}) = ${f_a.toFixed(6)} \\\\ f(b) = f(${b}) = ${f_b.toFixed(6)}`,
  });

  let sumExcl = 0; // f(x_even)
  let sumIncl = 0; // f(x_odd)
  let evenSteps = '';
  let oddSteps = '';

  for (let i = 1; i < n; i++) {
    const x_i = a + i * h;
    const f_i = f(x_i);
    if (i % 2 === 0) {
      sumExcl += f_i;
      evenSteps += `f(${x_i.toFixed(2)}) = ${f_i.toFixed(6)}\n`;
    } else {
      sumIncl += f_i;
      oddSteps += `f(${x_i.toFixed(2)}) = ${f_i.toFixed(6)}\n`;
    }
  }

  steps.push({
    title: 'Paso 3: Sumar puntos impares (peso 4)',
    content: oddSteps + `Σf(x_impares) = ${sumIncl.toFixed(6)}`,
    latex: `\\sum_{i=1,3,5...}^{n-1} f(x_i) = ${sumIncl.toFixed(6)}`,
  });

  if (n > 2) {
    steps.push({
      title: 'Paso 4: Sumar puntos pares (peso 2)',
      content: evenSteps + `Σf(x_pares) = ${sumExcl.toFixed(6)}`,
      latex: `\\sum_{i=2,4,6...}^{n-2} f(x_i) = ${sumExcl.toFixed(6)}`,
    });
  }

  const total = (h / 3) * (f_a + f_b + 4 * sumIncl + 2 * sumExcl);
  
  steps.push({
    title: 'Paso 5: Aplicar la fórmula de Simpson 1/3',
    content: `I ≈ (h / 3) * [f(a) + f(b) + 4 * Σf(impares) + 2 * Σf(pares)]\nI ≈ (${h.toFixed(6)} / 3) * [${f_a.toFixed(6)} + ${f_b.toFixed(6)} + 4 * ${sumIncl.toFixed(6)} + 2 * ${sumExcl.toFixed(6)}]\nI ≈ ${total.toFixed(6)}`,
    latex: `I \\approx \\frac{h}{3} \\left[ f(a) + f(b) + 4 \\sum_{i\\in\\text{odd}} f(x_i) + 2 \\sum_{i\\in\\text{even}} f(x_i) \\right] \\approx ${total.toFixed(6)}`,
  });

  return {
    value: total,
    steps,
    method: 'simpson',
    expression,
    bounds: { a, b },
    iterations: n,
  };
};
