import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import ScreenContainer from '../components/common/ScreenContainer';
import StickyCard from '../components/custom/StickyCard';
import { COLORS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - 44) / 2;

export default function HomeScreen({ navigation }) {
  return (
    <ScreenContainer backgroundImage={require('../../Asset/defaultbg.png')}>
      {/* Header Banner - BERANDA */}
      <View style={styles.bannerContainer}>
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

      {/* 2x2 Grid Menu */}
      <View style={styles.gridContainer}>
        {/* Row 1 */}
        <View style={styles.gridRow}>
          {/* Menu 1: INFORMASI */}
          <StickyCard
            onPress={() => navigation.navigate('Information')}
            style={[styles.menuCard, { width: cardWidth }]}
            tapePositions={['top-left', 'top-right']}
          >
            <View style={styles.cardContent}>
              <Image
                source={require('../../Asset/informasi.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>
          </StickyCard>

          {/* Menu 2: SMAD */}
          <StickyCard
            onPress={() => navigation.navigate('SmadCheck')}
            style={[styles.menuCard, { width: cardWidth }]}
            tapePositions={['top-left', 'top-right']}
          >
            <View style={styles.cardContent}>
              <Image
                source={require('../../Asset/SMAD.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>
          </StickyCard>
        </View>

        {/* Row 2 */}
        <View style={styles.gridRow}>
          {/* Menu 3: KALKULATOR STUNTING */}
          <StickyCard
            onPress={() => navigation.navigate('StuntingCalculator')}
            style={[styles.menuCard, { width: cardWidth }]}
            tapePositions={['top-left', 'top-right']}
          >
            <View style={styles.cardContent}>
              <Image
                source={require('../../Asset/kalkulator.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>
          </StickyCard>

          {/* Menu 4: KUISIONER */}
          <StickyCard
            onPress={() => navigation.navigate('Questionnaire')}
            style={[styles.menuCard, { width: cardWidth }]}
            tapePositions={['top-left', 'top-right']}
          >
            <View style={styles.cardContent}>
              <Image
                source={require('../../Asset/kuisioner.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>
          </StickyCard>
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.footerBox}>
        <Text style={styles.footerText}>
          E-MP ASI SMAD • Kemenkes RI & Poltekkes Kemenkes Jakarta III
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  bannerImage: {
    width: width - 32,
    height: 70,
  },
  greetingBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CBE5F5',
    ...SHADOWS.card,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textTitle,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  gridContainer: {
    marginVertical: 4,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuCard: {
    marginVertical: 4,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  footerBox: {
    marginTop: 18,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
