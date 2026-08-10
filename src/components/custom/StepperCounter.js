import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function StepperCounter({
  value = 0,
  onChange,
  min = 0,
  max = 10,
  label,
  unit = 'kali',
  color = COLORS.primary,
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
          <Feather name="minus" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={[styles.valueBox, { borderColor: color }]}>
          <Text style={[styles.valueText, { color }]}>{value}</Text>
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
          <Feather name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textTitle,
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  btnDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
  },
  valueBox: {
    minWidth: 80,
    height: 44,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '900',
  },
  unitText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: -2,
  },
});
