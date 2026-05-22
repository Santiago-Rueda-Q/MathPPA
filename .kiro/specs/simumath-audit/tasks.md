# Plan de Implementación: Auditoría y Mejoras SimuMath

## Resumen

Correcciones y mejoras organizadas por prioridad: críticas (defectos que producen resultados incorrectos o bloqueos), importantes (calidad de código y UX) y menores (pulido visual y accesibilidad). Cada tarea construye sobre las anteriores; las tareas críticas deben completarse primero.

## Tareas

---

### CRÍTICAS

- [ ] 1. Corregir el sanitizador de expresiones
  - [ ] 1.1 Reescribir `sanitizeExpression` en `src/hooks/utils/expressionSanitizer.ts`
    - Eliminar la regla global `.replace(/}/g, ')')` que destruye cualquier `}` no relacionado con potencias
    - Añadir regla específica para `e^{...}` → `exp(...)` usando el patrón `/e\^\{([^}]*)\}/g`
    - Añadir regla específica para `^{...}` → `^(...)` usando el patrón `/\^\{([^}]*)}/g`
    - Mantener las reglas de `\pi`, `\cdot`, `\div` y `sen(` → `sin(`
    - Ordenar las reglas de más específica a menos específica (primero `e^{...}`, luego `^{...}`)
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ]* 1.2 Escribir tests unitarios para `sanitizeExpression`
    - Verificar que `e^{x}` → `exp(x)` y que `x^{2}` → `x^(2)`
    - Verificar que `}` aislado (no parte de potencia) no se transforma
    - Verificar idempotencia: `sanitize(sanitize(expr)) === sanitize(expr)` para expresiones del teclado
    - _Requisitos: 2.3, 2.5_

- [ ] 2. Añadir límite seguro de iteraciones a Romberg
  - [ ] 2.1 Modificar `src/engine/methods/romberg.ts`
    - Añadir constante `const MAX_ROMBERG_LEVELS = 10` al inicio del archivo
    - Reemplazar el uso directo de `maxIterations` por `const levels = Math.min(Math.max(1, maxIterations), MAX_ROMBERG_LEVELS)`
    - Usar `levels` en lugar de `maxIterations` en el bucle `for` y en el cálculo de `resultValue`
    - _Requisitos: 3.1, 3.3, 3.4_
  - [ ] 2.2 Modificar `src/hooks/useCalculator.ts`
    - Dentro de `calculate`, después de parsear `numN`, añadir validación: si `method === 'romberg' && numN > 10`, mostrar advertencia en `error` (o como mensaje informativo) y usar `10` como valor efectivo
    - _Requisitos: 3.2_
  - [ ]* 2.3 Escribir tests unitarios para `calculateRomberg` con límite
    - Verificar que llamar con `maxIterations = 30` no lanza excepción y retorna valor finito
    - Verificar que el resultado con `n = 10` y `n = 30` es idéntico (el límite se aplica)
    - _Requisitos: 3.3, 3.4_

