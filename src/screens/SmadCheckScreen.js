import React, { useState, useRef } from 'react';
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
  const scrollRef = useRef(null);

  // Form States
  const [ageGroup, setAgeGroup] = useState('6-8'); // '6-8' atau '9-23'
  const [isBreastfeeding, setIsBreastfeeding] = useState(true);
  const [selectedFoodIds, setSelectedFoodIds] = useState([]);
  const [mealFrequency, setMealFrequency] = useState(2);
  const [milkFrequency, setMilkFrequency] = useState(0);

  // Result State
  const [result, setResult] = useState(null);

  // Total selected food groups including ASI
  const totalFoodCount = selectedFoodIds.length + (isBreastfeeding ? 1 : 0);

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

    // Auto-scroll ke hasil evaluasi
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);

    // Simpan ke riwayat lokal (non-blocking)
    try {
      await StorageService.saveSmadHistory({
        ageGroup,
        isBreastfeeding,
        selectedFoodIds,
        mealFrequency,
        milkFrequency,
        isMadPass: evalResult.isMadPass,
        mddScore: evalResult.mdd.score,
      });
    } catch (err) {
      console.log('Error saving SMAD history:', err);
    }
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
    <ScreenContainer ref={scrollRef} backgroundImage={require('../../Asset/defaultbg.png')}>
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
          Yuk periksa apakah makanan si kecil dalam <Text style={styles.boldText}>24 jam terakhir</Text> sudah memenuhi standar <Text style={styles.boldText}>Minimum Acceptable Diet (MAD)</Text> WHO!
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
              Tidak Menyusu ASI
            </Text>
          </TouchableOpacity>
        </View>
      </StickyCard>

      {/* QUESTION 3: 8 FOOD GROUPS CHECKLIST */}
      <StickyCard backgroundColor="#FFFFFF" style={styles.sectionCard}>
        <View style={styles.questionHeaderRow}>
          <Text style={styles.questionTitle}>3. Makanan yang Dikonsumsi (24 Jam Terakhir):</Text>
        </View>
        <Text style={styles.questionSubtitle}>
          Centang semua kelompok makanan yang dimakan si kecil kemarin:
        </Text>

        {/* Real-time Progress Bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Capaian Keragaman (MDD):</Text>
            <Text style={[styles.progressScore, { color: totalFoodCount >= 5 ? COLORS.success : COLORS.warning }]}>
              {totalFoodCount} dari 8 Kelompok {totalFoodCount >= 5 ? ' (Target Tercapai! 🎉)' : ' (Min. 5 kelompok)'}
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(totalFoodCount / 8) * 100}%`,
                  backgroundColor: totalFoodCount >= 5 ? COLORS.success : COLORS.warning,
                },
              ]}
            />
          </View>
        </View>

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
                    <Text style={styles.foodGroupNumber}>Kelompok {food.groupNumber}</Text>
                    <View style={styles.badgeWrapper}>
                      <Text style={styles.foodBadge}>{food.badge}</Text>
                    </View>
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
      </StickyCard>

      {/* QUESTION 4: MEAL FREQUENCY */}
      <StickyCard backgroundColor="#FFFFFF" style={styles.sectionCard}>
        <Text style={styles.questionTitle}>4. Frekuensi Makan Makanan Padat / Lunak:</Text>
        <Text style={styles.questionSubtitle}>
          Berapa kali si kecil makan makanan utama (padat/lumat/cincang) kemarin?
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
            Karena tidak menyusu ASI: berapa kali si kecil mendapat susu formula atau olahan susu? (Target: min. 2 kali)
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
        <Feather name="check-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.evaluateButtonText}>Evaluasi Gizi (Cek MAD Sekarang)</Text>
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
              <Text style={styles.breakdownTitle}>Rincian Capaian Indikator WHO:</Text>

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
              <Text style={styles.adviceTitle}>💡 Rekomendasi Menu & Tindak Lanjut:</Text>
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
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#C6E3F4',
    ...SHADOWS.card,
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
    fontSize: 14,
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
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
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
  progressCard: {
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  progressScore: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  foodList: {
    marginTop: 4,
  },
  foodCheckboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1.5,
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
    alignItems: 'center',
    marginBottom: 2,
  },
  foodGroupNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  badgeWrapper: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  foodBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textBody,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
  },
  foodNameActive: {
    color: '#15803D',
  },
  foodExamplesSmall: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  evaluateButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 14,
    marginBottom: 10,
    ...SHADOWS.button,
  },
  evaluateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
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
    borderRadius: 12,
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  indicatorLabel: {
    fontSize: 12,
    color: COLORS.textBody,
    fontWeight: '600',
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
    marginBottom: 8,
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
    borderRadius: 10,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textBody,
  },
});
