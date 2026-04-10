import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../TutorScreen.styles';
import { theme } from '../../../theme';

interface InputLineProps {
  label: string; value: string; placeholder: string;
  isWrong: boolean; isCorrect: boolean;
  onChange: (v: string) => void;
}

const InputLine = ({ label, value, placeholder, isWrong, isCorrect, onChange }: InputLineProps) => (
  <View style={styles.stepInputRow}>
    <Text style={styles.stepLabel}>{label}</Text>
    <TextInput
      style={[styles.quizInput, isWrong && { borderColor: theme.colors.error }]}
      value={value} onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.grey[400]}
      keyboardType="numeric" editable={!isCorrect}
    />
  </View>
);

interface QuizStepProps {
  title: string;
  stepNum: number;
  isCorrect: boolean;
  isWrong: boolean;
  visible: boolean;
  successText?: string;
  errorText?: string;
  inputs: { label: string; value: string; placeholder: string; onChange: (v: string) => void }[];
  onValidate: () => void;
}

export default function QuizStep({
  title, stepNum, isCorrect, isWrong, visible,
  successText, errorText, inputs, onValidate,
}: QuizStepProps) {
  if (!visible) return null;

  return (
    <View style={[
      styles.quizStep,
      isCorrect && styles.quizStepDone,
      isWrong && { borderColor: theme.colors.error, backgroundColor: theme.colors.error + '10' }
    ]}>
      <Text style={[styles.stepTitle, isWrong && { color: theme.colors.error }]}>{title}</Text>

      {inputs.map((inp, idx) => (
        <InputLine key={idx} {...inp} isWrong={isWrong} isCorrect={isCorrect} />
      ))}

      {!isCorrect && (
        <View style={[{ alignSelf: 'flex-end', marginTop: 6 }]}>
          <TouchableOpacity
            style={[styles.checkBtn, isWrong && { backgroundColor: theme.colors.error }]}
            onPress={onValidate}
          >
            <MaterialCommunityIcons
              name={isWrong ? 'close' : 'check'}
              size={20} color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      )}

      {isWrong   && <Text style={{ color: theme.colors.error, fontSize: 11, marginTop: 5 }}>{errorText}</Text>}
      {isCorrect && <Text style={styles.successText}>{successText}</Text>}
    </View>
  );
}
