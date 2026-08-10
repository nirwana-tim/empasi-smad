import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import ScreenContainer from '../components/common/ScreenContainer';
import RibbonHeader from '../components/custom/RibbonHeader';
import StickyCard from '../components/custom/StickyCard';
import StepperCounter from '../components/custom/StepperCounter';
import { FOOD_GROUPS } from '../data/foodGroups';
import { evaluateSMAD } from '../services/smadService';
import { StorageService } from '../services/storageService';
import { COLORS, SHADOWS } from '../constants/theme';

export default function SmadCheckScreen({ navigation }) {
  // Form States
  const [ageGroup, setAgeGroup] = useState('6-8'); // '6-8' atau '9-23'
  const [isBreastfeeding, setIsBreastfeeding] = useState(true);
  const [selectedFoodIds, setSelectedFoodIds] = useState([]);
  const [mealFrequency, setMealFrequency] = useState(2);
  const [milkFrequency, setMilkFrequency] = useState(0);

  // Result State
  const [result, setResult] = useState(null);

  // Toggle Food Selection
  const toggleFoodGroup = (id) => {
    if (id === 'breastmilk') {
      setIsBreastfeeding(!isBreastfeeding);
      return;
    }
    if (selectedFoodIds.includes(id)) {
      setSelectedFoodIds(selectedFoodIds.filter((item) => item !== id));
    } else {
      setSelectedFoodIds([...selectedFoodIds, id]);
    }
  };

  const handleEvaluate = async () => {
    const evalResult = evaluateSMAD({
      ageGroup,
      isBreastfeeding,
      selectedFoodIds,
      mealFrequency,
      milkFrequency,
    });

    setResult(evalResult);

    // Simpan ke riwayat lokal
    await StorageService.saveSmadHistory({
      ageGroup,
      isBreastfeeding,
      selectedFoodIds,
      mealFrequency,
      milkFrequency,
      isMadPass: evalResult.isMadPass,
      mddScore: evalResult.mdd.score,
    });
  };

  const handleReset = () => {
    setAgeGroup('6-8');
    setIsBreastfeeding(true);
    setSelectedFoodIds([]);
    setMealFrequency(2);
    setMilkFrequency(0);
    setResult(null);
  };

  return (
    <ScreenContainer backgroundImage={require('../../Asset/bgsmad.png')}>
      {/* Header */}
      <RibbonHeader
        title="Cek SMAD"
        subtitle="Evaluasi Mandiri MPASI – MAD Usia 6–23 Bulan"
        onBack={() => navigation.goBack()}
      />

      {/* Intro Note */}
      <View style={styles.introCard}>
        <Feather name="info" size={18} color={COLORS.primaryDark} style={styles.infoIcon} />
        <Text style={styles.introText}>
          Yuk periksa apakah pola makan si kecil dalam <Text style={styles.boldText}>24 jam terakhir</Text> sudah memenuhi standar <Text style={styles.boldText}>Minimum Acceptable Diet (MAD)</Text> WHO!
        </Text>
      </View>

      {/* QUESTION 1: USIA ANAK */}
      <StickyCard backgroundColor="#FFFFFF" style={styles.sectionCard}>
        <Text style={styles.questionTitle}>1. Usia Anak Saat Ini:</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setAgeGroup('6-8')}
            style={[
              styles.toggleBtn,
              ageGroup === '6-8' && styles.toggleBtnActive,
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleBtnText, ageGroup === '6-8' && styles.toggleBtnTextActive]}>
              6 – 8 Bulan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAgeGroup('9-23')}
            style={[
              styles.toggleBtn,
              ageGroup === '9-23' && styles.toggleBtnActive,
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleBtnText, ageGroup === '9-23' && styles.toggleBtnTextActive]}>
              9 – 23 Bulan
            </Text>
          </TouchableOpacity>
        </View>
      </StickyCard>

      {/* QUESTION 2: STATUS MENYUSU */}
      <StickyCard backgroundColor="#FFFFFF" style={styles.sectionCard}>
        <Text style={styles.questionTitle}>2. Apakah Anak Masih Menyusu ASI?</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setIsBreastfeeding(true)}
            style={[
              styles.toggleBtn,
              isBreastfeeding && styles.toggleBtnActive,
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleBtnText, isBreastfeeding && styles.toggleBtnTextActive]}>
              Ya, Masih Menyusu ASI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsBreastfeeding(false)}
            style={[
              styles.toggleBtn,
              !isBreastfeeding && styles.toggleBtnActiveDanger,
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleBtnText, !isBreastfeeding && styles.toggleBtnTextActive]}>
              Tidak
            </Text>
          </TouchableOpacity>
        </View>
      </StickyCard>

      {/* QUESTION 3: 8 FOOD GROUPS CHECKLIST */}
      <StickyCard backgroundColor="#FFFFFF" style={styles.sectionCard}>
        <Text style={styles.questionTitle}>3. Makanan yang Dikonsumsi (24 Jam Terakhir):</Text>
        <Text style={styles.questionSubtitle}>
          Centang semua kelompok makanan yang dimakan si kecil kemarin:
        </Text>

        <View style={styles.foodList}>
          {FOOD_GROUPS.map((food) => {
            const isSelected = food.id === 'breastmilk' ? isBreastfeeding : selectedFoodIds.includes(food.id);
            return (
              <TouchableOpacity
                key={food.id}
                onPress={() => toggleFoodGroup(food.id)}
                style={[
                  styles.foodCheckboxItem,
                  isSelected && styles.foodCheckboxItemActive,
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
                  {isSelected && <Feather name="check" size={14} color="#FFFFFF" />}
                </View>

                <View style={styles.foodInfo}>
                  <View style={styles.foodHeaderRow}>
                    <Text style={styles.foodGroupNumber}>Kel. {food.groupNumber}</Text>
                    <Text style={styles.foodBadge}>{food.badge}</Text>
                  </View>
                  <Text style={[styles.foodName, isSelected && styles.foodNameActive]}>
                    {food.title}
                  </Text>
                  <Text style={styles.foodExamplesSmall}>
                    {food.examples.slice(0, 4).join(', ')}...
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Counter Selected Groups */}
        <View style={styles.counterBanner}>
          <Text style={styles.counterBannerText}>
            Kelompok Terpilih: <Text style={styles.boldText}>{(selectedFoodIds.length + (isBreastfeeding ? 1 : 0))}</Text> / 8 Kelompok (Target WHO: min. 5)
          </Text>
        </View>
      </StickyCard>

      {/* QUESTION 4: MEAL FREQUENCY */}
      <StickyCard backgroundColor="#FFFFFF" style={styles.sectionCard}>
        <Text style={styles.questionTitle}>4. Frekuensi Makan Makanan Padat / Lunak:</Text>
        <Text style={styles.questionSubtitle}>
          Berapa kali si kecil makan makanan utama (padat/lumat/cincang) dalam 24 jam terakhir?
        </Text>
        <StepperCounter
          value={mealFrequency}
          onChange={setMealFrequency}
          min={0}
          max={8}
          unit="kali makan"
          color={COLORS.primary}
        />
      </StickyCard>

      {/* QUESTION 5: MILK FREQUENCY (FOR NON-BF) */}
      {!isBreastfeeding && (
        <StickyCard backgroundColor="#FFFFFF" style={styles.sectionCard}>
          <Text style={styles.questionTitle}>5. Frekuensi Konsumsi Susu / Olahan Susu:</Text>
          <Text style={styles.questionSubtitle}>
            Karena anak tidak menyusu ASI: berapa kali anak mendapat susu formula atau olahan susu? (Target WHO: min. 2 kali)
          </Text>
          <StepperCounter
            value={milkFrequency}
            onChange={setMilkFrequency}
            min={0}
            max={8}
            unit="kali minum"
            color="#E67E22"
          />
        </StickyCard>
      )}

      {/* BUTTON EVALUATE */}
      <TouchableOpacity
        onPress={handleEvaluate}
        style={styles.evaluateButton}
        activeOpacity={0.8}
      >
        <Feather name="check-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.evaluateButtonText}>Periksa Hasil SMAD Sekarang</Text>
      </TouchableOpacity>

      {/* RESULT SECTION */}
      {result && (
        <View style={styles.resultContainer}>
          <StickyCard
            backgroundColor={result.statusBg}
            hasTapes={true}
            tapeColor={result.isMadPass ? COLORS.washiTape : '#E74C3C'}
            tapePositions={['top-left', 'top-right']}
            style={styles.resultCard}
          >
            {/* Header Badge */}
            <View style={[styles.resultBadge, { backgroundColor: result.statusColor }]}>
              <Feather
                name={result.isMadPass ? 'check-circle' : 'alert-triangle'}
                size={22}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.resultBadgeText}>{result.statusTitle}</Text>
            </View>

            {/* Score Breakdown Table */}
            <View style={styles.breakdownBox}>
              <Text style={styles.breakdownTitle}>Rincian Capaian Indikator:</Text>

              {/* MDD */}
              <View style={styles.breakdownRow}>
                <Text style={styles.indicatorLabel}>Keragaman Pangan (MDD):</Text>
                <View style={styles.indicatorValueRow}>
                  <Text style={[styles.indicatorValue, { color: result.mdd.isPass ? COLORS.success : COLORS.danger }]}>
                    {result.mdd.score}/8 Kelompok
                  </Text>
                  <Feather
                    name={result.mdd.isPass ? 'check' : 'x'}
                    size={16}
                    color={result.mdd.isPass ? COLORS.success : COLORS.danger}
                    style={{ marginLeft: 4 }}
                  />
                </View>
              </View>

              {/* MMF */}
              <View style={styles.breakdownRow}>
                <Text style={styles.indicatorLabel}>Frekuensi Makan (MMF):</Text>
                <View style={styles.indicatorValueRow}>
                  <Text style={[styles.indicatorValue, { color: result.mmf.isPass ? COLORS.success : COLORS.danger }]}>
                    {result.mmf.count} kali (Target min. {result.mmf.target}x)
                  </Text>
                  <Feather
                    name={result.mmf.isPass ? 'check' : 'x'}
                    size={16}
                    color={result.mmf.isPass ? COLORS.success : COLORS.danger}
                    style={{ marginLeft: 4 }}
                  />
                </View>
              </View>

              {/* MMFF if applicable */}
              {result.mmff.isApplicable && (
                <View style={styles.breakdownRow}>
                  <Text style={styles.indicatorLabel}>Frekuensi Susu (MMFF):</Text>
                  <View style={styles.indicatorValueRow}>
                    <Text style={[styles.indicatorValue, { color: result.mmff.isPass ? COLORS.success : COLORS.danger }]}>
                      {result.mmff.count} kali (Target min. {result.mmff.target}x)
                    </Text>
                    <Feather
                      name={result.mmff.isPass ? 'check' : 'x'}
                      size={16}
                      color={result.mmff.isPass ? COLORS.success : COLORS.danger}
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Recommendations List */}
            <View style={styles.adviceBox}>
              <Text style={styles.adviceTitle}>💡 Rekomendasi untuk Bunda:</Text>
              {result.recommendations.map((rec, rIdx) => (
                <View key={rIdx} style={styles.recItem}>
                  <Text style={styles.recText}>{rec.text}</Text>
                  {rec.highlight && (
                    <Text style={styles.recHighlight}>👉 {rec.highlight}</Text>
                  )}
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
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoIcon: {
    marginRight: 10,
  },
  introText: {
    fontSize: 12,
    color: COLORS.textBody,
    flex: 1,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '800',
    color: COLORS.textTitle,
  },
  sectionCard: {
    marginVertical: 6,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textTitle,
    marginBottom: 6,
  },
  questionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 10,
    lineHeight: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  toggleBtnActiveDanger: {
    backgroundColor: '#E74C3C',
    borderColor: '#C0392B',
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textBody,
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  foodList: {
    marginTop: 4,
  },
  foodCheckboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  foodCheckboxItemActive: {
    backgroundColor: '#E8F8F0',
    borderColor: '#27AE60',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkCircleActive: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  foodInfo: {
    flex: 1,
  },
  foodHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  foodGroupNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  foodBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textTitle,
  },
  foodNameActive: {
    color: '#1E4620',
  },
  foodExamplesSmall: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  counterBanner: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  counterBannerText: {
    fontSize: 12,
    color: COLORS.textBody,
  },
  evaluateButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 10,
    ...SHADOWS.button,
  },
  evaluateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resultContainer: {
    marginTop: 12,
  },
  resultCard: {
    padding: 16,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 14,
  },
  resultBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  breakdownBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  indicatorLabel: {
    fontSize: 12,
    color: COLORS.textBody,
    fontWeight: '500',
  },
  indicatorValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  adviceBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
    marginBottom: 6,
  },
  recItem: {
    marginBottom: 8,
  },
  recText: {
    fontSize: 12,
    color: COLORS.textBody,
    lineHeight: 18,
  },
  recHighlight: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '700',
    marginTop: 2,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textBody,
  },
});
