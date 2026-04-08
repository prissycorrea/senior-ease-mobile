import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import { type ReactElement } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";

const LEXEND_BOLD = "Lexend_700Bold";
const PROFILE_PILL_DEFAULT = "#DCE8F2";

type Props = {
  displayName: string;
  onSettings: () => void;
  testID?: string;
};

export function DashboardHeader({
  displayName,
  onSettings,
  testID,
}: Props): ReactElement {
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  const fontBold = fontsLoaded ? LEXEND_BOLD : undefined;

  const isDefault = preference === "default";
  const profilePillBg = isDefault ? PROFILE_PILL_DEFAULT : palette.surface;
  const nameSize = Math.min(20, Math.max(14, Math.round(16 * scale)));
  const iconTopSize = Math.min(34, Math.max(22, Math.round(26 * scale)));

  const name = displayName.trim().length > 0 ? displayName.trim() : "Usuário";

  return (
    <View testID={testID} style={styles.headerRow}>
      <View style={styles.profileContainer}>
        <View
          style={[
            styles.avatarCircle,
            {
              backgroundColor: isDefault ? "#FFFFFF" : palette.background,
              borderWidth: isDefault ? 0 : 1,
              borderColor: palette.border,
            },
          ]}
        >
          <Ionicons
            name="person-outline"
            size={Math.min(26, Math.max(18, Math.round(22 * scale)))}
            color={isDefault ? "#5C6B7A" : palette.textMuted}
          />
        </View>
        <View
          style={[
            styles.nameCapsule,
            {
              backgroundColor: profilePillBg,
              borderWidth: isDefault ? 0 : 1,
              borderColor: palette.border,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fontBold,
              fontSize: nameSize,
              color: palette.text,
            }}
          >
            {name}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onSettings}
        style={({ pressed }) => [
          styles.iconCircle,
          {
            backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
            borderWidth: isDefault ? 0 : 1,
            borderColor: palette.border,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Configurações"
      >
        <Ionicons
          name="settings-outline"
          size={iconTopSize}
          color={isDefault ? "#5C6B7A" : palette.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 10,
  },
  profileContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  nameCapsule: {
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    paddingLeft: 22,
    paddingRight: 16,
    marginLeft: -14,
    zIndex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
});
