import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

export default function StepperCounter({
  value = 0,
  min = 0,
  max = 20,
  onChange,
  label,
  unit = 'kali',
  color = COLORS.primary,
  borderColor = '#CBD5E1',
  textColor = '#0284C7',
}) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Symmetrical Full-Width Stepper Row */}
      <View style={styles.counterRow}>
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={value <= min}
          style={[
            styles.btn,
            { backgroundColor: color },
            value <= min && styles.btnDisabled,
          ]}
          activeOpacity={0.7}
        >
          <Feather name="minus" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={[styles.valueBox, { borderColor }]}>
          <Text style={[styles.valueText, { color: textColor }]}>
            {value}
          </Text>
          {unit && <Text style={styles.unitText}>{unit}</Text>}
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          disabled={value >= max}
          style={[
            styles.btn,
            { backgroundColor: color },
            value >= max && styles.btnDisabled,
          ]}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.textTitle,
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 4,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  btnDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
  },
  valueBox: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  valueText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginRight: 6,
  },
  unitText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
  },
});
