import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BrandHeader from '../../components/shared/BrandHeader';
import LatexRenderer from '../../components/latex/LatexRenderer';
import { styles } from './TheoryScreen.styles';
import { theoryData, TheoryLevel } from '../../data/theory';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LevelView = ({ level }: { level: TheoryLevel }) => (
  <View style={styles.levelSection}>
    <Text style={styles.levelHeader}>{level.title}</Text>
    {level.subTitle && (
      <View style={styles.levelSubTitle}>
          <Text style={{color: '#FFFFFF', fontWeight: '800'}}>{level.subTitle}</Text>
      </View>
    )}
    {level.items.map((item, idx) => {
      switch (item.type) {
        case 'text':
          return <Text key={idx} style={styles.textItem}>{item.content}</Text>;
        case 'latex':
          return <View key={idx} style={{marginVertical: 10}}><LatexRenderer latex={item.content} fontSize={16} center color="#38BDF8" /></View>;
        case 'point':
          return (
            <View key={idx} style={styles.pointRow}>
              <MaterialCommunityIcons name={item.icon as any || 'chevron-right'} size={18} color="#10B981" />
              <Text style={styles.pointText}>{item.content}</Text>
            </View>
          );
        case 'tip':
          return (
            <View key={idx} style={styles.tipItem}>
              <MaterialCommunityIcons name={item.icon as any || 'lightbulb-outline'} size={20} color="#10B981" style={{marginRight: 8}} />
              <Text style={styles.tipText}>{item.content}</Text>
            </View>
          );
        case 'warning':
          return (
            <View key={idx} style={styles.warningItem}>
              <MaterialCommunityIcons name={item.icon as any || 'alert-octagon-outline'} size={20} color="#EF4444" style={{marginRight: 8}} />
              <Text style={styles.warningText}>{item.content}</Text>
            </View>
          );
        default:
          return null;
      }
    })}
  </View>
);

export default function TheoryScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <BrandHeader />
        <Text style={styles.subtitle}>Profundiza en los fundamentos técnicos de cada método</Text>

        {theoryData.map((method) => (
          <View key={method.id} style={styles.methodCard}>
            <TouchableOpacity 
              style={styles.methodHeader}
              onPress={() => toggleExpand(method.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.methodTitle}>{method.name}</Text>
              <View style={styles.diamondBtn}>
                <Text style={styles.diamondIcon}>{expandedId === method.id ? '✕' : '◇'}</Text>
              </View>
            </TouchableOpacity>

            {expandedId === method.id && (
              <View style={styles.theoryBody}>
                {method.levels.map((level, idx) => (
                  <LevelView key={idx} level={level} />
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
