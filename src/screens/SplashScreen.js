import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/theme';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleSkip = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#EDF9FE" translucent />

      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={handleSkip}
      >
        {/* Full Edge-to-Edge Image Container */}
        <Image
          source={require('../../Asset/LoadingScreen.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />

        {/* Floating Loading Indicator */}
        <Animated.View style={[styles.loadingBadge, { opacity: fadeAnim }]}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat Panduan MP-ASI...</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00A499',
  },
  touchArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingBadge: {
    position: 'absolute',
    bottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTitle,
    marginLeft: 8,
  },
});
