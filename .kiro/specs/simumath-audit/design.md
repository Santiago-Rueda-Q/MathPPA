# Documento de Diseño — Auditoría y Mejoras SimuMath

## Introducción

Este documento describe las decisiones técnicas para resolver cada uno de los 17 requisitos identificados en la auditoría de SimuMath. Las soluciones se organizan por prioridad (críticas → importantes → menores) y especifican exactamente qué archivos modificar, qué patrones aplicar y qué invariantes deben mantenerse.

---

## 1. KaTeX local en WebView (Req. 1)

**Archivo afectado:** `src/components/latex/utils/katexTemplate.ts`

**Problema:** El HTML generado carga KaTeX desde `cdn.jsdelivr.net`. Sin internet, el WebView queda en blanco.

**Solución:** Usar `require` de Expo para leer los archivos locales de KaTeX que ya están instalados en `node_modules/katex/dist/`. Expo bundlea los assets estáticos referenciados con `require`. Se generará el HTML con el CSS y JS inlineados como strings.

```
katex/dist/katex.min.css  →  leer con Asset.fromModule + FileSystem.readAsStringAsync
katex/dist/katex.min.js   →  leer con Asset.fromModule + FileSystem.readAsStringAsync
```

El hook `useLatexRenderer` se convierte en async y usa `useEffect` para cargar los assets una sola vez. Mientras carga, el componente muestra el texto plano como fallback.

**Invariante:** El componente web (`LatexRenderer.web.tsx`) ya usa KaTeX directamente (sin WebView) y no necesita cambios.

---

## 2. Sanitizador de expresiones (Req. 2)

**Archivo afectado:** `src/hooks/utils/expressionSanitizer.ts`

**Problema actual:**
```ts
.replace(/e\^\{/g, 'exp(')   // correcto
.replace(/}/g, ')')           // DESTRUCTIVO: elimina todo }
```

**Solución:** Eliminar la regla global de `}` → `)`. Reemplazarla por transformaciones específicas y ordenadas:

1. `e^{...}` → `exp(...)` — patrón completo antes de tocar llaves
2. `^{...}` → `^(...)` — potencias con llaves
3. `\pi` → `pi`
4. `\cdot` → `*`
5. `\div` → `/`
6. `sen(` → `sin(`

Ninguna regla debe tocar `}` de forma aislada. El orden importa: las reglas más específicas van primero.

**Propiedad de corrección:** `sanitize(sanitize(expr)) === sanitize(expr)` para toda expresión del teclado.

---

## 3. Romberg con límite seguro de iteraciones (Req. 3)

**Archivo afectado:** `src/engine/methods/romberg.ts`

**Problema:** `maxIterations` puede ser 30+ → 2³⁰ evaluaciones → freeze.

**Solución:**
```ts
const MAX_ROMBERG_LEVELS = 10;
const levels = Math.min(Math.max(1, maxIterations), MAX_ROMBERG_LEVELS);
```

El parámetro `n` que llega desde la UI se interpreta como "niveles de refinamiento", no como subintervalos. En `useCalculator.ts` se añade validación previa: si `method === 'romberg' && numN > 10`, se muestra advertencia y se usa 10.

**Nota pedagógica:** Los pasos de resolución ya muestran la tabla de Romberg correctamente con niveles ≤ 10.

---

## 4. exerciseMath con soporte real de Romberg (Req. 4)

**Archivos afectados:**
- `src/screens/exercises/utils/exerciseMath.ts`
- `src/screens/exercises/components/ExerciseCard.tsx`
- `src/screens/exercises/hooks/useQuizSteps.ts`

**Problema:** `calculateAnswers` usa trapecio como fallback para Romberg.

**Solución en `exerciseMath.ts`:**

Para Romberg, los pasos del quiz son distintos:
- Paso 1: Primera aproximación trapezoidal `R[0,0]`
- Paso 2: Segunda aproximación `R[1,0]`
- Paso 3: Primera extrapolación de Richardson `R[1,1]`
- Paso 4: Resultado final `R[n-1][n-1]`

La interfaz `Answers` se extiende con campos opcionales para Romberg:
```ts
export interface Answers {
  h: number; fa: number; fb: number; sum: number; result: number;
  // Romberg específico
  r00?: number; r10?: number; r11?: number;
}
```

**Solución en `ExerciseCard.tsx`:** Recibe `methodId` como prop y renderiza condicionalmente los títulos y labels de los pasos según el método.

**Solución en `useQuizSteps.ts`:** La validación del paso 3 para Romberg compara contra `answers.r11` en lugar de `answers.sum`.

---

## 5. Opacidad de QuizStep activo (Req. 5)

