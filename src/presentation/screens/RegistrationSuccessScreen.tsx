import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useEffect, type ReactElement } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { brandNavy, highContrastActionBlue } from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

type Props = {
  onCreateTask: () => void;
  onSkip: () => void;
};

export function RegistrationSuccessScreen({
  onCreateTask,
  onSkip,
}: Props): ReactElement {
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  const fontBold = fontsLoaded ? LEXEND_BOLD : undefined;
  const fontRegular = fontsLoaded ? LEXEND_REGULAR : undefined;

  const isDefault = preference === "default";
  const bg = isDefault ? "#F0F4F8" : palette.background;
  const titleColor = isDefault ? "#0047AB" : highContrastActionBlue;
  const subtitleColor = isDefault ? "#5C6B7A" : palette.textMuted;
  const primaryBg = isDefault ? brandNavy : palette.primary;
  const primaryOnBg = isDefault ? "#FFFFFF" : palette.onPrimary;
  const secondaryColor = isDefault ? "#5C6B7A" : palette.text;
  const iconColor = isDefault ? "#1DA34D" : "#69F0AE";

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(bg);
  }, [bg]);

  const titleSize = Math.min(42, Math.max(28, Math.round(36 * scale)));
  const successRingSize = Math.min(144, Math.max(100, Math.round(120 * scale)));
  const successCheckSize = Math.min(72, Math.max(48, Math.round(56 * scale)));
  const buttonH = Math.min(100, Math.max(52, Math.round(56 * scale)));
  const buttonText = Math.min(22, Math.max(15, Math.round(17 * scale)));
  const skipTextSize = Math.min(20, Math.max(14, Math.round(16 * scale)));

  return (
    <View testID="registration-success-screen" style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <StatusBar style={isDefault ? "dark" : "light"} />
        <View style={styles.content}>
          <View
            style={[
              styles.successRing,
              {
                width: successRingSize,
                height: successRingSize,
                borderRadius: successRingSize / 2,
                borderColor: iconColor,
              },
            ]}
          >
            <Ionicons
              name="checkmark"
              size={successCheckSize}
              color={iconColor}
            />
          </View>
          <Text
            style={{
              fontFamily: fontBold,
              fontSize: titleSize,
              lineHeight: titleSize * 1.2,
              color: titleColor,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Conta criada{"\n"}com sucesso!
          </Text>
          <Text
            style={{
              fontFamily: fontRegular,
              fontSize: skipTextSize,
              lineHeight: skipTextSize * 1.45,
              color: subtitleColor,
              textAlign: "center",
              marginBottom: 48,
              paddingHorizontal: 24,
            }}
          >
            Tudo pronto. Agora você pode organizar sua rotina de forma simples e segura.
          </Text>
        </View>

        <View style={styles.footer}>
          <Pressable
            testID="success-create-task"
            onPress={onCreateTask}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: primaryBg,
                minHeight: buttonH,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: buttonText,
                color: primaryOnBg,
              }}
            >
              Criar minha primeira tarefa
            </Text>
          </Pressable>

          <Pressable
            testID="success-skip"
            onPress={onSkip}
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: skipTextSize,
                color: secondaryColor,
              }}
            >
              Ir para a tela inicial
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 28,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successRing: {
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  footer: {
    paddingBottom: 24,
  },
  primaryButton: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
});
