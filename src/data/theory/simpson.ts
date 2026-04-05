import { MethodTheory } from './types';

export const simpsonTheory: MethodTheory = {
  id: 'simpson',
  name: 'Regla de Simpson 1/3',
  levels: [
    {
      title: '🧠 NIVEL 1 — IDEA FUNDAMENTAL',
      subTitle: '🔍 ¿Qué mejora Simpson?',
      items: [
        { type: 'text', content: 'Mientras el método del trapecio usa rectas (interpolación lineal), Simpson usa:' },
        { type: 'point', content: 'Parábolas (interpolación cuadrática)', icon: 'chart-bell-curve' },
        { type: 'tip', content: 'Esto permite un mejor ajuste a la curva y un error mucho menor.', icon: 'lightbulb-on-outline' },
        { type: 'text', content: 'Resuelve el problema de integrar funciones difíciles analíticamente con alta precisión.' }
      ]
    },
    {
      title: '📘 NIVEL 2 — BASE MATEMÁTICA',
      items: [
        { type: 'text', content: 'Aproximamos la función como un polinomio de grado 2 entre tres puntos consecutivos:' },
        { type: 'latex', content: 'f(x) \\approx ax^2 + bx + c' },
        { type: 'point', content: 'Usamos arcos parabólicos en lugar de segmentos de recta.', icon: 'axis-arrow' }
      ]
    },
    {
      title: '📐 NIVEL 3 — FÓRMULA DE SIMPSON 1/3',
      items: [
        { type: 'latex', content: 'I \\approx \\frac{h}{3} [f(x_0) + f(x_n) + 4\\sum_{i\\text{ impar}} f(x_i) + 2\\sum_{i\\text{ par}} f(x_i)]' },
        { type: 'point', content: 'n debe ser par.', icon: 'numeric-2-box-multiple-outline' },
        { type: 'text', content: 'Pesos optimizados:' },
        { type: 'point', content: 'Extremos: peso 1 | Impares: peso 4 | Pares: peso 2', icon: 'weight-kilogram' }
      ]
    },
    {
      title: '⚙️ NIVEL 4 — DERIVACIÓN CONCEPTUAL',
      items: [
        { type: 'text', content: 'Simpson proviene de integrar el polinomio interpolante de Lagrange de tres puntos.' },
        { type: 'point', content: 'El error es de orden O(h⁴), mucho mejor que el Trapecio O(h²).', icon: 'math-compass' },
        { type: 'latex', content: 'E = -\\frac{(b - a)^5}{180n^4} f^{(4)}(\\xi)' }
      ]
    },
    {
      title: '🧪 NIVEL 5 — EJEMPLOS RESUELTOS',
      items: [
        { type: 'text', content: 'Ejemplo: ∫ x² dx de 0 a 2 con n=2' },
        { type: 'point', content: 'h = 1 | x0=0, x1=1, x2=2', icon: 'numeric-1-circle-outline' },
        { type: 'latex', content: 'I \\approx \\frac{1}{3} [f(0) + f(2) + 4f(1)] = \\frac{1}{3} [0 + 4 + 4(1)] = 2.6667' },
        { type: 'tip', content: '¡Exacto! 8/3. Simpson es exacto para polinomios de hasta grado 3.', icon: 'check-decagram' },
        { type: 'text', content: 'Ejemplo 2: ∫ e^x dx de 0 a 1 con n=2' },
        { type: 'latex', content: 'I \\approx \\frac{0.5}{3} [1 + 2.7183 + 4(1.6487)] = 1.7188' },
        { type: 'point', content: 'Valor real: 1.7183. Error mínimo.', icon: 'trending-up' }
      ]
    },
    {
      title: '🧠 NIVEL 6 — INTERPRETACIÓN PROFUNDA',
      items: [
        { type: 'point', content: 'Captura la curvatura (segunda derivada) de la función.', icon: 'sine-wave' },
        { type: 'text', content: 'Simpson incluye términos hasta grado 3 en la expansión de Taylor.' }
      ]
    },
    {
      title: '⚖️ NIVEL 7 — COMPARACIÓN DIRECTA',
      items: [
        { type: 'point', content: 'Trapecio (Lineal): O(h²)', icon: 'align-vertical-bottom' },
        { type: 'point', content: 'Simpson (Cuadrática): O(h⁴)', icon: 'align-vertical-top' },
        { type: 'text', content: 'Simpson converge mucho más rápido.' }
      ]
    },
    {
      title: '❓ NIVEL 8 — DUDAS CLAVE',
      items: [
        { type: 'text', content: '¿Por qué n debe ser par?' },
        { type: 'point', content: 'Porque trabaja con pares de intervalos (3 puntos necesarios para una parábola).', icon: 'help-circle-outline' },
        { type: 'text', content: '¿Cuándo falla?' },
        { type: 'warning', content: 'Funciones con mucho ruido o discontinuidades.', icon: 'close-octagon-outline' }
      ]
    },
    {
      title: '⚠️ NIVEL 9 — ERRORES COMUNES',
      items: [
        { type: 'warning', content: 'Usar n impar.', icon: 'alert-octagon' },
        { type: 'warning', content: 'Confundir los pesos (4 y 2).', icon: 'alert-octagon' },
        { type: 'warning', content: 'No entender que es una aproximación numérica.', icon: 'alert-octagon' }
      ]
    }
  ]
};
