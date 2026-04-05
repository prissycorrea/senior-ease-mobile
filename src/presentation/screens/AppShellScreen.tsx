import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useEffect, type ReactElement } from "react";
import { StyleSheet, View } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

/** Área do app após onboarding/cadastro; conteúdo principal virá depois. */
export function AppShellScreen(): ReactElement {
  const { preference, palette } = useAppTheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(palette.background);
  }, [palette.background]);

  return (
    <View
      style={[styles.root, { backgroundColor: palette.background }]}
      testID="app-shell"
    >
      <StatusBar style={preference === "high_contrast" ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
