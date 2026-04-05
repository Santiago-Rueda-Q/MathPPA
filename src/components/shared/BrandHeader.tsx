import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { theme } from '../../theme';

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.appName}>PPA</Text>
        <Text style={styles.tagline}>Matemáticas Interactivas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.colors.glass,
  },
  textContainer: {
    marginLeft: theme.spacing.md,
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
