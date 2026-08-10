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
import WashiTape from '../components/custom/WashiTape';
import { QUESTIONNAIRE_LINKS } from '../constants/links';
import { COLORS, SHADOWS } from '../constants/theme';

export default function QuestionnaireScreen({ navigation }) {
  const handleOpenLink = async (url, title) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        toolbarColor: '#0284C7',
        showTitle: true,
        enableBarCollapsing: true,
      });
    } catch (e) {
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
      {/* Header Ribbon */}
      <RibbonHeader
        title="Kuisioner Penelitian"
        subtitle="Evaluasi Program Edukasi MP-ASI SMAD"
        onBack={() => navigation.goBack()}
      />

      {/* Intro Box */}
      <View style={styles.introCard}>
        <View style={styles.infoIconWrapper}>
          <Feather name="clipboard" size={16} color="#0284C7" />
        </View>
        <Text style={styles.introText}>
          Kuesioner ini digunakan untuk mengevaluasi pemahaman Bunda sebelum dan sesudah mempelajari materi pencegahan stunting pada aplikasi ini.
        </Text>
      </View>

      {/* CARD 1: PRE-TEST */}
      <View style={styles.stepCard}>
        <WashiTape position="top-left" color={COLORS.washiTape} />
        <WashiTape position="top-right" color={COLORS.washiTape} />

        <View style={styles.cardHeaderRow}>
          <View style={[styles.stepBadge, { backgroundColor: '#0284C7' }]}>
            <Text style={styles.stepBadgeText}>Langkah 1 (Awal)</Text>
          </View>
          <Text style={styles.stepStatusText}>Wajib Diisi di Awal</Text>
        </View>

        <Text style={styles.cardTitle}>{pretest.title}</Text>
        <Text style={[styles.cardSubtitle, { color: '#0284C7' }]}>{pretest.subtitle}</Text>
        <Text style={styles.cardDesc}>{pretest.description}</Text>

        <TouchableOpacity
          onPress={() => handleOpenLink(pretest.url, pretest.title)}
          style={[styles.openBtn, { backgroundColor: '#0284C7' }]}
          activeOpacity={0.85}
        >
          <Feather name="external-link" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.openBtnText}>Buka Form Pre-Test</Text>
        </TouchableOpacity>
      </View>

      {/* CARD 2: POST-TEST */}
      <View style={styles.stepCard}>
        <WashiTape position="top-left" color="#10B981" />
        <WashiTape position="top-right" color="#10B981" />

        <View style={styles.cardHeaderRow}>
          <View style={[styles.stepBadge, { backgroundColor: '#10B981' }]}>
            <Text style={styles.stepBadgeText}>Langkah 2 (Akhir)</Text>
          </View>
          <Text style={styles.stepStatusText}>Diisi Setelah Membaca</Text>
        </View>

        <Text style={styles.cardTitle}>{posttest.title}</Text>
        <Text style={[styles.cardSubtitle, { color: '#15803D' }]}>{posttest.subtitle}</Text>
        <Text style={styles.cardDesc}>{posttest.description}</Text>

        <TouchableOpacity
          onPress={() => handleOpenLink(posttest.url, posttest.title)}
          style={[styles.openBtn, { backgroundColor: '#10B981' }]}
          activeOpacity={0.85}
        >
          <Feather name="check-square" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.openBtnText}>Buka Form Post-Test</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Step-by-Step Guideline */}
      <View style={styles.guidelineBox}>
        <Text style={styles.guidelineTitle}>💡 Alur Pengisian Kuisioner:</Text>
        <View style={styles.guideStepRow}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.guideStepText}>
            Isi <Text style={styles.boldText}>Pre-Test</Text> terlebih dahulu sebelum membaca menu Informasi atau menggunakan fitur aplikasi.
          </Text>
        </View>

        <View style={styles.guideStepRow}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.guideStepText}>
            Pelajari menu <Text style={styles.boldText}>Informasi Edukasi</Text> dan coba lakukan <Text style={styles.boldText}>Cek SMAD</Text> & <Text style={styles.boldText}>Kalkulator Stunting</Text>.
          </Text>
        </View>

        <View style={styles.guideStepRow}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.guideStepText}>
            Setelah selesai, isi <Text style={styles.boldText}>Post-Test</Text> untuk mengukur peningkatan pemahaman Bunda.
          </Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#C6E3F4',
    ...SHADOWS.cardFloating,
  },
  infoIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  introText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
    ...SHADOWS.cardFloating,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepStatusText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 14,
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    ...SHADOWS.button,
  },
  openBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  guidelineBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.cardFloating,
  },
  guidelineTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  guideStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  guideStepText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
});
