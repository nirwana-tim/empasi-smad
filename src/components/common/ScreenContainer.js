import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../constants/theme';

export default function ScreenContainer({
  children,
  scrollable = true,
  backgroundImage = require('../../../Asset/defaultbg.png'),
  style,
  contentContainerStyle,
}) {
  const Container = scrollable ? ScrollView : View;

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <Container
          style={[styles.container, style]}
          contentContainerStyle={scrollable ? [styles.scrollContent, contentContainerStyle] : undefined}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerWrapper}>
            {children}
          </View>
        </Container>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.bgScreen,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  centerWrapper: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});