**Archivos afectados:**
- `src/screens/exercises/TutorScreen.styles.ts`
- `src/screens/exercises/components/QuizStep.tsx`

**Problema:** `quizStep` tiene `opacity: 0.5` hardcodeado. Los pasos activos se ven semitransparentes.

**Solución:** Eliminar `opacity: 0.5` del estilo base `quizStep`. La opacidad reducida no es necesaria porque los pasos inactivos ya no se renderizan (retornan `null` cuando `!visible`). El estilo `quizStepDone` mantiene su apariencia diferenciada con color de borde verde.

---

## 6. useEffect con dependencias correctas (Req. 6)

**Archivo afectado:** `src/screens/calculator/hooks/useCalculatorScreen.ts`

**Problema:**
```ts
useEffect(() => { loadFromRoute(route?.params); }, [route?.params]);
// loadFromRoute no está en las dependencias
```

**Solución:** Mover `loadFromRoute` dentro del `useEffect` o envolverla en `useCallback` con sus dependencias declaradas. La opción más limpia es inline:

```ts
useEffect(() => {
  if (!routeParams?.exercise) return;
  const { exercise, method: mId } = routeParams;
  calculator.setExpression(exercise.expression);
  calculator.setA(exercise.a.toString());
  calculator.setB(exercise.b.toString());
  calculator.setN(exercise.n.toString());
  if (mId) calculator.setMethod(mId as Method);
  setShowKeyboard(false);
}, [routeParams]);
```

`loadFromRoute` se mantiene como función separada para uso manual (sin `useEffect`).

---

## 7. Tipado de navegación (Req. 7)

**Archivos afectados:**
- `src/types/index.ts`
- `src/screens/calculator/CalculatorScreen.tsx`
- `src/screens/exercises/TutorScreen.tsx`

**Solución:** Definir los tipos de parámetros de navegación en `src/types/index.ts`:

```ts
import { Exercise } from '../data/exercises/types';
import { Method } from './index';

export type RootTabParamList = {
  Calculadora: { exercise?: Exercise; method?: Method } | undefined;
  Teoría: undefined;
  Aprender: undefined;
};

export type RootStackParamList = {
  Main: undefined;
};
```

`CalculatorScreen` usa `RouteProp<RootTabParamList, 'Calculadora'>`.
`TutorScreen` usa `BottomTabNavigationProp<RootTabParamList, 'Aprender'>`.

---

## 8. Fuentes personalizadas (Req. 8)

**Archivos afectados:**
- `App.tsx`
- `assets/fonts/` (agregar archivos de fuente)

**Solución:** Usar `expo-font` con `useFonts` hook en `App.tsx`:

```ts
const [fontsLoaded] = useFonts({
  'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
  'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  'FiraCode-Regular': require('./assets/fonts/FiraCode-Regular.ttf'),
});

if (!fontsLoaded) return <SplashScreen />;
```

Los archivos `.ttf` de Inter y FiraCode se descargan de Google Fonts y se colocan en `assets/fonts/`. El plugin `expo-font` en `app.json` ya está configurado.

**Fallback:** Si `useFonts` retorna error, la app continúa con fuentes del sistema (el tema ya tiene `fontFamily: 'System'` como fallback implícito en React Native).

---

## 9. AreaGraph con área sombreada (Req. 9)

**Archivos afectados:**
- `src/components/graph/AreaGraph.tsx`
- `src/components/graph/hooks/useAreaGraph.ts`

**Solución:** Construir un path SVG de área que:
1. Empiece en `(mapX(a), yZero)`
2. Siga la curva de la función de `a` a `b`
3. Cierre en `(mapX(b), yZero)`

```ts
// En useAreaGraph, filtrar solo los puntos dentro de [a, b]
const areaPoints = points.filter(p => p.x >= a && p.x <= b);

// En AreaGraph.tsx
const areaPath = areaPoints.length > 1
  ? `M ${mapX(a)} ${yZero} ` +
    areaPoints.map(p => `L ${mapX(p.x)} ${mapY(p.y)}`).join(' ') +
    ` L ${mapX(b)} ${yZero} Z`
  : '';
```

El `Path` de área usa `fill={theme.colors.primary}` con `opacity={0.15}` y se renderiza antes de la curva (para que quede debajo).

**Valores negativos:** Si `minY < 0`, se usan dos paths: uno para la parte positiva (verde) y otro para la negativa (rojo/error), cada uno cerrado sobre `yZero`.

**Error handling:** Si `points.length === 0` (expresión inválida), se renderiza un `SvgText` con mensaje de error centrado en el gráfico.

---

## 10. CursorManager — tokens consistentes (Req. 10)