- [ ] 3. Implementar soporte real de Romberg en el módulo de ejercicios
  - [ ] 3.1 Extender la interfaz `Answers` y la función `calculateAnswers` en `src/screens/exercises/utils/exerciseMath.ts`
    - Añadir campos opcionales a la interfaz: `r00?: number; r10?: number; r11?: number`
    - Añadir rama `romberg` en `calculateAnswers` que calcule:
      - `R[0][0]` = `(h/2) * (f(a) + f(b))` con `h = b - a` (primera aproximación, n=1)
      - `R[1][0]` = `0.5 * R[0][0] + (h/2) * f(a + h/2)` con `h = (b-a)/2`
      - `R[1][1]` = `R[1][0] + (R[1][0] - R[0][0]) / 3` (primera extrapolación de Richardson)
      - `result` = `R[exercise.n - 1][exercise.n - 1]` usando el algoritmo completo de Romberg
    - _Requisitos: 4.1, 4.2, 4.4_
  - [ ] 3.2 Adaptar `src/screens/exercises/components/ExerciseCard.tsx` para Romberg
    - Añadir prop `methodId: string` a la interfaz `Props`
    - Renderizar condicionalmente los títulos de los pasos según `methodId`:
      - Paso 1: "PASO 1: Primera aproximación R[0,0]" (Romberg) vs "PASO 1: Calcular h" (otros)
      - Paso 2: "PASO 2: Segunda aproximación R[1,0]" (Romberg) vs "PASO 2: Evaluar extremos" (otros)
      - Paso 3: "PASO 3: Extrapolación de Richardson R[1,1]" (Romberg) vs "PASO 3: Suma de puntos intermedios" (otros)
    - Adaptar los labels de los inputs del paso 3: `R[1,1] = ` para Romberg, `Σ f(xᵢ) = ` para otros
    - Pasar `methodId` desde `TutorScreen.tsx` al renderizar `<ExerciseCard>`
    - _Requisitos: 4.3_
  - [ ] 3.3 Adaptar la validación del paso 3 en `src/screens/exercises/hooks/useQuizSteps.ts`
    - Añadir parámetro `methodId: string` a `validateStep`
    - Para el paso 3: si `methodId === 'romberg'`, comparar `stepInputs.sum` contra `answers.r11`; en caso contrario, comparar contra `answers.sum`
    - Actualizar la llamada a `validateStep` en `ExerciseCard.tsx` para pasar `methodId`
    - _Requisitos: 4.1, 4.2_
  - [ ]* 3.4 Escribir tests unitarios para `calculateAnswers` con Romberg
    - Para cada ejercicio en `rombergExercises`, verificar que `|calculateAnswers(ex, 'romberg').result - ex.solution| < 0.001`
    - Verificar que `r00`, `r10` y `r11` son números finitos y no `NaN`
    - _Requisitos: 4.4_

- [ ] 4. Eliminar la opacidad reducida del QuizStep activo
  - [ ] 4.1 Modificar `src/screens/exercises/TutorScreen.styles.ts`
    - Eliminar la propiedad `opacity: 0.5` del estilo `quizStep`
    - Verificar que `quizStepDone` mantiene `opacity: 1` (o no tiene `opacity` explícita, que equivale a 1)
    - _Requisitos: 5.1, 5.2_

- [ ] 5. Punto de control — Verificar correcciones críticas
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.

- [ ] 6. Migrar KaTeX de CDN a recursos locales
  - [ ] 6.1 Convertir `useLatexRenderer` a carga asíncrona en `src/components/latex/hooks/useLatexRenderer.ts`
    - Añadir estado `isLoading: boolean` inicializado en `true` y `katexCss: string`, `katexJs: string`
    - Usar `useEffect` para cargar los assets una sola vez:
      - Cargar `katex.min.css` con `Asset.fromModule(require('katex/dist/katex.min.css'))` + `FileSystem.readAsStringAsync`
      - Cargar `katex.min.js` con `Asset.fromModule(require('katex/dist/katex.min.js'))` + `FileSystem.readAsStringAsync`
    - Mientras `isLoading === true`, retornar `html = ''` para que el componente muestre el fallback
    - _Requisitos: 1.1, 1.2, 1.4_
  - [ ] 6.2 Modificar `src/components/latex/utils/katexTemplate.ts`
    - Cambiar la firma a `generateKatexHtml(latex, fontSize, color, center, katexCss, katexJs)`
    - Reemplazar las etiquetas `<link>` y `<script src>` del CDN por `<style>${katexCss}</style>` y `<script>${katexJs}</script>` inlineados
    - _Requisitos: 1.1_
  - [ ] 6.3 Actualizar `src/components/latex/LatexRenderer.tsx` para mostrar fallback mientras carga
    - Importar `Text` de `react-native`
    - Si `isLoading`, renderizar `<Text>{latex}</Text>` como fallback visible
    - Si `!isLoading`, renderizar el `WebView` con el HTML generado
    - _Requisitos: 1.3_

