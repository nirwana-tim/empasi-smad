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
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import ScreenContainer from '../components/common/ScreenContainer';
import RibbonHeader from '../components/custom/RibbonHeader';
import WashiTape from '../components/custom/WashiTape';
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

  // Auto-update jika hasil sudah terbuka dan user mengganti umur/gender
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

      {/* Clean Single White Form Panel with Corner Washi Tapes */}
      <View style={styles.formPanel}>
        <WashiTape position="top-left" color={COLORS.washiTape} />
        <WashiTape position="top-right" color={COLORS.washiTape} />

        {/* Field 1: Nama Anak */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>Nama Panggilan Anak (Opsional)</Text>
          <View style={styles.inputPill}>
            <Text style={styles.inputIcon}>👶</Text>
            <TextInput
              value={childName}
              onChangeText={setChildName}
              placeholder="Contoh: Adik Arka"
              placeholderTextColor="#94A3B8"
              style={styles.textInput}
            />
          </View>
        </View>

        {/* Field 2: Jenis Kelamin (Sleek Segmented Switch) */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>Jenis Kelamin Anak</Text>
          <View style={styles.segmentedContainer}>
            <TouchableOpacity
              onPress={() => setGender('boy')}
              style={[
                styles.segmentedTab,
                gender === 'boy' && styles.segmentedTabBoyActive,
              ]}
              activeOpacity={0.8}
            >
              <FontAwesome6
                name="mars"
                size={16}
                color={gender === 'boy' ? '#FFFFFF' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.segmentedText,
                  gender === 'boy' && styles.segmentedTextActive,
                ]}
              >
                Laki-laki 👦
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGender('girl')}
              style={[
                styles.segmentedTab,
                gender === 'girl' && styles.segmentedTabGirlActive,
              ]}
              activeOpacity={0.8}
            >
              <FontAwesome6
                name="venus"
                size={16}
                color={gender === 'girl' ? '#FFFFFF' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.segmentedText,
                  gender === 'girl' && styles.segmentedTextActive,
                ]}
              >
                Perempuan 👧
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Field 3: Umur Anak Stepper & Quick Pills */}
        <View style={styles.fieldSection}>
          <View style={styles.labelWithBadgeRow}>
            <Text style={styles.fieldLabel}>Umur Anak</Text>
            <View style={styles.agePillBadge}>
              <Text style={styles.agePillText}>
                {ageMonths < 12
                  ? `${ageMonths} Bulan`
                  : `${Math.floor(ageMonths / 12)} Thn ${ageMonths % 12 > 0 ? `${ageMonths % 12} Bln` : ''}`}
              </Text>
            </View>
          </View>

          {/* Stepper Bar */}
          <View style={styles.stepperRow}>
            <TouchableOpacity
              onPress={() => setAgeMonths(Math.max(0, ageMonths - 1))}
              disabled={ageMonths <= 0}
              style={[
                styles.stepperButton,
                { backgroundColor: gender === 'boy' ? '#2563EB' : '#DB2777' },
                ageMonths <= 0 && styles.stepperButtonDisabled,
              ]}
              activeOpacity={0.7}
            >
              <Feather name="minus" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.stepperValueContainer}>
              <Text style={[styles.stepperValueText, { color: gender === 'boy' ? '#1E40AF' : '#9D174D' }]}>
                {ageMonths}
              </Text>
              <Text style={styles.stepperUnitText}>Bulan</Text>
            </View>

            <TouchableOpacity
              onPress={() => setAgeMonths(Math.min(60, ageMonths + 1))}
              disabled={ageMonths >= 60}
              style={[
                styles.stepperButton,
                { backgroundColor: gender === 'boy' ? '#2563EB' : '#DB2777' },
                ageMonths >= 60 && styles.stepperButtonDisabled,
              ]}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Age Shortcuts */}
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
                    isSelected && (gender === 'boy' ? styles.quickChipBoy : styles.quickChipGirl),
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

        {/* Field 4: Panjang / Tinggi Badan */}
        <View style={styles.fieldSection}>
          <View style={styles.labelWithBadgeRow}>
            <Text style={styles.fieldLabel}>
              {isUnder24 ? 'Panjang Badan (PB)' : 'Tinggi Badan (TB)'}
            </Text>
            <View style={[styles.posBadge, isUnder24 ? styles.posBadgeLie : styles.posBadgeStand]}>
              <Text style={[styles.posBadgeText, { color: isUnder24 ? '#0369A1' : '#15803D' }]}>
                {isUnder24 ? '🟢 Posisi Terlentang (Tidur)' : '🔵 Posisi Berdiri Tegak'}
              </Text>
            </View>
          </View>

          {/* Unified Measurement Box */}
          <View style={[styles.measurementBox, errorMessage ? styles.measurementBoxError : null]}>
            <Text style={styles.rulerEmoji}>📏</Text>
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
            ℹ️ Standar WHO: Balita &lt; 24 bulan diukur panjang badan (posisi tidur), dan &ge; 24 bulan diukur tinggi badan (posisi berdiri).
          </Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          onPress={handleCalculate}
          style={[
            styles.ctaButton,
            { backgroundColor: gender === 'boy' ? '#2563EB' : '#DB2777' },
          ]}
          activeOpacity={0.85}
        >
          <Feather name="activity" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.ctaButtonText}>Hitung Status Stunting</Text>
        </TouchableOpacity>
      </View>

      {/* RESULT SECTION */}
      {result && (
        <View style={styles.resultSection}>
          <View style={[styles.resultCard, { backgroundColor: result.statusBg }]}>
            <WashiTape position="top-left" color={result.isStunting ? '#EF4444' : COLORS.washiTape} />
            <WashiTape position="top-right" color={result.isStunting ? '#EF4444' : COLORS.washiTape} />

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

            {/* Metric Summary Card */}
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

            {/* Visual WHO Curve Gauge */}
            <ZScoreGauge zScore={result.zScore} statusColor={result.statusColor} />

            {/* Recommendations */}
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
              <Text style={styles.resetButtonText}>Hitung Balita Lain</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formPanel: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.cardFloating,
  },
  fieldSection: {
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
    gap: 4,
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
  },
  segmentedTabBoyActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentedTabGirlActive: {
    backgroundColor: '#DB2777',
    shadowColor: '#DB2777',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentedTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  agePillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  agePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  stepperButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  stepperButtonDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
  },
  stepperValueContainer: {
    flex: 1,
    maxWidth: 160,
    height: 46,
    marginHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  stepperValueText: {
    fontSize: 22,
    fontWeight: '900',
    marginRight: 4,
  },
  stepperUnitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  quickAgeScroll: {
    paddingVertical: 8,
  },
  quickChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 6,
  },
  quickChipBoy: {
    backgroundColor: '#DBEAFE',
  },
  quickChipGirl: {
    backgroundColor: '#FCE7F3',
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
  },
  measurementBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  rulerEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  lengthInputField: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  unitChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unitChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  errorBanner: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 4,
  },
  guidelineNote: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
    marginTop: 6,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 6,
    width: '100%',
    ...SHADOWS.button,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  resultSection: {
    marginTop: 14,
    width: '100%',
  },
  resultCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.cardFloating,
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
    padding: 14,
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
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 2,
    marginBottom: 6,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  comparisonBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
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
    marginBottom: 6,
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
    lineHeight: 17,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 12,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
});
