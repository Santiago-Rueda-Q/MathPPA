import { MethodTheory } from './types';

export const rombergTheory: MethodTheory = {
  id: 'romberg',
  name: 'Método de Romberg',
  levels: [
    {
      title: 'NIVEL 1 — EXTRAPOLACIÓN',
      items: [
        { type: 'text', content: 'Es un método de refinamiento recursivo avanzado.' },
        { type: 'point', content: 'Lleva la precisión del Trapecio a niveles superiores usando Extrapolación de Richardson.', icon: 'trending-up' }
      ]
    },
    {
      title: 'NIVEL 2 — FÓRMULA RECURSIVA',
      items: [
        { type: 'text', content: 'Utiliza una tabla triangular de resultados R(i, j):' },
        { type: 'latex', content: 'R_{i,j} = R_{i,j-1} + \\frac{R_{i,j-1} - R_{i-1,j-1}}{4^j - 1}' },
        { type: 'point', content: 'Cada nivel j de extrapolación elimina términos de error de mayor orden.', icon: 'numeric-increment' }
      ]
    },
    {
      title: 'NIVEL 5 — ANÁLISIS AVANZADO',
      items: [
        { type: 'text', content: 'Es el método más eficiente para funciones suaves y continuas.' },
        { type: 'tip', content: 'Elimina sistemáticamente el error de orden inferior al combinar estimaciones del trapecio.', icon: 'check-decagram' }
      ]
    }
  ]
};
