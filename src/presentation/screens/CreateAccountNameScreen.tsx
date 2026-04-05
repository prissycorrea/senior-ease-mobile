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
  Alert,
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
const BTN_LABEL_BASE = 17;
const NEXT_BASE = 17;
const MIC_BASE = 22;

const TOP_TINT_DEFAULT = "#DCE8F2";
const INPUT_BG_DEFAULT = "#E8EEF4";
const VOICE_BG_DEFAULT = "rgba(0, 86, 179, 0.14)";

type Props = {
  initialFullName: string;
  onBack: () => Promise<void>;
  onNext: (fullName: string) => Promise<void>;
};

export function CreateAccountNameScreen({
  initialFullName,
  onBack,
  onNext,
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
  const [name, setName] = useState(initialFullName);
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
  const voiceBg = isDefault ? VOICE_BG_DEFAULT : "rgba(84, 166, 255, 0.2)";
  const voiceIconColor = isDefault ? brandNavy : highContrastActionBlue;
  const voiceTextColor = isDefault ? brandNavy : palette.text;

  const titleSize = Math.min(48, Math.max(28, Math.round(TITLE_LINE * scale)));
  const titleLh = Math.min(54, Math.max(32, Math.round(TITLE_LH * scale)));
  const bodySize = Math.min(22, Math.max(14, Math.round(BODY_BASE * scale)));
  const inputSize = Math.min(24, Math.max(15, Math.round(INPUT_BASE * scale)));
  const btnLabelSize = Math.min(
    20,
    Math.max(14, Math.round(BTN_LABEL_BASE * scale)),
  );
  const nextSize = Math.min(22, Math.max(15, Math.round(NEXT_BASE * scale)));
  const micSize = Math.min(28, Math.max(18, Math.round(MIC_BASE * scale)));
  const nextMinH = Math.min(120, Math.max(52, Math.round(56 * scale)));
  const nextPadV = Math.min(22, Math.max(14, Math.round(17 * scale)));
  const inputMinH = Math.min(72, Math.max(52, Math.round(56 * scale)));

  const canNext = name.trim().length >= 2;

  useEffect(() => {
    setName(initialFullName);
  }, [initialFullName]);

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

  const handleNext = useCallback(async () => {
    if (!canNext || submitting) return;
    setSubmitting(true);
    try {
      await onNext(name.trim());
    } finally {
      setSubmitting(false);
    }
  }, [canNext, name, onNext, submitting]);

  const handleVoicePress = useCallback(() => {
    Alert.alert(
      "Voz",
      "Em breve você poderá ditar o nome por aqui.",
      [{ text: "OK" }],
    );
  }, []);

  return (
    <View
      testID="sign-up-step-1-screen"
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
              testID="sign-up-name-back"
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
                currentStep={1}
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
              Como{"\n"}podemos te{"\n"}
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
              chamar?
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
              Digite ou use a sua voz para informar o seu nome completo.
            </Text>

            <TextInput
              testID="sign-up-name-input"
              value={name}
              onChangeText={setName}
              placeholder="Digite o seu nome completo"
              placeholderTextColor={placeholderColor}
              style={{
                fontFamily: fontRegular,
                fontSize: inputSize,
                color: palette.text,
                backgroundColor: inputBg,
                borderWidth: 1,
                borderColor: inputBorder,
                borderRadius: 999,
                paddingHorizontal: 22,
                minHeight: inputMinH,
                paddingVertical: 14,
                marginBottom: 16,
              }}
              accessibilityLabel="Nome completo"
              autoCorrect={false}
              autoCapitalize="words"
            />

            <Pressable
              testID="sign-up-voice-button"
              onPress={handleVoicePress}
              style={({ pressed }) => [
                styles.voiceButton,
                {
                  backgroundColor: voiceBg,
                  minHeight: inputMinH,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ou use a voz tocando aqui"
            >
              <Ionicons name="mic" size={micSize} color={voiceIconColor} />
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: btnLabelSize,
                  color: voiceTextColor,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                Ou use a voz tocando aqui
              </Text>
            </Pressable>
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
            testID="sign-up-name-next"
            onPress={handleNext}
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
  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 999,
    paddingHorizontal: 20,
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
