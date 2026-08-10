import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import ScreenContainer from '../components/common/ScreenContainer';
import { COLORS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');
const cardMargin = 8;
const cardWidth = (width - 32 - (cardMargin * 2)) / 2;

function MenuButton({ imageSource, onPress, style }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
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

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardTouchable}
      >
        <Image
          source={imageSource}
          style={styles.menuImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <ScreenContainer backgroundImage={require('../../Asset/defaultbg.png')}>
      {/* Header Banner - BERANDA */}
      <View style={styles.bannerWrapper}>
        <Image
          source={require('../../Asset/iconberanda.png')}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

      {/* Greeting Slogan Box */}
      <View style={styles.greetingBox}>
        <Text style={styles.greetingText}>
          HALO BUNDA, YUK CEK KECUKUPAN GIZI MAKANAN SI KECIL HARI INI!
        </Text>
      </View>

      {/* 2x2 Grid Menu with Normalized Aspect Ratio */}
      <View style={styles.gridContainer}>
        {/* Row 1: INFORMASI & SMAD */}
        <View style={styles.gridRow}>
          <MenuButton
            imageSource={require('../../assets/cards/informasi.png')}
            onPress={() => navigation.navigate('Information')}
            style={{ width: cardWidth }}
          />
          <MenuButton
            imageSource={require('../../assets/cards/SMAD.png')}
            onPress={() => navigation.navigate('SmadCheck')}
            style={{ width: cardWidth }}
          />
        </View>

        {/* Row 2: KALKULATOR STUNTING & KUISIONER */}
        <View style={styles.gridRow}>
          <MenuButton
            imageSource={require('../../assets/cards/kalkulator.png')}
            onPress={() => navigation.navigate('StuntingCalculator')}
            style={{ width: cardWidth }}
          />
          <MenuButton
            imageSource={require('../../assets/cards/kuisioner.png')}
            onPress={() => navigation.navigate('Questionnaire')}
            style={{ width: cardWidth }}
          />
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.footerBox}>
        <View style={styles.footerBadge}>
          <Text style={styles.footerText}>
            E-MP ASI SMAD • Kemenkes RI & Poltekkes Jakarta III
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  bannerImage: {
    width: Math.min(width - 32, 360),
    height: 72,
    aspectRatio: 773 / 172,
  },
  greetingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#C6E3F4',
    ...SHADOWS.cardFloating,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textTitle,
    textAlign: 'center',
    lineHeight: 19,
    letterSpacing: 0.3,
  },
  gridContainer: {
    marginVertical: 4,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTouchable: {
    width: '100%',
    aspectRatio: 440 / 410,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  menuImage: {
    width: '100%',
    height: '100%',
  },
  footerBox: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
});