---

### IMPORTANTES

- [ ] 7. Eliminar mutación de parámetros en `calculateSimpson`
  - [ ] 7.1 Modificar `src/engine/methods/simpson.ts`
    - Reemplazar `if (n % 2 !== 0) n += 1` por `const effectiveN = n % 2 !== 0 ? n + 1 : n`
    - Sustituir todos los usos de `n` en el cuerpo de la función por `effectiveN`
    - Añadir paso informativo al inicio de `steps` cuando `effectiveN !== n`:
      ```
      { title: 'Ajuste automático de n', content: `n=${n} es impar. Simpson 1/3 requiere n par. Se usará n=${effectiveN}.`, latex: `n = ${n} \\rightarrow n = ${effectiveN}` }
      ```
    - _Requisitos: 16.1, 16.2, 16.3_
  - [ ]* 7.2 Escribir tests unitarios para `calculateSimpson` sin mutación
    - Verificar que llamar con `n = 3` retorna el mismo resultado que llamar con `n = 4`
    - Verificar que la variable original del llamador no se modifica (pasar una variable `let` y comprobar que sigue siendo 3)
    - Verificar que los pasos incluyen la nota de ajuste cuando `n` es impar
    - _Requisitos: 16.1, 16.2, 16.3_

- [ ] 8. Unificar tokens de potencia en `CursorManager` y teclado
  - [ ] 8.1 Modificar `src/hooks/utils/cursorManager.ts`
    - Cambiar la entrada `'^'` en `INSERTION_MAP` de `{ text: '^{}', offset: 2 }` a `{ text: '^()', offset: 2 }`
    - Eliminar la entrada `'pow('` del `INSERTION_MAP`
    - Añadir `Math.max(0, Math.min(expression.length, cursorPosition + offset))` en `applyInsertion` como defensa explícita del rango del cursor
    - _Requisitos: 10.1, 10.4_
  - [ ] 8.2 Modificar `src/components/calculator/config/keyboard.config.ts`
    - Eliminar `'pow('` del array `MATH_KEYS`
    - Eliminar la entrada `'pow('` de `MATH_LABELS`
    - _Requisitos: 10.1, 10.3_
  - [ ]* 8.3 Escribir tests unitarios para `applyInsertion` con `^`
    - Verificar que insertar `^` en expresión vacía produce `^()` con `cursorPosition = 2`
    - Verificar que `cursorPosition` siempre está en `[0, expression.length]` tras cualquier inserción
    - _Requisitos: 10.2, 10.4_

- [ ] 9. Reemplazar margen absoluto por margen relativo en la validación del Tutor
  - [ ] 9.1 Modificar `src/screens/exercises/hooks/useQuizSteps.ts`
    - Eliminar la constante `MARGIN = 0.01`
    - Añadir la función `isClose`:
      ```ts
      const isClose = (input: string, expected: number): boolean => {
        const val = parseFloat(input);
        if (isNaN(val)) return false;
        const diff = Math.abs(val - expected);
        const scale = Math.max(Math.abs(expected), 1);
        return diff / scale < 0.01;
      };
      ```
    - Reemplazar todas las llamadas a `close(a, b)` por `isClose(a, b)` en `validateStep`
    - _Requisitos: 12.1, 12.2, 12.3, 12.4_
  - [ ]* 9.2 Escribir tests unitarios para `isClose`
    - Verificar que para `expected = 50`, acepta `50.4` (< 1%) y rechaza `51` (> 1%)
    - Verificar que para `expected = 0.0001`, acepta `0.0001 ± 0.009` (margen absoluto ≤ 0.01)
    - Verificar que ingresar el valor exacto de `calculateAnswers` siempre es aceptado
    - _Requisitos: 12.1, 12.2, 12.3, 12.4_

