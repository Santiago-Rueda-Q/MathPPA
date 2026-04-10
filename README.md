# 🧮 SimuMath — Plataforma de Apoyo de Estudio de Ingeniería de Software FESC

<p align="center">
  <img src="assets/images/logo.png" width="100" alt="SimuMath Logo" />
</p>

<p align="center">
  <strong>Aprende. Practica. Domina tu proceso en la Ingeniería de Software FESC.</strong><br/>
  Una aplicación móvil interactiva construida con React Native + Expo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.73-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Expo-50-black?style=for-the-badge&logo=expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Redux%20Toolkit-ready-purple?style=for-the-badge&logo=redux" />
</p>

---

## Tabla de Contenidos

- [📱 Descripción del Proyecto](#-descripción-del-proyecto)
- [⚙️ Tecnologías y Librerías](#️-tecnologías-y-librerías)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [📊 Diagramas UML](#-diagramas-uml)
  - [Diagrama de Arquitectura General](#diagrama-de-arquitectura-general)
  - [Diagrama de Casos de Uso](#diagrama-de-casos-de-uso)
  - [Diagrama de Flujo de Cálculo](#diagrama-de-flujo-de-cálculo)
  - [Diagrama de Componentes](#diagrama-de-componentes)
  - [Diagrama de Estados (Quiz)](#diagrama-de-estados-quiz)
  - [Diagrama de Secuencia](#diagrama-de-secuencia)
- [📁 Estructura de Carpetas](#-estructura-de-carpetas)
- [🚀 Cómo Ejecutar el Proyecto](#-cómo-ejecutar-el-proyecto)
- [👥 Autores](#-autores)

---

## 📱 Descripción del Proyecto

**SimuMath** es una plataforma educativa gamificada diseñada como **apoyo de estudio para el programa de Ingeniería de Software de la FESC**. Permite a los estudiantes:

- 📖 **Aprender** los fundamentos teóricos de Trapecio, Simpson 1/3 y Romberg con fórmulas LaTeX interactivas
- 🎯 **Practicar** a través de una ruta de 10 niveles con verificación paso a paso
- 🧮 **Calcular** con una calculadora matemática de expresiones simbólicas con teclado personalizado
- 📈 **Visualizar** el área bajo la curva con gráficas SVG interactivas

---

## ⚙️ Tecnologías y Librerías

### Core

| Librería | Versión | Uso |
|----------|---------|-----|
| `react-native` | 0.73+ | Framework base multiplataforma |
| `expo` | ~50 | SDK y herramientas de desarrollo |
| `typescript` | 5.0+ | Tipado estático |
| `@reduxjs/toolkit` | ^2.0 | Manejo de estado global |
| `react-redux` | ^9.0 | Integración Redux ↔ React |

### Motor Matemático

| Librería | Versión | Uso |
|----------|---------|-----|
| `mathjs` | ^12.0 | Evaluación de expresiones matemáticas |
| `katex` | ^0.16 | Renderizado LaTeX (web) |
| `react-native-webview` | ^13.0 | Renderizado LaTeX (nativo iOS/Android) |

### Gráficas y Visualización

| Librería | Versión | Uso |
|----------|---------|-----|
| `react-native-svg` | ^14.0 | Gráficas SVG vectoriales interactivas |
| `@expo/vector-icons` | ^14.0 | Iconos (MaterialCommunityIcons) |

### Navegación y UI

| Librería | Versión | Uso |
|----------|---------|-----|
| `expo-status-bar` | ~1.11 | Control de la barra de estado |
| `react-navigation` | ^6.0 | Navegación entre pantallas (tabs) |

### Instalación de todas las dependencias

```bash
npm install mathjs katex react-native-webview react-native-svg @expo/vector-icons @reduxjs/toolkit react-redux
```

```bash
npx expo install expo-status-bar react-native-svg react-native-webview
```

---

## 🏗️ Arquitectura del Sistema

SimuMath sigue una arquitectura modular basada en el principio de **separación de responsabilidades**:

> **Un archivo = Una sola responsabilidad**

| Capa | Rol | Analogía |
|------|-----|----------|
| **Screens** | Orquestación de la pantalla | 🎼 Director de orquesta |
| **Hooks** | Lógica de negocio y estado | 🧠 Cerebro |
| **Components** | Piezas visuales reutilizables | 🧩 Piezas de UI |
| **Engine** | Cálculos matemáticos puros | ⚙️ Motor |
| **Utils** | Funciones puras sin estado | 📐 Reglas del juego |
| **Theme** | Sistema de diseño centralizado | 🎨 Paleta única |
| **Types** | Contratos TypeScript | 📋 Definiciones |

---

## 📊 Diagramas UML

### Diagrama de Arquitectura General

```mermaid
graph TD
    classDef presentation fill:#1a2130,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef logic fill:#151b23,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef components fill:#1a2130,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef core fill:#0d1117,stroke:#f59e0b,stroke-width:2px,color:#fff;

    subgraph Presentation ["🎼 Presentation — Screens"]
        S1[CalculatorScreen]
        S2[TutorScreen]
        S3[TheoryScreen]
    end

    subgraph Logic ["🧠 Business Logic — Hooks"]
        H1[useCalculator]
        H2[useExpressionInput]
        H3[useTutorScreen]
        H4[useQuizSteps]
        H5[useTheoryScreen]
        H6[useAreaGraph]
    end

    subgraph PieceComp ["🧩 Components — Visual Pieces"]
        C1[MathKeyboard]
        C2[AreaGraph]
        C3[LatexRenderer]
        C4[ExerciseCard]
        C5[MethodCard]
        C6[QuizStep]
    end

    subgraph CoreLayer ["⚙️ Core — Engine & Rules"]
        E1[calculateTrapecio]
        E2[calculateSimpson]
        E3[calculateRomberg]
        U1[expressionSanitizer]
        U2[cursorManager]
        U3[graphMath]
        U4[graphMapping]
        T1[theme]
        T2[types]
    end

    S1 <--> H1 & H2
    S2 <--> H3 & H4
    S3 <--> H5

    H1 --> E1 & E2 & E3
    H1 --> U1 & U2
    H2 --> U2
    H6 --> U3 & U4

    S1 --> C1 & C2 & C3
    S2 --> C4 & C6
    S3 --> C5
    C2 --> H6
    C4 --> C6

    C1 & C2 & C3 & C4 & C5 & C6 --> T1
    E1 & E2 & E3 --> T2
    H1 & H2 --> T2

    class S1,S2,S3 presentation;
    class H1,H2,H3,H4,H5,H6 logic;
    class C1,C2,C3,C4,C5,C6 components;
    class E1,E2,E3,U1,U2,U3,U4,T1,T2 core;
```

---

### Diagrama de Casos de Uso

```mermaid
graph LR
    classDef actor fill:#0d1117,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef usecase fill:#1a2130,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef system fill:#151b23,stroke:#10b981,stroke-width:2px,color:#fff;

    Estudiante(["👤 Estudiante"])

    subgraph SYS ["Sistema SimuMath"]
        UC1["📖 Ver teoría del método"]
        UC2["📊 Expandir/Colapsar sección"]
        UC3["🎯 Seleccionar nivel de ejercicio"]
        UC4["✅ Resolver pasos del quiz"]
        UC5["🔢 Ingresar expresión f(x)"]
        UC6["⚙️ Configurar parámetros a, b, n"]
        UC7["🧮 Calcular integral numérica"]
        UC8["📈 Visualizar gráfica del área"]
        UC9["📋 Ver pasos de resolución detallados"]
        UC10["🏆 Navegar al método calculadora"]
    end

    Estudiante --> UC1
    Estudiante --> UC3
    Estudiante --> UC5
    UC1 --> UC2
    UC3 --> UC4
    UC4 --> UC10
    UC5 --> UC6
    UC6 --> UC7
    UC7 --> UC8
    UC7 --> UC9

    class Estudiante actor;
    class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8,UC9,UC10 usecase;
```

---

### Diagrama de Flujo de Cálculo

```mermaid
flowchart TD
    classDef start fill:#10b981,stroke:#065f46,color:#fff;
    classDef process fill:#1a2130,stroke:#3b82f6,color:#fff;
    classDef decision fill:#151b23,stroke:#f59e0b,color:#fff;
    classDef error fill:#1a2130,stroke:#e53935,color:#fff;
    classDef result fill:#0d1117,stroke:#8b5cf6,color:#fff;

    A([▶ Usuario presiona CALCULAR]):::start
    B[sanitizeExpression\nsenx → sinx, LaTeX → mathjs]:::process
    C{¿Parámetros\nválidos?}:::decision
    D[❌ Mostrar error\nnúmeros inválidos]:::error
    E{Seleccionar\nmétodo}:::decision
    F[calculateTrapecio\nh/2 · f₀ + fₙ + 2Σfᵢ]:::process
    G[calculateSimpson\nh/3 · f₀ + fₙ + 4Σimp + 2Σpar]:::process
    H[calculateRomberg\nExtrapolación de Richardson]:::process
    I[Generar pasos LaTeX\nhighlightTex con theme.success]:::process
    J[CalculationResult\nvalue + steps + bounds]:::result
    K[Renderizar LatexRenderer\npor cada paso]:::process
    L[Renderizar AreaGraph\nSVG con mapX, mapY]:::process

    A --> B --> C
    C -- No --> D
    C -- Sí --> E
    E -- trapecio --> F
    E -- simpson --> G
    E -- romberg --> H
    F & G & H --> I --> J
    J --> K & L
```

---

### Diagrama de Componentes

```mermaid
graph TB
    classDef screen fill:#1a2130,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef hook fill:#151b23,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef comp fill:#1a2130,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef util fill:#0d1117,stroke:#f59e0b,stroke-width:2px,color:#fff;

    subgraph CS ["CalculatorScreen"]
        CS_S[CalculatorScreen.tsx]:::screen
        CS_H[useCalculatorScreen]:::hook
        CS_C1[CalculatorForm]:::comp
        CS_C2[CalculatorResult]:::comp
    end

    subgraph TS ["TutorScreen"]
        TS_S[TutorScreen.tsx]:::screen
        TS_H1[useTutorScreen]:::hook
        TS_H2[useQuizSteps]:::hook
        TS_C1[TutorHeader]:::comp
        TS_C2[ExerciseMap]:::comp
        TS_C3[ExerciseCard]:::comp
        TS_C4[QuizStep]:::comp
        TS_U[exerciseMath.ts]:::util
    end

    subgraph TH ["TheoryScreen"]
        TH_S[TheoryScreen.tsx]:::screen
        TH_H[useTheoryScreen]:::hook
        TH_C1[MethodCard]:::comp
        TH_C2[LevelView]:::comp
    end

    CS_S --> CS_H & CS_C1 & CS_C2
    TS_S --> TS_H1 & TS_H2
    TS_S --> TS_C1 & TS_C2 & TS_C3
    TS_C3 --> TS_C4
    TS_H2 --> TS_U
    TH_S --> TH_H & TH_C1
    TH_C1 --> TH_C2
```

---

### Diagrama de Estados (Quiz)

```mermaid
stateDiagram-v2
    [*] --> Inactivo : Seleccionar ejercicio
    Inactivo --> Paso1Activo : resetQuiz()

    Paso1Activo --> Paso1Incorrecto : validateStep(1) → ❌
    Paso1Incorrecto --> Paso1Activo : clearWrong (1.5s)
    Paso1Activo --> Paso2Activo : validateStep(1) → ✅

    Paso2Activo --> Paso2Incorrecto : validateStep(2) → ❌
    Paso2Incorrecto --> Paso2Activo : clearWrong (1.5s)
    Paso2Activo --> Paso3Activo : validateStep(2) → ✅

    Paso3Activo --> Paso3Incorrecto : validateStep(3) → ❌
    Paso3Incorrecto --> Paso3Activo : clearWrong (1.5s)
    Paso3Activo --> Paso4Activo : validateStep(3) → ✅

    Paso4Activo --> Paso4Incorrecto : validateStep(4) → ❌
    Paso4Incorrecto --> Paso4Activo : clearWrong (1.5s)
    Paso4Activo --> Completado : validateStep(4) → ✅

    Completado --> [*] : goToSolve() / selectExercise()
```

---

### Diagrama de Secuencia

```mermaid
sequenceDiagram
    actor Estudiante
    participant Screen as CalculatorScreen
    participant Hook as useCalculator
    participant Keyboard as MathKeyboard
    participant Engine as Engine Methods
    participant Renderer as LatexRenderer

    Estudiante->>Screen: Abre la pantalla
    Screen->>Hook: useCalculator()
    Hook-->>Screen: { expression, result, loading... }

    Estudiante->>Screen: Toca campo de expresión
    Screen->>Keyboard: Muestra Modal con MathKeyboard
    Estudiante->>Keyboard: Presiona tecla (ej. "sin(")
    Keyboard->>Hook: insertAtCursor("sin(")
    Hook->>Hook: applyInsertion() → sin() + cursor en pos 4
    Hook-->>Screen: expression actualizada

    Estudiante->>Screen: Presiona CALCULAR
    Screen->>Hook: calculate()
    Hook->>Hook: sanitizeExpression()
    Hook->>Engine: calculateTrapecio(expr, a, b, n)
    Engine->>Engine: evaluate() × n puntos
    Engine-->>Hook: CalculationResult { value, steps }
    Hook-->>Screen: result disponible

    Screen->>Renderer: LatexRenderer para cada step.latex
    Renderer-->>Estudiante: Fórmula renderizada visualmente
```

---

## 📁 Estructura de Carpetas

```
📁 src/
├── 📁 components/
│   ├── 📁 calculator/
│   │   ├── 📁 components/      # KeyButton
│   │   ├── 📁 config/          # keyboard.config.ts
│   │   ├── 📁 hooks/           # useMathKeyboard
│   │   ├── MathKeyboard.tsx
│   │   └── MathKeyboard.styles.ts
│   ├── 📁 graph/
│   │   ├── 📁 hooks/           # useAreaGraph
│   │   ├── 📁 utils/           # graphMath, graphMapping
│   │   ├── AreaGraph.tsx
│   │   ├── AreaGraph.styles.ts
│   │   └── AreaGraph.types.ts
│   ├── 📁 latex/
│   │   ├── 📁 hooks/           # useLatexRenderer
│   │   ├── 📁 utils/           # katexTemplate
│   │   ├── LatexRenderer.tsx
│   │   ├── LatexRenderer.web.tsx
│   │   ├── LatexRenderer.styles.ts
│   │   └── LatexRenderer.types.ts
│   └── 📁 shared/
│       ├── 📁 config/          # brand.config.ts
│       ├── BrandHeader.tsx
│       └── BrandHeader.styles.ts
├── 📁 engine/
│   ├── 📁 methods/             # trapecio, simpson, romberg
│   └── 📁 utils/               # latexFormatter
├── 📁 hooks/
│   ├── 📁 utils/               # expressionSanitizer, cursorManager
│   ├── useCalculator.ts
│   └── useExpressionInput.ts
├── 📁 screens/
│   ├── 📁 calculator/
│   │   ├── 📁 components/      # CalculatorForm, CalculatorResult
│   │   ├── 📁 hooks/           # useCalculatorScreen
│   │   ├── CalculatorScreen.tsx
│   │   └── CalculatorScreen.styles.ts
│   ├── 📁 exercises/
│   │   ├── 📁 components/      # TutorHeader, ExerciseMap, ExerciseCard, QuizStep
│   │   ├── 📁 hooks/           # useTutorScreen, useQuizSteps
│   │   ├── 📁 utils/           # exerciseMath
│   │   ├── TutorScreen.tsx
│   │   └── TutorScreen.styles.ts
│   └── 📁 learn/
│       ├── 📁 components/      # MethodCard, LevelView
│       ├── 📁 hooks/           # useTheoryScreen
│       ├── TheoryScreen.tsx
│       └── TheoryScreen.styles.ts
├── 📁 data/
│   ├── 📁 exercises/           # trapecio, simpson, romberg + types
│   └── 📁 theory/              # trapecio, simpson, romberg + types
├── 📁 store/
│   ├── 📁 slices/              # calculatorSlice
│   ├── hooks.ts                # useAppDispatch, useAppSelector
│   └── index.ts
├── 📁 theme/
│   └── index.ts                # Design system: colores, spacing, fonts
└── 📁 types/
    └── index.ts                # Method, CalculationResult, CalculatorState...
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos previos

- [Node.js](https://nodejs.org/) v18+
- [Expo CLI](https://expo.dev/) instalado globalmente
- [Expo Go](https://expo.dev/go) en tu dispositivo móvil (opcional)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Santiago-Rueda-Q/SimuMath.git
cd SimuMath
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en desarrollo

```bash
npx expo start
```

Luego escanea el QR con **Expo Go** en tu dispositivo, o presiona:
- `a` → Android Emulator
- `i` → iOS Simulator
- `w` → Navegador Web

### 4. Build de producción

```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

---

## 👥 Autores

Desarrollado por **Santiago Rueda Q**.

<p align="center">
  <a href="https://github.com/Santiago-Rueda-Q">
    <img src="https://github.com/Santiago-Rueda-Q.png?size=150" alt="Santiago Rueda Q" style="border-radius: 50%"/>
  </a>
</p>

**Sirley Sofía Molina León**

---

<p align="center">
  Hecho con ❤️ para los estudiantes de Ingeniería de Software de la FESC.<br/>
  <sub>© 2026 SimuMath – Plataforma de Apoyo de Estudio</sub>
</p>
