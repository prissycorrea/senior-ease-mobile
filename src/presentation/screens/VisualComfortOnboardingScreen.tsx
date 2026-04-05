import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState, type ReactElement } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { ThemePreference } from "../../domain/entities/ThemePreference";
import {
  accentBlue,
  brandNavy,
  createThemePalette,
} from "../theme/themePalette";

const screenBg = "#F1F4F7";
/** Borda suave do cartão “Padrão” (referência) */
const cardBorderLight = "#B8D4E8";
const cardHighContrastBg = "#001B3D";
const footerOnLightColor = "#1A1A1A";
const lineLight = "#A8C8E8";
const lineOnDarkCard = "#4A5F73";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

const PROGRESS_EXTRA_BELOW_TOP_ANDROID = 42;
const PROGRESS_EXTRA_BELOW_TOP_IOS = 16;
const ANDROID_PROGRESS_TOP_MIN_TOTAL = 72;

function progressTopPadding(insetsTop: number): number {
  const androidStatusBar =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 28) : 0;
  const chromeTop = Math.max(insetsTop, androidStatusBar);
  const extra =
    Platform.OS === "android"
      ? PROGRESS_EXTRA_BELOW_TOP_ANDROID
      : PROGRESS_EXTRA_BELOW_TOP_IOS;
  const total = chromeTop + extra;
  if (Platform.OS === "android") {
    return Math.max(total, ANDROID_PROGRESS_TOP_MIN_TOTAL);
  }
  return total;
}

function CheckBadgeOnLight(): ReactElement {
  return (
    <View
      style={checkStyles.filledAccent}
      accessibilityLabel="Selecionado"
    >
      <Ionicons name="checkmark" size={17} color="#FFFFFF" />
    </View>
  );
}

function CheckBadgeOnDark(): ReactElement {
  return (
    <View
      style={checkStyles.filledLight}
      accessibilityLabel="Selecionado"
    >
      <Ionicons name="checkmark" size={17} color={brandNavy} />
    </View>
  );
}

const checkStyles = StyleSheet.create({
  filledAccent: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: accentBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  filledLight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});

type Props = {
  initialPreference: ThemePreference;
  onComplete: (theme: ThemePreference) => Promise<void>;
};

