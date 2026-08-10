import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

export default function RibbonHeader({
  title,
  subtitle,
  onBack,
  backgroundColor = '#208A91',
  textColor = '#FFFFFF',
  showBackButton = true,
  rightAction,
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.ribbonBody, { backgroundColor }]}>
        {showBackButton && onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction && (
          <View style={styles.rightActionContainer}>
            {rightAction}
          </View>
        )}
      </View>

      {/* Ribbon Chevron Right Cut */}
      <View style={[styles.chevronArrow, { borderLeftColor: backgroundColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
    paddingRight: 10,
    width: '100%',
  },
  ribbonBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    paddingHorizontal: 14,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  chevronArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 29,
    borderBottomWidth: 29,
    borderLeftWidth: 18,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  backButton: {
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    color: '#E0F2FE',
    fontFamily: FONTS.semiBold,
    marginTop: 1,
  },
  rightActionContainer: {
    marginLeft: 8,
  },
});
