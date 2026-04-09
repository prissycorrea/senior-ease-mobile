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
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { SignUpFlowProgress } from "../components/SignUpFlowProgress";
import { flowHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import {
  accentBlue,
  brandNavy,
  highContrastActionBlue,
} from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

const TITLE_LINE = 42;
const TITLE_LH = 48;
const BODY_BASE = 16;
const INPUT_BASE = 17;
const SUBMIT_BASE = 17;

const TOP_TINT_DEFAULT = "#DCE8F2";
const INPUT_BG_DEFAULT = "#E8EEF4";

const MIN_PASSWORD_LEN = 6;

type Props = {
  accountEmail: string;
  onBack: () => Promise<void>;
  /** Retorna `true` se o login foi aceito (persistência feita pelo pai). */
  onComplete: (password: string) => Promise<boolean>;
};

export function LoginPasswordScreen({
  accountEmail,
  onBack,
  onComplete,
}: Props): ReactElement {
  const insets = useSafeAreaInsets();
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  const fontBold = fontsLoaded ? LEXEND_BOLD : undefined;
  const fontRegular = fontsLoaded ? LEXEND_REGULAR : undefined;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backing, setBacking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isDefault = preference === "default";
  const titleMutedColor = isDefault ? "#1A1A1A" : palette.text;
  const titleAccentColor = isDefault ? accentBlue : highContrastActionBlue;
  const progressActive = isDefault ? brandNavy : palette.primary;
  const progressInactive = isDefault ? "#C9D5DE" : "rgba(255,255,255,0.35)";
  const topBg = isDefault ? TOP_TINT_DEFAULT : palette.background;
  const cardBg = isDefault ? "#FFFFFF" : palette.surface;
  const bodyColor = isDefault ? "#5C6B7A" : palette.textMuted;
  const inputBg = isDefault ? INPUT_BG_DEFAULT : "#001B3D";
  const inputBorder = isDefault ? "#B8D4E8" : palette.border;
  const placeholderColor = isDefault ? "#8FA3B3" : "rgba(255,255,255,0.45)";
  const iconMuted = isDefault ? "#A8B8C8" : "rgba(255,255,255,0.4)";

  const titleSize = Math.min(48, Math.max(28, Math.round(TITLE_LINE * scale)));
  const titleLh = Math.min(54, Math.max(32, Math.round(TITLE_LH * scale)));
  const bodySize = Math.min(22, Math.max(14, Math.round(BODY_BASE * scale)));
  const inputSize = Math.min(24, Math.max(15, Math.round(INPUT_BASE * scale)));
  const submitSize = Math.min(
    22,
    Math.max(15, Math.round(SUBMIT_BASE * scale)),
  );
  const iconSize = Math.min(26, Math.max(20, Math.round(22 * scale)));
  const submitMinH = Math.min(120, Math.max(52, Math.round(56 * scale)));
  const submitPadV = Math.min(22, Math.max(14, Math.round(17 * scale)));
  const inputMinH = Math.min(72, Math.max(52, Math.round(56 * scale)));

  const canSubmit = password.length >= MIN_PASSWORD_LEN;

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(topBg);
  }, [topBg]);

  const handleBack = useCallback(async () => {
    if (backing || submitting) return;
    setBacking(true);
    try {
      await onBack();
    } finally {
      setBacking(false);
    }
  }, [backing, onBack, submitting]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onComplete(password.trim());
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, onComplete, submitting, password]);

  return (
    <View
      testID="login-step-2-screen"
      style={[styles.screenRoot, { backgroundColor: topBg }]}
    >
      <SafeAreaView style={styles.safe} edges={["left", "right"]}>
        <StatusBar style={isDefault ? "dark" : "light"} />
        <View style={[styles.topSection, { backgroundColor: topBg }]}>
          <View
            style={[
              styles.topBar,
              { paddingTop: flowHeaderPaddingTop(insets.top) },
            ]}
          >
            <Pressable
              testID="login-password-back"
              onPress={handleBack}
              disabled={backing || submitting}
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
                size={Math.min(34, Math.max(22, Math.round(26 * scale)))}
                color={isDefault ? brandNavy : "#FFFFFF"}
              />
            </Pressable>
            <View style={styles.progressWrap}>
              <SignUpFlowProgress
                currentStep={2}
                totalSteps={2}
                activeColor={progressActive}
                inactiveColor={progressInactive}
              />
            </View>
            <View style={styles.backPlaceholder} />
          </View>

          <Text style={styles.titleBlock}>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: titleSize,
                lineHeight: titleLh,
                color: titleMutedColor,
                letterSpacing: -1,
              }}
            >
              Digite sua{"\n"}
            </Text>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: titleSize,
                lineHeight: titleLh,
                color: titleAccentColor,
                letterSpacing: -1,
              }}
            >
              senha
            </Text>
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: cardBg,
              borderColor: isDefault ? "transparent" : palette.border,
            },
          ]}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontFamily: fontRegular,
                fontSize: bodySize,
                lineHeight: bodySize * 1.45,
                color: bodyColor,
                marginBottom: 12,
              }}
            >
              Use a mesma senha do seu cadastro no Senior Ease.
            </Text>
            {accountEmail.trim().length > 0 ? (
              <Text
                style={{
                  fontFamily: fontRegular,
                  fontSize: Math.min(18, Math.max(13, bodySize - 2)),
                  lineHeight: bodySize * 1.35,
                  color: bodyColor,
                  marginBottom: 20,
                  opacity: 0.95,
                }}
                numberOfLines={2}
              >
                Conta: {accountEmail.trim()}
              </Text>
            ) : (
              <View style={{ height: 8 }} />
            )}

            <View
              style={[
                styles.inputShell,
                {
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                  minHeight: inputMinH,
                },
              ]}
            >
              <TextInput
                testID="login-password-input"
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                placeholderTextColor={placeholderColor}
                style={{
                  fontFamily: fontRegular,
                  fontSize: inputSize,
                  color: palette.text,
                  flex: 1,
                  paddingVertical: 14,
                  paddingLeft: 22,
                  paddingRight: 8,
                }}
                accessibilityLabel="Senha"
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                textContentType="password"
                autoComplete="password"
              />
              <Pressable
                testID="login-password-toggle"
                onPress={() => setShowPassword((v) => !v)}
                style={({ pressed }) => [
                  styles.inputIconHit,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={iconSize}
                  color={iconMuted}
                />
              </Pressable>
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            styles.footerBar,
            {
              backgroundColor: cardBg,
              paddingBottom: 18 + insets.bottom,
            },
          ]}
        >
          <Pressable
            testID="login-password-submit"
            onPress={handleSubmit}
            disabled={!canSubmit || submitting}
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: isDefault ? brandNavy : palette.primary,
                minHeight: submitMinH,
                paddingVertical: submitPadV,
                opacity: !canSubmit ? 0.45 : pressed || submitting ? 0.92 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Entrar"
          >
            {submitting ? (
              <ActivityIndicator
                color={isDefault ? "#FFFFFF" : palette.onPrimary}
              />
            ) : (
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: submitSize,
                  lineHeight: submitSize * 1.2,
                  color: isDefault ? "#FFFFFF" : palette.onPrimary,
                }}
              >
                Entrar
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  progressWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.92,
  },
  titleBlock: {
    alignSelf: "stretch",
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 0,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 16,
    flexGrow: 1,
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingRight: 10,
  },
  inputIconHit: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  footerBar: {
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  submitButton: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
