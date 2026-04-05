import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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
  clampFontScale,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
} from "../../domain/entities/fontScale";
import { screenHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import {
  accentBlue,
  brandNavy,
  createThemePalette,
} from "../theme/themePalette";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

/** Texto de exemplo dentro da caixa (base antes do multiplicador) */
const PREVIEW_FONT_BASE = 20;

const TITLE_FONT_SIZE = 42;
const TITLE_LINE_HEIGHT = 48;
const ADJUST_LABEL_BASE = 16;
const NEXT_LABEL_BASE = 17;
const ADJUST_ICON_BASE = 22;
const ADJUST_CIRCLE_BASE = 32;

type Props = {
  themePreference: ThemePreference;
  initialFontScaleMultiplier: number;
  onComplete: (fontScaleMultiplier: number) => Promise<void>;
  onBack: () => Promise<void>;
};

export function FontSizeOnboardingScreen({
  themePreference,
  initialFontScaleMultiplier,
  onComplete,
  onBack,
}: Props): ReactElement {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  const palette = useMemo(
    () => createThemePalette(themePreference),
    [themePreference],
  );
  const [scale, setScale] = useState(() =>
    clampFontScale(initialFontScaleMultiplier),
  );
  const [submitting, setSubmitting] = useState(false);
  const [backing, setBacking] = useState(false);

  const isDefault = themePreference === "default";
  const progressInactiveColor = isDefault ? "#C9D5DE" : "rgba(255,255,255,0.38)";
  const backIconColor = isDefault ? brandNavy : "#000000";
  const adjustBg = isDefault ? accentBlue : palette.primary;
  const adjustFg = isDefault ? "#FFFFFF" : palette.onPrimary;
  const titleHighlightColor =
    themePreference === "high_contrast" ? "#FFFFFF" : accentBlue;

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(palette.background);
  }, [palette.background]);

  const previewFontSize = PREVIEW_FONT_BASE * scale;
  const adjustLabelSize = ADJUST_LABEL_BASE * scale;
  const nextLabelSize = NEXT_LABEL_BASE * scale;
  const adjustIconSize = Math.min(48, Math.max(18, Math.round(ADJUST_ICON_BASE * scale)));
  const adjustCircleSize = Math.min(68, Math.max(28, Math.round(ADJUST_CIRCLE_BASE * scale)));
  const adjustButtonMinH = Math.min(120, Math.max(48, Math.round(56 * scale)));
  const nextButtonMinH = Math.min(124, Math.max(52, Math.round(56 * scale)));
  const nextPadV = Math.min(38, Math.max(14, Math.round(17 * scale)));

  const canIncrease = scale < FONT_SCALE_MAX - 0.001;
  const canDecrease = scale > FONT_SCALE_MIN + 0.001;

  const handleNext = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onComplete(clampFontScale(scale));
    } finally {
      setSubmitting(false);
    }
  }, [onComplete, scale, submitting]);

  const handleBack = useCallback(async () => {
    if (backing) return;
    setBacking(true);
    try {
      await onBack();
    } finally {
      setBacking(false);
    }
  }, [backing, onBack]);

  const bump = useCallback((delta: number) => {
    setScale((s) => clampFontScale(s + delta));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={[styles.fontLoading, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={palette.primary} />
        <StatusBar style={isDefault ? "dark" : "light"} />
      </View>
    );
  }

  return (
    <View
      style={[styles.screenRoot, { backgroundColor: palette.background }]}
    >
      <SafeAreaView style={styles.safeInner} edges={["left", "right", "bottom"]}>
        <StatusBar style={isDefault ? "dark" : "light"} />
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.topBar,
              { paddingTop: screenHeaderPaddingTop(insets.top) },
            ]}
          >
            <Pressable
              onPress={handleBack}
              disabled={backing}
              style={({ pressed }) => [
                styles.backButton,
                { backgroundColor: isDefault ? "#FFFFFF" : "#FFFFFF" },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="chevron-back" size={26} color={backIconColor} />
            </Pressable>
            <View style={styles.progressCenter}>
              <View style={styles.progressRow}>
                <View
                  style={[
                    styles.progressSegment,
                    styles.progressSegmentInactive,
                    { backgroundColor: progressInactiveColor },
                  ]}
                />
                <View
                  style={[
                    styles.progressSegment,
                    styles.progressSegmentActive,
                    { backgroundColor: palette.primary },
                  ]}
                />
              </View>
            </View>
            <View style={styles.backPlaceholder} />
          </View>

          <View style={styles.headerBlock}>
            <Text style={styles.titleMain}>
              <Text style={{ color: palette.text }}>Este </Text>
              <Text style={{ color: titleHighlightColor }}>
                tamanho de letra
              </Text>
            </Text>
            <Text style={[styles.titleSecondLine, { color: palette.text }]}>
              está bom?
            </Text>
          </View>

          <View
            style={[
              styles.previewBox,
              {
                borderColor: isDefault ? "#B8D4E8" : palette.border,
                backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                minHeight: Math.round(200 * scale),
              },
            ]}
          >
            <Text
              style={{
                fontFamily: LEXEND_REGULAR,
                fontSize: previewFontSize,
                lineHeight: previewFontSize * 1.45,
                color: palette.text,
              }}
            >
              Com o SeniorEase, organizar seu dia a dia ficou mais simples e
              acessível.
            </Text>
          </View>

          <View style={styles.adjustRow}>
            <Pressable
              onPress={() => bump(FONT_SCALE_STEP)}
              disabled={!canIncrease}
              style={({ pressed }) => [
                styles.adjustButton,
                {
                  backgroundColor: adjustBg,
                  minHeight: adjustButtonMinH,
                  paddingVertical: Math.max(12, Math.round(14 * scale)),
                },
                !canIncrease && styles.adjustDisabled,
                pressed && canIncrease && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Aumentar tamanho da letra"
            >
              <View
                style={[
                  styles.adjustIconCircle,
                  {
                    borderColor: adjustFg,
                    width: adjustCircleSize,
                    height: adjustCircleSize,
                    borderRadius: adjustCircleSize / 2,
                  },
                ]}
              >
                <Ionicons name="add" size={adjustIconSize} color={adjustFg} />
              </View>
              <Text
                style={[
                  styles.adjustLabel,
                  {
                    color: adjustFg,
                    fontSize: adjustLabelSize,
                    lineHeight: adjustLabelSize * 1.25,
                  },
                ]}
              >
                Aumentar
              </Text>
            </Pressable>
            <Pressable
              onPress={() => bump(-FONT_SCALE_STEP)}
              disabled={!canDecrease}
              style={({ pressed }) => [
                styles.adjustButton,
                {
                  backgroundColor: adjustBg,
                  minHeight: adjustButtonMinH,
                  paddingVertical: Math.max(12, Math.round(14 * scale)),
                },
                !canDecrease && styles.adjustDisabled,
                pressed && canDecrease && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Diminuir tamanho da letra"
            >
              <View
                style={[
                  styles.adjustIconCircle,
                  {
                    borderColor: adjustFg,
                    width: adjustCircleSize,
                    height: adjustCircleSize,
                    borderRadius: adjustCircleSize / 2,
                  },
                ]}
              >
                <Ionicons
                  name="remove"
                  size={adjustIconSize}
                  color={adjustFg}
                />
              </View>
              <Text
                style={[
                  styles.adjustLabel,
                  {
                    color: adjustFg,
                    fontSize: adjustLabelSize,
                    lineHeight: adjustLabelSize * 1.25,
                  },
                ]}
              >
                Diminuir
              </Text>
            </Pressable>
          </View>
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
              {
                backgroundColor: isDefault ? brandNavy : palette.primary,
                minHeight: nextButtonMinH,
                paddingVertical: nextPadV,
              },
              (pressed || submitting) && styles.nextButtonPressed,
            ]}
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator
                color={isDefault ? "#FFFFFF" : palette.onPrimary}
              />
            ) : (
              <Text
                style={{
                  fontFamily: LEXEND_BOLD,
                  fontSize: nextLabelSize,
                  lineHeight: nextLabelSize * 1.2,
                  color: isDefault ? "#FFFFFF" : palette.onPrimary,
                }}
              >
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
    paddingBottom: 24,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  backPlaceholder: {
    width: 44,
    height: 44,
  },
  progressCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressSegment: {
    height: 6,
    borderRadius: 3,
  },
  progressSegmentInactive: {
    width: 40,
  },
  progressSegmentActive: {
    width: 72,
  },
  headerBlock: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    marginBottom: 26,
  },
  titleMain: {
    fontFamily: LEXEND_BOLD,
    fontSize: TITLE_FONT_SIZE,
    letterSpacing: -1.2,
    lineHeight: TITLE_LINE_HEIGHT,
  },
  titleSecondLine: {
    fontFamily: LEXEND_BOLD,
    fontSize: TITLE_FONT_SIZE,
    letterSpacing: -1.2,
    lineHeight: TITLE_LINE_HEIGHT,
    marginTop: -4,
  },
  previewBox: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginBottom: 28,
    justifyContent: "center",
  },
  adjustRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  adjustButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 28,
  },
  adjustDisabled: {
    opacity: 0.45,
  },
  adjustIconCircle: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  adjustLabel: {
    fontFamily: LEXEND_BOLD,
  },
  footerBar: {
    paddingHorizontal: 32,
    paddingTop: 8,
  },
  nextButton: {
    alignSelf: "stretch",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonPressed: {
    opacity: 0.9,
  },
  pressed: {
    opacity: 0.92,
  },
});
