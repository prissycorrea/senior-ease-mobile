import { Lexend_700Bold, useFonts } from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState, type ReactElement } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { ThemePreference } from "../../domain/entities/ThemePreference";
import { screenHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import { brandNavy, highContrastActionBlue } from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";

const LEXEND_BOLD = "Lexend_700Bold";
const BG_DEFAULT = "#F4F7F9";
const PROFILE_CARD_DEFAULT = "#E1F0F7";
const SECTION_LABEL_DEFAULT = "#5C6B7A";
const ROW_BORDER_DEFAULT = "#E3E8EE";
const LOGOUT_RED = "#C62828";
const ICON_BLUE = "#0056B3";

export type SettingsScreenProps = {
  userDisplayName: string;
  onBack: () => void;
  onFontSize: () => void;
  onUpdateThemePreference: (preference: ThemePreference) => Promise<void>;
  onLogout: () => Promise<void>;
};

export function SettingsScreen({
  userDisplayName,
  onBack,
  onFontSize,
  onUpdateThemePreference,
  onLogout,
}: SettingsScreenProps): ReactElement {
  const insets = useSafeAreaInsets();
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const [fontsLoaded] = useFonts({
    Lexend_700Bold,
  });
  const fontBold = fontsLoaded ? LEXEND_BOLD : undefined;

  const [themeBusy, setThemeBusy] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);

  const isDefault = preference === "default";
  const screenBg = isDefault ? BG_DEFAULT : palette.background;
  const profileCardBg = isDefault ? PROFILE_CARD_DEFAULT : palette.surface;
  const sectionLabelColor = isDefault ? SECTION_LABEL_DEFAULT : palette.textMuted;
  const rowBg = isDefault ? "#FFFFFF" : palette.surface;
  const rowBorder = isDefault ? ROW_BORDER_DEFAULT : palette.border;
  const titleColor = isDefault ? "#1A1A1A" : palette.text;
  const chevronColor = isDefault ? "#8FA3B3" : palette.textMuted;
  const backIconColor = isDefault ? brandNavy : palette.text;
  const nameColor = isDefault ? brandNavy : palette.primary;
  const iconTint = isDefault ? ICON_BLUE : highContrastActionBlue;

  const headerTitleSize = Math.min(22, Math.max(17, Math.round(19 * scale)));
  const sectionSize = Math.min(13, Math.max(10, Math.round(11 * scale)));
  const rowTitleSize = Math.min(18, Math.max(14, Math.round(16 * scale)));
  const profileNameSize = Math.min(20, Math.max(16, Math.round(18 * scale)));
  const editBtnSize = Math.min(15, Math.max(12, Math.round(13 * scale)));
  const iconBox = Math.min(44, Math.max(36, Math.round(40 * scale)));

  const highContrastOn = preference === "high_contrast";

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(screenBg);
  }, [screenBg]);

  const handleHighContrast = useCallback(
    async (value: boolean) => {
      if (themeBusy) return;
      setThemeBusy(true);
      try {
        await onUpdateThemePreference(value ? "high_contrast" : "default");
      } finally {
        setThemeBusy(false);
      }
    },
    [onUpdateThemePreference, themeBusy],
  );

  const handleLogoutPress = useCallback(() => {
    Alert.alert(
      "Sair da conta",
      "Você voltará para a tela inicial. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            if (logoutBusy) return;
            setLogoutBusy(true);
            void (async () => {
              try {
                await onLogout();
              } finally {
                setLogoutBusy(false);
              }
            })();
          },
        },
      ],
    );
  }, [logoutBusy, onLogout]);

  const displayName =
    userDisplayName.trim().length > 0 ? userDisplayName.trim() : "Usuário";

  return (
    <View
      testID="settings-screen"
      style={[styles.root, { backgroundColor: screenBg }]}
    >
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View
          style={[
            styles.headerRow,
            { paddingTop: screenHeaderPaddingTop(insets.top) },
          ]}
        >
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backCircle,
              {
                backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                borderColor: isDefault ? ROW_BORDER_DEFAULT : palette.border,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons
              name="chevron-back"
              size={Math.min(28, Math.max(22, Math.round(24 * scale)))}
              color={backIconColor}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: fontBold,
              fontSize: headerTitleSize,
              color: titleColor,
              flex: 1,
              marginLeft: 8,
            }}
          >
            Ajustes
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 28 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: profileCardBg,
                borderWidth: isDefault ? 0 : 1,
                borderColor: palette.border,
              },
            ]}
          >
            <View
              style={[
                styles.avatarCircle,
                {
                  backgroundColor: isDefault ? "#FFFFFF" : palette.background,
                },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={Math.min(28, Math.max(20, Math.round(24 * scale)))}
                color={isDefault ? "#5C6B7A" : palette.textMuted}
              />
            </View>
            <View style={styles.profileTextCol}>
              <Text
                testID="settings-user-name"
                numberOfLines={1}
                style={{
                  fontFamily: fontBold,
                  fontSize: profileNameSize,
                  color: nameColor,
                }}
              >
                {displayName}
              </Text>
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Editar perfil",
                    "Em breve você poderá alterar seus dados por aqui.",
                  );
                }}
                style={({ pressed }) => [
                  styles.editPill,
                  {
                    backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                    borderColor: isDefault ? "#B0BEC5" : palette.border,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Editar perfil"
              >
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: editBtnSize,
                    color: titleColor,
                  }}
                >
                  Editar perfil
                </Text>
              </Pressable>
            </View>
          </View>

          <Text
            style={[
              styles.sectionLabel,
              {
                fontFamily: fontBold,
                fontSize: sectionSize,
                color: sectionLabelColor,
              },
            ]}
          >
            ACESSIBILIDADE
          </Text>

          <Pressable
            onPress={onFontSize}
            style={({ pressed }) => [
              styles.rowCard,
              {
                backgroundColor: rowBg,
                borderColor: rowBorder,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Tamanho da letra"
          >
            <View
              style={[
                styles.iconBox,
                styles.fontSizeIconCol,
                { width: iconBox, height: iconBox },
              ]}
            >
              <Text
                style={{
                  color: iconTint,
                  fontFamily: fontBold,
                  fontSize: Math.round(11 * scale),
                }}
              >
                T
              </Text>
              <Text
                style={{
                  color: iconTint,
                  fontFamily: fontBold,
                  fontSize: Math.round(17 * scale),
                  marginTop: -3,
                }}
              >
                T
              </Text>
            </View>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: rowTitleSize,
                color: titleColor,
                flex: 1,
              }}
            >
              Tamanho da Letra
            </Text>
            <Ionicons name="chevron-forward" size={22} color={chevronColor} />
          </Pressable>

          <View
            style={[
              styles.rowCard,
              {
                backgroundColor: rowBg,
                borderColor: rowBorder,
              },
            ]}
          >
            <View style={[styles.iconBox, { width: iconBox, height: iconBox }]}>
              <Ionicons name="contrast-outline" size={22} color={iconTint} />
            </View>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: rowTitleSize,
                color: titleColor,
                flex: 1,
              }}
            >
              Alto Contraste
            </Text>
            <Switch
              testID="settings-high-contrast-switch"
              value={highContrastOn}
              disabled={themeBusy}
              onValueChange={(v) => {
                void handleHighContrast(v);
              }}
              trackColor={{
                false: isDefault ? "#D5DEE6" : "rgba(255,255,255,0.25)",
                true: isDefault ? brandNavy : palette.primary,
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={isDefault ? "#D5DEE6" : undefined}
            />
          </View>

          <Pressable
            onPress={() => {
              Alert.alert(
                "Configurar voz",
                "Em breve você poderá ajustar leitura e ditado por aqui.",
              );
            }}
            style={({ pressed }) => [
              styles.rowCard,
              {
                backgroundColor: rowBg,
                borderColor: rowBorder,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Configurar voz"
          >
            <View style={[styles.iconBox, { width: iconBox, height: iconBox }]}>
              <Ionicons name="mic-outline" size={22} color={iconTint} />
            </View>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: rowTitleSize,
                color: titleColor,
                flex: 1,
              }}
            >
              Configurar Voz
            </Text>
            <Ionicons name="chevron-forward" size={22} color={chevronColor} />
          </Pressable>

          <Text
            style={[
              styles.sectionLabel,
              styles.sectionSpacer,
              {
                fontFamily: fontBold,
                fontSize: sectionSize,
                color: sectionLabelColor,
              },
            ]}
          >
            CONTA
          </Text>

          <Pressable
            onPress={() => {
              Alert.alert(
                "Privacidade e segurança",
                "Em breve você encontrará opções de privacidade e segurança aqui.",
              );
            }}
            style={({ pressed }) => [
              styles.rowCard,
              {
                backgroundColor: rowBg,
                borderColor: rowBorder,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Privacidade e segurança"
          >
            <View style={[styles.iconBox, { width: iconBox, height: iconBox }]}>
              <Ionicons name="lock-closed" size={22} color={iconTint} />
            </View>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: rowTitleSize,
                color: titleColor,
                flex: 1,
              }}
            >
              Privacidade e Segurança
            </Text>
            <Ionicons name="chevron-forward" size={22} color={chevronColor} />
          </Pressable>

          <Pressable
            onPress={handleLogoutPress}
            disabled={logoutBusy}
            style={({ pressed }) => [
              styles.rowCard,
              {
                backgroundColor: rowBg,
                borderColor: rowBorder,
                opacity: pressed || logoutBusy ? 0.88 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <View style={[styles.iconBox, { width: iconBox, height: iconBox }]}>
              <Ionicons name="log-out-outline" size={22} color={LOGOUT_RED} />
            </View>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: rowTitleSize,
                color: LOGOUT_RED,
                flex: 1,
              }}
            >
              Sair da Conta
            </Text>
            <Ionicons name="chevron-forward" size={22} color={chevronColor} />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
      <StatusBar style={preference === "high_contrast" ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
    marginBottom: 28,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  profileTextCol: {
    flex: 1,
    gap: 10,
  },
  editPill: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  sectionLabel: {
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  sectionSpacer: {
    marginTop: 8,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
    marginBottom: 12,
  },
  iconBox: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 86, 179, 0.08)",
  },
  fontSizeIconCol: {
    flexDirection: "column",
    justifyContent: "center",
  },
});
