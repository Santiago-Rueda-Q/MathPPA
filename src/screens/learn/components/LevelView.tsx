import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TheoryLevel } from '../../../data/theory';
import { styles } from '../TheoryScreen.styles';
import { theme } from '../../../theme';
import LatexRenderer from '../../../components/latex/LatexRenderer';

const ITEM_ICON_DEFAULTS: Record<string, string> = {
  point:   'chevron-right',
  tip:     'lightbulb-outline',
  warning: 'alert-octagon-outline',
};

export default function LevelView({ level }: { level: TheoryLevel }) {
  return (
    <View style={styles.levelSection}>
      <Text style={styles.levelHeader}>{level.title}</Text>

      {level.subTitle && (
        <View style={styles.levelSubTitle}>
          <Text style={{ color: theme.colors.text.primary, fontWeight: '800' }}>{level.subTitle}</Text>
        </View>
      )}

      {level.items.map((item, idx) => {
        switch (item.type) {
          case 'text':
            return <Text key={idx} style={styles.textItem}>{item.content}</Text>;

          case 'latex':
            return (
              <View key={idx} style={{ marginVertical: 10 }}>
                <LatexRenderer latex={item.content} fontSize={16} center color={theme.colors.info} />
              </View>
            );

          case 'point':
            return (
              <View key={idx} style={styles.pointRow}>
                <MaterialCommunityIcons name={(item.icon as any) || ITEM_ICON_DEFAULTS.point} size={18} color={theme.colors.success} />
                <Text style={styles.pointText}>{item.content}</Text>
              </View>
            );

          case 'tip':
            return (
              <View key={idx} style={styles.tipItem}>
                <MaterialCommunityIcons name={(item.icon as any) || ITEM_ICON_DEFAULTS.tip} size={20} color={theme.colors.success} style={{ marginRight: 8 }} />
                <Text style={styles.tipText}>{item.content}</Text>
              </View>
            );

          case 'warning':
            return (
              <View key={idx} style={styles.warningItem}>
                <MaterialCommunityIcons name={(item.icon as any) || ITEM_ICON_DEFAULTS.warning} size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
                <Text style={styles.warningText}>{item.content}</Text>
              </View>
            );

          default:
            return null;
        }
      })}
    </View>
  );
}
