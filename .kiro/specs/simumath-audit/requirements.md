# Documento de Requisitos — Auditoría y Mejoras SimuMath

## Introducción

SimuMath es una aplicación móvil y web (React Native + Expo) para el aprendizaje interactivo de métodos numéricos de integración: Trapecio Compuesto, Simpson 1/3 Compuesto y Romberg. La aplicación incluye una calculadora paso a paso, pantalla de teoría con acordeón y un tutor interactivo con ejercicios por niveles.

Esta auditoría identifica defectos críticos de corrección, problemas importantes de calidad y mejoras menores de usabilidad y accesibilidad. Los requisitos están organizados por prioridad y cubren correcciones de lógica, robustez, tipado, experiencia de usuario y accesibilidad.

---

## Glosario

- **Calculadora**: Pantalla principal donde el usuario ingresa una expresión, límites y número de subintervalos para calcular una integral numérica.
- **Motor de Cálculo**: Módulo `src/engine/methods/` que implementa los algoritmos de Trapecio, Simpson y Romberg.
- **Sanitizador**: Función `sanitizeExpression` en `src/hooks/utils/expressionSanitizer.ts` que transforma la expresión del teclado matemático al formato aceptado por mathjs.
- **Tutor**: Pantalla de ejercicios interactivos guiados por pasos (`TutorScreen`).
- **QuizStep**: Componente que representa un paso individual del ejercicio interactivo.
- **ExerciseCard**: Componente que agrupa los cuatro pasos del ejercicio para un nivel dado.
- **ExerciseMap**: Componente que muestra el mapa de niveles disponibles para el método seleccionado.
- **LatexRenderer**: Componente que renderiza fórmulas matemáticas en formato LaTeX usando KaTeX.
- **AreaGraph**: Componente SVG que visualiza la función y los puntos de integración.
- **CursorManager**: Módulo `src/hooks/utils/cursorManager.ts` que gestiona la inserción de tokens y la posición del cursor en el teclado matemático.
- **MathKeyboard**: Teclado matemático virtual para ingreso de expresiones.
- **Romberg**: Método de integración numérica basado en extrapolación de Richardson sobre la regla del Trapecio.
- **mathjs**: Biblioteca de evaluación de expresiones matemáticas utilizada en el motor de cálculo.
- **KaTeX**: Biblioteca de renderizado de fórmulas LaTeX utilizada en `LatexRenderer`.
- **Safe Area Insets**: Márgenes dinámicos provistos por el sistema operativo para evitar solapamiento con notch, barra de estado y barra de navegación.
- **EARS**: Easy Approach to Requirements Syntax — conjunto de patrones para redactar requisitos verificables.

---

## Requisitos

---

### Requisito 1: Renderizado LaTeX sin dependencia de red

**User Story:** Como usuario de SimuMath en un entorno sin conexión a internet, quiero que las fórmulas matemáticas se rendericen correctamente, para que pueda usar la aplicación en cualquier contexto (aula, transporte, zona sin cobertura).

#### Criterios de Aceptación

1. THE `LatexRenderer` SHALL incluir todos los recursos de KaTeX (CSS y JavaScript) empaquetados localmente en la aplicación, sin realizar peticiones HTTP a dominios externos durante el renderizado.
2. WHEN la aplicación se ejecuta en modo sin conexión, THE `LatexRenderer` SHALL renderizar fórmulas LaTeX correctamente en todas las pantallas (Calculadora, Teoría, Tutor).
3. IF los recursos de KaTeX no pueden cargarse, THEN THE `LatexRenderer` SHALL mostrar la expresión LaTeX en texto plano como alternativa visible al usuario.
4. THE `LatexRenderer` SHALL renderizar fórmulas en un tiempo máximo de 500 ms desde que recibe la cadena LaTeX, independientemente del estado de la red.

---

### Requisito 2: Sanitizador de expresiones sin transformaciones destructivas

**User Story:** Como usuario que escribe expresiones con el teclado matemático, quiero que la expresión ingresada se convierta correctamente al formato de mathjs, para que el cálculo produzca resultados válidos y no expresiones malformadas.

#### Criterios de Aceptación

