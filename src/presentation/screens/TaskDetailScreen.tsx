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
  Alert,
  Modal,
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

import { screenHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import type { HomeActivity } from "../types/homeActivity";
import {
  accentBlue,
  brandNavy,
  highContrastActionBlue,
} from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

const COMPLETED_GREEN = "#2E7D32";
const COMPLETED_GREEN_HC = "#69F0AE";
const DANGER = "#C62828";
const DANGER_HC = "#FF8A80";

type Props = {
  visible: boolean;
  task: HomeActivity | null;
  onClose: () => void;
  onSave: (id: string, title: string, subtitle: string) => void;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskDetailScreen({
  visible,
  task,
  onClose,
  onSave,
  onToggleDone,
  onDelete,
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

  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSubtitle, setDraftSubtitle] = useState("");

  const isDefault = preference === "default";
  const titleAccent = isDefault ? accentBlue : highContrastActionBlue;
  const completedColor = isDefault ? COMPLETED_GREEN : COMPLETED_GREEN_HC;
  const dangerColor = isDefault ? DANGER : DANGER_HC;
  const inputBg = isDefault ? "#E8EEF4" : "#001B3D";
  const inputBorder = isDefault ? "#B8D4E8" : palette.border;
  const placeholderColor = isDefault ? "#8FA3B3" : "rgba(255,255,255,0.45)";
  const muted = isDefault ? "#5C6B7A" : palette.textMuted;
  const primaryBtnBg = isDefault ? brandNavy : palette.primary;
  const primaryBtnText = isDefault ? "#FFFFFF" : palette.onPrimary;

  const headSize = Math.min(22, Math.max(16, Math.round(18 * scale)));
  const bodySize = Math.min(20, Math.max(14, Math.round(16 * scale)));
  const labelSize = Math.min(15, Math.max(12, Math.round(13 * scale)));
  const inputSize = Math.min(20, Math.max(15, Math.round(17 * scale)));
  const btnLabel = Math.min(18, Math.max(14, Math.round(16 * scale)));
  const iconTop = Math.min(34, Math.max(22, Math.round(26 * scale)));

  useEffect(() => {
    if (task) {
      setDraftTitle(task.title);
      setDraftSubtitle(task.subtitle);
      setEditing(false);
    }
  }, [task?.id, task?.title, task?.subtitle, visible]);

  useEffect(() => {
    if (visible) {
      void SystemUI.setBackgroundColorAsync(palette.background);
    }
  }, [visible, palette.background]);

  const handleClose = useCallback(() => {
    setEditing(false);
    onClose();
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (!task) return;
    const t = draftTitle.trim();
    if (t.length < 1) {
      Alert.alert("Título obrigatório", "Digite um nome para a atividade.");
      return;
    }
    onSave(task.id, t, draftSubtitle.trim());
    setEditing(false);
  }, [draftSubtitle, draftTitle, onSave, task]);

  const handleCancelEdit = useCallback(() => {
    if (task) {
      setDraftTitle(task.title);
      setDraftSubtitle(task.subtitle);
    }
    setEditing(false);
  }, [task]);

  const handleToggleDone = useCallback(() => {
    if (!task) return;
    onToggleDone(task.id);
  }, [onToggleDone, task]);

  const handleDelete = useCallback(() => {
    if (!task) return;
    Alert.alert(
      "Excluir atividade",
      `Tem certeza que deseja excluir "${task.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDelete(task.id),
        },
      ],
    );
  }, [onDelete, task]);

  const open = Boolean(visible && task);

  return (
    <Modal
      visible={open}
      animationType="none"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      {task ? (
      <View
        testID="task-detail-screen"
        style={[styles.root, { backgroundColor: palette.background }]}
      >
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
          <View
            style={[
              styles.headerRow,
              { paddingTop: screenHeaderPaddingTop(insets.top) },
            ]}
          >
            <Pressable
              onPress={handleClose}
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
              accessibilityLabel="Fechar"
            >
              <Ionicons
                name="chevron-back"
                size={iconTop}
                color={isDefault ? brandNavy : palette.text}
              />
            </Pressable>
            <Text
              style={{
                flex: 1,
                fontFamily: fontBold,
                fontSize: headSize,
                color: palette.text,
                marginLeft: 8,
              }}
              numberOfLines={1}
            >
              Detalhes da atividade
            </Text>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 24 + insets.bottom },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: task.done
                    ? isDefault
                      ? "rgba(46, 125, 50, 0.12)"
                      : "rgba(105, 240, 174, 0.2)"
                    : isDefault
                      ? "rgba(0, 86, 179, 0.1)"
                      : "rgba(84, 166, 255, 0.2)",
                  alignSelf: "flex-start",
                },
              ]}
            >
              <Ionicons
                name={task.done ? "checkmark-circle" : "time-outline"}
                size={22}
                color={task.done ? completedColor : titleAccent}
              />
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: labelSize,
                  color: task.done ? completedColor : titleAccent,
                  marginLeft: 8,
                }}
              >
                {task.done ? "Concluída" : "Pendente"}
              </Text>
            </View>

            <Text
              style={[
                styles.fieldLabel,
                { fontFamily: fontBold, color: muted, fontSize: labelSize },
              ]}
            >
              Título
            </Text>
            {editing ? (
              <TextInput
                testID="task-detail-title-input"
                value={draftTitle}
                onChangeText={setDraftTitle}
                placeholder="Nome da atividade"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.input,
                  {
                    fontFamily: fontRegular,
                    fontSize: inputSize,
                    color: palette.text,
                    backgroundColor: inputBg,
                    borderColor: inputBorder,
                  },
                ]}
                accessibilityLabel="Título da atividade"
              />
            ) : (
              <Text
                testID="task-detail-title"
                style={{
                  fontFamily: fontBold,
                  fontSize: bodySize,
                  color: palette.text,
                  marginBottom: 20,
                }}
              >
                {task.title}
              </Text>
            )}

            <Text
              style={[
                styles.fieldLabel,
                { fontFamily: fontBold, color: muted, fontSize: labelSize },
              ]}
            >
              Data e horário
            </Text>
            {editing ? (
              <TextInput
                testID="task-detail-subtitle-input"
                value={draftSubtitle}
                onChangeText={setDraftSubtitle}
                placeholder="Ex.: Hoje — 10:00h"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.input,
                  {
                    fontFamily: fontRegular,
                    fontSize: inputSize,
                    color: palette.text,
                    backgroundColor: inputBg,
                    borderColor: inputBorder,
                  },
                ]}
                accessibilityLabel="Data e horário"
              />
            ) : (
              <Text
                testID="task-detail-subtitle"
                style={{
                  fontFamily: fontRegular,
                  fontSize: bodySize,
                  color: muted,
                  marginBottom: 28,
                }}
              >
                {task.subtitle}
              </Text>
            )}

            {editing ? (
              <View style={styles.btnCol}>
                <Pressable
                  testID="task-detail-save"
                  onPress={handleSave}
                  style={({ pressed }) => [
                    styles.btnPrimary,
                    {
                      backgroundColor: primaryBtnBg,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Salvar alterações"
                >
                  <Text
                    style={{
                      fontFamily: fontBold,
                      fontSize: btnLabel,
                      color: primaryBtnText,
                    }}
                  >
                    Salvar alterações
                  </Text>
                </Pressable>
                <Pressable
                  testID="task-detail-cancel-edit"
                  onPress={handleCancelEdit}
                  style={({ pressed }) => [
                    styles.btnOutline,
                    {
                      borderColor: isDefault ? brandNavy : palette.primary,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar edição"
                >
                  <Text
                    style={{
                      fontFamily: fontBold,
                      fontSize: btnLabel,
                      color: isDefault ? brandNavy : palette.primary,
                    }}
                  >
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.btnCol}>
                {task.done ? (
                  <Pressable
                    testID="task-detail-toggle-done"
                    onPress={handleToggleDone}
                    style={({ pressed }) => [
                      styles.btnOutline,
                      {
                        borderColor: isDefault ? brandNavy : palette.primary,
                        opacity: pressed ? 0.88 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Marcar como pendente"
                  >
                    <Text
                      style={{
                        fontFamily: fontBold,
                        fontSize: btnLabel,
                        color: isDefault ? brandNavy : palette.primary,
                      }}
                    >
                      Marcar como pendente
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    testID="task-detail-toggle-done"
                    onPress={handleToggleDone}
                    style={({ pressed }) => [
                      styles.btnPrimary,
                      {
                        backgroundColor: completedColor,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Marcar como concluída"
                  >
                    <Text
                      style={{
                        fontFamily: fontBold,
                        fontSize: btnLabel,
                        color: "#FFFFFF",
                      }}
                    >
                      Marcar como concluída
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  testID="task-detail-edit"
                  onPress={() => setEditing(true)}
                  style={({ pressed }) => [
                    styles.btnOutline,
                    {
                      borderColor: isDefault ? brandNavy : palette.primary,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Editar atividade"
                >
                  <Text
                    style={{
                      fontFamily: fontBold,
                      fontSize: btnLabel,
                      color: isDefault ? brandNavy : palette.primary,
                    }}
                  >
                    Editar
                  </Text>
                </Pressable>

                <Pressable
                  testID="task-detail-delete"
                  onPress={handleDelete}
                  style={({ pressed }) => [
                    styles.btnOutline,
                    {
                      borderColor: dangerColor,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Excluir atividade"
                >
                  <Text
                    style={{
                      fontFamily: fontBold,
                      fontSize: btnLabel,
                      color: dangerColor,
                    }}
                  >
                    Excluir atividade
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
        <StatusBar style={preference === "high_contrast" ? "light" : "dark"} />
      </View>
      ) : (
        <View />
      )}
    </Modal>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 24,
  },
  fieldLabel: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    minHeight: 52,
  },
  btnCol: {
    gap: 12,
    marginTop: 8,
  },
  btnPrimary: {
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  btnOutline: {
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
});
