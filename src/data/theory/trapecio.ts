import { MethodTheory } from './types';

export const trapecioTheory: MethodTheory = {
  id: 'trapecio',
  name: 'Método del Trapecio',
  levels: [
    {
      title: 'NIVEL 1 — FUNDAMENTO MATEMÁTICO',
      subTitle: '¿Qué problema resuelve el método del trapecio?',
      items: [
        { type: 'text', content: 'El cálculo integral busca resolver el área bajo la curva f(x):' },
        { type: 'latex', content: '\\int_a^b f(x) \\, dx' },
        { type: 'tip', content: 'Muchas funciones no tienen primitiva sencilla o son datos experimentales.', icon: 'lightbulb-outline' },
        { type: 'point', content: 'Aproximamos f(x) por una función lineal (recta) en cada subintervalo.', icon: 'chart-line' }
      ]
    },
    {
      title: 'NIVEL 2 — DERIVACIÓN DE LA FÓRMULA',
      items: [
        { type: 'text', content: 'Dividimos [a, b] en n partes de ancho h:' },
        { type: 'latex', content: 'h = \\frac{b - a}{n}' },
        { type: 'text', content: 'La suma total simplificada es:' },
        { type: 'latex', content: 'I \\approx \\frac{h}{2} [f(x_0) + f(x_n) + 2\\sum_{i=1}^{n-1} f(x_i)]' }
      ]
    },
    {
      title: 'NIVEL 7 — ERRORES CONCEPTUALES',
      items: [
        { type: 'warning', content: 'Creer que siempre es preciso sin considerar n.', icon: 'alert-octagon' },
        { type: 'warning', content: 'No validar si la función es continua en [a, b].', icon: 'alert-octagon' }
      ]
    }
  ]
};