1. WHEN el usuario ingresa una expresión con notación de potencia `^{...}` (por ejemplo `x^{2}`), THE `Sanitizador` SHALL transformarla a `x^(2)` sin alterar otros caracteres `}` que no pertenezcan a esa construcción.
2. WHEN el usuario ingresa `e^{x}`, THE `Sanitizador` SHALL transformarla a `exp(x)` de forma que mathjs pueda evaluarla correctamente.
3. THE `Sanitizador` SHALL transformar únicamente los patrones reconocidos explícitamente; los caracteres `}` que no formen parte de un patrón reconocido NO SHALL ser eliminados ni reemplazados.
4. FOR ALL expresiones válidas producidas por el `MathKeyboard`, THE `Sanitizador` SHALL producir una cadena evaluable por mathjs sin lanzar excepciones.
5. FOR ALL expresiones válidas producidas por el `MathKeyboard`, THE `Sanitizador` SHALL ser idempotente: aplicar la sanitización dos veces SHALL producir el mismo resultado que aplicarla una vez.

---

### Requisito 3: Motor Romberg con límite seguro de iteraciones

**User Story:** Como usuario que selecciona el método Romberg con un valor de `n` alto, quiero que la aplicación no se congele ni se vuelva irresponsiva, para que pueda obtener resultados en tiempo razonable.

#### Criterios de Aceptación

1. THE `Motor de Cálculo` para Romberg SHALL interpretar el parámetro `n` como el número de niveles de refinamiento de la tabla de Romberg, con un valor máximo permitido de 10.
2. WHEN el usuario ingresa un valor de `n` mayor a 10 para el método Romberg, THE `Calculadora` SHALL limitar las iteraciones a 10 e informar al usuario del ajuste mediante un mensaje visible.
3. WHEN el método Romberg se ejecuta con cualquier valor de `n` en el rango [1, 10], THE `Motor de Cálculo` SHALL completar el cálculo en menos de 2 segundos en dispositivos de gama media.
4. FOR ALL valores de `n` en el rango [1, 10] y para cualquier expresión válida, THE `Motor de Cálculo` para Romberg SHALL retornar un resultado numérico finito (no `NaN`, no `Infinity`).

---

### Requisito 4: Cálculo correcto de respuestas para ejercicios Romberg

**User Story:** Como estudiante que practica el método Romberg en el Tutor, quiero que los valores de referencia de cada paso sean los correctos para Romberg, para que pueda validar mi comprensión del método y no recibir retroalimentación errónea.

#### Criterios de Aceptación

1. WHEN el método seleccionado en el `Tutor` es Romberg, THE `exerciseMath` SHALL calcular las respuestas de referencia usando el algoritmo de Romberg, no el algoritmo del Trapecio.
2. THE `exerciseMath` SHALL soportar los tres métodos (`trapecio`, `simpson`, `romberg`) sin usar ninguno como fallback implícito para los demás.
3. WHEN el método es Romberg, THE `ExerciseCard` SHALL mostrar pasos adaptados al proceso de Romberg (primera aproximación trapezoidal, refinamientos sucesivos, extrapolación de Richardson) en lugar de los pasos genéricos de Trapecio/Simpson.
4. FOR ALL ejercicios de Romberg en los datos de `src/data/exercises/romberg.ts`, THE `exerciseMath` SHALL producir un resultado cuya diferencia absoluta con el campo `solution` del ejercicio sea menor a 0.001.

---

### Requisito 5: Visibilidad correcta de pasos activos en el Tutor

**User Story:** Como estudiante que resuelve un ejercicio paso a paso, quiero que el paso activo actual sea completamente visible y no semitransparente, para que pueda leer y completar el paso sin dificultad visual.

#### Criterios de Aceptación

1. WHEN un `QuizStep` está activo (visible y no completado), THE `QuizStep` SHALL renderizarse con `opacity: 1`.
2. WHEN un `QuizStep` está completado correctamente, THE `QuizStep` SHALL renderizarse con el estilo `quizStepDone` que incluye `opacity: 1` y el color de borde de éxito.
3. WHEN un `QuizStep` no está aún activo (pasos futuros no desbloqueados), THE `QuizStep` SHALL no renderizarse (retornar `null`), de modo que la opacidad reducida no sea necesaria para indicar estado inactivo.

