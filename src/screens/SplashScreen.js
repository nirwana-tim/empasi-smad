import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

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
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.touchArea}
          activeOpacity={1}
          onPress={handleSkip}
        >
          {/* Main Illustration & Logo Graphics */}
          <Animated.View
            style={[
              styles.imageContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={require('../../Asset/LoadingScreen.png')}
              style={styles.splashImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Minimalist Bottom Indicator */}
          <View style={styles.loadingIndicatorContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Memuat Panduan MP-ASI...</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF9FE',
  },
  safeArea: {
    flex: 1,
  },
  touchArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  splashImage: {
    width: width,
    height: height * 0.82,
    maxHeight: 700,
  },
  loadingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBE5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textTitle,
    marginLeft: 8,
  },
});