- [ ] 10. Corregir dependencias del `useEffect` en `useCalculatorScreen`
  - [ ] 10.1 Modificar `src/screens/calculator/hooks/useCalculatorScreen.ts`
    - Importar `useEffect` de React
    - Mover la lógica de `loadFromRoute` inline dentro de un `useEffect` con `[routeParams]` como dependencia:
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
    - Mantener `loadFromRoute` como función separada para uso manual (sin `useEffect`)
    - _Requisitos: 6.1, 6.2, 6.3_
  - [ ] 10.2 Actualizar `src/screens/calculator/CalculatorScreen.tsx`
    - Eliminar el `useEffect(() => { loadFromRoute(route?.params); }, [route?.params])` que ya no es necesario (el efecto ahora vive en el hook)
    - Verificar que `route?.params` se sigue pasando como `routeParams` al hook
    - _Requisitos: 6.1, 6.2_

- [ ] 11. Añadir tipado estricto de navegación
  - [ ] 11.1 Añadir tipos de navegación a `src/types/index.ts`
    - Importar `Exercise` desde `'../data/exercises/types'`
    - Exportar `RootTabParamList`:
      ```ts
      export type RootTabParamList = {
        Calculadora: { exercise?: Exercise; method?: Method } | undefined;
        'Teoría': undefined;
        Aprender: undefined;
      };
      ```
    - Exportar `RootStackParamList`:
      ```ts
      export type RootStackParamList = { Main: undefined };
      ```
    - _Requisitos: 7.4_
  - [ ] 11.2 Tipar `route` en `src/screens/calculator/CalculatorScreen.tsx`
    - Importar `RouteProp` de `@react-navigation/native` y `RootTabParamList` de `src/types`
    - Reemplazar `{ route }: any` por `{ route }: { route: RouteProp<RootTabParamList, 'Calculadora'> }`
    - _Requisitos: 7.1, 7.3_
  - [ ] 11.3 Tipar `navigation` en `src/screens/exercises/TutorScreen.tsx`
    - Importar `BottomTabNavigationProp` de `@react-navigation/bottom-tabs` y `RootTabParamList` de `src/types`
    - Reemplazar `{ navigation }: any` por `{ navigation }: { navigation: BottomTabNavigationProp<RootTabParamList, 'Aprender'> }`
    - _Requisitos: 7.2, 7.3_

- [ ] 12. Cargar fuentes personalizadas en la aplicación
  - [ ] 12.1 Descargar y colocar los archivos de fuente en `assets/fonts/`
    - Descargar `Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-Bold.ttf` desde Google Fonts
    - Descargar `FiraCode-Regular.ttf` desde Google Fonts
    - Colocar los cuatro archivos en `assets/fonts/`
    - _Requisitos: 8.1_
  - [ ] 12.2 Modificar `App.tsx` para cargar fuentes con `expo-font`
    - Importar `useFonts` de `expo-font`
    - Añadir en el cuerpo de `App`:
      ```ts
      const [fontsLoaded, fontError] = useFonts({
        'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
        'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        'FiraCode-Regular': require('./assets/fonts/FiraCode-Regular.ttf'),
      });
      if (!fontsLoaded && !fontError) return null;
      ```
    - Si `fontError`, registrar en consola y continuar (fuentes del sistema como fallback)
    - _Requisitos: 8.1, 8.2, 8.3_
  - [ ] 12.3 Actualizar `app.json` con la configuración del plugin `expo-font`
    - Añadir en la sección `plugins` de `app.json`:
      ```json
      ["expo-font", { "fonts": ["./assets/fonts/Inter-Regular.ttf", "./assets/fonts/Inter-Medium.ttf", "./assets/fonts/Inter-Bold.ttf", "./assets/fonts/FiraCode-Regular.ttf"] }]
      ```
    - _Requisitos: 8.4_

