import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';
import WashiTape from './WashiTape';

export default function StickyCard({
  title,
  subtitle,
  imageSource,
  onPress,
  children,
  backgroundColor = COLORS.bgCard,
  hasTapes = true,
  tapeColor = COLORS.washiTape,
  tapePositions = ['top-left', 'top-right'],
  showLines = true,
  style,
  contentContainerStyle,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.outerContainer, style]}>
      {hasTapes && tapePositions.includes('top-left') && (
        <WashiTape position="top-left" color={tapeColor} />
      )}
      {hasTapes && tapePositions.includes('top-right') && (
        <WashiTape position="top-right" color={tapeColor} />
      )}
      {hasTapes && tapePositions.includes('bottom-left') && (
        <WashiTape position="bottom-left" color={tapeColor} />
      )}
      {hasTapes && tapePositions.includes('bottom-right') && (
        <WashiTape position="bottom-right" color={tapeColor} />
      )}

      <CardWrapper
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        style={[
          styles.card,
          { backgroundColor },
          contentContainerStyle,
        ]}
      >
        {/* Notebook Lines Effect */}
        {showLines && (
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
          </View>
        )}

        {imageSource && (
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} resizeMode="contain" />
          </View>
        )}

        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {children}
      </CardWrapper>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 8,
    position: 'relative',
  },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C6E3F4',
    overflow: 'hidden',
    ...SHADOWS.cardFloating,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.notebookLine,
    opacity: 0.45,
    marginVertical: 14,
    marginHorizontal: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 110,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textTitle,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textBody,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 18,
  },
});
