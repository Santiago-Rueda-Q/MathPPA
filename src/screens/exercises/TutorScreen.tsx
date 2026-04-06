import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './TutorScreen.styles';
import { theme } from '../../theme';
import { trapecioExercises } from '../../data/exercises/trapecio';
import { simpsonExercises } from '../../data/exercises/simpson';
import { rombergExercises } from '../../data/exercises/romberg';
import { Exercise } from '../../data/exercises/types';
import { parse, evaluate } from 'mathjs';
import AreaGraph from '../../components/graph/AreaGraph';
import LatexRenderer from '../../components/latex/LatexRenderer';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatBound = (val: number) => {
  if (Math.abs(val - Math.PI) < 0.0001) return '\\pi';
  if (Math.abs(val - (Math.PI/2)) < 0.0001) return '\\frac{\\pi}{2}';
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(2);
};

const getLatexExpression = (expr: string) => {
  try {
    let tex = parse(expr).toTex();
    // Transform \exp(...) into e^{...} with proper spacing to avoid \cdote
    tex = tex.replace(/\\exp\s*\\left\((.*?)\\right\)/g, ' e^{$1} ');
    tex = tex.replace(/\\exp\s*\((.*?)\)/g, ' e^{$1} ');
    tex = tex.replace(/\\exp/g, ' e^ '); 
    return tex;
  } catch {
    return expr;
  }
};

const methods = [
  { id: 'trapecio', name: 'Trapecio', data: trapecioExercises },
  { id: 'simpson', name: 'Simpson 1/3', data: simpsonExercises },
  { id: 'romberg', name: 'Romberg', data: rombergExercises }
];

