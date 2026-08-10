import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer from '../components/common/ScreenContainer';
import RibbonHeader from '../components/custom/RibbonHeader';
import StickyCard from '../components/custom/StickyCard';
import ZScoreGauge from '../components/custom/ZScoreGauge';
import { calculateStuntingZScore } from '../services/stuntingService';
import { StorageService } from '../services/storageService';
import { COLORS, SHADOWS } from '../constants/theme';

export default function StuntingCalculatorScreen({ navigation }) {
  const scrollRef = useRef(null);

  const [childName, setChildName] = useState('');
  const [gender, setGender] = useState('boy'); // 'boy' atau 'girl'
  const [ageMonths, setAgeMonths] = useState(12);
  const [lengthInput, setLengthInput] = useState('75.0');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);

  // Helper untuk melakukan kalkulasi Z-score secara aman
  const executeCalculation = (lengthStr, age, genderVal) => {
    const cleanStr = String(lengthStr || '').trim().replace(',', '.');
    const parsedLength = parseFloat(cleanStr);

    if (isNaN(parsedLength) || parsedLength < 20 || parsedLength > 160) {
      setErrorMessage('Panjang/tinggi badan harus diisi angka antara 25 – 150 cm.');
      return null;
    }

    setErrorMessage('');
    try {
      const calcResult = calculateStuntingZScore(parsedLength, age, genderVal);
      return { calcResult, parsedLength };
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menghitung data.');
      return null;
    }
  };

  const handleCalculate = async () => {
    const res = executeCalculation(lengthInput, ageMonths, gender);
    if (!res) {
      Alert.alert(
        'Input Perlu Diperiksa',
        errorMessage || 'Mohon masukkan panjang/tinggi badan anak yang valid dalam rentang 25 – 150 cm.'
      );
      return;
    }

    const { calcResult, parsedLength } = res;
    setResult(calcResult);

    // Auto-scroll ke hasil agar pengguna langsung melihat meter kurva & status
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);

    // Simpan ke riwayat lokal (non-blocking)
    try {
      await StorageService.saveStuntingHistory({
        childName: childName.trim() || 'Si Kecil',
        gender,
        ageMonths,
        heightLengthCm: parsedLength,
        zScore: calcResult.zScore,
        category: calcResult.categoryKey,
        isStunted: calcResult.isStunting,
      });
    } catch (storageErr) {
      console.log('Error saving history:', storageErr);
    }
  };

  // Jika hasil sudah pernah dihitung dan user mengubah umur/gender, perbarui otomatis jika input valid
  useEffect(() => {
    if (result) {
      const res = executeCalculation(lengthInput, ageMonths, gender);
      if (res) {
        setResult(res.calcResult);
      }
    }
  }, [ageMonths, gender]);

  const handleReset = () => {
    setLengthInput('75.0');
    setErrorMessage('');
    setResult(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const isUnder24 = ageMonths < 24;

  return (
    <ScreenContainer ref={scrollRef} backgroundImage={require('../../Asset/defaultbg.png')}>
      {/* Header Ribbon */}
      <RibbonHeader
        title="Kalkulator Stunting"
        subtitle="Antropometri WHO PB/U & TB/U (0–60 Bulan)"
        onBack={() => navigation.goBack()}
      />

      {/* Main Input Form Card */}
      <StickyCard
        backgroundColor="#FFFFFF"
        showLines={false}
        hasTapes={true}
        tapeColor={COLORS.washiTape}
        tapePositions={['top-left', 'top-right']}
        style={styles.formCard}
      >
        {/* Field 1: Nama Anak */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Nama Panggilan Anak (Opsional):</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputEmoji}>👶</Text>
            <TextInput
              value={childName}
              onChangeText={setChildName}
              placeholder="Contoh: Adik Arka"
              placeholderTextColor="#94A3B8"
              style={styles.textInput}
            />
          </View>
        </View>

        {/* Field 2: Jenis Kelamin */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Jenis Kelamin Anak:</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              onPress={() => setGender('boy')}
              style={[
                styles.genderCard,
                gender === 'boy' ? styles.genderCardBoyActive : styles.genderCardBoyInactive,
              ]}
              activeOpacity={0.8}
            >
              <FontAwesome6
                name="mars"
                size={18}
                color={gender === 'boy' ? '#FFFFFF' : '#2563EB'}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'boy' ? styles.genderTextActive : { color: '#1E3A8A' },
                ]}
              >
                Laki-laki 👦
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGender('girl')}
              style={[
                styles.genderCard,
                gender === 'girl' ? styles.genderCardGirlActive : styles.genderCardGirlInactive,
              ]}
              activeOpacity={0.8}
            >
              <FontAwesome6
                name="venus"
                size={18}
                color={gender === 'girl' ? '#FFFFFF' : '#DB2777'}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'girl' ? styles.genderTextActive : { color: '#831843' },
                ]}
              >
                Perempuan 👧
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Field 3: Umur Anak Stepper */}
        <View style={styles.formGroup}>
          <View style={styles.labelWithBadgeRow}>
            <Text style={styles.fieldLabel}>Umur Anak Saat Ini:</Text>
            <View style={styles.agePillBadge}>
              <Text style={styles.agePillText}>
                {ageMonths < 12
                  ? `${ageMonths} Bulan`
                  : `${Math.floor(ageMonths / 12)} Thn ${ageMonths % 12 > 0 ? `${ageMonths % 12} Bln` : ''}`}
              </Text>
            </View>
          </View>

          {/* Large Stepper Counter */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              onPress={() => setAgeMonths(Math.max(0, ageMonths - 1))}
              disabled={ageMonths <= 0}
              style={[
                styles.stepperBtn,
                { backgroundColor: gender === 'boy' ? '#2563EB' : '#DB2777' },
                ageMonths <= 0 && styles.stepperBtnDisabled,
              ]}
              activeOpacity={0.7}
            >
              <Feather name="minus" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={[styles.stepperDisplay, { borderColor: gender === 'boy' ? '#93C5FD' : '#F9A8D4' }]}>
              <Text style={[styles.stepperNumber, { color: gender === 'boy' ? '#1E40AF' : '#9D174D' }]}>
                {ageMonths}
              </Text>
              <Text style={styles.stepperUnit}>Bulan</Text>
            </View>

            <TouchableOpacity
              onPress={() => setAgeMonths(Math.min(60, ageMonths + 1))}
              disabled={ageMonths >= 60}
              style={[
                styles.stepperBtn,
                { backgroundColor: gender === 'boy' ? '#2563EB' : '#DB2777' },
                ageMonths >= 60 && styles.stepperBtnDisabled,
              ]}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Age Shortcuts */}
          <View style={styles.quickAgeWrapper}>
            <Text style={styles.quickAgeTitle}>Pilihan Cepat:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickAgeScroll}
            >
              {[0, 3, 6, 9, 12, 18, 24, 36, 48, 60].map((m) => {
                const isSelected = ageMonths === m;
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setAgeMonths(m)}
                    style={[
                      styles.quickChip,
                      isSelected && (gender === 'boy' ? styles.quickChipBoyActive : styles.quickChipGirlActive),
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.quickChipText,
                        isSelected && styles.quickChipTextActive,
                      ]}
                    >
                      {m === 0 ? '0 (Lahir)' : `${m} bln`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Field 4: Panjang / Tinggi Badan */}
        <View style={styles.formGroup}>
          <View style={styles.labelWithBadgeRow}>
            <Text style={styles.fieldLabel}>
              {isUnder24 ? 'Panjang Badan (PB):' : 'Tinggi Badan (TB):'}
            </Text>
            <View style={[styles.posBadge, isUnder24 ? styles.posBadgeLie : styles.posBadgeStand]}>
              <Feather
                name={isUnder24 ? 'moon' : 'user'}
                size={12}
                color={isUnder24 ? '#0284C7' : '#16A34A'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.posBadgeText, { color: isUnder24 ? '#0369A1' : '#15803D' }]}>
                {isUnder24 ? 'Posisi Terlentang (Tidur)' : 'Posisi Berdiri Tegak'}
              </Text>
            </View>
          </View>

          {/* Measurement Input Box */}
          <View style={[styles.measurementBox, errorMessage ? styles.measurementBoxError : null]}>
            <Text style={styles.rulerIcon}>📏</Text>
            <TextInput
              value={lengthInput}
              onChangeText={(val) => {
                setLengthInput(val);
                if (errorMessage) setErrorMessage('');
              }}
              keyboardType="decimal-pad"
              placeholder="Contoh: 75.5"
              placeholderTextColor="#94A3B8"
              style={styles.lengthInputField}
            />
            <View style={styles.unitChip}>
              <Text style={styles.unitChipText}>cm</Text>
            </View>
          </View>

          {errorMessage ? (
            <Text style={styles.errorBanner}>⚠️ {errorMessage}</Text>
          ) : null}

          <Text style={styles.guidelineNote}>
            ℹ️ Sesuai standar Kemenkes/WHO: Balita &lt; 24 bulan diukur panjang badan posisi tidur, dan &ge; 24 bulan diukur tinggi badan posisi berdiri tegak.
          </Text>
        </View>

        {/* CTA Calculate Button */}
        <TouchableOpacity
          onPress={handleCalculate}
          style={[
            styles.ctaButton,
            { backgroundColor: gender === 'boy' ? '#2563EB' : '#DB2777' },
          ]}
          activeOpacity={0.85}
        >
          <Feather name="activity" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
          <Text style={styles.ctaButtonText}>Hitung Status Stunting Sekarang</Text>
        </TouchableOpacity>
      </StickyCard>

      {/* RESULT DASHBOARD SECTION */}
      {result && (
        <View style={styles.resultSection}>
          <StickyCard
            backgroundColor={result.statusBg}
            showLines={false}
            hasTapes={true}
            tapeColor={result.isStunting ? '#EF4444' : COLORS.washiTape}
            tapePositions={['top-left', 'top-right']}
            style={styles.resultCard}
          >
            {/* Status Title Banner */}
            <View style={[styles.resultTitleBanner, { backgroundColor: result.statusColor }]}>
              <Feather
                name={result.isStunting ? 'alert-triangle' : 'check-circle'}
                size={22}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.resultTitleBannerText}>{result.title}</Text>
            </View>

            {/* Metric Summary Dashboard */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Nilai Z-Score Pertumbuhan WHO</Text>
              <Text style={[styles.metricNumber, { color: result.statusColor }]}>
                {result.zScore > 0 ? `+${result.zScore}` : result.zScore} SD
              </Text>

              <View style={[styles.categoryBadge, { backgroundColor: result.statusBg, borderColor: result.statusColor }]}>
                <Text style={[styles.categoryBadgeText, { color: result.statusColor }]}>
                  Kategori: {result.status}
                </Text>
              </View>

              <View style={styles.comparisonBox}>
                <Text style={styles.comparisonText}>
                  📊 Median Standar WHO ({ageMonths} bln): <Text style={{ fontWeight: '800' }}>{result.whoMedian} cm</Text>
                </Text>
              </View>
            </View>

            {/* Visual WHO Gauge Curve */}
            <ZScoreGauge zScore={result.zScore} statusColor={result.statusColor} />

            {/* Detailed Recommendations */}
            <View style={styles.recommendationCard}>
              <Text style={styles.recHeaderTitle}>💡 Rekomendasi & Tindak Lanjut:</Text>
              {result.recommendations.map((item, idx) => (
                <View key={idx} style={styles.recItemRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.recItemText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              onPress={handleReset}
              style={styles.resetButton}
              activeOpacity={0.8}
            >
              <Feather name="refresh-cw" size={16} color="#475569" style={{ marginRight: 6 }} />
              <Text style={styles.resetButtonText}>Hitung Balita Lainnya</Text>
            </TouchableOpacity>
          </StickyCard>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formCard: {
    width: '100%',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.cardFloating,
  },
  formGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  inputEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  genderCardBoyActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
    ...SHADOWS.button,
  },
  genderCardBoyInactive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  genderCardGirlActive: {
    backgroundColor: '#DB2777',
    borderColor: '#BE185D',
    ...SHADOWS.button,
  },
  genderCardGirlInactive: {
    backgroundColor: '#FDF2F8',
    borderColor: '#FBCFE8',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '800',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  agePillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  agePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  stepperBtnDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
  },
  stepperDisplay: {
    flex: 1,
    maxWidth: 160,
    height: 48,
    marginHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  stepperNumber: {
    fontSize: 22,
    fontWeight: '900',
    marginRight: 4,
  },
  stepperUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  quickAgeWrapper: {
    marginTop: 10,
  },
  quickAgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  quickAgeScroll: {
    paddingVertical: 2,
  },
  quickChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  quickChipBoyActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  quickChipGirlActive: {
    backgroundColor: '#FCE7F3',
    borderColor: '#DB2777',
  },
  quickChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
  quickChipTextActive: {
    color: '#0F172A',
    fontWeight: '900',
  },
  posBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  posBadgeLie: {
    backgroundColor: '#E0F2FE',
  },
  posBadgeStand: {
    backgroundColor: '#DCFCE7',
  },
  posBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  measurementBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 52,
  },
  measurementBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  rulerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  lengthInputField: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  unitChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
  },
  errorBanner: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 6,
  },
  guidelineNote: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 6,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
    ...SHADOWS.button,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  resultSection: {
    marginTop: 14,
    width: '100%',
  },
  resultCard: {
    padding: 16,
    borderRadius: 20,
  },
  resultTitleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  resultTitleBannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  metricNumber: {
    fontSize: 34,
    fontWeight: '900',
    marginVertical: 4,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 2,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  comparisonBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 4,
    width: '100%',
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: 11,
    color: '#334155',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  recHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  recItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
    marginTop: 6,
    marginRight: 8,
  },
  recItemText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
});