---

### Requisito 6: Hook de pantalla Calculadora con dependencias correctas

**User Story:** Como desarrollador que mantiene SimuMath, quiero que los hooks de React sigan las reglas de dependencias de `useEffect`, para que el comportamiento de la aplicación sea predecible y no haya efectos secundarios inesperados al navegar entre pantallas.

#### Criterios de Aceptación

1. THE `useCalculatorScreen` SHALL declarar todas las funciones y valores referenciados dentro de `useEffect` en el array de dependencias del efecto, cumpliendo la regla `exhaustive-deps` de `eslint-plugin-react-hooks`.
2. WHEN el usuario navega desde el `Tutor` a la `Calculadora` con parámetros de ejercicio, THE `Calculadora` SHALL cargar los parámetros del ejercicio exactamente una vez por navegación, sin recargas adicionales por re-renders.
3. THE `useCalculatorScreen` SHALL no producir advertencias de `react-hooks/exhaustive-deps` al ejecutar el linter con la configuración del proyecto.

---

### Requisito 7: Tipado estricto de parámetros de navegación

**User Story:** Como desarrollador que mantiene SimuMath, quiero que los parámetros de navegación entre pantallas estén tipados con TypeScript, para que los errores de integración entre pantallas se detecten en tiempo de compilación y no en tiempo de ejecución.

#### Criterios de Aceptación

1. THE `CalculatorScreen` SHALL declarar el tipo de su prop `route` usando el sistema de tipos de React Navigation (`RouteProp`), especificando los parámetros opcionales `exercise` y `method`.
2. THE `TutorScreen` SHALL declarar el tipo de su prop `navigation` usando `NavigationProp` de React Navigation, especificando las rutas disponibles.
3. THE proyecto SHALL compilar sin errores de TypeScript en modo `strict` con los tipos de navegación correctamente definidos.
4. THE `src/types/index.ts` SHALL exportar los tipos de parámetros de navegación para uso compartido entre pantallas.

---

### Requisito 8: Fuentes personalizadas cargadas correctamente

**User Story:** Como usuario de SimuMath, quiero que la aplicación use las fuentes tipográficas definidas en el diseño (Inter, Fira Code), para que la experiencia visual sea consistente con la identidad de la aplicación.

#### Criterios de Aceptación

1. THE aplicación SHALL cargar las fuentes `Inter-Regular`, `Inter-Medium`, `Inter-Bold` y `FiraCode-Regular` desde los archivos incluidos en `assets/fonts/` antes de renderizar cualquier pantalla.
2. WHILE las fuentes se están cargando, THE aplicación SHALL mostrar una pantalla de carga o splash screen, sin renderizar texto con fuentes del sistema como sustituto permanente.
3. IF una fuente no puede cargarse, THEN THE aplicación SHALL continuar funcionando con la fuente del sistema como fallback, registrando el error en consola.
4. THE `app.json` SHALL incluir la configuración del plugin `expo-font` con las rutas correctas a todos los archivos de fuente utilizados en `theme.fonts`.

---

### Requisito 9: AreaGraph con visualización del área de integración

**User Story:** Como estudiante que visualiza una integral numérica, quiero ver el área sombreada bajo la curva entre los límites de integración, para que la gráfica refuerce visualmente el concepto de integral como área.

#### Criterios de Aceptación

1. THE `AreaGraph` SHALL renderizar un área sombreada (relleno semitransparente) entre la curva de la función y el eje X, delimitada por los valores `a` y `b`.
2. WHEN la función toma valores negativos en parte del intervalo, THE `AreaGraph` SHALL sombrear el área por encima del eje X con un color y el área por debajo con otro color diferenciado.
3. IF la expresión proporcionada a `AreaGraph` es inválida o produce un error de evaluación, THEN THE `AreaGraph` SHALL mostrar un mensaje de error visible dentro del área del gráfico en lugar de renderizar un gráfico vacío silenciosamente.
4. FOR ALL expresiones válidas y rangos [a, b] con a < b, THE `AreaGraph` SHALL renderizar la curva y el área sombreada sin lanzar excepciones.

---

