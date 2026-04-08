import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import { type ReactElement } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";
import { brandNavy } from "../theme/themePalette";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

type Props = {
  activeTab: "home" | "agenda";
  onTabPress: (tab: "home" | "agenda") => void;
  onAddPress: () => void;
  backgroundColor?: string;
};

export function BottomNavigation({
  activeTab,
  onTabPress,
  onAddPress,
  backgroundColor,
}: Props): ReactElement {
  const insets = useSafeAreaInsets();
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  const isDefault = preference === "default";
  const ringActive = isDefault ? brandNavy : palette.primary;
  const bottomNavLabel = Math.min(14, Math.max(10, Math.round(12 * scale)));
  const fontBold = fontsLoaded ? LEXEND_BOLD : undefined;
  const fontRegular = fontsLoaded ? LEXEND_REGULAR : undefined;

  const bgColor =
    backgroundColor ||
    (activeTab === "agenda" ? palette.surface : palette.background);
  const navPillBg = isDefault ? "#FFFFFF" : palette.surface;

  return (
    <View
      style={[
        styles.bottomDock,
        {
          paddingBottom: 12 + insets.bottom,
          backgroundColor: bgColor,
        },
      ]}
    >
      <View style={styles.bottomInner}>
        <View
          style={[
            styles.navPill,
            {
              backgroundColor: navPillBg,
              borderWidth: isDefault ? 0 : 1,
              borderColor: palette.border,
            },
          ]}
        >
          <Pressable
            onPress={() => onTabPress("home")}
            style={styles.navItem}
            accessibilityRole="button"
            accessibilityLabel="Início"
          >
            <Ionicons
              name="home"
              size={24}
              color={activeTab === "home" ? ringActive : palette.textMuted}
            />
            <Text
              style={{
                fontFamily: activeTab === "home" ? fontBold : fontRegular,
                fontSize: bottomNavLabel,
                color: activeTab === "home" ? ringActive : palette.textMuted,
                marginTop: 4,
              }}
            >
              Início
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onTabPress("agenda")}
            style={styles.navItem}
            accessibilityRole="button"
            accessibilityLabel="Agenda"
          >
            <Ionicons
              name="calendar-outline"
              size={24}
              color={activeTab === "agenda" ? ringActive : palette.textMuted}
            />
            <Text
              style={{
                fontFamily: activeTab === "agenda" ? fontBold : fontRegular,
                fontSize: bottomNavLabel,
                color: activeTab === "agenda" ? ringActive : palette.textMuted,
                marginTop: 4,
              }}
            >
              Agenda
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={onAddPress}
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: isDefault ? brandNavy : palette.primary,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Adicionar atividade"
        >
          <Text
            style={{
              fontFamily: fontBold,
              fontSize: Math.min(18, Math.max(14, Math.round(15 * scale))),
              color: isDefault ? "#FFFFFF" : palette.onPrimary,
            }}
          >
            Adicionar Tarefa
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  bottomInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  navPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  navItem: {
    alignItems: "center",
    minWidth: 56,
  },
  addButton: {
    flex: 1,
    borderRadius: 999,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
