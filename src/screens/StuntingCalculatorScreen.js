import React, { useState } from 'react';
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
import StickyCard from '../components/custom/StickyCard';
import StepperCounter from '../components/custom/StepperCounter';
import ZScoreGauge from '../components/custom/ZScoreGauge';
import { calculateStuntingZScore } from '../services/stuntingService';
import { StorageService } from '../services/storageService';
import { COLORS, SHADOWS } from '../constants/theme';

export default function StuntingCalculatorScreen({ navigation }) {
  const [childName, setChildName] = useState('');
  const [gender, setGender] = useState('boy'); // 'boy' atau 'girl'
  const [ageMonths, setAgeMonths] = useState(12);
  const [lengthInput, setLengthInput] = useState('75.0');
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    const parsedLength = parseFloat(lengthInput.replace(',', '.'));
    if (isNaN(parsedLength) || parsedLength <= 20 || parsedLength >= 150) {
      Alert.alert(
        'Input Tidak Valid',
        'Mohon masukkan panjang/tinggi badan anak yang valid dalam rentang 25 - 140 cm.'
      );
      return;
    }

    try {
      const calcResult = calculateStuntingZScore(parsedLength, ageMonths, gender);
      setResult(calcResult);

      // Simpan riwayat
      await StorageService.saveStuntingHistory({
        childName: childName.trim() || 'Si Kecil',
        gender,
        ageMonths,
        heightLengthCm: parsedLength,
        zScore: calcResult.zScore,
        category: calcResult.categoryKey,
        isStunted: calcResult.isStunting,
      });
    } catch (err) {
      Alert.alert('Gagal Menghitung', err.message);
    }
  };

  const handleReset = () => {
    setLengthInput('75.0');
    setResult(null);
  };

  const isUnder24 = ageMonths < 24;

  return (
    <ScreenContainer backgroundImage={require('../../Asset/defaultbg.png')}>
      {/* Header */}
      <RibbonHeader
        title="Kalkulator Stunting"
        subtitle="Antropometri WHO PB/U & TB/U (0–60 Bulan)"
        onBack={() => navigation.goBack()}
      />

      {/* Input Form Card */}
      <StickyCard backgroundColor="#FFFFFF" style={styles.formCard}>
        {/* Child Name (Optional) */}
        <Text style={styles.inputLabel}>Nama Panggilan Anak (Opsional):</Text>
        <TextInput
          value={childName}
          onChangeText={setChildName}
          placeholder="Contoh: Adik Arka"
          placeholderTextColor={COLORS.textMuted}
          style={styles.textInput}
        />

        {/* Gender Selection */}
        <Text style={styles.inputLabel}>Jenis Kelamin Anak:</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            onPress={() => setGender('boy')}
            style={[
              styles.genderBtn,
              gender === 'boy' && styles.genderBtnBoyActive,
            ]}
            activeOpacity={0.8}
          >
            <FontAwesome6
              name="mars"
              size={16}
              color={gender === 'boy' ? '#FFFFFF' : '#2563EB'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.genderBtnText, gender === 'boy' && styles.genderBtnTextActive]}>
              Laki-laki 👦
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGender('girl')}
            style={[
              styles.genderBtn,
              gender === 'girl' && styles.genderBtnGirlActive,
            ]}
            activeOpacity={0.8}
          >
            <FontAwesome6
              name="venus"
              size={16}
              color={gender === 'girl' ? '#FFFFFF' : '#DB2777'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.genderBtnText, gender === 'girl' && styles.genderBtnTextActive]}>
              Perempuan 👧
            </Text>
          </TouchableOpacity>
        </View>

        {/* Age in Months Stepper */}
        <Text style={styles.inputLabel}>Umur Anak (Bulan):</Text>
        <StepperCounter
          value={ageMonths}
          onChange={setAgeMonths}
          min={0}
          max={60}
          unit="Bulan"
          color={gender === 'boy' ? '#2563EB' : '#DB2777'}
        />

        {/* Quick Age Shortcuts (Horizontal Scroll to prevent any wrapping overflow) */}
        <View style={styles.quickAgeContainer}>
          <Text style={styles.quickAgeLabel}>Pilih Cepat:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickAgeScroll}
          >
            {[6, 9, 12, 18, 24, 36, 48, 60].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setAgeMonths(m)}
                style={[
                  styles.quickAgeBtn,
                  ageMonths === m && styles.quickAgeBtnActive,
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.quickAgeText, ageMonths === m && styles.quickAgeTextActive]}>
                  {m} bln
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Length / Height Input */}
        <View style={styles.measurementHeader}>
          <Text style={styles.inputLabelBold}>
            {isUnder24 ? 'Panjang Badan (PB):' : 'Tinggi Badan (TB):'}
          </Text>
          <View style={styles.measurementBadge}>
            <Text style={styles.measurementBadgeText}>
              {isUnder24 ? 'Posisi Terlentang / Tidur' : 'Posisi Berdiri Tegak'}
            </Text>
          </View>
        </View>

        {/* Input with unit box - Constrained width */}
        <View style={styles.inputWithUnitRow}>
          <TextInput
            value={lengthInput}
            onChangeText={setLengthInput}
            keyboardType="decimal-pad"
            placeholder="Contoh: 75.5"
            placeholderTextColor={COLORS.textMuted}
            style={styles.lengthInput}
          />
          <View style={styles.unitBadge}>
            <Text style={styles.unitBadgeText}>cm</Text>
          </View>
        </View>

        <Text style={styles.measurementNote}>
          * Standar WHO: Anak &lt; 24 bulan diukur panjang badan (terlentang), anak &ge; 24 bulan diukur tinggi badan (berdiri tegak).
        </Text>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleCalculate}
          style={styles.calculateBtn}
          activeOpacity={0.8}
        >
          <Feather name="activity" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.calculateBtnText}>Hitung Status Stunting Sekarang</Text>
        </TouchableOpacity>
      </StickyCard>

      {/* RESULT SECTION */}
      {result && (
        <View style={styles.resultWrapper}>
          <StickyCard
            backgroundColor={result.statusBg}
            hasTapes={true}
            tapeColor={result.isStunting ? '#E74C3C' : COLORS.washiTape}
            tapePositions={['top-left', 'top-right']}
            style={styles.resultCard}
          >
            {/* Status Title Banner */}
            <View style={[styles.statusBanner, { backgroundColor: result.statusColor }]}>
              <Feather
                name={result.isStunting ? 'alert-circle' : 'check-circle'}
                size={24}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.statusBannerText}>{result.title}</Text>
            </View>

            {/* Z-Score Summary Box */}
            <View style={styles.zscoreBox}>
              <Text style={styles.zscoreLabel}>Hasil Perhitungan Z-Score WHO:</Text>
              <Text style={[styles.zscoreValue, { color: result.statusColor }]}>
                {result.zScore > 0 ? `+${result.zScore}` : result.zScore} SD
              </Text>
              <Text style={styles.categoryLabel}>{result.status}</Text>
              <Text style={styles.medianRefText}>
                Median Standar WHO ({ageMonths} bln): <Text style={{ fontWeight: '800' }}>{result.whoMedian} cm</Text>
              </Text>
            </View>

            {/* Visual Gauge Curve */}
            <ZScoreGauge zScore={result.zScore} statusColor={result.statusColor} />

            {/* Recommendation Box */}
            <View style={styles.recommendationCard}>
              <Text style={styles.recCardTitle}>💡 Rekomendasi & Tindak Lanjut:</Text>
              {result.recommendations.map((item, idx) => (
                <View key={idx} style={styles.recItemRow}>
                  <Feather name="check" size={14} color={COLORS.primaryDark} style={{ marginTop: 2, marginRight: 6 }} />
                  <Text style={styles.recItemText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              onPress={handleReset}
              style={styles.resetBtn}
              activeOpacity={0.8}
            >
              <Feather name="refresh-cw" size={16} color={COLORS.textBody} style={{ marginRight: 6 }} />
              <Text style={styles.resetBtnText}>Hitung Ulang</Text>
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
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textTitle,
    marginBottom: 6,
    marginTop: 4,
  },
  inputLabelBold: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textTitle,
    marginBottom: 10,
    width: '100%',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '100%',
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    minWidth: 0,
  },
  genderBtnBoyActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  genderBtnGirlActive: {
    backgroundColor: '#DB2777',
    borderColor: '#BE185D',
  },
  genderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textBody,
  },
  genderBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  quickAgeContainer: {
    marginVertical: 6,
    width: '100%',
  },
  quickAgeLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickAgeScroll: {
    paddingVertical: 2,
  },
  quickAgeBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickAgeBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  quickAgeText: {
    fontSize: 11,
    color: COLORS.textBody,
    fontWeight: '600',
  },
  quickAgeTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  measurementBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  measurementBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  inputWithUnitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  lengthInput: {
    flex: 1,
    minWidth: 0,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textTitle,
  },
  unitBadge: {
    backgroundColor: COLORS.primaryLight,
    width: 52,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    flexShrink: 0,
  },
  unitBadgeText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  measurementNote: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 6,
    lineHeight: 14,
  },
  calculateBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
    width: '100%',
    ...SHADOWS.button,
  },
  calculateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  resultWrapper: {
    marginTop: 12,
    width: '100%',
  },
  resultCard: {
    padding: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusBannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  zscoreBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  zscoreLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  zscoreValue: {
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textTitle,
  },
  medianRefText: {
    fontSize: 11,
    color: COLORS.textBody,
    marginTop: 4,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
    marginBottom: 6,
  },
  recItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recItemText: {
    fontSize: 12,
    color: COLORS.textBody,
    flex: 1,
    lineHeight: 17,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textBody,
  },
});