**Archivos afectados:**
- `src/hooks/utils/cursorManager.ts`
- `src/components/calculator/config/keyboard.config.ts`

**Problema:** `pow(` inserta `^()` con offset 2, pero `^` también inserta `^{}` con offset 2. Son inconsistentes y `^{}` no es sintaxis válida de mathjs.

**Solución:**
1. Eliminar `pow(` del array `MATH_KEYS` en `keyboard.config.ts`
2. Cambiar la entrada de `^` en `INSERTION_MAP`:
   ```ts
   '^': { text: '^()', offset: 2 }  // cursor dentro de ()
   ```
3. Eliminar las entradas de `pow(` del `INSERTION_MAP`

Esto unifica el comportamiento: `^` siempre inserta `^()` con el cursor posicionado entre los paréntesis, listo para escribir el exponente.

**Invariante de cursor:** `applyInsertion` y `applyDelete` ya garantizan que `cursorPosition ∈ [0, expression.length]`. Se añade un `Math.max(0, Math.min(...))` explícito como defensa.

---

## 11. Notación ln consistente (Req. 11)

**Archivos afectados:**
- `src/data/exercises/trapecio.ts` (niveles 6, 9)
- `src/data/exercises/romberg.ts` (niveles 6, 9)
- `src/screens/exercises/components/ExerciseCard.tsx`

**Solución:**
- Las expresiones internas de mathjs se mantienen como `log(x)` (mathjs lo evalúa como ln).
- En `getLatexExpression` dentro de `ExerciseCard.tsx`, añadir la transformación:
  ```ts
  tex = tex.replace(/\\log\b/g, '\\ln');
  ```
- Los textos de descripción de ejercicios que digan "ln(x)" ya son correctos; los que digan "log(x)" se actualizan.
- El botón `ln(` del teclado ya existe en `MATH_KEYS`. No hay cambios en el teclado.

---

## 12. Validación con margen relativo (Req. 12)

**Archivo afectado:** `src/screens/exercises/hooks/useQuizSteps.ts`

**Problema:** `MARGIN = 0.01` es absoluto. Para resultado = 50, requiere exactitud de ±0.01 (muy estricto). Para resultado = 0.0001, acepta errores del 100x (muy permisivo).

**Solución:**
```ts
const isClose = (input: string, expected: number): boolean => {
  const val = parseFloat(input);
  if (isNaN(val)) return false;
  const diff = Math.abs(val - expected);
  const scale = Math.max(Math.abs(expected), 1);
  return diff / scale < 0.01;
};
```

Reemplaza la función `close` inline en `validateStep`.

---

## 13. Safe Area Insets dinámicos (Req. 13)

**Archivos afectados:**
- `src/screens/calculator/CalculatorScreen.styles.ts`
- `src/screens/calculator/CalculatorScreen.tsx`
- `src/screens/learn/TheoryScreen.styles.ts`
- `src/screens/learn/TheoryScreen.tsx`
- `src/screens/exercises/TutorScreen.styles.ts`
- `src/screens/exercises/TutorScreen.tsx`

**Solución:** Usar `useSafeAreaInsets` de `react-native-safe-area-context` (ya instalado) en cada pantalla:

```ts
const insets = useSafeAreaInsets();
// paddingTop: insets.top + 16
// paddingBottom: insets.bottom + TAB_BAR_HEIGHT
```

La constante `TAB_BAR_HEIGHT` se define en el tema o en una constante compartida:
```ts
// src/theme/index.ts
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 75;
```

Los estilos que usan valores hardcodeados se convierten en estilos dinámicos calculados en el componente con `useMemo`.

---

## 14. Accesibilidad (Req. 14)

**Archivos afectados:**
- `src/components/latex/LatexRenderer.tsx`
- `src/components/latex/LatexRenderer.types.ts`
- `src/components/shared/BrandHeader.tsx`
- `src/components/graph/AreaGraph.tsx`

**Solución:**

`LatexRenderer.types.ts` — añadir prop opcional:
```ts
export interface LatexRendererProps {
  latex: string;
  fontSize?: number;
  color?: string;
  center?: boolean;
  accessibilityLabel?: string;  // nuevo
}
```

`LatexRenderer.tsx` — aplicar al contenedor:
```tsx
<View
  accessible={true}
  accessibilityRole="text"
  accessibilityLabel={accessibilityLabel ?? `Fórmula: ${latex}`}
  style={[styles.container, { minHeight: fontSize * 2, height }]}
>
```

`BrandHeader.tsx`:
```tsx
<Image accessibilityLabel="Logo de SimuMath" ... />
```

