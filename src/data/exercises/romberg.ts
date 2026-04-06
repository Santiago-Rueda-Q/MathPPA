import { Exercise } from './types';

export const rombergExercises: Exercise[] = [
  { 
    id: 'r1', level: 1, difficulty: 'fácil', title: 'Refinamiento x', expression: 'x', a: 1, b: 3, n: 2, 
    description: 'Extrapolation con linealidad. Integra x de 1 a 3.', solution: 4 
  },
  { 
    id: 'r2', level: 2, difficulty: 'fácil', title: 'Curvatura moderada', expression: 'x^2', a: 0, b: 2, n: 2, 
    description: 'Aplica Romberg a x² de 0 a 2.', solution: 2.6667
  },
  { 
    id: 'r3', level: 3, difficulty: 'fácil', title: 'Polinomios grado 3', expression: 'x^3', a: 0, b: 2, n: 2, 
    description: 'Nivel 1 de Romberg (T2) será Simpson. Integra x³.', solution: 4
  },
  { 
    id: 'r4', level: 4, difficulty: 'medio', title: 'Exponenciales e^x', expression: 'exp(x)', a: 0, b: 1, n: 2, 
    description: 'Mira cómo Romberg elimina el error de e^x en pocos niveles.', solution: 1.7183
  },
  { 
    id: 'r5', level: 5, difficulty: 'medio', title: 'Trigonometría suave', expression: 'cos(x)', a: 0, b: Math.PI/2, n: 2, 
    description: 'Integra f(x) = cos(x) de 0 a π/2.', solution: 1
  },
  { 
    id: 'r6', level: 6, difficulty: 'medio', title: 'Poder de Romberg', expression: '1/x', a: 1, b: 4, n: 4, 
    description: 'Refinamiento recursivo para ln(4). ∫ 1/x dx de 1 a 4.', solution: 1.386
  },
  { 
    id: 'r7', level: 7, difficulty: 'difícil', title: 'Raíces continuas', expression: 'sqrt(x)', a: 0, b: 9, n: 4, 
    description: 'Aproxima ∫ √x de 0 a 9.', solution: 18
  },
  { 
    id: 'r8', level: 8, difficulty: 'difícil', title: 'Funciones sigmoidales', expression: '1 / (1 + exp(-x))', a: -2, b: 2, n: 4, 
    description: 'Cálculo de área bajo la función logística f(x) = 1/(1+e⁻x).', solution: 2
  },
  { 
    id: 'r9', level: 9, difficulty: 'difícil', title: 'Logaritmos complejos', expression: 'x * log(x)', a: 1, b: 4, n: 8, 
    description: 'Integra x * ln(x) de 1 a 4.', solution: 6.704
  },
  { 
    id: 'r10', level: 10, difficulty: 'difícil', title: 'El Desafío Maestro', expression: 'exp(-x^2)', a: 0, b: 1, n: 4, 
    description: 'Refina el valor de la distribución normal de 0 a 1.', solution: 0.7468
  }
];
