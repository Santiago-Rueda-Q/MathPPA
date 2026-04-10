import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../TutorScreen.styles';

interface Method { id: string; name: string; }
interface Props {
  selectedMethodId: string;
  methods: Method[];
  onSelect: (m: Method) => void;
}

export default function TutorHeader({ selectedMethodId, methods, onSelect }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Ruta de Aprendizaje</Text>
      <Text style={styles.subtitle}>Supera los 10 niveles por cada método numérico</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pathSelector}>
        {methods.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.pathTab, selectedMethodId === m.id && styles.activePathTab]}
            onPress={() => onSelect(m)}
          >
            <Text style={[styles.pathTabText, selectedMethodId === m.id && styles.activePathTabText]}>
              {m.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
