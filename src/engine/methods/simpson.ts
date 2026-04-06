import { evaluate } from 'mathjs';
import { CalculationResult, CalculationStep } from '../../types';

export const calculateSimpson = (
  expression: string,
  a: number,
  b: number,
  n: number
): CalculationResult => {
  if (n % 2 !== 0) n += 1; // Simpson requires even n

  const steps: CalculationStep[] = [];
  const f = (x: number) => evaluate(expression, { x });

  const h = (b - a) / n;
  
  // Paso 1
  steps.push({
    title: 'Paso 1: Calcular h (tamaño del paso)',
    content: `h = (b-a)/n = (${b}-${a})/${n} = ${h.toFixed(6)}`,
    latex: `h = \\frac{b - a}{n} = \\textcolor{#10B981}{\\frac{${b} - ${a}}{${n}}} = ${h.toFixed(6)}`,
  });

  // Paso 2
  const fa = f(a);
  const fb = f(b);
  steps.push({
    title: 'Paso 2: Evaluación en los extremos del intervalo',
    content: `x_0 = ${a} => f(x_0) = ${fa.toFixed(6)}\nx_n = ${b} => f(x_n) = ${fb.toFixed(6)}`,
    latex: `x_0 = ${a} \\Rightarrow f(x_0) = ${fa.toFixed(6)} \\\\ x_n = ${b} \\Rightarrow f(x_n) = ${fb.toFixed(6)}`,
  });

  let sumOdd = 0;
  let sumEven = 0;

  // Paso 3: Evaluaciones individuales si n <= 8
  for (let i = 1; i < n; i++) {
    const xi = a + i * h;
    const fi = f(xi);
    const isOdd = i % 2 !== 0;
    
    if (isOdd) sumOdd += fi;
    else sumEven += fi;

    if (n <= 30) {
      steps.push({
        title: `Paso 3.${i}: Punto intermedio x_${i} (${isOdd ? 'Impar' : 'Par'})`,
        content: `x_${i} = a + ${i}h = ${xi.toFixed(4)} => f(x_i) = ${fi.toFixed(6)}`,
        latex: `x_{${i}} = a + ${i}h = \\textcolor{#10B981}{${a} + ${i}(${h.toFixed(4)})} = ${xi.toFixed(4)} \\Rightarrow f(x_{${i}}) = ${fi.toFixed(6)}`
      });
    }
  }

  // Paso 3.Total: Grupos
  steps.push({
    title: 'Paso 3.Final: Sumatoria de puntos impares y pares',
    content: `Σf_impar = ${sumOdd.toFixed(6)}, Σf_par = ${sumEven.toFixed(6)}`,
    latex: `\\sum \\text{imp} = ${sumOdd.toFixed(6)}, \\quad \\sum \\text{par} = ${sumEven.toFixed(6)}`,
  });

  const value = (h / 3) * (fa + fb + 4 * sumOdd + 2 * sumEven);

  steps.push({
    title: 'Paso 4: Aplicar la Regla de Simpson 1/3 Compuesta',
    content: `I = (h/3) * [f(x_0) + f(x_n) + 4Σf_imp + 2Σf_par]`,
    latex: `I \\approx \\frac{h}{3} [f(x_0) + f(x_n) + 4\\sum f_{imp} + 2\\sum f_{par}] = \\textcolor{#10B981}{\\frac{${h.toFixed(4)}}{3} [${fa.toFixed(4)} + ${fb.toFixed(4)} + 4(${sumOdd.toFixed(4)}) + 2(${sumEven.toFixed(4)})]} = ${value.toFixed(6)}`,
  });

  return {
    value,
    steps,
    method: 'simpson',
    expression,
    bounds: { a, b },
    iterations: n,
  };
};