### Requisito 10: CursorManager con tokens consistentes y sintaxis válida

**User Story:** Como usuario que escribe expresiones con el teclado matemático, quiero que todos los botones del teclado inserten tokens con sintaxis coherente y evaluable, para que no tenga que corregir manualmente la expresión antes de calcular.

#### Criterios de Aceptación

1. THE `CursorManager` SHALL definir un único mecanismo para insertar potencias: el botón `^` SHALL insertar `^()` con el cursor posicionado dentro de los paréntesis, y el botón `pow(` SHALL ser eliminado o redirigido al mismo comportamiento.
2. WHEN el usuario inserta cualquier token del `MathKeyboard` en una expresión vacía, THE `CursorManager` SHALL producir una expresión cuya posición de cursor esté en el rango `[0, expression.length]`.
3. FOR ALL tokens disponibles en el `MathKeyboard`, la expresión resultante de insertar el token en una expresión vacía SHALL ser evaluable por mathjs después de completar los argumentos requeridos.
4. THE `CursorManager` SHALL garantizar que `cursorPosition` después de cualquier operación de inserción o borrado sea siempre un entero en el rango `[0, expression.length]`.

---

### Requisito 11: Notación de logaritmo natural consistente

**User Story:** Como estudiante que usa SimuMath para aprender integración, quiero que la notación matemática mostrada en ejercicios y teoría sea consistente con la notación estándar de cálculo, para que no haya confusión entre logaritmo natural y logaritmo decimal.

#### Criterios de Aceptación

1. THE aplicación SHALL usar la notación `ln(x)` para referirse al logaritmo natural en todos los textos de la interfaz de usuario, etiquetas de ejercicios y descripciones de teoría.
2. WHEN un ejercicio usa la expresión `log(x)` internamente para mathjs, THE `ExerciseCard` SHALL mostrar la expresión como `ln(x)` en la representación LaTeX visible al usuario.
3. THE `MathKeyboard` SHALL incluir un botón etiquetado `ln(` que inserte `ln()` en la expresión, y SHALL no incluir un botón genérico `log(` que pueda confundirse con logaritmo decimal.

---

### Requisito 12: Validación de respuestas con margen relativo

**User Story:** Como estudiante que valida sus respuestas en el Tutor, quiero que el criterio de aceptación de mis respuestas sea justo para valores tanto grandes como pequeños, para que no sea rechazado por diferencias de redondeo insignificantes ni aceptado con errores grandes.

#### Criterios de Aceptación

1. THE `useQuizSteps` SHALL validar las respuestas del usuario usando un margen relativo: una respuesta es correcta si `|respuesta_usuario - valor_correcto| / max(|valor_correcto|, 1) < 0.01`.
2. WHEN el valor correcto es mayor a 1, THE `useQuizSteps` SHALL aceptar respuestas con hasta 1% de error relativo.
3. WHEN el valor correcto es menor o igual a 1, THE `useQuizSteps` SHALL aceptar respuestas con hasta 0.01 de error absoluto.
4. FOR ALL ejercicios en los datos de `src/data/exercises/`, ingresar el valor exacto calculado por `calculateAnswers` SHALL siempre ser aceptado como correcto por `useQuizSteps`.

---

### Requisito 13: Layout adaptativo con Safe Area Insets

**User Story:** Como usuario de SimuMath en dispositivos con notch, barra de estado dinámica o barra de navegación por gestos, quiero que el contenido de la aplicación no quede oculto detrás de elementos del sistema operativo, para que toda la interfaz sea visible y usable.

#### Criterios de Aceptación

1. THE `CalculatorScreen` SHALL usar `useSafeAreaInsets` o `SafeAreaView` para calcular el `paddingBottom` del `ScrollView`, en lugar del valor hardcodeado de 120 px.
2. THE `TheoryScreen` SHALL usar `useSafeAreaInsets` o `SafeAreaView` para calcular el `paddingTop`, en lugar del valor hardcodeado de 60 px.
3. THE `TutorScreen` SHALL usar `useSafeAreaInsets` o `SafeAreaView` para calcular el `paddingTop` del header, en lugar del valor hardcodeado de 60 px.
4. WHEN la tab bar tiene `position: 'absolute'`, THE contenido de cada pantalla SHALL calcular su `paddingBottom` dinámicamente a partir de la altura real de la tab bar más los insets del sistema.

