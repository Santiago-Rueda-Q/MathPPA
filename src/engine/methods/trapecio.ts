import { evaluate } from 'mathjs';
import { CalculationResult, CalculationStep } from '../../types';

export const calculateTrapecio = (
  expression: string,
  a: number,
  b: number,
  n: number
): CalculationResult => {
  const steps: CalculationStep[] = [];
  const f = (x: number) => evaluate(expression, { x });

  const h = (b - a) / n;
  
  // Paso 1
  steps.push({
    title: 'Paso 1: Calcular h (tamaño del paso)',
    content: `h = (b - a) / n = (${b} - ${a}) / ${n} = ${h.toFixed(6)}`,
    latex: `h = \\frac{b - a}{n} = \\textcolor{#10B981}{\\frac{${b} - ${a}}{${n}}} = ${h.toFixed(6)}`,
  });

  // Paso 2
  const fa = f(a);
  const fb = f(b);
  steps.push({
    title: 'Paso 2: Evaluar extremos del intervalo',
    content: `x_0 = ${a} => f(x_0) = ${fa.toFixed(6)}\nx_n = ${b} => f(x_n) = ${fb.toFixed(6)}`,
    latex: `x_0 = ${a} \\Rightarrow f(x_0) = ${fa.toFixed(6)} \\\\ x_n = ${b} \\Rightarrow f(x_n) = ${fb.toFixed(6)}`,
  });

  // Paso 3: Puntos intermedios detallados
  let sum = 0;
  let intermediateLatex = '';
  
  if (n > 1) {
    for (let i = 1; i < n; i++) {
        const xi = a + i * h;
        const fi = f(xi);
        sum += fi;

        // Solo añadimos pasos individuales si n es manejable para no saturar la UI
        if (n <= 30) {
           steps.push({
             title: `Paso 3.${i}: Punto intermedio x_${i}`,
             content: `x_${i} = a + ${i}h = ${xi.toFixed(4)} => f(x_${i}) = ${fi.toFixed(6)}`,
             latex: `x_{${i}} = a + ${i}h = \\textcolor{#10B981}{${a} + ${i}(${h.toFixed(4)})} = ${xi.toFixed(4)} \\Rightarrow f(x_{${i}}) = ${fi.toFixed(6)}`
           });
        }
        if (i < 4) intermediateLatex += `${fi.toFixed(4)} + `;
    }
  }

  if (n > 30) {
     steps.push({
       title: `Paso 3: Suma de los ${n-1} puntos intermedios`,
       content: `Σ f(xi) desde i=1 hasta ${n-1}`,
       latex: `\\sum_{i=1}^{n-1} f(x_i) = ${sum.toFixed(6)}`,
     });
  } else {
     steps.push({
       title: `Paso 3.Final: Suma total de puntos intermedios`,
       content: `Σ f(xi) = ${sum.toFixed(6)}`,
       latex: `\\sum_{i=1}^{n-1} f(x_i) = ${sum.toFixed(6)}`,
     });
  }

  // Paso 4
  const value = (h / 2) * (fa + fb + 2 * sum);

  steps.push({
    title: 'Paso 4: Aplicar la fórmula del Trapecio Compuesto',
    content: `I = (h/2) * [f(a) + f(b) + 2*Σf(xi)]`,
    latex: `I \\approx \\frac{h}{2} [f(x_0) + f(x_n) + 2\\sum_{i=1}^{n-1} f(x_i)] = \\textcolor{#10B981}{\\frac{${h.toFixed(4)}}{2} [${fa.toFixed(4)} + ${fb.toFixed(4)} + 2(${sum.toFixed(4)})]} = ${value.toFixed(6)}`,
  });

  return {
    value,
    steps,
    method: 'trapecio',
    expression,
    bounds: { a, b },
    iterations: n,
  };
};
