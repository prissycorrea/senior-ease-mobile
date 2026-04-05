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
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { screenHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import { accentBlue, brandNavy, highContrastActionBlue } from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

const TOP_TINT_DEFAULT = "#F1F4F7";
const INPUT_BG_DEFAULT = "#E8EEF4";
const VOICE_BG_DEFAULT = "rgba(0, 86, 179, 0.14)";
const ICON_CIRCLE_DEFAULT = "rgba(0, 86, 179, 0.12)";

type DayMode = "today" | "tomorrow" | "custom";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (title: string, subtitle: string) => void;
};

function formatSubtitle(
  mode: DayMode,
  customDate: string,
  timeText: string,
  remindOn: boolean,
): string {
  let day: string;
  if (mode === "today") day = "Hoje";
  else if (mode === "tomorrow") day = "Amanhã";
  else day = customDate.trim() || "Data a definir";
  const t = timeText.trim();
  let timePart = "";
  if (t.length > 0) {
    const normalized = /\d/.test(t) && !t.toLowerCase().includes("h")
      ? `${t}h`
      : t;
    timePart = ` — ${normalized}`;
  }
  let s = day + timePart;
  if (remindOn) {
    s += " · Lembrete";
  }
  return s;
}

export function AddTaskScreen({
  visible,
  onClose,
  onCreate,
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

  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState("");
  const [dayMode, setDayMode] = useState<DayMode>("today");
  const [customDate, setCustomDate] = useState("");
  const [timeText, setTimeText] = useState("");
  const [remindOn, setRemindOn] = useState(false);
  const [dateFieldOpen, setDateFieldOpen] = useState(false);
  const [timeFieldOpen, setTimeFieldOpen] = useState(false);

  const isDefault = preference === "default";
  const titleMuted = isDefault ? "#1A1A1A" : palette.text;
  const titleAccent = isDefault ? accentBlue : highContrastActionBlue;
  const topBg = isDefault ? TOP_TINT_DEFAULT : palette.background;
  const cardBg = isDefault ? "#FFFFFF" : palette.surface;
  const bodyColor = isDefault ? "#5C6B7A" : palette.textMuted;
  const inputBg = isDefault ? INPUT_BG_DEFAULT : "#001B3D";
  const inputBorder = isDefault ? "#B8D4E8" : palette.border;
  const placeholderColor = isDefault ? "#8FA3B3" : "rgba(255,255,255,0.45)";
  const voiceBg = isDefault ? VOICE_BG_DEFAULT : "rgba(84, 166, 255, 0.2)";
  const voiceIconColor = isDefault ? brandNavy : highContrastActionBlue;
  const voiceTextColor = isDefault ? brandNavy : palette.text;
  const iconCircleBg = isDefault ? ICON_CIRCLE_DEFAULT : "rgba(84, 166, 255, 0.2)";
  const pillBorder = isDefault ? "#C9D5DE" : palette.border;
  const primaryBtnBg = isDefault ? brandNavy : palette.primary;
  const primaryBtnText = isDefault ? "#FFFFFF" : palette.onPrimary;

  const headerTitleSize = Math.min(17, Math.max(14, Math.round(16 * scale)));
  const titleSize = Math.min(40, Math.max(26, Math.round(34 * scale)));
  const titleLh = Math.min(44, Math.max(30, Math.round(38 * scale)));
  const bodySize = Math.min(18, Math.max(14, Math.round(16 * scale)));
  const inputSize = Math.min(20, Math.max(15, Math.round(17 * scale)));
  const btnLabelSize = Math.min(20, Math.max(15, Math.round(17 * scale)));
  const micSize = Math.min(26, Math.max(18, Math.round(22 * scale)));
  const inputMinH = Math.min(72, Math.max(52, Math.round(56 * scale)));
  const nextMinH = Math.min(120, Math.max(52, Math.round(56 * scale)));
  const nextPadV = Math.min(22, Math.max(14, Math.round(17 * scale)));
  const rowIconSize = Math.min(22, Math.max(18, Math.round(20 * scale)));

  useEffect(() => {
    if (visible) {
      setStep(1);
      setTitle("");
      setDayMode("today");
      setCustomDate("");
      setTimeText("");
      setRemindOn(false);
      setDateFieldOpen(false);
      setTimeFieldOpen(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      void SystemUI.setBackgroundColorAsync(topBg);
    }
  }, [visible, topBg]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSettings = useCallback(() => {
    Alert.alert(
      "Configurações",
      "Em breve você poderá ajustar lembretes e preferências por aqui.",
    );
  }, []);

  const handleVoicePress = useCallback(() => {
    Alert.alert(
      "Voz",
      "Em breve você poderá ditar a tarefa por aqui.",
      [{ text: "OK" }],
    );
  }, []);

  const handleStep1Next = useCallback(() => {
    const t = title.trim();
    if (t.length < 1) {
      Alert.alert(
        "Título obrigatório",
        "Digite ou dite o que você precisa fazer.",
      );
      return;
    }
    setStep(2);
  }, [title]);

  const handleStep2Back = useCallback(() => {
    setStep(1);
  }, []);

  const handleFinish = useCallback(() => {
    const t = title.trim();
    if (t.length < 1) {
      setStep(1);
      return;
    }
    const sub = formatSubtitle(dayMode, customDate, timeText, remindOn);
    onCreate(t, sub);
  }, [customDate, dayMode, onCreate, remindOn, timeText, title]);

  const selectToday = useCallback(() => {
    setDayMode("today");
    setDateFieldOpen(false);
    setCustomDate("");
  }, []);

  const selectTomorrow = useCallback(() => {
    setDayMode("tomorrow");
    setDateFieldOpen(false);
    setCustomDate("");
  }, []);

  const openCustomDate = useCallback(() => {
    setDayMode("custom");
    setDateFieldOpen(true);
  }, []);

  const openTimeField = useCallback(() => {
    setTimeFieldOpen(true);
  }, []);

  const canStep1Next = title.trim().length >= 1;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View
        testID="add-task-screen"
        style={[styles.screenRoot, { backgroundColor: topBg }]}
      >
        <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
          <StatusBar style={isDefault ? "dark" : "light"} />

          <View style={[styles.topSection, { backgroundColor: topBg }]}>
            <View
              style={[
                styles.headerBar,
                { paddingTop: screenHeaderPaddingTop(insets.top) },
              ]}
            >
              <View style={styles.headerSide}>
                {step === 1 ? (
                  <Pressable
                    testID="add-task-close"
                    onPress={handleClose}
                    style={({ pressed }) => [
                      styles.roundBtn,
                      {
                        backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                        borderWidth: isDefault ? 0 : 2,
                        borderColor: isDefault ? "transparent" : palette.border,
                        opacity: pressed ? 0.88 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar"
                  >
                    <Ionicons
                      name="close"
                      size={Math.min(28, Math.max(22, Math.round(24 * scale)))}
                      color={isDefault ? "#1A1A1A" : palette.text}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    testID="add-task-step2-back"
                    onPress={handleStep2Back}
                    style={({ pressed }) => [
                      styles.roundBtn,
                      {
                        backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                        borderWidth: isDefault ? 0 : 2,
                        borderColor: isDefault ? "transparent" : palette.border,
                        opacity: pressed ? 0.88 : 1,
                      },
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
                )}
              </View>
              <View style={styles.headerCenter}>
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: headerTitleSize,
                    color: titleMuted,
                  }}
                >
                  Nova tarefa
                </Text>
              </View>
              <View style={styles.headerSide}>
                <Pressable
                  testID="add-task-settings"
                  onPress={handleSettings}
                  style={({ pressed }) => [
                    styles.roundBtn,
                    {
                      backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                      borderWidth: isDefault ? 0 : 2,
                      borderColor: isDefault ? "transparent" : palette.border,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Configurações"
                >
                  <Ionicons
                    name="settings-outline"
                    size={Math.min(24, Math.max(20, Math.round(22 * scale)))}
                    color={isDefault ? "#5C6B7A" : palette.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {step === 1 ? (
              <Text style={styles.titleBlock}>
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: titleSize,
                    lineHeight: titleLh,
                    color: titleMuted,
                    letterSpacing: -0.5,
                  }}
                >
                  O que você{"\n"}
                </Text>
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: titleSize,
                    lineHeight: titleLh,
                    color: titleAccent,
                    letterSpacing: -0.5,
                  }}
                >
                  precisa fazer?
                </Text>
              </Text>
            ) : (
              <Text style={styles.titleBlock}>
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: titleSize,
                    lineHeight: titleLh,
                    color: titleAccent,
                    letterSpacing: -0.5,
                  }}
                >
                  Quando será{"\n"}
                </Text>
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: titleSize,
                    lineHeight: titleLh,
                    color: titleMuted,
                    letterSpacing: -0.5,
                  }}
                >
                  a atividade?
                </Text>
              </Text>
            )}
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
              {step === 1 ? (
                <>
                  <Text
                    style={{
                      fontFamily: fontRegular,
                      fontSize: bodySize,
                      lineHeight: bodySize * 1.45,
                      color: bodyColor,
                      marginBottom: 20,
                    }}
                  >
                    Digite ou fale a sua nova tarefa
                  </Text>
                  <TextInput
                    testID="add-task-title-input"
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Digite aqui a sua nova tarefa"
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
                    accessibilityLabel="Descrição da nova tarefa"
                  />
                  <Pressable
                    testID="add-task-voice-button"
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
                </>
              ) : (
                <>
                  <View style={styles.dayPillRow}>
                    <Pressable
                      testID="add-task-day-today"
                      onPress={selectToday}
                      style={({ pressed }) => [
                        styles.dayPill,
                        {
                          flex: 1,
                          backgroundColor:
                            dayMode === "today"
                              ? primaryBtnBg
                              : isDefault
                                ? "#FFFFFF"
                                : palette.surface,
                          borderColor:
                            dayMode === "today" ? primaryBtnBg : pillBorder,
                          borderWidth: dayMode === "today" ? 0 : 1,
                          opacity: pressed ? 0.92 : 1,
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel="Hoje"
                      accessibilityState={{ selected: dayMode === "today" }}
                    >
                      <Text
                        style={{
                          fontFamily: fontBold,
                          fontSize: btnLabelSize,
                          color:
                            dayMode === "today"
                              ? primaryBtnText
                              : palette.text,
                          flex: 1,
                        }}
                      >
                        Hoje
                      </Text>
                      {dayMode === "today" ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={primaryBtnText}
                        />
                      ) : (
                        <View
                          style={[
                            styles.emptyRadio,
                            { borderColor: pillBorder },
                          ]}
                        />
                      )}
                    </Pressable>
                    <Pressable
                      testID="add-task-day-tomorrow"
                      onPress={selectTomorrow}
                      style={({ pressed }) => [
                        styles.dayPill,
                        {
                          flex: 1,
                          backgroundColor:
                            dayMode === "tomorrow"
                              ? primaryBtnBg
                              : isDefault
                                ? "#FFFFFF"
                                : palette.surface,
                          borderColor:
                            dayMode === "tomorrow" ? primaryBtnBg : pillBorder,
                          borderWidth: dayMode === "tomorrow" ? 0 : 1,
                          opacity: pressed ? 0.92 : 1,
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel="Amanhã"
                      accessibilityState={{ selected: dayMode === "tomorrow" }}
                    >
                      <Text
                        style={{
                          fontFamily: fontBold,
                          fontSize: btnLabelSize,
                          color:
                            dayMode === "tomorrow"
                              ? primaryBtnText
                              : palette.text,
                          flex: 1,
                        }}
                      >
                        Amanhã
                      </Text>
                      {dayMode === "tomorrow" ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={primaryBtnText}
                        />
                      ) : (
                        <View
                          style={[
                            styles.emptyRadio,
                            { borderColor: pillBorder },
                          ]}
                        />
                      )}
                    </Pressable>
                  </View>

                  {dateFieldOpen || dayMode === "custom" ? (
                    <TextInput
                      testID="add-task-custom-date-input"
                      value={customDate}
                      onChangeText={setCustomDate}
                      placeholder="Ex.: 15/04"
                      placeholderTextColor={placeholderColor}
                      style={{
                        fontFamily: fontRegular,
                        fontSize: inputSize,
                        color: palette.text,
                        backgroundColor: inputBg,
                        borderWidth: 1,
                        borderColor: inputBorder,
                        borderRadius: 14,
                        paddingHorizontal: 16,
                        minHeight: 48,
                        paddingVertical: 12,
                        marginBottom: 16,
                      }}
                      accessibilityLabel="Outra data"
                    />
                  ) : null}

                  <Pressable
                    testID="add-task-pick-date-row"
                    onPress={openCustomDate}
                    style={({ pressed }) => [
                      styles.optionRow,
                      {
                        borderBottomColor: pillBorder,
                        opacity: pressed ? 0.88 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Selecione outra data"
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: iconCircleBg },
                      ]}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={rowIconSize}
                        color={titleAccent}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: fontBold,
                        fontSize: inputSize,
                        color: palette.text,
                        flex: 1,
                      }}
                    >
                      Selecione outra data
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={bodyColor}
                    />
                  </Pressable>

                  <Pressable
                    testID="add-task-pick-time-row"
                    onPress={openTimeField}
                    style={({ pressed }) => [
                      styles.optionRow,
                      {
                        borderBottomColor: pillBorder,
                        opacity: pressed ? 0.88 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Informe o horário"
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: iconCircleBg },
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={rowIconSize}
                        color={titleAccent}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: fontBold,
                        fontSize: inputSize,
                        color: palette.text,
                        flex: 1,
                      }}
                    >
                      Informe o horário
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={bodyColor}
                    />
                  </Pressable>

                  {timeFieldOpen ? (
                    <TextInput
                      testID="add-task-time-input"
                      value={timeText}
                      onChangeText={setTimeText}
                      placeholder="Ex.: 10:00h"
                      placeholderTextColor={placeholderColor}
                      style={{
                        fontFamily: fontRegular,
                        fontSize: inputSize,
                        color: palette.text,
                        backgroundColor: inputBg,
                        borderWidth: 1,
                        borderColor: inputBorder,
                        borderRadius: 14,
                        paddingHorizontal: 16,
                        minHeight: 48,
                        paddingVertical: 12,
                        marginBottom: 8,
                        marginLeft: 56,
                      }}
                      accessibilityLabel="Horário da atividade"
                    />
                  ) : null}

                  <View
                    style={[
                      styles.optionRow,
                      {
                        borderBottomWidth: 0,
                        paddingVertical: 14,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: iconCircleBg },
                      ]}
                    >
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={rowIconSize}
                        color={titleAccent}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: fontBold,
                        fontSize: inputSize,
                        color: palette.text,
                        flex: 1,
                      }}
                    >
                      Me lembre
                    </Text>
                    <Switch
                      testID="add-task-reminder-switch"
                      value={remindOn}
                      onValueChange={setRemindOn}
                      trackColor={{
                        false: isDefault ? "#D8DEE6" : "#4A5568",
                        true: isDefault ? brandNavy : highContrastActionBlue,
                      }}
                      thumbColor="#FFFFFF"
                      accessibilityLabel="Ativar lembrete"
                    />
                  </View>
                </>
              )}
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
            {step === 1 ? (
              <Pressable
                testID="add-task-step1-next"
                onPress={handleStep1Next}
                disabled={!canStep1Next}
                style={({ pressed }) => [
                  styles.nextButton,
                  {
                    backgroundColor: primaryBtnBg,
                    minHeight: nextMinH,
                    paddingVertical: nextPadV,
                    opacity: !canStep1Next ? 0.45 : pressed ? 0.92 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Próximo"
              >
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: btnLabelSize,
                    color: primaryBtnText,
                  }}
                >
                  Próximo
                </Text>
              </Pressable>
            ) : (
              <Pressable
                testID="add-task-submit"
                onPress={handleFinish}
                style={({ pressed }) => [
                  styles.nextButton,
                  {
                    backgroundColor: primaryBtnBg,
                    minHeight: nextMinH,
                    paddingVertical: nextPadV,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Concluir"
              >
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: btnLabelSize,
                    color: primaryBtnText,
                  }}
                >
                  Próximo
                </Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
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
    paddingBottom: 8,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerSide: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  roundBtn: {
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
  titleBlock: {
    alignSelf: "stretch",
    marginBottom: 8,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
  dayPillRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  dayPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
    gap: 8,
  },
  emptyRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
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
