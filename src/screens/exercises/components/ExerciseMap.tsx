import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../TutorScreen.styles';

interface Props {
  currentLevel: number;
  onSelect: (level: number) => void;
}

export default function ExerciseMap({ currentLevel, onSelect }: Props) {
  return (
    <View style={styles.exerciseMap}>
      <View style={styles.mapRow}>
        {Array.from({ length: 10 }).map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.levelCircle, currentLevel === i + 1 && styles.activeLevelCircle]}
            onPress={() => onSelect(i + 1)}
          >
            <Text style={[styles.levelText, currentLevel === i + 1 && styles.activeLevelText]}>
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
