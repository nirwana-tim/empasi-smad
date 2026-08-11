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
    "vitamin_a_fruits_veg",
  ]);
  const [mealFrequency, setMealFrequency] = useState(2);
  const [milkFrequency, setMilkFrequency] = useState(0);

  // Result State
  const [result, setResult] = useState(null);

  // Total selected food groups including ASI
  const totalFoodCount = selectedFoodIds.length + (isBreastfeeding ? 1 : 0);

  // Toggle Food Selection
  const toggleFoodGroup = (id) => {
    setResult(null);
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
              onPress={() => {
                setAgeGroup("6-8");
                setResult(null);
              }}
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
              onPress={() => {
                setAgeGroup("9-23");
                setResult(null);
              }}
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
              onPress={() => {
                setIsBreastfeeding(true);
                setResult(null);
              }}
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
              onPress={() => {
                setIsBreastfeeding(false);
                setResult(null);
              }}
              style={[
                styles.segmentedTab,
                !isBreastfeeding && styles.segmentedTabActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentedText,
                  !isBreastfeeding && styles.segmentedTextActive,
                ]}
              >
                Tidak / Non-ASI 🍼
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

          {/* List of 8 Food Groups (Numbered Subheadings with Cards Below) */}
          <View style={styles.foodList}>
            {FOOD_GROUPS.map((food, index) => {
              const alphabetIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
              const isAsi = food.id === "breastmilk";
              const isSelected = isAsi
                ? isBreastfeeding
                : selectedFoodIds.includes(food.id);

              return (
                <View key={food.id} style={styles.foodGroupBlock}>
                  {/* Sub-header OUTSIDE the card */}
                  <View style={styles.foodGroupHeader}>
                    <Text
                      style={[
                        styles.foodGroupHeaderTitle,
                        isSelected && styles.foodGroupHeaderTitleActive,
                      ]}
                    >
                      {alphabetIndex[index] || index + 1}. Kelompok {food.groupNumber}
                    </Text>
                    <View style={styles.badgeTag}>
                      <Text style={styles.badgeTagText}>
                        {isAsi && isBreastfeeding
                          ? "Otomatis Terpenuhi"
                          : food.badge}
                      </Text>
                    </View>
                  </View>

                  {/* Selectable Card Below Subheader */}
                  <TouchableOpacity
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
                        <Feather name="check" size={14} color="#FFFFFF" />
                      )}
                    </View>

                    <View style={styles.foodContent}>
                      <Text
                        style={[
                          styles.foodTitle,
                          isSelected && styles.foodTitleActive,
                        ]}
                      >
                        {food.title}
                      </Text>

                      <Text style={styles.foodExamples}>
                        <Text style={styles.foodExamplesPrefix}>Contoh: </Text>
                        {food.examples.join(", ")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
            onChange={(val) => {
              setMealFrequency(val);
              setResult(null);
            }}
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
              Untuk anak non-ASI / sufor: berapa kali si kecil mendapat susu
              formula atau olahan susu kemarin?
            </Text>
            <StepperCounter
              value={milkFrequency}
              onChange={(val) => {
                setMilkFrequency(val);
                setResult(null);
              }}
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
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={styles.resultBannerText}>{result.statusTitle}</Text>
                <Text style={styles.resultBannerSubtitle}>
                  Standar Minimum Acceptable Diet (MAD) WHO
                </Text>
              </View>
            </View>

            {/* Hero Metric Summary Card */}
            <View style={styles.metricSummaryCard}>
              <Text style={styles.metricLabel}>Skor Keragaman Pangan (MDD)</Text>
              <Text style={[styles.metricNumber, { color: result.statusColor }]}>
                {result.mdd.score} / 8
              </Text>

              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: result.statusBg,
                    borderColor: result.statusColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryBadgeText,
                    { color: result.statusColor },
                  ]}
                >
                  {result.mdd.isPass
                    ? "Keragaman Terpenuhi (≥5 Kelompok)"
                    : "Kurang Beragam (<5 Kelompok)"}
                </Text>
              </View>

              <View style={styles.comparisonBox}>
                <Text style={styles.comparisonText}>
                  {result.isMadPass
                    ? "🌟 Makanan si kecil telah memenuhi standar keragaman & frekuensi gizi harian!"
                    : "⚠️ Si kecil memerlukan minimal 5 kelompok makanan & frekuensi makan yang cukup."}
                </Text>
              </View>
            </View>

            {/* 3 Indikator Breakdown Cards */}
            <View style={styles.indicatorsGrid}>
              {/* MDD */}
              <View style={styles.indicatorCard}>
                <Text style={styles.indIcon}>🥗</Text>
                <Text style={styles.indTitle}>Keragaman</Text>
                <Text
                  style={[
                    styles.indScore,
                    { color: result.mdd.isPass ? "#15803D" : "#DC2626" },
                  ]}
                >
                  {result.mdd.score}/8
                </Text>
                <View
                  style={[
                    styles.indBadge,
                    {
                      backgroundColor: result.mdd.isPass ? "#DCFCE7" : "#FEE2E2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.indStatus,
                      { color: result.mdd.isPass ? "#15803D" : "#DC2626" },
                    ]}
                  >
                    {result.mdd.isPass ? "✅ Min. 5" : "❌ Kurang"}
                  </Text>
                </View>
              </View>

              {/* MMF */}
              <View style={styles.indicatorCard}>
                <Text style={styles.indIcon}>⏱️</Text>
                <Text style={styles.indTitle}>Frekuensi</Text>
                <Text
                  style={[
                    styles.indScore,
                    { color: result.mmf.isPass ? "#15803D" : "#DC2626" },
                  ]}
                >
                  {result.mmf.count}x
                </Text>
                <View
                  style={[
                    styles.indBadge,
                    {
                      backgroundColor: result.mmf.isPass ? "#DCFCE7" : "#FEE2E2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.indStatus,
                      { color: result.mmf.isPass ? "#15803D" : "#DC2626" },
                    ]}
                  >
                    {result.mmf.isPass ? `✅ Min. ${result.mmf.target}x` : "❌ Kurang"}
                  </Text>
                </View>
              </View>

              {/* MMFF */}
              <View style={styles.indicatorCard}>
                <Text style={styles.indIcon}>{isBreastfeeding ? "🤱" : "🍼"}</Text>
                <Text style={styles.indTitle}>Status Susu</Text>
                <Text
                  style={[
                    styles.indScore,
                    { color: result.mmff.isPass ? "#15803D" : "#DC2626" },
                  ]}
                >
                  {result.mmff.isApplicable ? `${result.mmff.count}x` : "ASI"}
                </Text>
                <View
                  style={[
                    styles.indBadge,
                    {
                      backgroundColor: result.mmff.isPass ? "#DCFCE7" : "#FEE2E2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.indStatus,
                      { color: result.mmff.isPass ? "#15803D" : "#DC2626" },
                    ]}
                  >
                    {result.mmff.isApplicable
                      ? result.mmff.isPass
                        ? "✅ Min. 2x"
                        : "❌ Kurang"
                      : "✅ Terpenuhi"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Visual 8 Food Groups Breakdown Grid */}
            <View style={styles.foodBreakdownCard}>
              <Text style={styles.foodBreakdownTitle}>
                📋 Ringkasan 8 Kelompok Makanan Kemarin:
              </Text>
              <View style={styles.foodBreakdownGrid}>
                {FOOD_GROUPS.map((food) => {
                  const isAsi = food.id === "breastmilk";
                  const isEaten = isAsi
                    ? isBreastfeeding
                    : selectedFoodIds.includes(food.id);

                  return (
                    <View
                      key={food.id}
                      style={[
                        styles.foodBreakdownChip,
                        isEaten
                          ? styles.foodBreakdownChipActive
                          : styles.foodBreakdownChipInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.foodBreakdownIcon,
                          { color: isEaten ? "#15803D" : "#94A3B8" },
                        ]}
                      >
                        {isEaten ? "✓" : "○"}
                      </Text>
                      <Text
                        style={[
                          styles.foodBreakdownText,
                          isEaten && styles.foodBreakdownTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {food.groupNumber}. {food.title}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Recommendations List */}
            <View style={styles.recommendationCard}>
              <Text style={styles.recCardTitle}>
                💡 Rekomendasi Menu & Tindak Lanjut:
              </Text>
              {result.recommendations.map((rec, rIdx) => (
                <View key={rIdx} style={styles.recItemBox}>
                  <View style={styles.recItemRow}>
                    <View style={styles.recBulletDot} />
                    <Text style={styles.recTextMain}>{rec.text}</Text>
                  </View>
                  {rec.highlight && (
                    <View style={styles.recHighlightPill}>
                      <Text style={styles.recHighlightText}>
                        👉 {rec.highlight}
                      </Text>
                    </View>
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
    marginTop: 8,
  },
  foodGroupBlock: {
    marginBottom: 14,
  },
  foodGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  foodGroupHeaderTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#475569",
  },
  foodGroupHeaderTitleActive: {
    color: "#0284C7",
    fontFamily: FONTS.bold,
  },
  badgeTag: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  badgeTagText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    color: "#0369A1",
  },
  foodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  foodRowInactive: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  foodRowActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  checkCircleActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  foodContent: {
    flex: 1,
  },
  foodTitle: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: "#334155",
    marginBottom: 2,
  },
  foodTitleActive: {
    color: "#15803D",
  },
  foodExamples: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#64748B",
    lineHeight: 16,
  },
  foodExamplesPrefix: {
    fontFamily: FONTS.medium,
    color: "#475569",
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
    position: "relative",
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
    textAlign: "center",
  },
  resultBannerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
    textAlign: "center",
  },
  metricSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...SHADOWS.card,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: "#64748B",
    marginBottom: 4,
  },
  metricNumber: {
    fontSize: 34,
    fontFamily: FONTS.bold,
    marginVertical: 2,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 4,
    marginBottom: 10,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  comparisonBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  comparisonText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: "#334155",
    textAlign: "center",
    lineHeight: 18,
  },
  indicatorsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  indicatorCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...SHADOWS.card,
  },
  indIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  indTitle: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: "#64748B",
    textAlign: "center",
  },
  indScore: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginVertical: 4,
  },
  indBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  indStatus: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    textAlign: "center",
  },
  foodBreakdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...SHADOWS.card,
  },
  foodBreakdownTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#334155",
    marginBottom: 10,
  },
  foodBreakdownGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  foodBreakdownChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    width: "48.5%",
  },
  foodBreakdownChipActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },
  foodBreakdownChipInactive: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  foodBreakdownIcon: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    marginRight: 4,
  },
  foodBreakdownText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: "#64748B",
    flex: 1,
  },
  foodBreakdownTextActive: {
    color: "#15803D",
    fontFamily: FONTS.semiBold,
  },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...SHADOWS.card,
  },
  recCardTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#334155",
    marginBottom: 8,
  },
  recItemBox: {
    marginBottom: 10,
  },
  recItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recBulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0284C7",
    marginTop: 6,
    marginRight: 8,
  },
  recTextMain: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: "#334155",
    lineHeight: 18,
    flex: 1,
  },
  recHighlightPill: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
    marginLeft: 14,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  recHighlightText: {
    fontSize: 11,
    color: "#0284C7",
    fontFamily: FONTS.semiBold,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 12,
  },
  resetButtonText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: "#475569",
  },
});
