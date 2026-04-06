import { Exercise } from './types';

export const trapecioExercises: Exercise[] = [
  { 
    id: 't1', level: 1, difficulty: 'fácil', title: 'Lineas base', expression: 'x', a: 0, b: 2, n: 2, 
    description: 'Calcula el área de un triángulo sencillo. Integración de f(x) = x de 0 a 2 con 2 trapecios.', solution: 2
  },
  { 
    id: 't2', level: 2, difficulty: 'fácil', title: 'Parábolas simples', expression: 'x^2', a: 1, b: 3, n: 4, 
    description: 'Un poco más de curva. Integra f(x) = x² de 1 a 3 con n=4.', solution: 8.75 
  },
  { 
    id: 't3', level: 3, difficulty: 'fácil', title: 'Funciones constantes', expression: '5', a: 0, b: 10, n: 5, 
    description: 'Reta al método con una línea plana. ∫ 5 dx de 0 a 10.', solution: 50
  },
  { 
    id: 't4', level: 4, difficulty: 'medio', title: 'Exponenciales fundamentales', expression: 'exp(x)', a: 0, b: 1, n: 4, 
    description: 'La función exponencial requiere más precisión. Prueba n=4.', solution: 1.727
  },
  { 
    id: 't5', level: 5, difficulty: 'medio', title: 'Seno básico', expression: 'sin(x)', a: 0, b: Math.PI, n: 8, 
    description: 'Aproxima el área bajo un puente de seno completo.', solution: 1.974
  },
  { 
    id: 't6', level: 6, difficulty: 'medio', title: 'Logaritmos naturales', expression: 'log(x)', a: 1, b: 5, n: 10, 
    description: 'Integra f(x) = ln(x) de 1 a 5.', solution: 4.024
  },
  { 
    id: 't7', level: 7, difficulty: 'medio', title: 'Funciones racionales', expression: '1/x', a: 1, b: 2, n: 10, 
    description: '∫ 1/x de 1 a 2. Aproxima ln(2).', solution: 0.6937
  },
  { 
    id: 't8', level: 8, difficulty: 'difícil', title: 'Oscilaciones moderadas', expression: 'sin(2x)', a: 0, b: Math.PI/2, n: 16, 
    description: 'La frecuencia aumenta. El trapecio necesita más puntos.', solution: 1
  },
  { 
    id: 't9', level: 9, difficulty: 'difícil', title: 'Raíces y exponentes', expression: 'sqrt(x) * exp(x)', a: 0, b: 1, n: 20, 
    description: 'Combina potencias y crecimientos rápidos.', solution: 1.258
  },
  { 
    id: 't10', level: 10, difficulty: 'difícil', title: 'El Desafío Final', expression: 'exp(-x^2)', a: 0, b: 2, n: 30, 
    description: 'Aproxima la campana de Gauss. f(x) = e^(-x²).', solution: 0.882
  }
];
