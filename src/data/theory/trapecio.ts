import { MethodTheory } from './types';

export const trapecioTheory: MethodTheory = {
  id: 'trapecio',
  name: 'Método del Trapecio',
  levels: [
    {
      title: 'NIVEL 1 — FUNDAMENTO MATEMÁTICO PROFUNDO',
      subTitle: '¿Qué problema resuelve el método del trapecio?',
      items: [
        { type: 'text', content: 'El cálculo integral busca resolver el área bajo la curva:' },
        { type: 'latex', content: '\\int_{a}^{b} f(x) \\, dx' },
        { type: 'point', content: 'Esto representa el área bajo la curva f(x) de a hasta b.', icon: 'chart-areaspline' },
        { type: 'text', content: 'Pero muchas funciones no tienen primitiva sencilla, son experimentales o difíciles de integrar analíticamente.' },
        { type: 'tip', content: 'Entonces usamos integración numérica.', icon: 'lightbulb-outline' },
        { type: 'text', content: 'Idea conceptual rigurosa: Aproximamos f(x) por una función lineal (recta) en cada subintervalo.' },
        { type: 'point', content: 'En vez de usar la curva real, usamos segmentos de recta.', icon: 'chart-line' },
        { type: 'point', content: 'Esto es una aproximación de primer orden (interpolación lineal).', icon: 'numeric-1-box-outline' }
      ]
    },
    {
      title: 'NIVEL 2 — DERIVACIÓN DE LA FÓRMULA',
      subTitle: 'Construcción paso a paso',
      items: [
        { type: 'text', content: 'Partimos de un intervalo [a, b] dividido en n partes iguales:' },
        { type: 'latex', content: 'h = \\frac{b - a}{n}' },
        { type: 'text', content: 'Los puntos son: x₀, x₁, x₂, ..., xₙ' },
        { type: 'point', content: 'Área de un trapecio: Para el subintervalo [xᵢ, xᵢ₊₁]', icon: 'shape-rectangle-plus' },
        { type: 'latex', content: 'A_i = \\frac{h}{2} [f(x_i) + f(x_{i+1})]' },
        { type: 'text', content: 'Simplificando la suma total de todos los trapecios:' },
        { type: 'latex', content: 'I \\approx \\frac{h}{2} [f(x_0) + f(x_n) + 2 \\sum_{i=1}^{n-1} f(x_i)]' },
        { type: 'tip', content: 'Interpretación: Los extremos aparecen una vez; los puntos internos aparecen dos veces porque pertenecen a dos trapecios.', icon: 'state-machine' }
      ]
    },
    {
      title: 'NIVEL 3 — INTERPRETACIÓN NUMÉRICA Y GEOMÉTRICA',
      items: [
        { type: 'point', content: 'Geométricamente: Cada trapecio tiene base inferior sobre el eje X y lados inclinados según la función.', icon: 'geometry' },
        { type: 'point', content: 'Numéricamente: Es una suma ponderada de valores de la función.', icon: 'sigma' },
        { type: 'text', content: 'Orden del error (E):' },
        { type: 'latex', content: 'E = -\\frac{(b-a)^3}{12n^2} f\'\'(\\xi)' },
        { type: 'tip', content: 'El error disminuye proporcionalmente a 1/n².', icon: 'trending-down' }
      ]
    },
    {
      title: 'NIVEL 4 — EJEMPLOS RESUELTOS (PROFUNDOS)',
      items: [
        { type: 'point', content: 'Ejemplo 1: Función polinómica x² de 0 a 2 con n=4. Resultado ≈ 2.75 (Real: 2.67).', icon: 'numeric-1-circle-outline' },
        { type: 'point', content: 'Ejemplo 2: Función lineal x de 1 a 3. Resultado exacto!', icon: 'numeric-2-circle-outline' },
        { type: 'tip', content: 'Dato clave: El método del trapecio es exacto para funciones lineales.', icon: 'check-decagram' },
        { type: 'text', content: 'Ejemplo 3: Función exponencial exp(x) de 0 à 1 con n=2.' },
        { type: 'latex', content: 'I \\approx \\frac{0.5}{2} [1 + 2.7183 + 2(1.6487)] = 1.7539' },
        { type: 'text', content: 'Ejemplo 4: Función trigonométrica sin(x) de 0 à π con n=4.' },
        { type: 'latex', content: 'I \\approx \\frac{\\pi/4}{2} [0 + 0 + 2(0.707+1+0.707)] \\approx 1.896' }
      ]
    },
    {
      title: 'NIVEL 5 — ANÁLISIS AVANZADO',
      items: [
        { type: 'point', content: 'Relación con series de Taylor: Truncamos la expansión de Taylor usando solo la pendiente promedio.', icon: 'lambda' },
        { type: 'point', content: 'Interpretación como interpolación: Aproximamos f(x) mediante una recta secante entre puntos.', icon: 'vector-line' },
        { type: 'text', content: 'Comparación: Trapecio O(h²) es menos preciso que Simpson O(h⁴) pero más robusto.' }
      ]
    },
    {
      title: 'NIVEL 6 — DUDAS IMPORTANTES',
      items: [
        { type: 'point', content: '¿Para qué sirve? Para funciones difíciles de integrar o datos tabulares.', icon: 'help-circle-outline' },
        { type: 'point', content: '¿Cuando falla? Con funciones muy curvas o discontinuidades.', icon: 'alert-circle-outline' },
        { type: 'point', content: '¿Qué pasa si n tiende a infinito? Se obtiene el valor real de la integral.', icon: 'infinity' }
      ]
    },
    {
      title: 'NIVEL 7 — ERRORES CONCEPTUALES COMUNES',
      items: [
        { type: 'warning', content: 'Confundir integración numérica con la integral indefinida analítica.', icon: 'alert-octagon' },
        { type: 'warning', content: 'Creer que siempre es preciso sin considerar la curvatura.', icon: 'alert-octagon' },
        { type: 'warning', content: 'No normalizar n en el trapecio (mientras que en Simpson es obligatorio par).', icon: 'alert-octagon' }
      ]
    }
  ]
};
