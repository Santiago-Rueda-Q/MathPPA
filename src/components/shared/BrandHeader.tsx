import React from 'react';
import { View, Image, Text } from 'react-native';
import { styles } from './BrandHeader.styles';
import { BRAND_CONFIG } from './config/brand.config';

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <Image 
        source={BRAND_CONFIG.logoPath} 
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.appName}>{BRAND_CONFIG.appName}</Text>
        <Text style={styles.tagline}>{BRAND_CONFIG.tagline}</Text>
      </View>
    </View>
  );
}
