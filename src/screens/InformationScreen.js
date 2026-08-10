import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenContainer from '../components/common/ScreenContainer';
import RibbonHeader from '../components/custom/RibbonHeader';
import WashiTape from '../components/custom/WashiTape';
import { EDUCATION_CHAPTERS } from '../data/educationContent';
import { FOOD_GROUPS } from '../data/foodGroups';
import { StorageService } from '../services/storageService';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

export default function InformationScreen({ navigation }) {
  // activeIndex: 0 s/d (EDUCATION_CHAPTERS.length - 1) adalah Bab Materi
  // activeIndex === EDUCATION_CHAPTERS.length adalah Halaman Terpisah: SELESAI
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const totalChapters = EDUCATION_CHAPTERS.length;
  const isCompletionPage = activeChapterIndex === totalChapters;
  const chapter = !isCompletionPage ? EDUCATION_CHAPTERS[activeChapterIndex] : null;

  // Jika sampai di Halaman Selesai, otomatis tandai materi telah rampung
  useEffect(() => {
    if (isCompletionPage) {
      StorageService.setMaterialsCompleted(true);
    }
  }, [activeChapterIndex]);

  return (
    <ScreenContainer backgroundImage={require('../../Asset/defaultbg.png')}>
      {/* Header */}
      <RibbonHeader
        title="Informasi Edukasi"
        subtitle="Panduan MP-ASI Pencegahan Stunting"
        onBack={() => navigation.goBack()}
      />

      {/* Horizontal Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContainer}
      >
        {EDUCATION_CHAPTERS.map((item, idx) => {
          const isActive = idx === activeChapterIndex;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => setActiveChapterIndex(idx)}
              style={[
                styles.tabPill,
                isActive && { backgroundColor: item.color, borderColor: item.color },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabPillText,
                  isActive && styles.tabPillTextActive,
                ]}
              >
                {item.shortTitle}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Tab Selesai */}
        <TouchableOpacity
          onPress={() => setActiveChapterIndex(totalChapters)}
          style={[
            styles.tabPill,
            isCompletionPage && { backgroundColor: '#10B981', borderColor: '#10B981' },
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabPillText,
              isCompletionPage && styles.tabPillTextActive,
            ]}
          >
            🎉 Selesai
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MAIN CONTENT CARD */}
      {!isCompletionPage && chapter ? (
        /* HALAMAN MATERI BAB 1-6 */
        <View style={styles.mainCard}>
          {/* Washi Tapes on Corners */}
          <WashiTape position="top-left" color={COLORS.washiTape} />
          <WashiTape position="top-right" color={COLORS.washiTape} />

          {/* Chapter Title Badge & Progress indicator with comfortable top spacing */}
          <View style={styles.chapterHeaderRow}>
            <View style={[styles.chapterBadge, { backgroundColor: chapter.color }]}>
              <Text style={styles.chapterBadgeText}>{chapter.title}</Text>
            </View>
            <Text style={styles.chapterCounterText}>
              Bab {activeChapterIndex + 1} dari {totalChapters}
            </Text>
          </View>

          <Text style={styles.chapterSummary}>{chapter.summary}</Text>

          <View style={styles.divider} />

          {/* Dynamic Chapter Sections */}
          {chapter.sections.map((section, sIdx) => (
            <View key={sIdx} style={styles.sectionContainer}>
              {section.heading && (
                <View style={styles.headingRow}>
                  <View style={[styles.bulletCircle, { backgroundColor: chapter.color }]} />
                  <Text style={styles.sectionHeading}>{section.heading}</Text>
                </View>
              )}

              {section.highlight && (
                <View style={[styles.highlightBox, { borderLeftColor: chapter.color }]}>
                  <Text style={styles.highlightText}>{section.highlight}</Text>
                </View>
              )}

              {section.content && (
                <Text style={styles.sectionContent}>{section.content}</Text>
              )}

              {/* List with step numbers */}
              {section.list && (
                <View style={styles.listContainer}>
                  {section.list.map((li, lIdx) => (
                    <View key={lIdx} style={styles.listItem}>
                      <View style={[styles.listNumber, { backgroundColor: chapter.color }]}>
                        <Text style={styles.listNumberText}>{li.number}</Text>
                      </View>
                      <View style={styles.listTextContainer}>
                        <Text style={styles.listTitle}>{li.title}</Text>
                        <Text style={styles.listDesc}>{li.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Table for Portion & Textures */}
              {section.table && (
                <View style={styles.tableContainer}>
                  {section.table.map((row, rIdx) => (
                    <View key={rIdx} style={styles.tableCard}>
                      <View style={styles.tableCardHeader}>
                        <Feather name="calendar" size={14} color={COLORS.primaryDark} />
                        <Text style={styles.tableAgeText}>{row.age}</Text>
                      </View>
                      <Text style={styles.tableRowLabel}>Tekstur:</Text>
                      <Text style={styles.tableRowValue}>{row.texture}</Text>
                      <Text style={styles.tableRowLabel}>Frekuensi:</Text>
                      <Text style={styles.tableRowValue}>{row.freq}</Text>
                      <Text style={styles.tableRowLabel}>Porsi:</Text>
                      <Text style={styles.tableRowValue}>{row.portion}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Checklist items */}
              {section.checklist && (
                <View style={styles.checklistContainer}>
                  {section.checklist.map((item, cIdx) => (
                    <View key={cIdx} style={styles.checkItem}>
                      <Feather name="check-circle" size={18} color="#10B981" />
                      <Text style={styles.checkText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Special Food Groups Visual Grid on Chapter 3 */}
          {chapter.id === 'food_diversity' && (
            <View style={styles.foodGridWrapper}>
              <Text style={styles.foodGridTitle}>8 Kelompok Pangan MP-ASI Standar WHO:</Text>
              {FOOD_GROUPS.map((fg) => (
                <View key={fg.id} style={styles.foodCard}>
                  <View style={styles.foodCardTop}>
                    <View style={styles.groupBadge}>
                      <Text style={styles.groupBadgeText}>Kelompok {fg.groupNumber}</Text>
                    </View>
                    <Text style={styles.foodCategory}>{fg.category}</Text>
                  </View>
                  <Text style={styles.foodTitle}>{fg.title}</Text>
                  <Text style={styles.foodExamples}>Contoh: {fg.examples.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        /* DEDICATED NEXT PAGE: HALAMAN SELESAI BELAJAR */
        <View style={styles.mainCard}>
          <WashiTape position="top-left" color="#10B981" />
          <WashiTape position="top-right" color="#10B981" />

          <View style={styles.completionContainer}>
            <View style={styles.trophyCircle}>
              <Text style={styles.trophyIcon}>🏆</Text>
            </View>

            <Text style={styles.completionTitle}>
              Seluruh Materi Telah Dipelajari!
            </Text>

            <Text style={styles.completionDesc}>
              Hebat Bunda! Seluruh panduan MP-ASI dan pencegahan stunting telah selesai dipelajari. Kuesioner <Text style={styles.boldText}>Post-Test</Text> sekarang sudah <Text style={{ color: '#15803D', fontWeight: '800' }}>TERBUKA</Text> untuk diisi.
            </Text>

            <View style={styles.summaryPointsBox}>
              <Text style={styles.summaryPointsHeader}>Ringkasan Pembelajaran:</Text>
              <View style={styles.pointRow}>
                <Feather name="check" size={16} color="#10B981" style={{ marginRight: 6 }} />
                <Text style={styles.pointText}>Prinsip Tepat Waktu & Kecukupan Gizi</Text>
              </View>
              <View style={styles.pointRow}>
                <Feather name="check" size={16} color="#10B981" style={{ marginRight: 6 }} />
                <Text style={styles.pointText}>8 Kelompok Pangan MAD Standar WHO</Text>
              </View>
              <View style={styles.pointRow}>
                <Feather name="check" size={16} color="#10B981" style={{ marginRight: 6 }} />
                <Text style={styles.pointText}>Tahapan Tekstur, Porsi, & Frekuensi</Text>
              </View>
              <View style={styles.pointRow}>
                <Feather name="check" size={16} color="#10B981" style={{ marginRight: 6 }} />
                <Text style={styles.pointText}>Kebersihan & Responsive Feeding</Text>
              </View>
            </View>

            {/* CTA Button ke Post-Test */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Questionnaire')}
              style={styles.posttestCtaBtn}
              activeOpacity={0.85}
            >
              <Feather name="check-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.posttestCtaBtnText}>Lanjut ke Kuisioner Post-Test</Text>
            </TouchableOpacity>

            {/* Tombol Baca Ulang */}
            <TouchableOpacity
              onPress={() => setActiveChapterIndex(0)}
              style={styles.reReadBtn}
              activeOpacity={0.7}
            >
              <Feather name="rotate-ccw" size={14} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.reReadBtnText}>Baca Ulang Materi dari Bab 1</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Next/Prev Chapter Navigation Buttons */}
      <View style={styles.navButtonsRow}>
        <TouchableOpacity
          onPress={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
          disabled={activeChapterIndex === 0}
          style={[
            styles.navBtn,
            activeChapterIndex === 0 && styles.navBtnDisabled,
          ]}
          activeOpacity={0.8}
        >
          <Feather name="chevron-left" size={18} color={activeChapterIndex === 0 ? COLORS.textMuted : '#FFFFFF'} />
          <Text style={[styles.navBtnText, activeChapterIndex === 0 && styles.navBtnTextDisabled]}>
            Sebelumnya
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveChapterIndex(Math.min(totalChapters, activeChapterIndex + 1))}
          disabled={isCompletionPage}
          style={[
            styles.navBtn,
            styles.navBtnPrimary,
            isCompletionPage && styles.navBtnDisabled,
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.navBtnText, isCompletionPage && styles.navBtnTextDisabled]}>
            {activeChapterIndex === totalChapters - 1 ? 'Selesai Belajar 🎉' : 'Selanjutnya'}
          </Text>
          <Feather name="chevron-right" size={18} color={isCompletionPage ? COLORS.textMuted : '#FFFFFF'} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabScrollContainer: {
    paddingHorizontal: 4,
    paddingBottom: 8,
    marginBottom: 8,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#CBE5F5',
    ...SHADOWS.card,
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  mainCard: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 18,
    paddingBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
    ...SHADOWS.cardFloating,
  },
  chapterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  chapterBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  chapterBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  chapterCounterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  chapterSummary: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: '#334155',
    flex: 1,
  },
  highlightBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    lineHeight: 21,
  },
  sectionContent: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 23,
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  listDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 18,
  },
  tableContainer: {
    marginTop: 8,
  },
  tableCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  tableCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tableAgeText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FONTS.bold,
    color: '#0284C7',
    marginLeft: 6,
  },
  tableRowLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  tableRowValue: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    fontFamily: FONTS.semiBold,
  },
  checklistContainer: {
    marginTop: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  checkText: {
    fontSize: 12,
    color: '#334155',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  foodGridWrapper: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  foodGridTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FONTS.bold,
    color: '#334155',
    marginBottom: 8,
  },
  foodCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  foodCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  groupBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },
  foodCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  foodTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  foodExamples: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  completionContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  trophyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  trophyIcon: {
    fontSize: 32,
  },
  completionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 8,
  },
  completionDesc: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  boldText: {
    fontWeight: '800',
    color: '#334155',
  },
  summaryPointsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryPointsHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  pointText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  posttestCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    ...SHADOWS.button,
  },
  posttestCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  reReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 6,
  },
  reReadBtnText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  navButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#64748B',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    ...SHADOWS.button,
  },
  navBtnPrimary: {
    backgroundColor: '#0284C7',
  },
  navBtnDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
  },
  navBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    marginHorizontal: 4,
  },
  navBtnTextDisabled: {
    color: '#94A3B8',
  },
});
