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
  
  const [hInput, setHInput] = useState('');
  const [faInput, setFaInput] = useState('');
  const [fbInput, setFbInput] = useState('');
  const [showResult, setShowResult] = useState(false);

  const selectExercise = (level: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const ex = selectedMethod.data.find(e => e.level === level);
    if (ex) {
      setSelectedExercise(ex);
      setCurrentLevel(level);
      setHInput('');
      setFaInput('');
      setFbInput('');
      setShowResult(false);
    }
  };

  const checkSubstitution = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setShowResult(true);
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
    if (!selectedExercise) return { h: 0, fa: 0, fb: 0 };
    try {
      const h = (selectedExercise.b - selectedExercise.a) / selectedExercise.n;
      const fa = evaluate(selectedExercise.expression, { x: selectedExercise.a });
      const fb = evaluate(selectedExercise.expression, { x: selectedExercise.b });
      return { h, fa, fb };
    } catch {
      return { h: 0, fa: 0, fb: 0 };
    }
  };

  const answers = calculateAnswers();

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

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
               <Text style={styles.exTitle}>Nivel {selectedExercise.level}: {selectedExercise.title}</Text>
               <MaterialCommunityIcons name="trophy-outline" size={20} color={theme.colors.accent} />
            </View>
            
            <Text style={styles.exDesc}>{selectedExercise.description}</Text>
            
            <View style={{ marginVertical: 10 }}>
               <LatexRenderer 
                 latex={`\\int_{${formatBound(selectedExercise.a)}}^{${formatBound(selectedExercise.b)}} ${getLatexExpression(selectedExercise.expression)} \\, dx`} 
                 fontSize={22} 
                 center 
                 color={theme.colors.primary}
               />
            </View>

            <View style={styles.exParams}>
               <View>
                 <Text style={styles.paramLabel}>Intervalo [a, b]</Text>
                 <Text style={styles.paramValue}>
                   {formatBound(selectedExercise.a).replace('\\', '')}, {formatBound(selectedExercise.b).replace('\\', 'π')}
                 </Text>
               </View>
               <View>
                 <Text style={styles.paramLabel}>Particiones</Text>
                 <Text style={styles.paramValue}>n = {selectedExercise.n}</Text>
               </View>
               <View>
                 <Text style={styles.paramLabel}>Dificultad</Text>
                 <Text style={[styles.paramValue, { color: theme.colors.accent }]}>
                   {selectedExercise.difficulty.toUpperCase()}
                 </Text>
               </View>
            </View>

            <View style={{ marginVertical: 20, backgroundColor: '#0D0D0D', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#222' }}>
               <Text style={{ color: theme.colors.primary, fontWeight: '900', fontSize: 13, marginBottom: 15 }}>
                 PASO 1: SUSTITUCIÓN EN LA FÓRMULA
               </Text>
               
               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: '#888', fontWeight: 'bold', width: 60 }}>h = </Text>
                  <TextInput 
                    style={[styles.quizInput, hInput !== '' && styles.quizInputActive]} 
                    placeholder="Valor h" 
                    placeholderTextColor="#444"
                    value={hInput}
                    onChangeText={setHInput}
                    keyboardType="numeric"
                  />
               </View>

               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: '#888', fontWeight: 'bold', width: 60 }}>f(a) = </Text>
                  <TextInput 
                    style={[styles.quizInput, faInput !== '' && styles.quizInputActive]} 
                    placeholder="Valor f(a)" 
                    placeholderTextColor="#444"
                    value={faInput}
                    onChangeText={setFaInput}
                    keyboardType="numeric"
                  />
               </View>

               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={{ color: '#888', fontWeight: 'bold', width: 60 }}>f(b) = </Text>
                  <TextInput 
                    style={[styles.quizInput, fbInput !== '' && styles.quizInputActive]} 
                    placeholder="Valor f(b)" 
                    placeholderTextColor="#444"
                    value={fbInput}
                    onChangeText={setFbInput}
                    keyboardType="numeric"
                  />
               </View>

               <TouchableOpacity 
                 style={{ backgroundColor: theme.colors.primary + '20', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.primary }} 
                 onPress={checkSubstitution}
               >
                  <Text style={{ color: theme.colors.primary, fontWeight: '900' }}>REVISAR VALORES</Text>
               </TouchableOpacity>

               {showResult && (
                 <View style={{ marginTop: 15, padding: 15, backgroundColor: '#1A1A1A', borderRadius: 12, borderWidth: 1, borderColor: '#333' }}>
                    <Text style={{ color: '#888', fontSize: 12, marginBottom: 5 }}>RESULTADOS ESPERADOS:</Text>
                    <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
                       h = {answers.h.toFixed(4)} | f(a) = {answers.fa.toFixed(4)} | f(b) = {answers.fb.toFixed(4)}
                    </Text>
                    <Text style={{ color: theme.colors.primary, fontSize: 13, textAlign: 'center', marginTop: 10, fontWeight: '700' }}>
                       ¿Coinciden tus resultados? ¡Ahora procésalo en la calculadora!
                    </Text>
                 </View>
               )}
            </View>

            <AreaGraph 
              expression={selectedExercise.expression} 
              a={selectedExercise.a} 
              b={selectedExercise.b} 
              n={selectedExercise.n}
              height={140}
            />

            <TouchableOpacity style={styles.btnSolve} onPress={goToSolve}>
               <Text style={styles.btnLabel}>RESOLVER EN CALCULADORA</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
