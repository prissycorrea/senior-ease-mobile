import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";
import { brandNavy } from "../theme/themePalette";

const TITLE_FONT_SIZE = 24;
const SUBTITLE_FONT_SIZE = 16;
const SUBTITLE_LINE_HEIGHT = 22;

type Props = {
  onBack: () => Promise<void>;
};

export function MainAppScreen({ onBack }: Props) {
  const { preference, palette } = useAppTheme();
  const fontScale = useFontScaleMultiplier();
  const [backing, setBacking] = useState(false);

  const isDefault = preference === "default";
  const backIconColor = isDefault ? brandNavy : "#000000";
  const backIconSize = Math.min(34, Math.max(22, Math.round(26 * fontScale)));

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(palette.background);
  }, [palette.background]);

  const handleBack = useCallback(async () => {
    if (backing) return;
    setBacking(true);
    try {
      await onBack();
    } finally {
      setBacking(false);
    }
  }, [backing, onBack]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={handleBack}
            disabled={backing}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: "#FFFFFF" },
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
        <View style={styles.centerBlock}>
          <Text
            style={[
              styles.title,
              {
                color: palette.text,
                fontSize: TITLE_FONT_SIZE * fontScale,
              },
            ]}
          >
            Senior Ease
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: palette.textMuted,
                fontSize: SUBTITLE_FONT_SIZE * fontScale,
                lineHeight: SUBTITLE_LINE_HEIGHT * fontScale,
              },
            ]}
          >
            O tema escolhido está ativo em todo o aplicativo.
          </Text>
        </View>
      </SafeAreaView>
      <StatusBar style={preference === "high_contrast" ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
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
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
  },
});
