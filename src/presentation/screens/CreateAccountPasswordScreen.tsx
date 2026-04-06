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

const TITLE_LINE = 42;
const TITLE_LH = 48;
const BODY_BASE = 16;
const INPUT_BASE = 17;
const NEXT_BASE = 17;

const TOP_TINT_DEFAULT = "#DCE8F2";
const INPUT_BG_DEFAULT = "#E8EEF4";
const TIP_BG_DEFAULT = "rgba(0, 86, 179, 0.12)";

const MIN_PASSWORD_LEN = 6;

type Props = {
  onBack: () => Promise<void>;
  onComplete: (password: string) => Promise<void>;
};

export function CreateAccountPasswordScreen({
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
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
  const tipBg = isDefault ? TIP_BG_DEFAULT : "rgba(84, 166, 255, 0.18)";
  const tipIconColor = isDefault ? brandNavy : highContrastActionBlue;
  const iconMuted = isDefault ? "#A8B8C8" : "rgba(255,255,255,0.4)";

  const titleSize = Math.min(48, Math.max(28, Math.round(TITLE_LINE * scale)));
  const titleLh = Math.min(54, Math.max(32, Math.round(TITLE_LH * scale)));
  const bodySize = Math.min(22, Math.max(14, Math.round(BODY_BASE * scale)));
  const inputSize = Math.min(24, Math.max(15, Math.round(INPUT_BASE * scale)));
  const nextSize = Math.min(22, Math.max(15, Math.round(NEXT_BASE * scale)));
  const tipSize = Math.min(20, Math.max(14, Math.round(15 * scale)));
  const iconSize = Math.min(26, Math.max(20, Math.round(22 * scale)));
  const bulbSize = Math.min(28, Math.max(22, Math.round(24 * scale)));
  const nextMinH = Math.min(120, Math.max(52, Math.round(56 * scale)));
  const nextPadV = Math.min(22, Math.max(14, Math.round(17 * scale)));
  const inputMinH = Math.min(72, Math.max(52, Math.round(56 * scale)));

  const passwordsMatch = password === confirm && confirm.length > 0;
  const longEnough = password.length >= MIN_PASSWORD_LEN;
  const canNext = longEnough && passwordsMatch;

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

  const handleComplete = useCallback(async () => {
    if (!canNext || submitting) return;
    setSubmitting(true);
    try {
      await onComplete(password.trim());
    } finally {
      setSubmitting(false);
    }
  }, [canNext, onComplete, password, submitting]);

  const passwordInput = (
    label: string,
    testID: string,
    toggleTestID: string,
    value: string,
    onChangeText: (t: string) => void,
    secure: boolean,
    onToggleSecure: () => void,
    placeholder: string,
  ) => (
    <View
      style={[
        styles.inputShell,
        {
          backgroundColor: inputBg,
          borderColor: inputBorder,
          minHeight: inputMinH,
          marginBottom: 14,
        },
      ]}
    >
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
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
        accessibilityLabel={label}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry={secure}
        textContentType="newPassword"
        autoComplete="password-new"
      />
      <Pressable
        testID={toggleTestID}
        onPress={onToggleSecure}
        style={({ pressed }) => [
          styles.inputIconHit,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={secure ? "Mostrar senha" : "Ocultar senha"}
      >
        <Ionicons
          name={secure ? "eye-off-outline" : "eye-outline"}
          size={iconSize}
          color={iconMuted}
        />
      </Pressable>
    </View>
  );

  return (
    <View
      testID="sign-up-step-3-screen"
      style={[styles.screenRoot, { backgroundColor: topBg }]}
    >
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <StatusBar style={isDefault ? "dark" : "light"} />
        <View style={[styles.topSection, { backgroundColor: topBg }]}>
          <View
            style={[
              styles.topBar,
              { paddingTop: screenHeaderPaddingTop(insets.top) },
            ]}
          >
            <Pressable
              testID="sign-up-password-back"
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
                currentStep={3}
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
              Crie uma{"\n"}
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
              senha segura
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
                marginBottom: 20,
              }}
            >
              Sua senha deve ser fácil de lembrar, mas difícil de adivinhar.
            </Text>

            {passwordInput(
              "Senha",
              "sign-up-password-input",
              "sign-up-password-toggle-primary",
              password,
              setPassword,
              !showPassword,
              () => setShowPassword((v) => !v),
              "Digite sua senha",
            )}

            {passwordInput(
              "Confirmar senha",
              "sign-up-password-confirm-input",
              "sign-up-password-toggle-confirm",
              confirm,
              setConfirm,
              !showConfirm,
              () => setShowConfirm((v) => !v),
              "Digite a senha novamente",
            )}

            <View
              style={[
                styles.tipBox,
                {
                  backgroundColor: tipBg,
                  borderColor: isDefault ? "transparent" : palette.border,
                  borderWidth: isDefault ? 0 : 1,
                },
              ]}
            >
              <Ionicons
                name="bulb-outline"
                size={bulbSize}
                color={tipIconColor}
                style={styles.tipIcon}
              />
              <Text
                style={{
                  fontFamily: fontRegular,
                  fontSize: tipSize,
                  lineHeight: tipSize * 1.45,
                  color: bodyColor,
                  flex: 1,
                }}
              >
                <Text style={{ fontFamily: fontBold, color: titleMutedColor }}>
                  Dica:{" "}
                </Text>
                Use uma data especial ou o nome de alguém que você ama com um
                número.
              </Text>
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
            testID="sign-up-password-next"
            onPress={handleComplete}
            disabled={!canNext || submitting}
            style={({ pressed }) => [
              styles.nextButton,
              {
                backgroundColor: isDefault ? brandNavy : palette.primary,
                minHeight: nextMinH,
                paddingVertical: nextPadV,
                opacity: !canNext ? 0.45 : pressed || submitting ? 0.92 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Próximo"
          >
            {submitting ? (
              <ActivityIndicator
                color={isDefault ? "#FFFFFF" : palette.onPrimary}
              />
            ) : (
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: nextSize,
                  lineHeight: nextSize * 1.2,
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
  screenRoot: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 28,
    paddingBottom: 12,
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
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  footerBar: {
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  nextButton: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
