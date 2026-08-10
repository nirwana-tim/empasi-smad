import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import ScreenContainer from '../components/common/ScreenContainer';
import RibbonHeader from '../components/custom/RibbonHeader';
import StickyCard from '../components/custom/StickyCard';
import { EDUCATION_CHAPTERS } from '../data/educationContent';
import { FOOD_GROUPS } from '../data/foodGroups';
import { COLORS, SHADOWS } from '../constants/theme';

export default function InformationScreen({ navigation }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const chapter = EDUCATION_CHAPTERS[activeChapterIndex];

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
      </ScrollView>

      {/* Main Chapter Card */}
      <StickyCard
        backgroundColor="#FFFFFF"
        hasTapes={true}
        tapePositions={['top-left', 'top-right']}
        style={styles.mainCard}
      >
        {/* Chapter Title Badge */}
        <View style={[styles.chapterBadge, { backgroundColor: chapter.color }]}>
          <Text style={styles.chapterBadgeText}>{chapter.title}</Text>
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

            {/* Table if any */}
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

            {/* Checklist if any */}
            {section.checklist && (
              <View style={styles.checklistContainer}>
                {section.checklist.map((item, cIdx) => (
                  <View key={cIdx} style={styles.checkItem}>
                    <Feather name="check-circle" size={18} color={COLORS.success} />
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
            <Text style={styles.foodGridTitle}>8 Kelompok Pangan MP-ASI:</Text>
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
      </StickyCard>

      {/* Next/Prev Chapter Buttons */}
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
          <Feather name="chevron-left" size={20} color={activeChapterIndex === 0 ? COLORS.textMuted : COLORS.white} />
          <Text style={[styles.navBtnText, activeChapterIndex === 0 && styles.navBtnTextDisabled]}>
            Sebelumnya
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveChapterIndex(Math.min(EDUCATION_CHAPTERS.length - 1, activeChapterIndex + 1))}
          disabled={activeChapterIndex === EDUCATION_CHAPTERS.length - 1}
          style={[
            styles.navBtn,
            styles.navBtnPrimary,
            activeChapterIndex === EDUCATION_CHAPTERS.length - 1 && styles.navBtnDisabled,
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.navBtnText, activeChapterIndex === EDUCATION_CHAPTERS.length - 1 && styles.navBtnTextDisabled]}>
            Selanjutnya
          </Text>
          <Feather name="chevron-right" size={20} color={activeChapterIndex === EDUCATION_CHAPTERS.length - 1 ? COLORS.textMuted : COLORS.white} />
        </TouchableOpacity>
      </View>
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
    color: COLORS.textBody,
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  mainCard: {
    marginTop: 6,
  },
  chapterBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  chapterBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  chapterSummary: {
    fontSize: 13,
    color: COLORS.textBody,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textTitle,
    flex: 1,
  },
  highlightBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    padding: 10,
    borderRadius: 6,
    marginVertical: 8,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textTitle,
  },
  sectionContent: {
    fontSize: 13,
    color: COLORS.textBody,
    lineHeight: 20,
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    color: COLORS.textTitle,
  },
  listDesc: {
    fontSize: 12,
    color: COLORS.textBody,
    marginTop: 2,
    lineHeight: 17,
  },
  tableContainer: {
    marginTop: 8,
  },
  tableCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
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
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginLeft: 6,
  },
  tableRowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  tableRowValue: {
    fontSize: 13,
    color: COLORS.textBody,
    fontWeight: '600',
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  checkText: {
    fontSize: 12,
    color: COLORS.textBody,
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
    fontWeight: '800',
    color: COLORS.textTitle,
    marginBottom: 8,
  },
  foodCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
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
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  foodCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  foodTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
  },
  foodExamples: {
    fontSize: 12,
    color: COLORS.textBody,
    marginTop: 2,
  },
  navButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 20,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#64748B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    ...SHADOWS.button,
  },
  navBtnPrimary: {
    backgroundColor: COLORS.primary,
  },
  navBtnDisabled: {
    backgroundColor: '#E2E8F0',
    elevation: 0,
  },
  navBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginHorizontal: 4,
  },
  navBtnTextDisabled: {
    color: COLORS.textMuted,
  },
});
