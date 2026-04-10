import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from './TheoryScreen.styles';
import { theoryData } from '../../data/theory';
import { useTheoryScreen } from './hooks/useTheoryScreen';
import BrandHeader from '../../components/shared/BrandHeader';
import MethodCard from './components/MethodCard';

export default function TheoryScreen() {
  const { expandedId, toggleExpand } = useTheoryScreen();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <BrandHeader />
        <Text style={styles.subtitle}>Profundiza en los fundamentos técnicos de cada método</Text>

        {theoryData.map(method => (
          <MethodCard
            key={method.id}
            method={method}
            isExpanded={expandedId === method.id}
            onToggle={toggleExpand}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
