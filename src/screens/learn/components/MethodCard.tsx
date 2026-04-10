import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MethodTheory } from '../../../data/theory';
import { styles } from '../TheoryScreen.styles';
import LevelView from './LevelView';

interface Props {
  method: MethodTheory;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export default function MethodCard({ method, isExpanded, onToggle }: Props) {
  return (
    <View style={styles.methodCard}>
      <TouchableOpacity
        style={styles.methodHeader}
        onPress={() => onToggle(method.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.methodTitle}>{method.name}</Text>
        <View style={styles.diamondBtn}>
          <Text style={styles.diamondIcon}>{isExpanded ? '✕' : '◇'}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.theoryBody}>
          {method.levels.map((level, idx) => (
            <LevelView key={idx} level={level} />
          ))}
        </View>
      )}
    </View>
  );
}
