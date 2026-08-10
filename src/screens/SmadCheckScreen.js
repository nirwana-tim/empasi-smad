import React, { useState, useRef, useEffect } from 'react';
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
  const [selectedFoodIds, setSelectedFoodIds] = useState(['grains_roots', 'flesh_foods', 'eggs', 'fruits_veg_vita']);
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

    // Auto-scroll ke hasil evaluasi agar langsung terlihat
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

  // Real-time update jika hasil sudah terbuka
  useEffect(() => {
    if (result) {
      const evalResult = evaluateSMAD({
        ageGroup,
        isBreastfeeding,
        selectedFoodIds,
        mealFrequency,
        milkFrequency,
      });
      setResult(evalResult);
    }
  }, [ageGroup, isBreastfeeding, selectedFoodIds, mealFrequency, milkFrequency]);

  const handleReset = () => {
    setAgeGroup('6-8');
    setIsBreastfeeding(true);
    setSelectedFoodIds([]);
    setMealFrequency(2);
    setMilkFrequency(0);
    setResult(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const targetMmf = isBreastfeeding ? (ageGroup === '6-8' ? 2 : 3) : 4;

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
        <View style={styles.infoIconWrapper}>
          <Feather name="info" size={18} color="#0284C7" />
        </View>
        <Text style={styles.introText}>
          Yuk periksa apakah makanan si kecil dalam <Text style={styles.boldText}>24 jam terakhir</Text> sudah memenuhi standar <Text style={styles.boldText}>Minimum Acceptable Diet (MAD)</Text> WHO!
        </Text>
      </View>

      {/* UNIFIED SINGLE FORM CARD */}
      <StickyCard
        backgroundColor="#FFFFFF"
        showLines={false}
        hasTapes={true}
        tapeColor={COLORS.washiTape}
        tapePositions={['top-left', 'top-right']}
        style={styles.formCard}
      >
        {/* PERTANYAAN 1: USIA ANAK */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>1. Usia Anak Saat Ini:</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setAgeGroup('6-8')}
              style={[
                styles.toggleBtn,
                ageGroup === '6-8' ? styles.toggleBtnActive : styles.toggleBtnInactive,
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleBtnText, ageGroup === '6-8' && styles.toggleBtnTextActive]}>
                6 – 8 Bulan
              </Text>
              <Text style={[styles.toggleBtnSub, ageGroup === '6-8' && styles.toggleBtnSubActive]}>
                MP-ASI Awal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAgeGroup('9-23')}
              style={[
                styles.toggleBtn,
                ageGroup === '9-23' ? styles.toggleBtnActive : styles.toggleBtnInactive,
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleBtnText, ageGroup === '9-23' && styles.toggleBtnTextActive]}>
                9 – 23 Bulan
              </Text>
              <Text style={[styles.toggleBtnSub, ageGroup === '9-23' && styles.toggleBtnSubActive]}>
                MP-ASI Lanjutan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PERTANYAAN 2: STATUS MENYUSU */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>2. Apakah Anak Masih Menyusu ASI?</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setIsBreastfeeding(true)}
              style={[
                styles.toggleBtn,
                isBreastfeeding ? styles.toggleBtnActive : styles.toggleBtnInactive,
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleBtnText, isBreastfeeding && styles.toggleBtnTextActive]}>
                Ya, Masih ASI 🤱
              </Text>
              <Text style={[styles.toggleBtnSub, isBreastfeeding && styles.toggleBtnSubActive]}>
                Otomatis +1 Kelompok
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsBreastfeeding(false)}
              style={[
                styles.toggleBtn,
                !isBreastfeeding ? styles.toggleBtnDangerActive : styles.toggleBtnInactive,
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleBtnText, !isBreastfeeding && styles.toggleBtnTextActive]}>
                Tidak Menyusu 🍼
              </Text>
              <Text style={[styles.toggleBtnSub, !isBreastfeeding && styles.toggleBtnSubActive]}>
                Wajib Susu Min. 2x
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PERTANYAAN 3: 8 KELOMPOK MAKANAN */}
        <View style={styles.questionSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.questionTitle}>3. Makanan yang Dikonsumsi (24 Jam Terakhir):</Text>
          </View>
          <Text style={styles.questionSubtitle}>
            Centang semua kelompok makanan yang dimakan si kecil kemarin:
          </Text>

          {/* Real-time Progress Bar */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Capaian Keragaman (MDD):</Text>
              <Text style={[styles.progressScore, { color: totalFoodCount >= 5 ? '#16A34A' : '#D97706' }]}>
                {totalFoodCount} dari 8 Kelompok {totalFoodCount >= 5 ? ' (Target Tercapai! 🎉)' : ' (Min. 5 kelompok)'}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(100, (totalFoodCount / 8) * 100)}%`,
                    backgroundColor: totalFoodCount >= 5 ? '#10B981' : '#F59E0B',
                  },
                ]}
              />
            </View>
          </View>

          {/* List of 8 Food Groups */}
          <View style={styles.foodList}>
            {FOOD_GROUPS.map((food) => {
              const isAsi = food.id === 'breastmilk';
              const isSelected = isAsi ? isBreastfeeding : selectedFoodIds.includes(food.id);

              return (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => toggleFoodGroup(food.id)}
                  style={[
                    styles.foodItemCard,
                    isSelected ? styles.foodItemActive : styles.foodItemInactive,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
                    {isSelected && <Feather name="check" size={14} color="#FFFFFF" />}
                  </View>

                  <View style={styles.foodContent}>
                    <View style={styles.foodHeaderRow}>
                      <Text style={[styles.foodGroupBadge, isSelected && { color: '#0369A1' }]}>
                        Kelompok {food.groupNumber}
                      </Text>
                      <View style={[styles.badgeTag, isSelected && { backgroundColor: '#DCFCE7' }]}>
                        <Text style={[styles.badgeTagText, isSelected && { color: '#15803D' }]}>
                          {isAsi && isBreastfeeding ? 'Otomatis Terpenuhi' : food.badge}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.foodTitle, isSelected && styles.foodTitleActive]}>
                      {food.title}
                    </Text>

                    <Text style={styles.foodExamples} numberOfLines={1}>
                      {food.examples.slice(0, 4).join(', ')}...
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* PERTANYAAN 4: FREKUENSI MAKAN UTAMA */}
        <View style={styles.questionSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.questionTitle}>4. Frekuensi Makan Makanan Padat/Lunak:</Text>
            <View style={styles.targetBadge}>
              <Text style={styles.targetBadgeText}>Target: min. {targetMmf}x</Text>
            </View>
          </View>
          <Text style={styles.questionSubtitle}>
            Berapa kali si kecil makan makanan utama (lumat/lembik/keluarga) kemarin?
          </Text>
          <StepperCounter
            value={mealFrequency}
            onChange={setMealFrequency}
            min={0}
            max={8}
            unit="kali makan"
            color="#0284C7"
          />
        </View>

        {/* PERTANYAAN 5: FREKUENSI SUSU (JIKA NON-ASI) */}
        {!isBreastfeeding && (
          <View style={styles.questionSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.questionTitle}>5. Frekuensi Konsumsi Susu / Olahan Susu:</Text>
              <View style={[styles.targetBadge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.targetBadgeText, { color: '#B45309' }]}>Target: min. 2x</Text>
              </View>
            </View>
            <Text style={styles.questionSubtitle}>
              Karena tidak menyusu ASI: berapa kali si kecil mendapat susu formula/olahan susu kemarin?
            </Text>
            <StepperCounter
              value={milkFrequency}
              onChange={setMilkFrequency}
              min={0}
              max={8}
              unit="kali minum"
              color="#D97706"
            />
          </View>
        )}

        {/* CTA EVALUATE BUTTON */}
        <TouchableOpacity
          onPress={handleEvaluate}
          style={styles.evaluateBtn}
          activeOpacity={0.85}
        >
          <Feather name="check-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.evaluateBtnText}>Evaluasi Gizi SMAD</Text>
        </TouchableOpacity>
      </StickyCard>

      {/* RESULT SECTION */}
      {result && (
        <View style={styles.resultSectionWrapper}>
          <StickyCard
            backgroundColor={result.statusBg}
            showLines={false}
            hasTapes={true}
            tapeColor={result.isMadPass ? COLORS.washiTape : '#EF4444'}
            tapePositions={['top-left', 'top-right']}
            style={styles.resultCard}
          >
            {/* Status Title Banner */}
            <View style={[styles.resultBanner, { backgroundColor: result.statusColor }]}>
              <Feather
                name={result.isMadPass ? 'check-circle' : 'alert-triangle'}
                size={24}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.resultBannerText}>{result.statusTitle}</Text>
            </View>

            {/* 3 Indikator Breakdown Cards */}
            <View style={styles.indicatorsGrid}>
              {/* MDD */}
              <View style={styles.indicatorCard}>
                <Text style={styles.indTitle}>Keragaman (MDD)</Text>
                <Text style={[styles.indScore, { color: result.mdd.isPass ? '#16A34A' : '#DC2626' }]}>
                  {result.mdd.score}/8
                </Text>
                <Text style={styles.indStatus}>
                  {result.mdd.isPass ? '✅ Tercapai (≥5)' : '❌ Kurang (<5)'}
                </Text>
              </View>

              {/* MMF */}
              <View style={styles.indicatorCard}>
                <Text style={styles.indTitle}>Frekuensi (MMF)</Text>
                <Text style={[styles.indScore, { color: result.mmf.isPass ? '#16A34A' : '#DC2626' }]}>
                  {result.mmf.count}x
                </Text>
                <Text style={styles.indStatus}>
                  {result.mmf.isPass ? `✅ Cukup (≥${result.mmf.target}x)` : `❌ Kurang (<${result.mmf.target}x)`}
                </Text>
              </View>

              {/* MMFF */}
              <View style={styles.indicatorCard}>
                <Text style={styles.indTitle}>Susu (MMFF)</Text>
                <Text style={[styles.indScore, { color: result.mmff.isPass ? '#16A34A' : '#DC2626' }]}>
                  {result.mmff.isApplicable ? `${result.mmff.count}x` : 'ASI'}
                </Text>
                <Text style={styles.indStatus}>
                  {result.mmff.isApplicable
                    ? (result.mmff.isPass ? '✅ Cukup (≥2x)' : '❌ Kurang (<2x)')
                    : '🤱 Menyusu ASI'}
                </Text>
              </View>
            </View>

            {/* Recommendations List */}
            <View style={styles.recommendationCard}>
              <Text style={styles.recCardTitle}>💡 Rekomendasi Menu & Tindak Lanjut:</Text>
              {result.recommendations.map((rec, rIdx) => (
                <View key={rIdx} style={styles.recItemBox}>
                  <Text style={styles.recTextMain}>{rec.text}</Text>
                  {rec.highlight && (
                    <Text style={styles.recHighlightText}>👉 {rec.highlight}</Text>
                  )}
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
              <Text style={styles.resetButtonText}>Hitung Ulang Menu Lainnya</Text>
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
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#C6E3F4',
    ...SHADOWS.cardFloating,
  },
  infoIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  formCard: {
    width: '100%',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.cardFloating,
  },
  questionSection: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  questionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  targetBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  targetBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369A1',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  toggleBtnInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  toggleBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
    ...SHADOWS.button,
  },
  toggleBtnDangerActive: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
    ...SHADOWS.button,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  toggleBtnSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  toggleBtnSubActive: {
    color: '#E0F2FE',
  },
  progressCard: {
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
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
    color: '#0369A1',
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
  foodItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  foodItemInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  foodItemActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
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
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  foodContent: {
    flex: 1,
  },
  foodHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  foodGroupBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  badgeTag: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  foodTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  foodTitleActive: {
    color: '#15803D',
  },
  foodExamples: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  evaluateBtn: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 8,
    width: '100%',
    ...SHADOWS.button,
  },
  evaluateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  resultSectionWrapper: {
    marginTop: 14,
    width: '100%',
  },
  resultCard: {
    padding: 16,
    borderRadius: 20,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  resultBannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  indicatorCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  indTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  indScore: {
    fontSize: 18,
    fontWeight: '900',
    marginVertical: 4,
  },
  indStatus: {
    fontSize: 9,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  recCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  recItemBox: {
    marginBottom: 8,
  },
  recTextMain: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  recHighlightText: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '700',
    marginTop: 2,
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