---

### Requisito 14: Accesibilidad en componentes con contenido visual

**User Story:** Como usuario de SimuMath que utiliza un lector de pantalla, quiero que los componentes visuales tengan etiquetas de accesibilidad descriptivas, para que pueda entender el contenido matemático y la identidad de la aplicación sin depender de la visión.

#### Criterios de Aceptación

1. THE `LatexRenderer` SHALL incluir una prop `accessibilityLabel` que describa el contenido matemático de la fórmula en texto plano, y SHALL aplicarla al contenedor del `WebView`.
2. THE `BrandHeader` SHALL incluir `accessibilityLabel="Logo de SimuMath"` (o equivalente descriptivo) en el componente `Image` del logotipo.
3. THE `AreaGraph` SHALL incluir `accessibilityLabel` en su contenedor `View` describiendo la función graficada y el intervalo de integración.
4. WHERE la plataforma es iOS o Android, THE `LatexRenderer` SHALL marcar el `WebView` con `accessibilityRole` apropiado para que los lectores de pantalla anuncien el contenido como fórmula matemática.

---

### Requisito 15: ExerciseMap dinámico según ejercicios disponibles

**User Story:** Como estudiante que navega por los niveles del Tutor, quiero ver exactamente los niveles disponibles para el método seleccionado, para que no aparezcan niveles vacíos o inaccesibles en el mapa de ejercicios.

#### Criterios de Aceptación

1. THE `ExerciseMap` SHALL renderizar exactamente tantos niveles como ejercicios tenga el método seleccionado en `src/data/exercises/`, sin asumir un número fijo de 10 niveles.
2. WHEN el método seleccionado tiene menos de 10 ejercicios, THE `ExerciseMap` SHALL mostrar únicamente los niveles disponibles.
3. FOR ALL métodos disponibles (`trapecio`, `simpson`, `romberg`), el número de niveles mostrados en `ExerciseMap` SHALL ser igual al número de elementos en el array `exercises` del `LearningPath` correspondiente.

---

### Requisito 16: calculateSimpson sin mutación de parámetros

**User Story:** Como desarrollador que mantiene SimuMath, quiero que las funciones del motor de cálculo sean puras y no muten sus parámetros de entrada, para que el comportamiento sea predecible y no haya efectos secundarios inesperados al reutilizar los valores.

#### Criterios de Aceptación

1. THE `calculateSimpson` SHALL no modificar el valor del parámetro `n` recibido; si `n` es impar, SHALL usar internamente `n + 1` sin reasignar el parámetro.
2. FOR ALL valores de `n` impares en el rango [1, 99], llamar a `calculateSimpson` SHALL retornar un resultado equivalente al calculado con `n + 1` subintervalos, sin alterar la variable original del llamador.
3. THE `calculateSimpson` SHALL incluir en los pasos de resolución una nota visible cuando `n` fue ajustado de impar a par, informando al usuario del ajuste.

---

### Requisito 17: Conversión LaTeX del teclado con expresiones anidadas

**User Story:** Como usuario que escribe expresiones complejas con el teclado matemático, quiero que la vista previa LaTeX muestre correctamente funciones anidadas como `sin(cos(x))`, para que pueda verificar visualmente que la expresión ingresada es la correcta antes de calcular.

#### Criterios de Aceptación

1. THE `useMathKeyboard` SHALL convertir expresiones con funciones anidadas (por ejemplo `sin(cos(x))`) a LaTeX válido que KaTeX pueda renderizar sin errores.
2. THE `useMathKeyboard` SHALL convertir expresiones con múltiples niveles de anidamiento (al menos dos niveles) correctamente, sin truncar ni malformar los argumentos internos.
3. FOR ALL expresiones válidas producidas por el `MathKeyboard`, la cadena LaTeX generada por `useMathKeyboard` SHALL ser una cadena no vacía.
4. FOR ALL expresiones válidas producidas por el `MathKeyboard`, la cadena LaTeX generada SHALL no contener secuencias de escape LaTeX malformadas que causen errores de renderizado en KaTeX.
