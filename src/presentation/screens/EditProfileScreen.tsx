import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { firebaseAuthErrorMessage } from "../../data/firebase/firebaseAuth";

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
const NEXT_BASE = 17;

const TOP_TINT_DEFAULT = "#DCE8F2";
const INPUT_BG_DEFAULT = "#E8EEF4";
const LOGOUT_RED = "#C62828";

type Props = {
  visible: boolean;
  initialName: string;
  initialEmail: string;
  onClose: () => void;
  onSave: (newName: string, newEmail: string) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
};

export function EditProfileScreen({
  visible,
  initialName,
  initialEmail,
  onClose,
  onSave,
  onDeleteAccount,
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

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [backing, setBacking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDefault = preference === "default";
  const titleMutedColor = isDefault ? "#1A1A1A" : palette.text;
  const titleAccentColor = isDefault ? accentBlue : highContrastActionBlue;
  const topBg = isDefault ? TOP_TINT_DEFAULT : palette.background;
  const cardBg = isDefault ? "#F0F4F8" : palette.surface;
  const bodyColor = isDefault ? "#5C6B7A" : palette.textMuted;
  const inputBg = isDefault ? INPUT_BG_DEFAULT : "#001B3D";
  const inputBorder = isDefault ? "#B8D4E8" : palette.border;
  const placeholderColor = isDefault ? "#8FA3B3" : "rgba(255,255,255,0.45)";

  const titleSize = Math.min(48, Math.max(28, Math.round(TITLE_LINE * scale)));
  const titleLh = Math.min(54, Math.max(32, Math.round(TITLE_LH * scale)));
  const bodySize = Math.min(22, Math.max(14, Math.round(BODY_BASE * scale)));
  const inputSize = Math.min(24, Math.max(15, Math.round(INPUT_BASE * scale)));
  const nextSize = Math.min(22, Math.max(15, Math.round(NEXT_BASE * scale)));
  const nextMinH = Math.min(120, Math.max(52, Math.round(56 * scale)));
  const nextPadV = Math.min(22, Math.max(14, Math.round(17 * scale)));
  const inputMinH = Math.min(72, Math.max(52, Math.round(56 * scale)));

  const canSave = name.trim().length >= 2 && email.trim().length >= 5;

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(topBg);
  }, [topBg]);

  const slideAnim = useRef(new Animated.Value(600)).current;

  const handleClose = useCallback(() => {
    if (submitting || deleting) return;
    Animated.timing(slideAnim, {
      toValue: 600,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setName(initialName);
      setEmail(initialEmail);
      onClose();
    });
  }, [deleting, onClose, submitting, initialName, initialEmail, slideAnim]);

  const handleSave = useCallback(async () => {
    if (!canSave || submitting || deleting) return;
    setSubmitting(true);
    try {
      await onSave(name.trim(), email.trim());
      setSubmitting(false);
    } catch (e: any) {
      const code = e && typeof e === "object" && "code" in e ? String(e.code) : undefined;
      Alert.alert(
        "Erro ao salvar",
        code ? firebaseAuthErrorMessage(code) : (e?.message || "Ocorreu um erro ao atualizar os dados.")
      );
      setSubmitting(false);
    }
  }, [canSave, deleting, email, name, onSave, submitting, onClose]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar Exclusão",
          style: "destructive",
          onPress: async () => {
            if (deleting || submitting) return;
            setDeleting(true);
            try {
              await onDeleteAccount();
            } catch (e: any) {
              setDeleting(false);
              const code = e && typeof e === "object" && "code" in e ? String(e.code) : undefined;
              Alert.alert("Erro ao excluir", code ? firebaseAuthErrorMessage(code) : (e?.message || "Ocorreu um erro."));
            }
          }
        }
      ]
    );
  }, [deleting, onDeleteAccount, submitting]);

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setEmail(initialEmail);
      setSubmitting(false);
      setDeleting(false);
      slideAnim.setValue(800);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, initialName, initialEmail, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          testID="edit-profile-sheet"
          style={[
            styles.sheetContainer,
            {
              backgroundColor: cardBg,
              borderColor: isDefault ? "transparent" : palette.border,
              borderWidth: isDefault ? 0 : 1,
              paddingBottom: insets.bottom,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.topSection}>
            <View style={styles.topBar}>
              <Pressable
                onPress={handleClose}
                disabled={submitting || deleting}
                style={({ pressed }) => [
                  styles.closeButton,
                  {
                    backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                    borderWidth: isDefault ? 0 : 2,
                    borderColor: isDefault ? "transparent" : palette.border,
                  },
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
              >
                <Ionicons
                  name="close"
                  size={Math.min(30, Math.max(22, Math.round(24 * scale)))}
                  color={isDefault ? brandNavy : "#FFFFFF"}
                />
              </Pressable>
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: Math.min(20, Math.max(16, Math.round(18 * scale))),
                  color: titleMutedColor,
                  flex: 1,
                  marginLeft: 16,
                }}
              >
                Editar Perfil
              </Text>
            </View>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontFamily: fontRegular,
                fontSize: bodySize,
                lineHeight: bodySize * 1.45,
                color: bodyColor,
                marginBottom: 10,
              }}
            >
              Seu Nome
            </Text>
            <TextInput
              testID="edit-profile-name-input"
              value={name}
              onChangeText={setName}
              placeholder="Ex: João da Silva"
              placeholderTextColor={placeholderColor}
              editable={!submitting && !deleting}
              autoCapitalize="words"
              textContentType="name"
              style={{
                fontFamily: fontRegular,
                fontSize: inputSize,
                color: palette.text,
                backgroundColor: inputBg,
                borderWidth: 1,
                borderColor: inputBorder,
                borderRadius: 14,
                paddingHorizontal: 20,
                minHeight: inputMinH,
                paddingVertical: 14,
                marginBottom: 24,
              }}
              accessibilityLabel="Seu Nome"
            />

            <Text
              style={{
                fontFamily: fontRegular,
                fontSize: bodySize,
                lineHeight: bodySize * 1.45,
                color: bodyColor,
                marginBottom: 10,
              }}
            >
              Seu E-mail
            </Text>
            <TextInput
              testID="edit-profile-email-input"
              value={email}
              onChangeText={setEmail}
              placeholder="Ex: joao@gmail.com"
              placeholderTextColor={placeholderColor}
              editable={false}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              style={{
                fontFamily: fontRegular,
                fontSize: inputSize,
                color: palette.textMuted,
                backgroundColor: isDefault ? "#F4F7F9" : inputBg,
                borderWidth: 1,
                borderColor: inputBorder,
                borderRadius: 14,
                paddingHorizontal: 20,
                minHeight: inputMinH,
                paddingVertical: 14,
                marginBottom: 36,
                opacity: 0.6,
              }}
              accessibilityLabel="Seu E-mail (não editável)"
            />

            <Pressable
              onPress={handleDelete}
              disabled={deleting || submitting}
              style={({ pressed }) => [
                styles.deleteOption,
                { opacity: pressed || deleting ? 0.7 : 1 }
              ]}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={24} color={LOGOUT_RED} />
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: bodySize,
                  color: LOGOUT_RED,
                }}
              >
                Excluir Conta Permanentemente
              </Text>
            </Pressable>

          </ScrollView>

          <View style={styles.footerBar}>
            <View style={styles.footerInner}>
              <Pressable
                testID="edit-profile-save"
                onPress={handleSave}
                disabled={!canSave || submitting || deleting}
                style={({ pressed }) => [
                  styles.nextButton,
                  {
                    backgroundColor:
                      !canSave || submitting
                        ? palette.border
                        : isDefault
                          ? brandNavy
                          : palette.primary,
                    minHeight: nextMinH,
                    paddingVertical: nextPadV,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Salvar alterações"
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="large" />
                ) : (
                  <Text
                    style={{
                      fontFamily: fontBold,
                      fontSize: nextSize,
                      color:
                        !canSave || submitting
                          ? palette.textMuted
                          : isDefault
                            ? "#FFFFFF"
                            : palette.onPrimary,
                    }}
                  >
                    Salvar alterações
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    paddingTop: 24,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 0.75,
    overflow: "hidden",
  },
  topSection: {
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.88,
  },
  titleBlock: {
    marginTop: 8,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 36,
    paddingHorizontal: 28,
  },
  deleteOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  footerInner: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButton: {
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});
