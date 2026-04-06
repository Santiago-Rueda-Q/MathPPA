import { MethodTheory } from './types';

export const rombergTheory: MethodTheory = {
  id: 'romberg',
  name: 'Método de Romberg',
  levels: [
    {
      title: 'NIVEL 1 — IDEA FUNDAMENTAL',
      subTitle: '¿Qué es el método de Romberg?',
      items: [
        { type: 'text', content: 'Es un método recursivo que mejora progresivamente el resultado del trapecio eliminando errores mediante extrapolación.' },
        { type: 'point', content: 'No cambia la fórmula base, refina el resultado matemáticamente.', icon: 'auto-fix' },
        { type: 'tip', content: 'Objetivo: Alta precisión con muy pocos cálculos.', icon: 'target' }
      ]
    },
    {
      title: 'NIVEL 2 — BASE MATEMÁTICA',
      items: [
        { type: 'text', content: 'Romberg parte de la expansión del error de Euler-Maclaurin:' },
        { type: 'latex', content: 'T(h) = I + C h^2 + O(h^4)' },
        { type: 'point', content: 'T(h): Aproximación con trapecio | I: Valor real | Ch²: Error principal', icon: 'math-norm' }
      ]
    },
    {
      title: 'NIVEL 3 — EXTRAPOLACIÓN DE RICHARDSON',
      subTitle: 'Clave del método',
      items: [
        { type: 'text', content: 'Si calculamos T(h) y T(h/2), podemos eliminar el término de error cuadrático.' },
        { type: 'point', content: 'Esto genera una aproximación de orden superior.', icon: 'numeric-1-box-multiple-outline' },
        { type: 'latex', content: 'R_{k,j} = R_{k,j-1} + \\frac{R_{k,j-1} - R_{k-1,j-1}}{4^{j-1}-1}' }
      ]
    },
    {
      title: 'NIVEL 4 — LA TABLA DE ROMBERG',
      items: [
        { type: 'text', content: 'Se construye una matriz triangular de valores R[i,j]:' },
        { type: 'point', content: 'Columna 1: Estimaciones por Trapecio con n duplicado.', icon: 'table-column' },
        { type: 'point', content: 'Siguientes columnas: Refinamientos sucesivos.', icon: 'table-row-plus-after' },
        { type: 'point', content: 'Cada nivel k mejora el anterior dividiendo h a la mitad.', icon: 'trending-down' }
      ]
    },
    {
      title: 'NIVEL 5 — PASO A PASO TEÓRICO',
      items: [
        { type: 'point', content: '1. Calcular trapecio con pocos puntos.', icon: 'numeric-1-circle-outline' },
        { type: 'point', content: '2. Refinar dividiendo h entre 2.', icon: 'numeric-2-circle-outline' },
        { type: 'point', content: '3. Construir la tabla triangular.', icon: 'numeric-3-circle-outline' },
        { type: 'point', content: '4. Aplicar la extrapolación recursivamente.', icon: 'numeric-4-circle-outline' }
      ]
    },
    {
      title: 'NIVEL 6 — EJEMPLO COMPLETO',
      items: [
        { type: 'text', content: 'Integrando x² de 0 a 1:' },
        { type: 'point', content: 'Paso 1: Trapecio básico R(0,0) = 0.5', icon: 'pencil-outline' },
        { type: 'point', content: 'Paso 2: Refinamiento h/2 -> R(1,0) = 0.375', icon: 'pencil-outline' },
        { type: 'latex', content: 'R_{1,1} = 0.375 + \\frac{0.375 - 0.5}{3} = 0.3333' },
        { type: 'tip', content: '¡Resultado exacto (1/3)! Romberg convergió en solo 2 pasos.', icon: 'check-decagram' }
      ]
    },
    {
      title: 'NIVEL 7 — INTERPRETACIÓN PROFUNDA',
      items: [
        { type: 'point', content: 'Detecta el error dominante y lo cancela algebraicamente.', icon: 'radar' },
        { type: 'point', content: 'Relación con Taylor: Elimina términos de error h², h⁴, h⁶...', icon: 'sigma' }
      ]
    },
    {
      title: 'NIVEL 8 — CONVERGENCIA',
      items: [
        { type: 'point', content: 'Tiene una convergencia cuasi-exponencial.', icon: 'chart-timeline-variant-shimmer' },
        { type: 'text', content: 'Es el método con mayor orden de convergencia para funciones suaves.' }
      ]
    },
    {
      title: 'NIVEL 9 — DUDAS IMPORTANTES',
      items: [
        { type: 'text', content: '¿Por qué funciona?' },
        { type: 'point', content: 'Porque aprovecha la estructura predecible del error del método del trapecio.', icon: 'help-circle-outline' },
        { type: 'warning', content: 'Falla con funciones no suaves, discontinuidades o datos con ruido experimental.', icon: 'close-octagon-outline' }
      ]
    },
    {
      title: 'NIVEL 10 — ERRORES COMUNES',
      items: [
        { type: 'warning', content: 'No construir correctamente los índices de la tabla.', icon: 'alert-octagon' },
        { type: 'warning', content: 'No entender que la extrapolación requiere duplicar puntos en cada nivel.', icon: 'alert-octagon' },
        { type: 'warning', content: 'Aplicarlo a funciones con singularidades en el intervalo.', icon: 'alert-octagon' }
      ]
    }
  ]
};
