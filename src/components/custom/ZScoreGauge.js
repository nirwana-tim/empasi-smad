import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function ZScoreGauge({ zScore = 0, statusColor = COLORS.success }) {
  // Rentang tampilan Z-score: -4 SD sampai +4 SD
  const minZ = -4;
  const maxZ = 4;
  const clampedZ = Math.max(minZ, Math.min(maxZ, zScore));
  const rawPercentage = ((clampedZ - minZ) / (maxZ - minZ)) * 100;
  // Clamp bubble position so badge text never overflows left or right edge
  const bubblePercentage = Math.max(10, Math.min(90, rawPercentage));

  return (
    <View style={styles.container}>
      <Text style={styles.headerLabel}>Posisi pada Kurva Standar WHO (PB/U & TB/U):</Text>

      {/* Pointer Indicator */}
      <View style={styles.pointerTrack}>
        <View style={[styles.pointerWrapper, { left: `${bubblePercentage}%` }]}>
          <View style={[styles.pointerBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.pointerText}>{zScore > 0 ? `+${zScore}` : zScore} SD</Text>
          </View>
          <View style={[styles.pointerArrow, { borderTopColor: statusColor }]} />
        </View>
      </View>

      {/* Multi-segmented Spectrum Bar */}
      <View style={styles.bar}>
        <View style={[styles.segment, { flex: 1, backgroundColor: '#E74C3C' }]} />
        <View style={[styles.segment, { flex: 1, backgroundColor: '#F39C12' }]} />
        <View style={[styles.segment, { flex: 5, backgroundColor: '#27AE60' }]} />
        <View style={[styles.segment, { flex: 1, backgroundColor: '#2980B9' }]} />
      </View>

      {/* Axis Scale Markers */}
      <View style={styles.scaleRow}>
        <Text style={styles.scaleText}>-3 SD</Text>
        <Text style={styles.scaleText}>-2 SD</Text>
        <Text style={[styles.scaleText, { fontWeight: '700' }]}>0 (Median)</Text>
        <Text style={styles.scaleText}>+2 SD</Text>
        <Text style={styles.scaleText}>+3 SD</Text>
      </View>

      {/* Legend Labels */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#E74C3C' }]} />
          <Text style={styles.legendText}>Sangat Pendek</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F39C12' }]} />
          <Text style={styles.legendText}>Pendek</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#27AE60' }]} />
          <Text style={styles.legendText}>Normal</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2980B9' }]} />
          <Text style={styles.legendText}>Tinggi</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textTitle,
    marginBottom: 16,
  },
  pointerTrack: {
    height: 28,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  pointerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
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
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%',
  },
  segment: {
    height: '100%',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    width: '100%',
  },
  scaleText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
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
    fontSize: 10,
    color: COLORS.textBody,
    fontWeight: '600',
  },
});