export function VisualComfortOnboardingScreen({
  initialPreference,
  onComplete,
}: Props): ReactElement {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  const [selected, setSelected] = useState<ThemePreference>(initialPreference);
  const [submitting, setSubmitting] = useState(false);
  const palette = createThemePalette(selected);
  const progressInactiveColor =
    selected === "high_contrast" ? "#FFFFFF" : "#C9D5DE";
  const titleConfortoColor =
    selected === "high_contrast" ? "#FFFFFF" : accentBlue;

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(palette.background);
  }, [palette.background]);

  const handleNext = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onComplete(selected);
    } finally {
      setSubmitting(false);
    }
  }, [onComplete, selected, submitting]);

  if (!fontsLoaded) {
    return (
      <View style={styles.fontLoading}>
        <ActivityIndicator size="large" color={brandNavy} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <View
      style={[styles.screenRoot, { backgroundColor: palette.background }]}
    >
      <SafeAreaView style={styles.safeInner} edges={["left", "right"]}>
        <StatusBar style={selected === "high_contrast" ? "light" : "dark"} />
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.progressWrap,
              { paddingTop: progressTopPadding(insets.top) },
            ]}
          >
            <View style={styles.progressRow}>
              <View
                style={[
                  styles.progressSegment,
                  styles.progressSegmentActive,
                  { backgroundColor: palette.primary },
                ]}
              />
              <View
                style={[
                  styles.progressSegment,
                  styles.progressSegmentInactive,
                  { backgroundColor: progressInactiveColor },
                ]}
              />
            </View>
          </View>

          <View style={styles.headerBlock}>
            <Text
              style={[styles.titleLine1, { color: titleConfortoColor }]}
              testID="onboarding-title-conforto"
            >
              Conforto
            </Text>
            <Text style={[styles.titleLine2, { color: palette.text }]}>
              visual
            </Text>
            <Text style={[styles.subtitle, { color: palette.textMuted }]}>
              Selecione a opção que é melhor para os seus olhos.
            </Text>
          </View>

          <Pressable
            onPress={() => setSelected("default")}
            style={({ pressed }) => [
              styles.card,
              styles.cardDefault,
              selected === "default"
                ? styles.cardDefaultSelected
                : styles.cardDefaultIdle,
              pressed && styles.pressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected === "default" }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitleDefault}>Padrão</Text>
              {selected === "default" ? (
                <CheckBadgeOnLight />
              ) : (
                <View style={styles.radioOuter}>
                  <View style={styles.radioInnerEmpty} />
                </View>
              )}
            </View>
            <View style={styles.previewRow}>
              <View style={styles.avatarDefault}>
                <Ionicons name="person" size={24} color={brandNavy} />
              </View>
              <View style={styles.previewLines}>
                <View style={[styles.line, { backgroundColor: lineLight }]} />
                <View
                  style={[
                    styles.line,
                    { backgroundColor: lineLight, width: "72%" },
                  ]}
                />
              </View>
            </View>
            <Text style={[styles.footerOnLight, { color: footerOnLightColor }]}>
              Texto de exemplo fácil de ler.
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelected("high_contrast")}
            style={({ pressed }) => [
              styles.card,
              styles.cardHighContrast,
              selected === "high_contrast"
                ? styles.cardHighContrastSelected
                : styles.cardHighContrastIdle,
              pressed && styles.pressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected === "high_contrast" }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitleLight}>Alto Contraste</Text>
              {selected === "high_contrast" ? (
                <CheckBadgeOnDark />
              ) : (
                <View style={styles.radioOuterLight}>
                  <View style={styles.radioInnerEmpty} />
                </View>
              )}
            </View>
            <View style={styles.previewRow}>
              <View style={styles.avatarHighContrast}>
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.previewLines}>
                <View
                  style={[styles.line, { backgroundColor: lineOnDarkCard }]}
                />
                <View
                  style={[
                    styles.line,
                    { backgroundColor: lineOnDarkCard, width: "72%" },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.footerLight}>
              Texto de exemplo fácil de ler.
            </Text>
          </Pressable>
        </ScrollView>

        <View
          style={[
            styles.footerBar,
            {
              backgroundColor: palette.background,
              paddingBottom: 22 + insets.bottom,
            },
          ]}
        >
          <Pressable
            onPress={handleNext}
            disabled={submitting}
            style={({ pressed }) => [
              styles.nextButton,
              { backgroundColor: palette.primary },
              (pressed || submitting) && styles.nextButtonPressed,
            ]}
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator color={palette.onPrimary} />
            ) : (
              <Text style={[styles.nextLabel, { color: palette.onPrimary }]}>
                Próximo
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fontLoading: {
    flex: 1,
    backgroundColor: screenBg,
    alignItems: "center",
    justifyContent: "center",
  },
  screenRoot: {
    flex: 1,
  },
  safeInner: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollFlex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 32,
    paddingBottom: 36,
    flexGrow: 1,
  },
  progressWrap: {
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 28,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  progressSegment: {
    height: 6,
    borderRadius: 3,
  },
  progressSegmentActive: {
    width: 72,
  },
  progressSegmentInactive: {
    width: 40,
  },
  headerBlock: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    marginBottom: 26,
  },
  titleLine1: {
    fontFamily: LEXEND_BOLD,
    fontSize: 42,
    letterSpacing: -1.2,
    lineHeight: 48,
  },
  titleLine2: {
    fontFamily: LEXEND_BOLD,
    fontSize: 42,
    letterSpacing: -1.2,
    lineHeight: 48,
    marginTop: -4,
  },
  subtitle: {
    fontFamily: LEXEND_REGULAR,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    marginTop: 22,
    maxWidth: "100%",
  },
  card: {
    alignSelf: "stretch",
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 18,
    minHeight: 176,
  },
  cardDefault: {
    backgroundColor: "#FFFFFF",
  },
  cardDefaultIdle: {
    borderWidth: 1,
    borderColor: cardBorderLight,
  },
  cardDefaultSelected: {
    borderWidth: 2,
    borderColor: accentBlue,
  },
  cardHighContrast: {
    backgroundColor: cardHighContrastBg,
  },
  cardHighContrastIdle: {
    borderWidth: 0,
  },
  cardHighContrastSelected: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  pressed: {
    opacity: 0.94,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    minHeight: 36,
  },
  cardTitleDefault: {
    fontFamily: LEXEND_BOLD,
    fontSize: 24,
    color: "#1A1A1A",
    flex: 1,
    paddingRight: 12,
    lineHeight: 30,
  },
  cardTitleLight: {
    fontFamily: LEXEND_BOLD,
    fontSize: 24,
    color: "#FFFFFF",
    flex: 1,
    paddingRight: 12,
    lineHeight: 30,
  },
  radioOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#B0BCC6",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterLight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInnerEmpty: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarDefault: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "transparent",
    borderWidth: 2.5,
    borderColor: accentBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarHighContrast: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "transparent",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  previewLines: {
    flex: 1,
    gap: 11,
    justifyContent: "center",
  },
  line: {
    height: 11,
    borderRadius: 6,
    width: "100%",
  },
  footerOnLight: {
    fontFamily: LEXEND_REGULAR,
    fontSize: 14,
  },
  footerLight: {
    fontFamily: LEXEND_REGULAR,
    fontSize: 14,
    color: "#FFFFFF",
  },
  footerBar: {
    paddingHorizontal: 32,
    paddingTop: 8,
  },
  nextButton: {
    alignSelf: "stretch",
    borderRadius: 28,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  nextButtonPressed: {
    opacity: 0.9,
  },
  nextLabel: {
    fontFamily: LEXEND_BOLD,
    fontSize: 17,
  },
});
