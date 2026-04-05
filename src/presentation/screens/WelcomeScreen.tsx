import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState, type ReactElement } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { screenHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import {
  accentBlue,
  brandNavy,
  highContrastActionBlue,
} from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

const LOGO_BASE = 34;
const BUTTON_LABEL_BASE = 17;
const HELP_LINK_BASE = 16;
const BUTTON_MIN_H = 56;
const H_PADDING = 28;
/** Foto um pouco mais suave; o fundo claro aparece nas áreas mais transparentes. */
const BACKGROUND_IMAGE_OPACITY = 0.72;
/** Desfoque único e leve por cima da imagem (expo-blur). */
const BLUR_INTENSITY = 16;

type Props = {
  onContinue: () => Promise<void>;
  onBack: () => Promise<void>;
  onHelpPress?: () => void;
};

export function WelcomeScreen({
  onContinue,
  onBack,
  onHelpPress,
}: Props): ReactElement {
  const insets = useSafeAreaInsets();
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  const [busy, setBusy] = useState(false);
  const [backing, setBacking] = useState(false);

  const isDefault = preference === "default";
  const logoSeniorColor = isDefault ? brandNavy : "#FFFFFF";
  const logoEaseColor = isDefault ? accentBlue : highContrastActionBlue;

  const logoSize = Math.min(48, Math.max(26, Math.round(LOGO_BASE * scale)));
  const buttonLabelSize = Math.min(
    26,
    Math.max(14, Math.round(BUTTON_LABEL_BASE * scale)),
  );
  const helpSize = Math.min(22, Math.max(13, Math.round(HELP_LINK_BASE * scale)));
  const buttonMinH = Math.min(120, Math.max(52, Math.round(BUTTON_MIN_H * scale)));
  const buttonPadV = Math.max(14, Math.round(16 * scale));

  const primaryBg = isDefault ? accentBlue : palette.primary;
  const primaryFg = isDefault ? "#FFFFFF" : palette.onPrimary;
  const secondaryBg = isDefault ? brandNavy : "#001B3D";
  const secondaryFg = "#FFFFFF";
  const secondaryBorder = isDefault ? undefined : palette.border;
  const backIconColor = isDefault ? brandNavy : "#FFFFFF";
  const backIconSize = Math.min(34, Math.max(22, Math.round(26 * scale)));

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(
      isDefault ? "#E8EEF4" : palette.background,
    );
  }, [isDefault, palette.background]);

  const runContinue = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onContinue();
    } finally {
      setBusy(false);
    }
  }, [busy, onContinue]);

  const handleBack = useCallback(async () => {
    if (backing || busy) return;
    setBacking(true);
    try {
      await onBack();
    } finally {
      setBacking(false);
    }
  }, [backing, busy, onBack]);

  if (!fontsLoaded) {
    return (
      <View style={[styles.boot, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={palette.primary} />
        <StatusBar style={isDefault ? "dark" : "light"} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: isDefault ? "#E4EBF2" : palette.background,
        },
      ]}
      testID="welcome-screen"
    >
      <View style={styles.bgStack} pointerEvents="none">
        <Image
          source={require("../../../assets/welcome_image.png")}
          style={[styles.bgImage, { opacity: BACKGROUND_IMAGE_OPACITY }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        {!isDefault ? (
          <View style={styles.highContrastPhotoScrim} />
        ) : null}
        <BlurView
          intensity={isDefault ? BLUR_INTENSITY : BLUR_INTENSITY + 10}
          tint={isDefault ? "light" : "dark"}
          style={styles.blurLayer}
        />
      </View>
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <StatusBar style={isDefault ? "dark" : "light"} />
        <View
          style={[
            styles.content,
            { paddingTop: screenHeaderPaddingTop(insets.top) },
          ]}
        >
          <View style={styles.topBar}>
            <Pressable
              testID="welcome-back-button"
              onPress={handleBack}
              disabled={backing || busy}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                  borderWidth: isDefault ? 0 : 2,
                  borderColor: isDefault ? "transparent" : palette.border,
                },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons
                name="chevron-back"
                size={backIconSize}
                color={backIconColor}
              />
            </Pressable>
          </View>
          <View
            style={styles.logoBlock}
            accessibilityRole="header"
            accessibilityLabel="seniorease"
          >
            <Text
              style={[
                styles.logoText,
                {
                  fontFamily: LEXEND_BOLD,
                  fontSize: logoSize,
                  lineHeight: logoSize * 1.08,
                  color: logoSeniorColor,
                },
              ]}
            >
              senior
            </Text>
            <Text
              style={[
                styles.logoText,
                {
                  fontFamily: LEXEND_BOLD,
                  fontSize: logoSize,
                  lineHeight: logoSize * 1.08,
                  color: logoEaseColor,
                },
              ]}
            >
              ease
            </Text>
          </View>

          <View style={styles.flexSpacer} />

          <Pressable
            testID="welcome-primary-button"
            disabled={busy}
            onPress={runContinue}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: primaryBg,
                minHeight: buttonMinH,
                paddingVertical: buttonPadV,
                opacity: pressed && !busy ? 0.92 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Criar uma conta"
          >
            <Text
              style={{
                fontFamily: LEXEND_BOLD,
                fontSize: buttonLabelSize,
                color: primaryFg,
              }}
            >
              Criar uma conta
            </Text>
          </Pressable>

          <Pressable
            testID="welcome-secondary-button"
            disabled={busy}
            onPress={runContinue}
            style={({ pressed }) => [
              styles.button,
              styles.buttonSecondary,
              {
                backgroundColor: secondaryBg,
                minHeight: buttonMinH,
                paddingVertical: buttonPadV,
                borderWidth: secondaryBorder ? 2 : 0,
                borderColor: secondaryBorder ?? "transparent",
                opacity: pressed && !busy ? 0.92 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Já tenho uma conta"
          >
            <Text
              style={{
                fontFamily: LEXEND_BOLD,
                fontSize: buttonLabelSize,
                color: secondaryFg,
              }}
            >
              Já tenho uma conta
            </Text>
          </Pressable>

          <View style={styles.bottomSpacer} />

          <Pressable
            testID="welcome-help-link"
            onPress={onHelpPress}
            disabled={!onHelpPress}
            style={({ pressed }) => [
              styles.helpWrap,
              pressed && onHelpPress && styles.helpPressed,
            ]}
            accessibilityRole="link"
            accessibilityLabel="Preciso de ajuda"
          >
            <Text
              style={[
                styles.helpText,
                {
                  fontFamily: LEXEND_REGULAR,
                  fontSize: helpSize,
                  color: logoSeniorColor,
                },
              ]}
            >
              Preciso de ajuda
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
      {busy ? (
        <View
          style={[
            styles.busyOverlay,
            isDefault ? styles.busyOverlayLight : styles.busyOverlayDark,
          ]}
          pointerEvents="auto"
        >
          <ActivityIndicator
            size="large"
            color={isDefault ? brandNavy : "#FFFFFF"}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bgStack: {
    ...StyleSheet.absoluteFillObject,
  },
  highContrastPhotoScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(3, 8, 16, 0.5)",
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    paddingBottom: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: -4,
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
  pressed: {
    opacity: 0.92,
  },
  flexSpacer: {
    flex: 1,
    minHeight: 24,
  },
  logoBlock: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 0,
  },
  logoText: {
    letterSpacing: -0.8,
  },
  button: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 14,
  },
  buttonSecondary: {
    marginBottom: 0,
  },
  bottomSpacer: {
    flexGrow: 1,
    minHeight: 20,
    maxHeight: 80,
  },
  helpWrap: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  helpPressed: {
    opacity: 0.75,
  },
  helpText: {
    textDecorationLine: "underline",
    textAlign: "center",
  },
  busyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  busyOverlayLight: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  busyOverlayDark: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