`AreaGraph.tsx`:
```tsx
<View
  accessible={true}
  accessibilityLabel={`Gráfica de f(x) = ${props.expression} en [${props.a}, ${props.b}]`}
  style={styles.container}
>
```

---

## 15. ExerciseMap dinámico (Req. 15)

**Archivos afectados:**
- `src/screens/exercises/components/ExerciseMap.tsx`
- `src/screens/exercises/TutorScreen.tsx`

**Problema:** `Array.from({ length: 10 })` hardcodea 10 niveles.

**Solución:** Pasar el número de ejercicios como prop:

```tsx
// ExerciseMap.tsx
interface Props {
  currentLevel: number;
  totalLevels: number;  // nuevo
  onSelect: (level: number) => void;
}

// Uso: Array.from({ length: totalLevels })
```

En `TutorScreen.tsx`:
```tsx
<ExerciseMap
  currentLevel={currentLevel}
  totalLevels={selectedMethod.data.length}
  onSelect={(level) => selectExercise(level, quiz.resetQuiz)}
/>
```

---

## 16. calculateSimpson sin mutación (Req. 16)

**Archivo afectado:** `src/engine/methods/simpson.ts`

**Problema:**
```ts
if (n % 2 !== 0) n += 1;  // muta el parámetro
```

**Solución:**
```ts
const effectiveN = n % 2 !== 0 ? n + 1 : n;
// usar effectiveN en todo el resto de la función
```

Si `effectiveN !== n`, añadir un paso informativo al inicio de `steps`:
```ts
if (effectiveN !== n) {
  steps.push({
    title: 'Ajuste automático de n',
    content: `n=${n} es impar. Simpson 1/3 requiere n par. Se usará n=${effectiveN}.`,
    latex: `n = ${n} \\rightarrow n = ${effectiveN} \\text{ (ajuste automático)}`,
  });
}
```

---

## 17. Conversión LaTeX con anidamiento (Req. 17)

**Archivo afectado:** `src/components/calculator/hooks/useMathKeyboard.ts`

**Problema:** Las regex actuales usan `[^)]*` que no captura paréntesis anidados. `sin(cos(x))` se convierte incorrectamente.

**Solución:** Usar `mathjs.parse().toTex()` para la conversión, igual que hace `ExerciseCard.tsx`:

```ts
import { parse } from 'mathjs';

const toLatex = (expr: string): string => {
  try {
    let tex = parse(expr).toTex();
    // post-procesado mínimo para consistencia visual
    tex = tex.replace(/\\exp\s*\\left\((.*?)\\right\)/gs, 'e^{$1}');
    return tex;
  } catch {
    return expr; // fallback: texto plano
  }
};
```

El cursor se inserta como marcador antes de llamar a `toLatex`, usando un placeholder único que no interfiera con el parsing de mathjs (ej: `__CURSOR__`), y se reemplaza por `\textcolor{...}{|}` en el resultado LaTeX.

---

## Orden de implementación recomendado

| Prioridad | Tarea | Archivos principales |
|-----------|-------|---------------------|
| 1 | Sanitizador (Req. 2) | `expressionSanitizer.ts` |
| 2 | Romberg límite seguro (Req. 3) | `romberg.ts`, `useCalculator.ts` |
| 3 | exerciseMath Romberg (Req. 4) | `exerciseMath.ts`, `ExerciseCard.tsx` |
| 4 | Opacidad QuizStep (Req. 5) | `TutorScreen.styles.ts` |
| 5 | KaTeX local (Req. 1) | `katexTemplate.ts`, `useLatexRenderer.ts` |
| 6 | Simpson sin mutación (Req. 16) | `simpson.ts` |
| 7 | CursorManager tokens (Req. 10) | `cursorManager.ts`, `keyboard.config.ts` |
| 8 | Validación margen relativo (Req. 12) | `useQuizSteps.ts` |
| 9 | useEffect dependencias (Req. 6) | `useCalculatorScreen.ts` |
| 10 | Tipado navegación (Req. 7) | `types/index.ts`, pantallas |
| 11 | Fuentes personalizadas (Req. 8) | `App.tsx`, `assets/fonts/` |
| 12 | AreaGraph área sombreada (Req. 9) | `AreaGraph.tsx`, `useAreaGraph.ts` |
| 13 | Notación ln (Req. 11) | `ExerciseCard.tsx`, datos |
| 14 | ExerciseMap dinámico (Req. 15) | `ExerciseMap.tsx` |
| 15 | Safe Area Insets (Req. 13) | 3 pantallas + estilos |
| 16 | Accesibilidad (Req. 14) | 4 componentes |
| 17 | LaTeX anidado (Req. 17) | `useMathKeyboard.ts` |
