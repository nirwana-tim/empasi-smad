import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../components/common/ScreenContainer';
import RibbonHeader from '../components/custom/RibbonHeader';
import WashiTape from '../components/custom/WashiTape';
import { QUESTIONNAIRE_LINKS } from '../constants/links';
import { StorageService } from '../services/storageService';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

export default function QuestionnaireScreen({ navigation }) {
  const [progress, setProgress] = useState({
    hasCompletedPretest: false,
    hasReadMaterials: false,
  });

  // Muat status progress setiap kali layar diakses / kembali dari layar lain
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function loadProgress() {
        try {
          const data = await StorageService.getQuestionnaireProgress();
          if (isMounted) {
            setProgress(data || { hasCompletedPretest: false, hasReadMaterials: false });
          }
        } catch (err) {
          console.log('Error loading progress:', err);
        }
      }
      loadProgress();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Helper fungsi pembuka URL yang 100% aman di Web, Android, dan iOS
  const openExternalUrl = async (url) => {
    if (!url) {
      Alert.alert('Link Tidak Tersedia', 'Tautan kuesioner tidak ditemukan.');
      return false;
    }

    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.open) {
          window.open(url, '_blank', 'noopener,noreferrer');
          return true;
        }
      }

      // Di Android / iOS gunakan WebBrowser in-app atau Linking
      const result = await WebBrowser.openBrowserAsync(url, {
        toolbarColor: '#0284C7',
        showTitle: true,
        enableBarCollapsing: true,
      });

      return true;
    } catch (browserErr) {
      console.log('WebBrowser fallback to Linking:', browserErr);
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return true;
        } else {
          Alert.alert('Gagal Membuka Link', 'Perangkat tidak mendukung pembukaan tautan ini.');
          return false;
        }
      } catch (linkingErr) {
        console.log('Linking error:', linkingErr);
        Alert.alert('Gagal Membuka Link', 'Silakan periksa koneksi internet atau peramban web Anda.');
        return false;
      }
    }
  };

  // Handler Buka Form Pre-Test
  const handleOpenPretest = async () => {
    const success = await openExternalUrl(pretest.url);
    if (success) {
      // Tandai otomatis Pre-Test sudah dibuka/dikerjakan
      const updated = await StorageService.setPretestCompleted(true);
      setProgress(updated);
    }
  };

  // Handler Buka Form Post-Test
  const handleOpenPosttest = async () => {
    if (!isPosttestUnlocked) {
      Alert.alert(
        'Post-Test Masih Terkunci 🔒',
        'Untuk menjaga keabsahan data penelitian, kuesioner Post-Test baru dapat dibuka setelah Bunda mengisi Pre-Test dan membaca seluruh materi edukasi.'
      );
      return;
    }
    await openExternalUrl(posttest.url);
  };

  // Handler Reset Progress
  const handleResetProgress = () => {
    Alert.alert(
      'Reset Alur Pengujian',
      'Apakah Anda ingin mengunci kembali form Post-Test dan mengulang alur pengujian dari awal?',
      [
        {
          text: 'Reset Sekarang',
          style: 'destructive',
          onPress: async () => {
            const initial = await StorageService.resetQuestionnaireProgress();
            setProgress(initial);
            Alert.alert('Berhasil', 'Alur kuesioner telah di-reset ke awal.');
          },
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const pretest = QUESTIONNAIRE_LINKS.pretest;
  const posttest = QUESTIONNAIRE_LINKS.posttest;

  // Syarat pembukaan Post-Test: Wajib Pre-Test SELESAI && Materi SELESAI dibaca
  const isPosttestUnlocked = progress.hasCompletedPretest && progress.hasReadMaterials;

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
          Kuesioner penelitian ini menggunakan metode berjenjang: <Text style={styles.boldText}>Pre-Test</Text> ➔ <Text style={styles.boldText}>Pelajari Materi</Text> ➔ <Text style={styles.boldText}>Post-Test (Terbuka Otomatis)</Text>.
        </Text>
      </View>

      {/* CARD 1: PRE-TEST (Langkah Pertama) */}
      <View style={[styles.stepCard, progress.hasCompletedPretest && styles.stepCardDone]}>
        <WashiTape position="top-left" color={COLORS.washiTape} />
        <WashiTape position="top-right" color={COLORS.washiTape} />

        <View style={styles.cardHeaderRow}>
          <View style={[styles.stepBadge, { backgroundColor: progress.hasCompletedPretest ? '#10B981' : '#0284C7' }]}>
            <Text style={styles.stepBadgeText}>
              {progress.hasCompletedPretest ? '✅ Selesai Diisi' : 'Langkah 1 (Awal)'}
            </Text>
          </View>
          <Text style={[styles.stepStatusText, progress.hasCompletedPretest && { color: '#15803D' }]}>
            {progress.hasCompletedPretest ? 'Telah Diselesaikan' : 'Wajib Diisi di Awal'}
          </Text>
        </View>

        <Text style={styles.cardTitle}>{pretest.title}</Text>
        <Text style={[styles.cardSubtitle, { color: progress.hasCompletedPretest ? '#15803D' : '#0284C7' }]}>
          {pretest.subtitle}
        </Text>
        <Text style={styles.cardDesc}>
          {progress.hasCompletedPretest
            ? 'Bunda sudah membuka & mengisi Pre-Test ini. Silakan lanjutkan dengan membaca materi edukasi pada menu Informasi untuk membuka form Post-Test.'
            : pretest.description}
        </Text>

        <TouchableOpacity
          onPress={handleOpenPretest}
          style={styles.openBtn}
          activeOpacity={0.85}
        >
          <Feather name="external-link" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.openBtnText}>
            {progress.hasCompletedPretest ? 'Buka Kembali Form Pre-Test' : 'Buka Form Pre-Test'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CARD 2: POST-TEST (Terkunci sampai Pretest + Materi Selesai) */}
      <View
        style={[
          styles.stepCard,
          !isPosttestUnlocked ? styles.stepCardLocked : styles.stepCardUnlocked,
        ]}
      >
        <WashiTape
          position="top-left"
          color={isPosttestUnlocked ? '#10B981' : '#94A3B8'}
        />
        <WashiTape
          position="top-right"
          color={isPosttestUnlocked ? '#10B981' : '#94A3B8'}
        />

        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.stepBadge,
              { backgroundColor: isPosttestUnlocked ? '#10B981' : '#64748B' },
            ]}
          >
            <Text style={styles.stepBadgeText}>
              {isPosttestUnlocked ? '🔓 Langkah 2 (Terbuka)' : '🔒 Langkah 2 (Terkunci)'}
            </Text>
          </View>
          <Text style={[styles.stepStatusText, isPosttestUnlocked && { color: '#15803D' }]}>
            {isPosttestUnlocked ? 'Siap Diisi Sekarang' : 'Terkunci Sementara'}
          </Text>
        </View>

        <Text style={[styles.cardTitle, !isPosttestUnlocked && { color: '#475569' }]}>
          {posttest.title}
        </Text>
        <Text style={[styles.cardSubtitle, { color: isPosttestUnlocked ? '#15803D' : '#64748B' }]}>
          {posttest.subtitle}
        </Text>

        {/* Lock / Unlock Explanatory Message */}
        {!isPosttestUnlocked ? (
          <View style={styles.lockedNoticeBox}>
            <Feather name="lock" size={18} color="#D97706" style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.lockedNoticeTitle}>Syarat Membuka Post-Test:</Text>
              <Text style={styles.lockedNoticeText}>
                {progress.hasCompletedPretest ? '✅' : '⚪'} 1. Mengisi Form Pre-Test {'\n'}
                {progress.hasReadMaterials ? '✅' : '⚪'} 2. Membaca seluruh materi edukasi (Bab 1–6)
              </Text>

              {/* Shortcut Button to Read Materials if Pretest done */}
              {progress.hasCompletedPretest && !progress.hasReadMaterials && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Information')}
                  style={styles.shortcutBtn}
                  activeOpacity={0.8}
                >
                  <Feather name="book-open" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.shortcutBtnText}>Baca Materi Edukasi Sekarang</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <Text style={styles.cardDesc}>
            Selamat! Bunda telah menyelesaikan Pre-Test dan mempelajari seluruh materi MP-ASI. Silakan isi form Post-Test ini untuk mengukur pemahaman akhir.
          </Text>
        )}

        <TouchableOpacity
          onPress={handleOpenPosttest}
          style={[
            styles.openBtn,
            { backgroundColor: isPosttestUnlocked ? '#10B981' : '#CBD5E1' },
          ]}
          activeOpacity={isPosttestUnlocked ? 0.85 : 0.8}
        >
          <Feather
            name={isPosttestUnlocked ? 'check-square' : 'lock'}
            size={18}
            color={isPosttestUnlocked ? '#FFFFFF' : '#64748B'}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.openBtnText,
              !isPosttestUnlocked && { color: '#64748B' },
            ]}
          >
            {isPosttestUnlocked ? 'Buka Form Post-Test' : 'Post-Test Terkunci 🔒'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Step-by-Step Guideline */}
      <View style={styles.guidelineBox}>
        <Text style={styles.guidelineTitle}>💡 Alur Tahapan Penelitian (LMS Method):</Text>
        <View style={styles.guideStepRow}>
          <View style={[styles.stepCircle, progress.hasCompletedPretest && { backgroundColor: '#10B981' }]}>
            <Text style={styles.stepNumber}>{progress.hasCompletedPretest ? '✓' : '1'}</Text>
          </View>
          <Text style={styles.guideStepText}>
            Isi <Text style={styles.boldText}>Pre-Test</Text> terlebih dahulu untuk mengetahui pengetahuan awal sebelum membaca materi.
          </Text>
        </View>

        <View style={styles.guideStepRow}>
          <View style={[styles.stepCircle, progress.hasReadMaterials && { backgroundColor: '#10B981' }]}>
            <Text style={styles.stepNumber}>{progress.hasReadMaterials ? '✓' : '2'}</Text>
          </View>
          <Text style={styles.guideStepText}>
            Pelajari menu <Text style={styles.boldText}>Informasi Edukasi</Text> (Bab 1–6) hingga selesai.
          </Text>
        </View>

        <View style={styles.guideStepRow}>
          <View style={[styles.stepCircle, isPosttestUnlocked && { backgroundColor: '#10B981' }]}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.guideStepText}>
            Form <Text style={styles.boldText}>Post-Test</Text> otomatis <Text style={{ color: '#15803D', fontFamily: FONTS.bold }}>terbuka (Unlocked)</Text> setelah langkah 1 & 2 selesai.
          </Text>
        </View>

        {/* Reset Button for Testing/Researchers */}
        <TouchableOpacity
          onPress={handleResetProgress}
          style={styles.resetProgressBtn}
          activeOpacity={0.7}
        >
          <Feather name="refresh-cw" size={13} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.resetProgressText}>Reset Status Kuisioner (Untuk Kebutuhan Pengujian)</Text>
        </TouchableOpacity>
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
  stepCardDone: {
    borderColor: '#BAE6FD',
  },
  stepCardLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.92,
  },
  stepCardUnlocked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#86EFAC',
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
    fontWeight: '700',
    fontFamily: FONTS.bold,
  },
  stepStatusText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONTS.bold,
    color: '#334155',
    marginTop: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FONTS.bold,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 14,
  },
  lockedNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  lockedNoticeTitle: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: '#92400E',
    marginBottom: 4,
  },
  lockedNoticeText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    fontFamily: FONTS.medium,
  },
  shortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0284C7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  shortcutBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  openBtn: {
    backgroundColor: '#0284C7',
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
    fontFamily: FONTS.bold,
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
    fontFamily: FONTS.semiBold,
    color: '#334155',
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
    fontFamily: FONTS.bold,
  },
  guideStepText: {
    fontSize: 12,
    color: '#475569',
    fontFamily: FONTS.regular,
    lineHeight: 18,
    flex: 1,
  },
  boldText: {
    fontFamily: FONTS.semiBold,
    color: '#334155',
  },
  resetProgressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  resetProgressText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: FONTS.medium,
  },
});
