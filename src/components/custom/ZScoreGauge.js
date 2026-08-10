import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

export default function ZScoreGauge({ zScore = 0, statusColor = '#27AE60' }) {
  // Rentang tampilan Z-score: -4 SD sampai +4 SD
  const minZ = -4;
  const maxZ = 4;
  const clampedZ = Math.max(minZ, Math.min(maxZ, zScore));
  const rawPercentage = ((clampedZ - minZ) / (maxZ - minZ)) * 100;
  // Clamp bubble position so badge text never overflows left or right edge
  const bubblePercentage = Math.max(12, Math.min(88, rawPercentage));

  return (
    <View style={styles.container}>
      <Text style={styles.headerLabel}>Posisi pada Kurva Pertumbuhan WHO (PB/U & TB/U):</Text>

      {/* Pointer Indicator with Floating Badge */}
      <View style={styles.pointerTrack}>
        <View style={[styles.pointerWrapper, { left: `${bubblePercentage}%` }]}>
          <View style={[styles.pointerBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.pointerText}>
              {zScore > 0 ? `+${zScore}` : zScore} SD
            </Text>
          </View>
          <View style={[styles.pointerArrow, { borderTopColor: statusColor }]} />
        </View>
      </View>

      {/* Segmented Color Spectrum Bar */}
      <View style={styles.bar}>
        {/* Sangat Pendek (Severely Stunted) < -3 SD */}
        <View style={[styles.segment, { backgroundColor: '#DC2626', flex: 1 }]} />
        {/* Pendek (Stunted) -3 SD to -2 SD */}
        <View style={[styles.segment, { backgroundColor: '#F59E0B', flex: 1 }]} />
        {/* Normal -2 SD to +3 SD */}
        <View style={[styles.segment, { backgroundColor: '#10B981', flex: 5 }]} />
        {/* Tinggi > +3 SD */}
        <View style={[styles.segment, { backgroundColor: '#3B82F6', flex: 1 }]} />
      </View>

      {/* Scale Labels */}
      <View style={styles.scaleRow}>
        <Text style={styles.scaleText}>-4 SD</Text>
        <Text style={styles.scaleText}>-3</Text>
        <Text style={styles.scaleText}>-2</Text>
        <Text style={[styles.scaleText, styles.scaleTextMedian]}>0 (Median)</Text>
        <Text style={styles.scaleText}>+2</Text>
        <Text style={styles.scaleText}>+3</Text>
        <Text style={styles.scaleText}>+4 SD</Text>
      </View>

      {/* Legend Checklist */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
          <Text style={styles.legendText}>Sgt Pendek (&lt;-3)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Pendek (-3 s/d -2)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Normal (-2 s/d +3)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>Tinggi</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  headerLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.textTitle,
    marginBottom: 16,
  },
  pointerTrack: {
    height: 30,
    position: 'relative',
    marginBottom: 4,
    width: '100%',
  },
  pointerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -35,
    width: 70,
  },
  pointerBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  pointerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  pointerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    width: '100%',
  },
  scaleText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: FONTS.medium,
  },
  scaleTextMedian: {
    fontFamily: FONTS.bold,
    color: COLORS.textTitle,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    width: '100%',
    flexWrap: 'wrap',
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 9,
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
  },
});
