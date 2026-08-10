import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function WashiTape({ position = 'top-right', color = COLORS.washiTape, style }) {
  const isTopLeft = position === 'top-left';
  const isTopRight = position === 'top-right';
  const isBottomLeft = position === 'bottom-left';
  const isBottomRight = position === 'bottom-right';

  const rotation = isTopLeft
    ? '-15deg'
    : isTopRight
    ? '15deg'
    : isBottomLeft
    ? '12deg'
    : '-12deg';

  const positionStyle = {
    top: isTopLeft || isTopRight ? -8 : undefined,
    bottom: isBottomLeft || isBottomRight ? -8 : undefined,
    left: isTopLeft || isBottomLeft ? -10 : undefined,
    right: isTopRight || isBottomRight ? -10 : undefined,
  };

  return (
    <View
      style={[
        styles.tape,
        {
          backgroundColor: color,
          transform: [{ rotate: rotation }],
        },
        positionStyle,
        style,
      ]}
    >
      <View style={styles.tapeInnerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  tape: {
    position: 'absolute',
    width: 60,
    height: 18,
    borderRadius: 2,
    zIndex: 10,
    opacity: 0.92,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  tapeInnerLine: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    marginVertical: 3,
  },
});
