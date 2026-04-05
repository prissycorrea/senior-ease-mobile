import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { screenHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import {
  accentBlue,
  brandNavy,
  highContrastActionBlue,
} from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";
import type { HomeActivity } from "../types/homeActivity";
import { AddTaskScreen } from "./AddTaskScreen";
import { TaskDetailScreen } from "./TaskDetailScreen";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

const PROFILE_PILL_DEFAULT = "#DCE8F2";
const PROGRESS_CARD_DEFAULT = "rgba(0, 86, 179, 0.1)";
const NAV_PILL_DEFAULT = "#DCE8F2";
const COMPLETED_GREEN = "#2E7D32";
const COMPLETED_GREEN_HC = "#69F0AE";

type Props = {
  userDisplayName: string;
  onBack: () => Promise<void>;
};

const INITIAL_ACTIVITIES: HomeActivity[] = [
  {
    id: "1",
    title: "Tomar remédio",
    subtitle: "Hoje — 09:00h",
    done: true,
  },
  {
    id: "2",
    title: "Caminhar no parque",
    subtitle: "Hoje — 10:00h",
    done: false,
  },
  {
    id: "3",
    title: "Almoço com a família",
    subtitle: "Hoje — 12:00h",
    done: false,
  },
  {
    id: "4",
    title: "Leitura de estudo",
    subtitle: "Amanhã — 16:00h",
    done: false,
  },
];

function DailyProgressRing({
  size,
  strokeWidth,
  progress,
  activeColor,
  trackColor,
  label,
  fontFamily,
  labelSize,
  labelColor,
}: {
  size: number;
  strokeWidth: number;
  progress: number;
  activeColor: string;
  trackColor: string;
  label: string;
  fontFamily: string | undefined;
  labelSize: number;
  labelColor: string;
}) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${cx}, ${cy}`}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={activeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.ringLabelWrap}>
        <Text
          style={{
            fontFamily,
            fontSize: labelSize,
            fontWeight: "700",
            color: labelColor,
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

export function MainAppScreen({ userDisplayName, onBack }: Props): ReactElement {
  const insets = useSafeAreaInsets();
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  const fontBold = fontsLoaded ? LEXEND_BOLD : undefined;
  const fontRegular = fontsLoaded ? LEXEND_REGULAR : undefined;
  const [backing, setBacking] = useState(false);
  const [activities, setActivities] =
    useState<HomeActivity[]>(INITIAL_ACTIVITIES);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [addTaskVisible, setAddTaskVisible] = useState(false);

  const isDefault = preference === "default";
  const displayName =
    userDisplayName.trim().length > 0 ? userDisplayName.trim() : "Usuário";

  const titleAccent = isDefault ? accentBlue : highContrastActionBlue;
  const profilePillBg = isDefault ? PROFILE_PILL_DEFAULT : palette.surface;
  const progressCardBg = isDefault ? PROGRESS_CARD_DEFAULT : palette.surface;
  const navPillBg = isDefault ? NAV_PILL_DEFAULT : palette.surface;
  const cardBg = isDefault ? "#FFFFFF" : palette.surface;
  const cardBorder = isDefault ? "#C9D5DE" : palette.border;
  const completedColor = isDefault ? COMPLETED_GREEN : COMPLETED_GREEN_HC;
  const ringTrack = isDefault ? "#E0E8F0" : "rgba(255,255,255,0.25)";
  const progressSubtitleColor = isDefault ? "#5C6B7A" : palette.textMuted;
  const ringActive = isDefault ? brandNavy : palette.primary;
  const chevronColor = isDefault ? "#8FA3B3" : palette.textMuted;

  const titleLine = Math.min(42, Math.max(26, Math.round(34 * scale)));
  const sectionTitle = Math.min(22, Math.max(15, Math.round(17 * scale)));
  const bodySize = Math.min(20, Math.max(14, Math.round(15 * scale)));
  const smallMeta = Math.min(17, Math.max(12, Math.round(13 * scale)));
  const nameSize = Math.min(20, Math.max(14, Math.round(16 * scale)));
  const ringSize = Math.min(120, Math.max(76, Math.round(92 * scale)));
  const ringStroke = isDefault
    ? Math.min(8, Math.max(5, Math.round(6 * scale)))
    : Math.min(10, Math.max(6, Math.round(8 * scale)));
  const ringLabel = Math.min(22, Math.max(14, Math.round(18 * scale)));
  const bottomNavLabel = Math.min(13, Math.max(10, Math.round(11 * scale)));
  const addTaskSize = Math.min(18, Math.max(13, Math.round(15 * scale)));
  const iconTop = Math.min(34, Math.max(22, Math.round(26 * scale)));

  const detailTask = useMemo(
    () => activities.find((a) => a.id === detailTaskId) ?? null,
    [activities, detailTaskId],
  );

  const progressFraction = useMemo(() => {
    const done = activities.filter((a) => a.done).length;
    const total = activities.length;
    return { done, total, pct: total === 0 ? 0 : done / total };
  }, [activities]);

  useEffect(() => {
    if (
      detailTaskId !== null &&
      !activities.some((a) => a.id === detailTaskId)
    ) {
      setDetailTaskId(null);
    }
  }, [activities, detailTaskId]);

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

  const handleSettings = useCallback(() => {
    Alert.alert("Configurações", "Em breve você poderá ajustar o app por aqui.");
  }, []);

  const handleAddTask = useCallback(() => {
    setAddTaskVisible(true);
  }, []);

  const handleAddTaskClose = useCallback(() => {
    setAddTaskVisible(false);
  }, []);

  const handleCreateTask = useCallback((title: string, subtitle: string) => {
    const sub =
      subtitle.trim().length > 0 ? subtitle.trim() : "Sem horário definido";
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setActivities((prev) => [
      ...prev,
      { id, title, subtitle: sub, done: false },
    ]);
    setAddTaskVisible(false);
  }, []);

  const handleAgenda = useCallback(() => {
    Alert.alert("Agenda", "Em breve sua agenda completa estará aqui.");
  }, []);

  const handleActivityPress = useCallback((id: string) => {
    setDetailTaskId(id);
  }, []);

  const handleTaskDetailClose = useCallback(() => {
    setDetailTaskId(null);
  }, []);

  const handleTaskSave = useCallback(
    (id: string, title: string, subtitle: string) => {
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, title, subtitle } : a)),
      );
    },
    [],
  );

  const handleTaskToggleDone = useCallback((id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)),
    );
  }, []);

  const handleTaskDelete = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setDetailTaskId(null);
  }, []);

  return (
    <View
      testID="home-screen"
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
            onPress={handleBack}
            disabled={backing}
            style={({ pressed }) => [
              styles.iconCircle,
              {
                backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                borderWidth: isDefault ? 0 : 1,
                borderColor: palette.border,
              },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons
              name="chevron-back"
              size={iconTop}
              color={isDefault ? brandNavy : palette.text}
            />
          </Pressable>

          <View
            style={[
              styles.profilePill,
              {
                backgroundColor: profilePillBg,
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
                size={Math.min(26, Math.max(18, Math.round(22 * scale)))}
                color={isDefault ? "#5C6B7A" : palette.textMuted}
              />
            </View>
            <Text
              testID="home-user-name"
              numberOfLines={1}
              style={{
                fontFamily: fontBold,
                fontSize: nameSize,
                color: palette.text,
                flex: 1,
              }}
            >
              {displayName}
            </Text>
          </View>

          <Pressable
            onPress={handleSettings}
            style={({ pressed }) => [
              styles.iconCircle,
              {
                backgroundColor: isDefault ? "#FFFFFF" : palette.surface,
                borderWidth: isDefault ? 0 : 1,
                borderColor: palette.border,
              },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Configurações"
          >
            <Ionicons
              name="settings-outline"
              size={iconTop}
              color={isDefault ? "#5C6B7A" : palette.text}
            />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 28 + insets.bottom + 88 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.titleBlock}>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: titleLine,
                lineHeight: titleLine * 1.05,
                color: palette.text,
              }}
            >
              Próximas{"\n"}
            </Text>
            <Text
              style={{
                fontFamily: fontBold,
                fontSize: titleLine,
                lineHeight: titleLine * 1.05,
                color: titleAccent,
              }}
            >
              atividades
            </Text>
          </Text>

          <View
            style={[
              styles.progressCard,
              {
                backgroundColor: progressCardBg,
                borderWidth: isDefault ? 0 : 1,
                borderColor: palette.border,
                ...(isDefault
                  ? {}
                  : {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 6,
                      elevation: 2,
                    }),
              },
            ]}
          >
            <View
              style={[
                styles.ringShadowWrap,
                {
                  width: ringSize,
                  height: ringSize,
                  borderRadius: ringSize / 2,
                  backgroundColor: progressCardBg,
                  shadowOpacity: isDefault ? 0.12 : 0.18,
                  elevation: isDefault ? 4 : 0,
                },
              ]}
            >
              <DailyProgressRing
                size={ringSize}
                strokeWidth={ringStroke}
                progress={progressFraction.pct}
                activeColor={ringActive}
                trackColor={ringTrack}
                label={`${Math.round(progressFraction.pct * 100)}%`}
                fontFamily={fontBold}
                labelSize={ringLabel}
                labelColor={palette.text}
              />
            </View>
            <View style={styles.progressTextCol}>
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: sectionTitle,
                  lineHeight: Math.round(sectionTitle * 1.2),
                  color: ringActive,
                  marginBottom: 8,
                }}
              >
                Progresso{"\n"}diário
              </Text>
              <Text
                style={{
                  fontFamily: fontRegular,
                  fontSize: smallMeta,
                  lineHeight: Math.round(smallMeta * 1.35),
                  color: progressSubtitleColor,
                }}
              >
                {progressFraction.done} de {progressFraction.total} atividades
              </Text>
            </View>
          </View>

          <View style={styles.listGap}>
            {activities.map((item) => (
              <Pressable
                key={item.id}
                testID={`home-activity-${item.id}`}
                onPress={() => handleActivityPress(item.id)}
                style={({ pressed }) => [
                  styles.activityCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <View style={styles.activityRow}>
                  {item.done ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={Math.min(32, Math.max(22, Math.round(26 * scale)))}
                      color={completedColor}
                    />
                  ) : (
                    <View
                      style={[
                        styles.emptyCircle,
                        { borderColor: isDefault ? "#B0BEC5" : palette.border },
                      ]}
                    />
                  )}
                  <View style={styles.activityTexts}>
                    <Text
                      style={{
                        fontFamily: fontBold,
                        fontSize: bodySize,
                        color: item.done ? completedColor : palette.text,
                        textDecorationLine: item.done ? "line-through" : "none",
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontRegular,
                        fontSize: smallMeta,
                        color: palette.textMuted,
                        marginTop: 4,
                      }}
                    >
                      {item.subtitle}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={chevronColor}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomDock,
            {
              paddingBottom: 12 + insets.bottom,
              backgroundColor: palette.background,
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
              <View style={styles.navItem}>
                <Ionicons name="home" size={24} color={ringActive} />
                <Text
                  style={{
                    fontFamily: fontBold,
                    fontSize: bottomNavLabel,
                    color: ringActive,
                    marginTop: 4,
                  }}
                >
                  Início
                </Text>
              </View>
              <Pressable
                onPress={handleAgenda}
                style={styles.navItem}
                accessibilityRole="button"
                accessibilityLabel="Agenda"
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={palette.textMuted}
                />
                <Text
                  style={{
                    fontFamily: fontRegular,
                    fontSize: bottomNavLabel,
                    color: palette.textMuted,
                    marginTop: 4,
                  }}
                >
                  Agenda
                </Text>
              </Pressable>
            </View>

            <Pressable
              testID="home-add-task"
              onPress={handleAddTask}
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: isDefault ? brandNavy : palette.primary,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Adicionar tarefa"
            >
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: addTaskSize,
                  color: isDefault ? "#FFFFFF" : palette.onPrimary,
                }}
              >
                Adicionar Tarefa
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
      <StatusBar style={preference === "high_contrast" ? "light" : "dark"} />
      <TaskDetailScreen
        visible={detailTaskId !== null}
        task={detailTask}
        onClose={handleTaskDetailClose}
        onSave={handleTaskSave}
        onToggleDone={handleTaskToggleDone}
        onDelete={handleTaskDelete}
      />
      <AddTaskScreen
        visible={addTaskVisible}
        onClose={handleAddTaskClose}
        onCreate={handleCreateTask}
      />
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
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
  profilePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 10,
    minHeight: 48,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.88,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  titleBlock: {
    marginBottom: 20,
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 22,
    gap: 16,
  },
  ringShadowWrap: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabelWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTextCol: {
    flex: 1,
    justifyContent: "center",
  },
  listGap: {
    gap: 12,
  },
  activityCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emptyCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
  },
  activityTexts: {
    flex: 1,
  },
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
  },
});