- [ ] 13. Añadir área sombreada al gráfico de integración
  - [ ] 13.1 Calcular `areaPath` en `src/components/graph/hooks/useAreaGraph.ts`
    - Filtrar los puntos de la curva que estén dentro del intervalo `[a, b]`: `const areaPoints = points.filter(p => p.x >= a && p.x <= b)`
    - Construir el path SVG de área:
      ```ts
      const areaPath = areaPoints.length > 1
        ? `M ${mapX(a)} ${yZero} ` +
          areaPoints.map(p => `L ${mapX(p.x)} ${mapY(p.y)}`).join(' ') +
          ` L ${mapX(b)} ${yZero} Z`
        : '';
      ```
    - Retornar `areaPath` junto con los demás valores del hook
    - _Requisitos: 9.1, 9.4_
  - [ ] 13.2 Renderizar el área sombreada en `src/components/graph/AreaGraph.tsx`
    - Importar `Path` de `react-native-svg` (ya importado)
    - Añadir `<Path d={areaPath} fill={theme.colors.primary} opacity={0.15} />` antes del `Path` de la curva (para que quede debajo)
    - Si `points.length === 0`, renderizar `<SvgText x={width/2} y={height/2} fill={theme.colors.error} textAnchor="middle">Error al evaluar la expresión</SvgText>` en lugar del gráfico vacío
    - _Requisitos: 9.1, 9.3, 9.4_

- [ ] 14. Punto de control — Verificar correcciones importantes
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.

---

### MENORES

- [ ] 15. Unificar la notación de logaritmo natural
  - [ ] 15.1 Añadir transformación `\log` → `\ln` en `src/screens/exercises/components/ExerciseCard.tsx`
    - En la función `getLatexExpression`, añadir `.replace(/\\log\b/g, '\\ln')` al post-procesado del `tex`, después de las transformaciones de `exp`
    - _Requisitos: 11.1, 11.2_
  - [ ] 15.2 Actualizar descripciones en `src/data/exercises/trapecio.ts`
    - En el nivel 6 (`id: 't6'`), cambiar la descripción de `"Integra f(x) = ln(x) de 1 a 5."` (ya es correcta; verificar que no diga "log(x)")
    - _Requisitos: 11.1_
  - [ ] 15.3 Actualizar descripciones en `src/data/exercises/romberg.ts`
    - En el nivel 9 (`id: 'r9'`), cambiar la descripción de `"Integra x * ln(x) de 1 a 4."` (ya es correcta; verificar que no diga "log(x)")
    - _Requisitos: 11.1_

- [ ] 16. Hacer `ExerciseMap` dinámico según ejercicios disponibles
  - [ ] 16.1 Añadir prop `totalLevels` a `src/screens/exercises/components/ExerciseMap.tsx`
    - Extender la interfaz `Props` con `totalLevels: number`
    - Reemplazar `Array.from({ length: 10 })` por `Array.from({ length: totalLevels })`
    - _Requisitos: 15.1, 15.2, 15.3_
  - [ ] 16.2 Pasar `totalLevels` desde `src/screens/exercises/TutorScreen.tsx`
    - Añadir `totalLevels={selectedMethod.data.length}` al componente `<ExerciseMap>`
    - _Requisitos: 15.1, 15.3_

