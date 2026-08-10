import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenContainer from "../components/common/ScreenContainer";
import RibbonHeader from "../components/custom/RibbonHeader";
import WashiTape from "../components/custom/WashiTape";
import StepperCounter from "../components/custom/StepperCounter";
import { FOOD_GROUPS } from "../data/foodGroups";
import { evaluateSMAD } from "../services/smadService";
import { StorageService } from "../services/storageService";
import { COLORS, FONTS, SHADOWS } from "../constants/theme";

export default function SmadCheckScreen({ navigation }) {
  const scrollRef = useRef(null);

  // Form States
  const [ageGroup, setAgeGroup] = useState("6-8"); // '6-8' atau '9-23'
  const [isBreastfeeding, setIsBreastfeeding] = useState(true);
  const [selectedFoodIds, setSelectedFoodIds] = useState([
    "grains_roots",
    "flesh_foods",
    "eggs",
    "fruits_veg_vita",
  ]);
  const [mealFrequency, setMealFrequency] = useState(2);
  const [milkFrequency, setMilkFrequency] = useState(0);

  // Result State
  const [result, setResult] = useState(null);

  // Total selected food groups including ASI
  const totalFoodCount = selectedFoodIds.length + (isBreastfeeding ? 1 : 0);

  // Toggle Food Selection
  const toggleFoodGroup = (id) => {
    if (id === "breastmilk") {
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
      console.log("Error saving SMAD history:", err);
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
  }, [
    ageGroup,
    isBreastfeeding,
    selectedFoodIds,
    mealFrequency,
    milkFrequency,
  ]);

  const handleReset = () => {
    setAgeGroup("6-8");
    setIsBreastfeeding(true);
    setSelectedFoodIds([]);
    setMealFrequency(2);
    setMilkFrequency(0);
    setResult(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const targetMmf = isBreastfeeding ? (ageGroup === "6-8" ? 2 : 3) : 4;

  return (
    <ScreenContainer
      ref={scrollRef}
      backgroundImage={require("../../Asset/defaultbg.png")}
    >
      {/* Header */}
      <RibbonHeader
        title="Cek SMAD"
        subtitle="Evaluasi Mandiri MPASI – MAD Usia 6–23 Bulan"
        onBack={() => navigation.goBack()}
      />

      {/* Intro Note */}
      <View style={styles.introCard}>
        <View style={styles.infoIconWrapper}>
          <Feather name="info" size={16} color="#0284C7" />
        </View>
        <Text style={styles.introText}>
          Yuk periksa apakah makanan si kecil dalam{" "}
          <Text style={styles.boldText}>24 jam terakhir</Text> sudah memenuhi
          standar{" "}
          <Text style={styles.boldText}>Minimum Acceptable Diet (MAD)</Text>{" "}
          WHO!
        </Text>
      </View>

      {/* Single Clean Form Panel with Washi Tapes */}
      <View style={styles.formPanel}>
        <WashiTape position="top-left" color={COLORS.washiTape} />
        <WashiTape position="top-right" color={COLORS.washiTape} />

        {/* PERTANYAAN 1: USIA ANAK */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>1. Usia Anak Saat Ini</Text>
          <View style={styles.segmentedContainer}>
            <TouchableOpacity
              onPress={() => setAgeGroup("6-8")}
              style={[
                styles.segmentedTab,
                ageGroup === "6-8" && styles.segmentedTabActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentedText,
                  ageGroup === "6-8" && styles.segmentedTextActive,
                ]}
              >
                6 – 8 Bulan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAgeGroup("9-23")}
              style={[
                styles.segmentedTab,
                ageGroup === "9-23" && styles.segmentedTabActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentedText,
                  ageGroup === "9-23" && styles.segmentedTextActive,
                ]}
              >
                9 – 23 Bulan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PERTANYAAN 2: STATUS MENYUSU */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>
            2. Apakah Anak Masih Menyusu ASI?
          </Text>
          <View style={styles.segmentedContainer}>
            <TouchableOpacity
              onPress={() => setIsBreastfeeding(true)}
              style={[
                styles.segmentedTab,
                isBreastfeeding && styles.segmentedTabActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentedText,
                  isBreastfeeding && styles.segmentedTextActive,
                ]}
              >
                Ya, Masih ASI 🤱
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsBreastfeeding(false)}
              style={[
                styles.segmentedTab,
                !isBreastfeeding && styles.segmentedTabDangerActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentedText,
                  !isBreastfeeding && styles.segmentedTextActive,
                ]}
              >
                Tidak Menyusu 🍼
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PERTANYAAN 3: 8 KELOMPOK MAKANAN */}
        <View style={styles.questionSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.questionTitle}>
              3. Makanan yang Dikonsumsi (24 Jam Terakhir)
            </Text>
          </View>
          <Text style={styles.questionSubtitle}>
            Centang semua kelompok makanan yang dimakan si kecil kemarin:
          </Text>

          {/* Real-time Progress Bar */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Capaian Keragaman (MDD):</Text>
              <Text
                style={[
                  styles.progressScore,
                  { color: totalFoodCount >= 5 ? "#16A34A" : "#D97706" },
                ]}
              >
                {totalFoodCount} dari 8 Kelompok{" "}
                {totalFoodCount >= 5
                  ? " (Target Tercapai! 🎉)"
                  : " (Min. 5 kelompok)"}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(100, (totalFoodCount / 8) * 100)}%`,
                    backgroundColor:
                      totalFoodCount >= 5 ? "#10B981" : "#F59E0B",
                  },
                ]}
              />
            </View>
          </View>

          {/* List of 8 Food Groups (Clean Flat Rows) */}
          <View style={styles.foodList}>
            {FOOD_GROUPS.map((food) => {
              const isAsi = food.id === "breastmilk";
              const isSelected = isAsi
                ? isBreastfeeding
                : selectedFoodIds.includes(food.id);

              return (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => toggleFoodGroup(food.id)}
                  style={[
                    styles.foodRow,
                    isSelected ? styles.foodRowActive : styles.foodRowInactive,
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkCircle,
                      isSelected && styles.checkCircleActive,
                    ]}
                  >
                    {isSelected && (
                      <Feather name="check" size={13} color="#FFFFFF" />
                    )}
                  </View>

                  <View style={styles.foodContent}>
                    <View style={styles.foodHeaderRow}>
                      <Text
                        style={[
                          styles.foodGroupBadge,
                          isSelected && { color: "#0369A1" },
                        ]}
                      >
                        Kelompok {food.groupNumber}
                      </Text>
                      <View
                        style={[
                          styles.badgeTag,
                          isSelected && { backgroundColor: "#DCFCE7" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeTagText,
                            isSelected && { color: "#15803D" },
                          ]}
                        >
                          {isAsi && isBreastfeeding
                            ? "Otomatis Terpenuhi"
                            : food.badge}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.foodTitle,
                        isSelected && styles.foodTitleActive,
                      ]}
                    >
                      {food.title}
                    </Text>

                    <Text style={styles.foodExamples} numberOfLines={1}>
                      {food.examples.slice(0, 4).join(", ")}...
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
            <Text style={styles.questionTitle}>
              4. Frekuensi Makan Makanan Padat / Lunak
            </Text>
            <View style={styles.targetBadge}>
              <Text style={styles.targetBadgeText}>
                Target: min. {targetMmf}x
              </Text>
            </View>
          </View>
          <Text style={styles.questionSubtitle}>
            Berapa kali si kecil makan makanan utama (lumat/lembik/keluarga)
            kemarin?
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
              <Text style={styles.questionTitle}>
                5. Frekuensi Konsumsi Susu / Olahan Susu
              </Text>
              <View
                style={[styles.targetBadge, { backgroundColor: "#FEF3C7" }]}
              >
                <Text style={[styles.targetBadgeText, { color: "#B45309" }]}>
                  Target: min. 2x
                </Text>
              </View>
            </View>
            <Text style={styles.questionSubtitle}>
              Karena tidak menyusu ASI: berapa kali si kecil mendapat susu
              formula/olahan susu kemarin?
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
          <Feather
            name="check-circle"
            size={18}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.evaluateBtnText}>Evaluasi Gizi SMAD</Text>
        </TouchableOpacity>
      </View>

      {/* RESULT SECTION */}
      {result && (
        <View style={styles.resultSectionWrapper}>
          <View
            style={[styles.resultCard, { backgroundColor: result.statusBg }]}
          >
            <WashiTape
              position="top-left"
              color={result.isMadPass ? COLORS.washiTape : "#EF4444"}
            />
            <WashiTape
              position="top-right"
              color={result.isMadPass ? COLORS.washiTape : "#EF4444"}
            />

            {/* Status Title Banner */}
            <View
              style={[
                styles.resultBanner,
                { backgroundColor: result.statusColor },
              ]}
            >
              <Feather
                name={result.isMadPass ? "check-circle" : "alert-triangle"}
                size={22}
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
                <Text
                  style={[
                    styles.indScore,
                    { color: result.mdd.isPass ? "#16A34A" : "#DC2626" },
                  ]}
                >
                  {result.mdd.score}/8
                </Text>
                <Text style={styles.indStatus}>
                  {result.mdd.isPass ? "✅ Tercapai (≥5)" : "❌ Kurang (<5)"}
                </Text>
              </View>

              {/* MMF */}
              <View style={styles.indicatorCard}>
                <Text style={styles.indTitle}>Frekuensi (MMF)</Text>
                <Text
                  style={[
                    styles.indScore,
                    { color: result.mmf.isPass ? "#16A34A" : "#DC2626" },
                  ]}
                >
                  {result.mmf.count}x
                </Text>
                <Text style={styles.indStatus}>
                  {result.mmf.isPass
                    ? `✅ Cukup (≥${result.mmf.target}x)`
                    : `❌ Kurang (<${result.mmf.target}x)`}
                </Text>
              </View>

              {/* MMFF */}
              <View style={styles.indicatorCard}>
                <Text style={styles.indTitle}>Susu (MMFF)</Text>
                <Text
                  style={[
                    styles.indScore,
                    { color: result.mmff.isPass ? "#16A34A" : "#DC2626" },
                  ]}
                >
                  {result.mmff.isApplicable ? `${result.mmff.count}x` : "ASI"}
                </Text>
                <Text style={styles.indStatus}>
                  {result.mmff.isApplicable
                    ? result.mmff.isPass
                      ? "✅ Cukup (≥2x)"
                      : "❌ Kurang (<2x)"
                    : "🤱 Menyusu ASI"}
                </Text>
              </View>
            </View>

            {/* Recommendations List */}
            <View style={styles.recommendationCard}>
              <Text style={styles.recCardTitle}>
                💡 Rekomendasi Menu & Tindak Lanjut:
              </Text>
              {result.recommendations.map((rec, rIdx) => (
                <View key={rIdx} style={styles.recItemBox}>
                  <Text style={styles.recTextMain}>{rec.text}</Text>
                  {rec.highlight && (
                    <Text style={styles.recHighlightText}>
                      👉 {rec.highlight}
                    </Text>
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
              <Feather
                name="refresh-cw"
                size={16}
                color="#475569"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.resetButtonText}>Hitung Ulang Menu Lain</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  introCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#C6E3F4",
    ...SHADOWS.cardFloating,
  },
  infoIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  introText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: "#334155",
    flex: 1,
    lineHeight: 18,
  },
  boldText: {
    fontFamily: FONTS.semiBold,
    color: "#334155",
  },
  formPanel: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...SHADOWS.cardFloating,
  },
  questionSection: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  questionTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#334155",
    marginBottom: 6,
  },
  questionSubtitle: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginBottom: 8,
    lineHeight: 15,
  },
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginTop: 2,
  },
  segmentedTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 11,
  },
  segmentedTabActive: {
    backgroundColor: "#0284C7",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentedTabDangerActive: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentedText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: "#64748B",
  },
  segmentedTextActive: {
    color: "#FFFFFF",
    fontFamily: FONTS.semiBold,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
    gap: 4,
  },
  targetBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  targetBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    color: "#0369A1",
  },
  progressCard: {
    backgroundColor: "#F0F9FF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: "#0369A1",
  },
  progressScore: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  foodList: {
    marginTop: 4,
  },
  foodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
  },
  foodRowInactive: {
    backgroundColor: "#F8FAFC",
    borderColor: "#F1F5F9",
  },
  foodRowActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#FFFFFF",
  },
  checkCircleActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  foodContent: {
    flex: 1,
  },
  foodHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
  },
  foodGroupBadge: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    color: "#64748B",
  },
  badgeTag: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeTagText: {
    fontSize: 9,
    fontFamily: FONTS.medium,
    color: "#475569",
  },
  foodTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#334155",
  },
  foodTitleActive: {
    color: "#15803D",
  },
  foodExamples: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginTop: 1,
  },
  evaluateBtn: {
    backgroundColor: "#0284C7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 8,
    width: "100%",
    ...SHADOWS.button,
  },
  evaluateBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.bold,
    letterSpacing: 0.2,
  },
  resultSectionWrapper: {
    marginTop: 14,
    width: "100%",
  },
  resultCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...SHADOWS.cardFloating,
  },
  resultBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  resultBannerText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONTS.bold,
    letterSpacing: 0.2,
  },
  indicatorsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  indicatorCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  indTitle: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: "#64748B",
    textAlign: "center",
  },
  indScore: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginVertical: 4,
  },
  indStatus: {
    fontSize: 9,
    fontFamily: FONTS.medium,
    color: "#334155",
    textAlign: "center",
  },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  recCardTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#334155",
    marginBottom: 8,
  },
  recItemBox: {
    marginBottom: 8,
  },
  recTextMain: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: "#334155",
    lineHeight: 18,
  },
  recHighlightText: {
    fontSize: 12,
    color: "#0284C7",
    fontFamily: FONTS.semiBold,
    marginTop: 2,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 12,
  },
  resetButtonText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#475569",
  },
});