export default function TutorScreen({ navigation }: any) {
  const [selectedMethod, setSelectedMethod] = useState(methods[0]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(trapecioExercises[0]);
  
  // Interactive Steps Logic
  const [activeStep, setActiveStep] = useState(1);
  const [stepInputs, setStepInputs] = useState({
    h: '',
    fa: '',
    fb: '',
    sum: '',
    result: ''
  });
  const [isStepCorrect, setIsStepCorrect] = useState([false, false, false, false, false]);
  const [isStepWrong, setIsStepWrong] = useState([false, false, false, false, false]);

  const selectExercise = (level: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const ex = selectedMethod.data.find(e => e.level === level);
    if (ex) {
      setSelectedExercise(ex);
      setCurrentLevel(level);
      setActiveStep(1);
      setStepInputs({ h: '', fa: '', fb: '', sum: '', result: '' });
      setIsStepCorrect([false, false, false, false, false]);
      setIsStepWrong([false, false, false, false, false]);
    }
  };

  const goToSolve = () => {
    if (selectedExercise) {
      navigation.navigate('Calculadora', { 
         exercise: selectedExercise,
         method: selectedMethod.id 
      });
    }
  };

  const calculateAnswers = () => {
    if (!selectedExercise) return { h: 0, fa: 0, fb: 0, sum: 0, result: 0 };
    try {
      const f = (x: number) => evaluate(selectedExercise.expression, { x });
      const h = (selectedExercise.b - selectedExercise.a) / selectedExercise.n;
      const fa = f(selectedExercise.a);
      const fb = f(selectedExercise.b);
      let sum = 0;
      
      if (selectedMethod.id === 'trapecio') {
        for (let i = 1; i < selectedExercise.n; i++) {
          sum += f(selectedExercise.a + i * h);
        }
        const result = (h / 2) * (fa + fb + 2 * sum);
        return { h, fa, fb, sum, result };
      } else if (selectedMethod.id === 'simpson') {
        // Simpson 1/3 Rule
        let sumOdd = 0;
        let sumEven = 0;
        for (let i = 1; i < selectedExercise.n; i++) {
          const val = f(selectedExercise.a + i * h);
          if (i % 2 === 0) sumEven += val;
          else sumOdd += val;
        }
        const result = (h / 3) * (fa + fb + 4 * sumOdd + 2 * sumEven);
        return { h, fa, fb, sum: 4 * sumOdd + 2 * sumEven, result };
      } else {
         // Romberg (Using trapezoid for the quiz simplicity)
         for (let i = 1; i < selectedExercise.n; i++) {
           sum += f(selectedExercise.a + i * h);
         }
         const result = (h / 2) * (fa + fb + 2 * sum);
         return { h, fa, fb, sum, result };
      }
    } catch {
      return { h: 0, fa: 0, fb: 0, sum: 0, result: 0 };
    }
  };

  const answers = calculateAnswers();

  const validateStep = (stepNum: number) => {
    const margin = 0.01;
    let correct = false;
    
    if (stepNum === 1) {
       correct = Math.abs(parseFloat(stepInputs.h) - answers.h) < margin;
    } else if (stepNum === 2) {
       const faOk = Math.abs(parseFloat(stepInputs.fa) - answers.fa) < margin;
       const fbOk = Math.abs(parseFloat(stepInputs.fb) - answers.fb) < margin;
       correct = faOk && fbOk;
    } else if (stepNum === 3) {
       correct = Math.abs(parseFloat(stepInputs.sum) - answers.sum) < margin;
    } else if (stepNum === 4) {
       correct = Math.abs(parseFloat(stepInputs.result) - answers.result) < margin;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (correct) {
      const newStatus = [...isStepCorrect];
      newStatus[stepNum] = true;
      setIsStepCorrect(newStatus);
      const newWrong = [...isStepWrong];
      newWrong[stepNum] = false;
      setIsStepWrong(newWrong);
      if (activeStep === stepNum && activeStep < 4) {
        setActiveStep(stepNum + 1);
      }
    } else {
      const newWrong = [...isStepWrong];
      newWrong[stepNum] = true;
      setIsStepWrong(newWrong);
      
      // Auto-reset error after a short delay or on next input
      setTimeout(() => {
        setIsStepWrong(prev => {
          const reset = [...prev];
          reset[stepNum] = false;
          return reset;
        });
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ruta de Aprendizaje</Text>
        <Text style={styles.subtitle}>Supera los 10 niveles por cada método numérico</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pathSelector}>
          {methods.map(m => (
            <TouchableOpacity 
              key={m.id} 
              style={[styles.pathTab, selectedMethod.id === m.id && styles.activePathTab]}
              onPress={() => setSelectedMethod(m)}
            >
              <Text style={[styles.pathTabText, selectedMethod.id === m.id && styles.activePathTabText]}>
                {m.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={styles.exerciseMap}>
          <View style={styles.mapRow}>
            {Array.from({ length: 10 }).map((_, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.levelCircle, currentLevel === i + 1 && styles.activeLevelCircle]}
                onPress={() => selectExercise(i + 1)}
              >
                <Text style={[styles.levelText, currentLevel === i + 1 && styles.activeLevelText]}>
                  {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedExercise && (
          <View style={styles.exerciseCard}>
            {/* Progress Bar */}
            <View style={{ height: 4, backgroundColor: '#222', borderRadius: 2, marginBottom: 15, flexDirection: 'row', overflow: 'hidden' }}>
              <View style={{ width: `${(activeStep / 4) * 100}%`, backgroundColor: theme.colors.primary, height: '100%' }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
               <Text style={styles.exTitle}>Nivel {selectedExercise.level}: {selectedExercise.title}</Text>
               <MaterialCommunityIcons 
                 name={isStepCorrect[4] ? "trophy" : "trophy-outline"} 
                 size={24} 
                 color={isStepCorrect[4] ? "#FFB300" : theme.colors.accent} 
               />
            </View>
            
            <Text style={styles.exDesc}>{selectedExercise.description}</Text>
            
            <View style={{ marginVertical: 15 }}>
               <LatexRenderer 
                 latex={`\\int_{${formatBound(selectedExercise.a)}}^{${formatBound(selectedExercise.b)}} ${getLatexExpression(selectedExercise.expression)} \\, dx`} 
                 fontSize={22} 
                 center 
                 color={theme.colors.primary}
               />
            </View>

            <View style={{ marginTop: 10 }}>
               <View style={[
                   styles.quizStep, 
                   activeStep >= 1 && { opacity: 1 }, 
                   isStepCorrect[1] && styles.quizStepDone,
                   isStepWrong[1] && { borderColor: theme.colors.error, backgroundColor: theme.colors.error + '10' }
               ]}>
                  <Text style={[styles.stepTitle, isStepWrong[1] && { color: theme.colors.error }]}>
                    PASO 1: Calcular h (tamaño del paso)
                  </Text>
                  <View style={styles.stepInputRow}>
                     <Text style={styles.stepLabel}>h = </Text>
                     <TextInput 
                       style={[styles.quizInput, isStepWrong[1] && { borderColor: theme.colors.error }]} 
                       value={stepInputs.h}
                       onChangeText={v => {
                         setStepInputs({...stepInputs, h: v});
                         const reset = [...isStepWrong]; reset[1] = false; setIsStepWrong(reset);
                       }}
                       placeholder="0.00" placeholderTextColor="#444"
                       keyboardType="numeric"
                       editable={!isStepCorrect[1]}
                     />
                     {!isStepCorrect[1] && (
                       <TouchableOpacity 
                         style={[styles.checkBtn, isStepWrong[1] && { backgroundColor: theme.colors.error }]} 
                         onPress={() => validateStep(1)}
                       >
                          <MaterialCommunityIcons name={isStepWrong[1] ? "close" : "check"} size={20} color="#FFF" />
                       </TouchableOpacity>
                     )}
                  </View>
                  {isStepWrong[1] && <Text style={{ color: theme.colors.error, fontSize: 11, marginTop: 5 }}>¡Valor incorrecto! Revisa la fórmula h=(b-a)/n</Text>}
                  {isStepCorrect[1] && <Text style={styles.successText}>¡Correcto! h = {answers.h.toFixed(2)}</Text>}
               </View>

               {activeStep >= 2 && (
                 <View style={[
                     styles.quizStep, 
                     isStepCorrect[2] && styles.quizStepDone,
                     isStepWrong[2] && { borderColor: theme.colors.error, backgroundColor: theme.colors.error + '10' }
                 ]}>
                    <Text style={[styles.stepTitle, isStepWrong[2] && { color: theme.colors.error }]}>PASO 2: Evaluar extremos</Text>
                    <View style={styles.stepInputRow}>
                       <Text style={styles.stepLabel}>f(a) = </Text>
                       <TextInput 
                         style={[styles.quizInput, isStepWrong[2] && { borderColor: theme.colors.error }]} 
                         value={stepInputs.fa}
                         onChangeText={v => {
                            setStepInputs({...stepInputs, fa: v});
                            const reset = [...isStepWrong]; reset[2] = false; setIsStepWrong(reset);
                         }}
                         placeholder="f(a)" placeholderTextColor="#444"
                         keyboardType="numeric"
                         editable={!isStepCorrect[2]}
                       />
                    </View>
                    <View style={[styles.stepInputRow, { marginTop: 8 }]}>
                       <Text style={styles.stepLabel}>f(b) = </Text>
                       <TextInput 
                         style={[styles.quizInput, isStepWrong[2] && { borderColor: theme.colors.error }]} 
                         value={stepInputs.fb}
                         onChangeText={v => {
                            setStepInputs({...stepInputs, fb: v});
                            const reset = [...isStepWrong]; reset[2] = false; setIsStepWrong(reset);
                         }}
                         placeholder="f(b)" placeholderTextColor="#444"
                         keyboardType="numeric"
                         editable={!isStepCorrect[2]}
                       />
                       {!isStepCorrect[2] && (
                         <TouchableOpacity 
                           style={[styles.checkBtn, isStepWrong[2] && { backgroundColor: theme.colors.error }]} 
                           onPress={() => validateStep(2)}
                         >
                            <MaterialCommunityIcons name={isStepWrong[2] ? "close" : "check"} size={20} color="#FFF" />
                         </TouchableOpacity>
                       )}
                    </View>
                    {isStepWrong[2] && <Text style={{ color: theme.colors.error, fontSize: 11, marginTop: 5 }}>¡Valores incorrectos! Evalúa f(x) en los límites</Text>}
                    {isStepCorrect[2] && <Text style={styles.successText}>¡Excelente evaluación!</Text>}
                 </View>
               )}

               {activeStep >= 3 && (
                 <View style={[
                     styles.quizStep, 
                     isStepCorrect[3] && styles.quizStepDone,
                     isStepWrong[3] && { borderColor: theme.colors.error, backgroundColor: theme.colors.error + '10' }
                 ]}>
                    <Text style={[styles.stepTitle, isStepWrong[3] && { color: theme.colors.error }]}>PASO 3: Suma de puntos intermedios</Text>
                    <View style={styles.stepInputRow}>
                       <Text style={styles.stepLabel}>Σ f(xᵢ) = </Text>
                       <TextInput 
                         style={[styles.quizInput, isStepWrong[3] && { borderColor: theme.colors.error }]} 
                         value={stepInputs.sum}
                         onChangeText={v => {
                            setStepInputs({...stepInputs, sum: v});
                            const reset = [...isStepWrong]; reset[3] = false; setIsStepWrong(reset);
                         }}
                         placeholder="Suma" placeholderTextColor="#444"
                         keyboardType="numeric"
                         editable={!isStepCorrect[3]}
                       />
                       {!isStepCorrect[3] && (
                         <TouchableOpacity 
                           style={[styles.checkBtn, isStepWrong[3] && { backgroundColor: theme.colors.error }]} 
                           onPress={() => validateStep(3)}
                         >
                            <MaterialCommunityIcons name={isStepWrong[3] ? "close" : "check"} size={20} color="#FFF" />
                         </TouchableOpacity>
                       )}
                    </View>
                    {isStepWrong[3] && <Text style={{ color: theme.colors.error, fontSize: 11, marginTop: 5 }}>¡Suma incorrecta! Revisa los puntos intermedios</Text>}
                 </View>
               )}

               {activeStep >= 4 && (
                 <View style={[
                     styles.quizStep, 
                     isStepCorrect[4] && styles.quizStepDone,
                     isStepWrong[4] && { borderColor: theme.colors.error, backgroundColor: theme.colors.error + '10' }
                 ]}>
                    <Text style={[styles.stepTitle, isStepWrong[4] && { color: theme.colors.error }]}>PASO 4: Resultado Final Integral</Text>
                    <View style={styles.stepInputRow}>
                       <Text style={styles.stepLabel}>I ≈ </Text>
                       <TextInput 
                         style={[styles.quizInput, isStepWrong[4] && { borderColor: theme.colors.error }]} 
                         value={stepInputs.result}
                         onChangeText={v => {
                            setStepInputs({...stepInputs, result: v});
                            const reset = [...isStepWrong]; reset[4] = false; setIsStepWrong(reset);
                         }}
                         placeholder="Resultado" placeholderTextColor="#444"
                         keyboardType="numeric"
                         editable={!isStepCorrect[4]}
                       />
                       {!isStepCorrect[4] && (
                         <TouchableOpacity 
                           style={[styles.checkBtn, isStepWrong[4] && { backgroundColor: theme.colors.error }]} 
                           onPress={() => validateStep(4)}
                         >
                            <MaterialCommunityIcons name={isStepWrong[4] ? "close" : "check"} size={20} color="#FFF" />
                         </TouchableOpacity>
                       )}
                    </View>
                    {isStepWrong[4] && <Text style={{ color: theme.colors.error, fontSize: 11, marginTop: 5 }}>¡Resultado incorrecto! Aplica la fórmula final</Text>}
                 </View>
               )}
            </View>

            {isStepCorrect[4] && (
               <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <MaterialCommunityIcons name="check-decagram" size={60} color={theme.colors.primary} />
                  <Text style={{ color: theme.colors.primary, fontWeight: '900', fontSize: 18, marginTop: 10 }}>¡Excelente resolución!</Text>
                  
                  <TouchableOpacity style={[styles.btnSolve, { width: '100%' }]} onPress={goToSolve}>
                    <Text style={styles.btnLabel}>VER DETALLES EN CALCULADORA</Text>
                  </TouchableOpacity>
               </View>
            )}

            <View style={{ marginTop: 20 }}>
              <AreaGraph 
                expression={selectedExercise.expression} 
                a={selectedExercise.a} 
                b={selectedExercise.b} 
                n={selectedExercise.n}
                height={140}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
