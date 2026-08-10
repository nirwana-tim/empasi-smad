import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../components/common/ScreenContainer';
import RibbonHeader from '../components/custom/RibbonHeader';
import StickyCard from '../components/custom/StickyCard';
import { QUESTIONNAIRE_LINKS } from '../constants/links';
import { COLORS, SHADOWS } from '../constants/theme';

export default function QuestionnaireScreen({ navigation }) {
  const handleOpenLink = async (url, title) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        toolbarColor: COLORS.primary,
        showTitle: true,
        enableBarCollapsing: true,
      });
    } catch (e) {
      // Fallback ke browser eksternal jika in-app browser gagal
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Gagal Membuka Link', 'Tidak dapat membuka tautan kuesioner.');
        }
      } catch (err) {
        Alert.alert('Gagal Membuka Link', 'Terjadi kendala saat membuka peramban web.');
      }
    }
  };

  const pretest = QUESTIONNAIRE_LINKS.pretest;
  const posttest = QUESTIONNAIRE_LINKS.posttest;

  return (
    <ScreenContainer backgroundImage={require('../../Asset/defaultbg.png')}>
      {/* Header */}
      <RibbonHeader
        title="Kuisioner Penelitian"
        subtitle="Evaluasi Program Edukasi MP-ASI SMAD"
        onBack={() => navigation.goBack()}
      />

      {/* Intro Note */}
      <View style={styles.introCard}>
        <Feather name="clipboard" size={20} color={COLORS.primaryDark} style={{ marginRight: 10 }} />
        <Text style={styles.introText}>
          Kuesioner ini digunakan untuk mengevaluasi pemahaman Bunda sebelum dan sesudah mempelajari materi pencegahan stunting pada aplikasi ini.
        </Text>
      </View>

      {/* CARD 1: PRE-TEST */}
      <StickyCard
        backgroundColor="#FFFFFF"
        hasTapes={true}
        tapePositions={['top-left', 'top-right']}
        style={styles.card}
      >
        <View style={styles.cardHeaderRow}>
          <View style={[styles.stepBadge, { backgroundColor: pretest.themeColor }]}>
            <Text style={styles.stepBadgeText}>{pretest.badgeText}</Text>
          </View>
          <Text style={styles.stepStatusText}>Wajib Diisi Awal</Text>
        </View>

        <Text style={styles.cardTitle}>{pretest.title}</Text>
        <Text style={styles.cardSubtitle}>{pretest.subtitle}</Text>
        <Text style={styles.cardDesc}>{pretest.description}</Text>

        <TouchableOpacity
          onPress={() => handleOpenLink(pretest.url, pretest.title)}
          style={[styles.openBtn, { backgroundColor: pretest.themeColor }]}
          activeOpacity={0.8}
        >
          <Feather name="external-link" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.openBtnText}>Buka Form Pre-Test</Text>
        </TouchableOpacity>
      </StickyCard>

      {/* CARD 2: POST-TEST */}
      <StickyCard
        backgroundColor="#FFFFFF"
        hasTapes={true}
        tapeColor="#27AE60"
        tapePositions={['top-left', 'top-right']}
        style={styles.card}
      >
        <View style={styles.cardHeaderRow}>
          <View style={[styles.stepBadge, { backgroundColor: posttest.themeColor }]}>
            <Text style={styles.stepBadgeText}>{posttest.badgeText}</Text>
          </View>
          <Text style={styles.stepStatusText}>Diisi Setelah Membaca</Text>
        </View>

        <Text style={styles.cardTitle}>{posttest.title}</Text>
        <Text style={styles.cardSubtitle}>{posttest.subtitle}</Text>
        <Text style={styles.cardDesc}>{posttest.description}</Text>

        <TouchableOpacity
          onPress={() => handleOpenLink(posttest.url, posttest.title)}
          style={[styles.openBtn, { backgroundColor: posttest.themeColor }]}
          activeOpacity={0.8}
        >
          <Feather name="check-square" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.openBtnText}>Buka Form Post-Test</Text>
        </TouchableOpacity>
      </StickyCard>

      {/* Bottom Guideline */}
      <View style={styles.guidelineBox}>
        <Text style={styles.guidelineTitle}>ℹ️ Petunjuk Pengisian:</Text>
        <Text style={styles.guidelineText}>
          1. Kerjakan <Text style={styles.boldText}>Pre-Test</Text> sebelum Bunda membaca fitur Informasi atau menghitung gizi di aplikasi ini.
        </Text>
        <Text style={styles.guidelineText}>
          2. Pelajari menu <Text style={styles.boldText}>Informasi</Text> dan coba lakukan <Text style={styles.boldText}>Cek SMAD</Text> makanan si kecil.
        </Text>
        <Text style={styles.guidelineText}>
          3. Setelah itu, kerjakan <Text style={styles.boldText}>Post-Test</Text> untuk mengukur peningkatan pemahaman Bunda.
        </Text>
      </View>

      <View style={{ height: 30 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  introText: {
    fontSize: 12,
    color: COLORS.textBody,
    flex: 1,
    lineHeight: 18,
  },
  card: {
    marginVertical: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepStatusText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textTitle,
    marginTop: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textBody,
    lineHeight: 18,
    marginBottom: 14,
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    ...SHADOWS.button,
  },
  openBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  guidelineBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guidelineTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
    marginBottom: 6,
  },
  guidelineText: {
    fontSize: 12,
    color: COLORS.textBody,
    lineHeight: 18,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.textTitle,
  },
});