- [ ] 17. Usar Safe Area Insets dinámicos en las tres pantallas
  - [ ] 17.1 Añadir constante `TAB_BAR_HEIGHT` en `src/theme/index.ts`
    - Importar `Platform` de `react-native`
    - Exportar `export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 75`
    - _Requisitos: 13.4_
  - [ ] 17.2 Aplicar `useSafeAreaInsets` en `src/screens/calculator/CalculatorScreen.tsx`
    - Importar `useSafeAreaInsets` de `react-native-safe-area-context` y `TAB_BAR_HEIGHT` del tema
    - Obtener `const insets = useSafeAreaInsets()`
    - Reemplazar el `paddingTop: 60` hardcodeado en `CalculatorScreen.styles.ts` por `paddingTop: insets.top + 16` calculado dinámicamente en el componente (usando `useMemo` o estilo inline)
    - Reemplazar `paddingBottom: 120` por `paddingBottom: insets.bottom + TAB_BAR_HEIGHT`
    - _Requisitos: 13.1, 13.4_
  - [ ] 17.3 Aplicar `useSafeAreaInsets` en `src/screens/learn/TheoryScreen.tsx`
    - Importar `useSafeAreaInsets` de `react-native-safe-area-context` y `TAB_BAR_HEIGHT` del tema
    - Reemplazar `paddingTop: 60` por `insets.top + 16` y `paddingBottom: 120` por `insets.bottom + TAB_BAR_HEIGHT`
    - _Requisitos: 13.2, 13.4_
  - [ ] 17.4 Aplicar `useSafeAreaInsets` en `src/screens/exercises/TutorScreen.tsx`
    - Importar `useSafeAreaInsets` de `react-native-safe-area-context` y `TAB_BAR_HEIGHT` del tema
    - Reemplazar `paddingTop: 60` del header en `TutorScreen.styles.ts` por valor dinámico calculado con `insets.top + 16`
    - _Requisitos: 13.3, 13.4_

- [ ] 18. Añadir accesibilidad a componentes visuales
  - [ ] 18.1 Añadir prop `accessibilityLabel` a `src/components/latex/LatexRenderer.types.ts`
    - Añadir `accessibilityLabel?: string` a la interfaz `LatexRendererProps`
    - _Requisitos: 14.1_
  - [ ] 18.2 Aplicar accesibilidad en `src/components/latex/LatexRenderer.tsx`
    - Añadir `accessibilityLabel` a los props desestructurados
    - Aplicar al `View` contenedor:
      ```tsx
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `Fórmula: ${latex}`}
      ```
    - _Requisitos: 14.1, 14.4_
  - [ ] 18.3 Añadir accesibilidad al logo en `src/components/shared/BrandHeader.tsx`
    - Añadir `accessibilityLabel="Logo de SimuMath"` al componente `<Image>`
    - _Requisitos: 14.2_
  - [ ] 18.4 Añadir accesibilidad al contenedor de `src/components/graph/AreaGraph.tsx`
    - Añadir al `View` contenedor:
      ```tsx
      accessible={true}
      accessibilityLabel={`Gráfica de f(x) = ${props.expression} en [${props.a}, ${props.b}]`}
      ```
    - _Requisitos: 14.3_

- [ ] 19. Corregir conversión LaTeX con expresiones anidadas en el teclado
  - [ ] 19.1 Refactorizar `src/components/calculator/hooks/useMathKeyboard.ts`
    - Importar `parse` de `mathjs`
    - Crear función `toLatex(expr: string): string`:
      - Insertar el cursor como placeholder: reemplazar la posición del cursor por `__CURSOR__` antes del parse
      - Llamar a `parse(exprWithPlaceholder).toTex()` para obtener LaTeX estructuralmente correcto
      - Reemplazar `__CURSOR__` en el resultado por `\textcolor{${cursorColor}}{|}`
      - En el bloque `catch`, retornar el texto plano como fallback
      - Añadir post-procesado mínimo: `tex.replace(/\\exp\s*\\left\((.*?)\\right\)/gs, 'e^{$1}')`
    - Reemplazar el bloque de regex en cadena del `latex` IIFE por una llamada a `toLatex`
    - _Requisitos: 17.1, 17.2, 17.3, 17.4_

- [ ] 20. Punto de control final — Verificar todas las mejoras
  - Asegurarse de que todos los tests pasan y que la aplicación compila sin errores TypeScript. Consultar al usuario si surgen dudas.

---

## Notas

- Las sub-tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- El orden de las tareas sigue la prioridad del diseño: críticas primero, luego importantes, luego menores
- Cada tarea referencia los requisitos específicos para trazabilidad
- Los puntos de control (tareas 5, 14 y 20) validan el progreso incremental
- Las tareas críticas 1–6 deben completarse antes de las importantes 7–13
- La tarea 6 (KaTeX local) requiere que `expo-file-system` y `expo-asset` estén disponibles en el entorno
