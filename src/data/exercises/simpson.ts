import { Exercise } from './types';

export const simpsonExercises: Exercise[] = [
  { 
    id: 's1', level: 1, difficulty: 'fácil', title: 'Parábolas exactas', expression: 'x^2', a: 0, b: 2, n: 2, 
    description: 'La regla de Simpson es exacta para polinomios de grado 2. Compruébalo con f(x) = x².', solution: 2.6667
  },
  { 
    id: 's2', level: 2, difficulty: 'fácil', title: 'Lineales y Simpson', expression: '2x + 1', a: 0, b: 3, n: 2, 
    description: 'Integra f(x) = 2x + 1 de 0 a 3.', solution: 12 
  },
  { 
    id: 's3', level: 3, difficulty: 'fácil', title: 'Polinomios de grado 3', expression: 'x^3', a: -1, b: 1, n: 2, 
    description: 'Simpson también es exacto para grado 3. Calcula ∫ x³ dx de -1 a 1.', solution: 0
  },
  { 
    id: 's4', level: 4, difficulty: 'medio', title: 'Seno y precisión n=4', expression: 'sin(x)', a: 0, b: Math.PI, n: 4, 
    description: 'Mejor que trapecio. Integra seno de 0 a π con n=4.', solution: 2.0045
  },
  { 
    id: 's5', level: 5, difficulty: 'medio', title: 'Exponencial n=2', expression: 'exp(x)', a: 0, b: 1, n: 2, 
    description: 'Mira cuánta precisión logras con solo 2 intervalos en e^x.', solution: 1.7188
  },
  { 
    id: 's6', level: 6, difficulty: 'medio', title: 'Funciones combinadas', expression: 'x + sin(x)', a: 0, b: Math.PI, n: 6, 
    description: 'Suma de lineal y trigonométrica.', solution: 6.934
  },
  { 
    id: 's7', level: 7, difficulty: 'difícil', title: 'Raíz cuadrada', expression: 'sqrt(x)', a: 0, b: 4, n: 10, 
    description: 'Aproxima la integral de la raíz de 0 a 4.', solution: 5.333
  },
  { 
    id: 's8', level: 8, difficulty: 'difícil', title: 'Exponencial negativa', expression: 'exp(-x)', a: 0, b: 5, n: 12, 
    description: 'Decaimiento exponencial de 0 a 5.', solution: 0.993
  },
  { 
    id: 's9', level: 9, difficulty: 'difícil', title: 'Fracciones y Raíces', expression: '1 / (1 + x^2)', a: 0, b: 1, n: 20, 
    description: 'Aproxima la integral de arcotangente f(x) = 1/(1+x²).', solution: 0.7854
  },
  { 
    id: 's10', level: 10, difficulty: 'difícil', title: 'El Gran Desafío', expression: 'sin(x^2)', a: 0, b: Math.PI, n: 30, 
    description: 'Oscilación parabólica compleja: ∫ sin(x²) dx.', solution: 0.772
  }
];
