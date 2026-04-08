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

import type { ThemePreference } from "../../domain/entities/ThemePreference";
import { screenHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import {
  accentBlue,
  brandNavy,
  highContrastActionBlue,
} from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";
import type { HomeActivity } from "../types/homeActivity";
import { addDays, localISODate } from "../utils/agendaDates";

/** Quando definido, tarefas vêm do Firestore (mesma coleção `tasks` da web). */
export type MainAppRemoteTasks = {
  activities: HomeActivity[];
  createTask: (
    title: string,
    subtitle: string,
    scheduleDate: string,
    periodIso: string,
  ) => void | Promise<void>;
  saveTask: (
    previous: HomeActivity,
    title: string,
    subtitle: string,
  ) => void | Promise<void>;
  toggleDone: (id: string) => void | Promise<void>;
  deleteTask: (id: string) => void | Promise<void>;
};
import { AddTaskScreen } from "./AddTaskScreen";
import { AgendaScreen } from "./AgendaScreen";
import { EditProfileScreen } from "./EditProfileScreen";
import { FontSizeOnboardingScreen } from "./FontSizeOnboardingScreen";
import { SettingsScreen } from "./SettingsScreen";
import { TaskDetailScreen } from "./TaskDetailScreen";
import { DashboardHeader } from "../components/DashboardHeader";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

const PROFILE_PILL_DEFAULT = "#DCE8F2";
const PROGRESS_CARD_DEFAULT = "rgba(0, 86, 179, 0.1)";
const NAV_PILL_DEFAULT = "#DCE8F2";
const COMPLETED_GREEN = "#2E7D32";
const COMPLETED_GREEN_HC = "#69F0AE";

type Props = {
  userDisplayName: string;
  userEmail: string;
  onBack: () => Promise<void>;
  onLogout: () => Promise<void>;
  onUpdateProfile: (name: string, email: string) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onUpdateThemePreference: (preference: ThemePreference) => Promise<void>;
  onUpdateFontScale: (multiplier: number) => Promise<void>;
  remoteTasks?: MainAppRemoteTasks;
  autoLaunchTaskCreation?: boolean;
};

function createSeedActivities(): HomeActivity[] {
  const now = new Date();
  const todayKey = localISODate(now);
  const tomorrowKey = localISODate(addDays(now, 1));
  return [
    {
      id: "1",
      title: "Tomar remédio",
      subtitle: "Hoje — 09:00h",
      done: true,
      scheduleDate: todayKey,
    },
    {
      id: "2",
      title: "Caminhar no parque",
      subtitle: "Hoje — 10:00h",
      done: false,
      scheduleDate: todayKey,
    },
    {
      id: "3",
      title: "Almoço com a família",
      subtitle: "Hoje — 12:00h",
      done: false,
      scheduleDate: todayKey,
    },
    {
      id: "4",
      title: "Leitura de estudo",
      subtitle: "Amanhã — 16:00h",
      done: false,
      scheduleDate: tomorrowKey,
    },
  ];
}

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

export function MainAppScreen({
  userDisplayName,
  userEmail,
  onBack,
  onLogout,
  onUpdateProfile,
  onDeleteAccount,
  onUpdateThemePreference,
  onUpdateFontScale,
  remoteTasks,
  autoLaunchTaskCreation,
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
  const [backing, setBacking] = useState(false);
  const [localActivities, setLocalActivities] = useState<HomeActivity[]>(
    createSeedActivities,
  );
  const activities = remoteTasks?.activities ?? localActivities;
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [mainTab, setMainTab] = useState<"home" | "agenda">("home");
  const [mainOverlay, setMainOverlay] = useState<
    "none" | "settings" | "fontSize"
  >("none");
  const [editProfileVisible, setEditProfileVisible] = useState(false);

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
    if (autoLaunchTaskCreation) {
      setAddTaskVisible(true);
    }
  }, [autoLaunchTaskCreation]);

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
    setMainOverlay("settings");
  }, []);

  const handleSettingsBack = useCallback(() => {
    setMainOverlay("none");
  }, []);

  const handleOpenFontSizeFromSettings = useCallback(() => {
    setMainOverlay("fontSize");
  }, []);

  const handleFontSizeFromSettingsComplete = useCallback(
    async (multiplier: number) => {
      await onUpdateFontScale(multiplier);
      setMainOverlay("settings");
    },
    [onUpdateFontScale],
  );

  const handleFontSizeFromSettingsBack = useCallback(async () => {
    setMainOverlay("settings");
  }, []);

  const handleOpenSettingsFromAddTask = useCallback(() => {
    setAddTaskVisible(false);
    setMainOverlay("settings");
  }, []);

  const handleAddTask = useCallback(() => {
    setAddTaskVisible(true);
  }, []);

  const handleAddTaskClose = useCallback(() => {
    setAddTaskVisible(false);
  }, []);

  const handleCreateTask = useCallback(
    (
      title: string,
      subtitle: string,
      scheduleDate: string,
      periodIso: string,
    ) => {
      if (remoteTasks) {
        void remoteTasks.createTask(title, subtitle, scheduleDate, periodIso);
        return;
      }
      const sub =
        subtitle.trim().length > 0 ? subtitle.trim() : "Sem horário definido";
      const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setLocalActivities((prev) => [
        ...prev,
        { id, title, subtitle: sub, done: false, scheduleDate },
      ]);
    },
    [remoteTasks],
  );

  const handleAgenda = useCallback(() => {
    setMainTab("agenda");
  }, []);

  const handleOpenHomeTab = useCallback(() => {
    setMainTab("home");
  }, []);

  const handleActivityPress = useCallback((id: string) => {
    setDetailTaskId(id);
  }, []);

  const handleTaskDetailClose = useCallback(() => {
    setDetailTaskId(null);
  }, []);

  const handleTaskSave = useCallback(
    (id: string, title: string, subtitle: string) => {
      if (remoteTasks) {
        const prev = activities.find((a) => a.id === id);
        if (prev) void remoteTasks.saveTask(prev, title, subtitle);
        return;
      }
      setLocalActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, title, subtitle } : a)),
      );
    },
    [activities, remoteTasks],
  );

  const handleTaskToggleDone = useCallback(
    (id: string) => {
      if (remoteTasks) {
        void remoteTasks.toggleDone(id);
        return;
      }
      setLocalActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)),
      );
    },
    [remoteTasks],
  );

  const handleTaskDelete = useCallback(
    (id: string) => {
      if (remoteTasks) {
        void remoteTasks.deleteTask(id);
      } else {
        setLocalActivities((prev) => prev.filter((a) => a.id !== id));
      }
      setDetailTaskId(null);
    },
    [remoteTasks],
  );

  return (
    <View
      {...(mainOverlay === "none"
        ? { testID: mainTab === "home" ? "home-screen" : "agenda-screen" }
        : {})}
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      {mainOverlay === "fontSize" ? (
        <FontSizeOnboardingScreen
          themePreference={preference}
          initialFontScaleMultiplier={scale}
          onComplete={handleFontSizeFromSettingsComplete}
          onBack={handleFontSizeFromSettingsBack}
        />
      ) : mainOverlay === "settings" ? (
        <>
          <SettingsScreen
            userDisplayName={displayName}
            onBack={handleSettingsBack}
            onFontSize={handleOpenFontSizeFromSettings}
            onUpdateThemePreference={onUpdateThemePreference}
            onLogout={onLogout}
            onEditProfile={() => setEditProfileVisible(true)}
          />
          <EditProfileScreen
            visible={editProfileVisible}
            initialName={displayName}
            initialEmail={userEmail}
            onClose={() => setEditProfileVisible(false)}
            onSave={async (name, email) => {
              await onUpdateProfile(name, email);
              setEditProfileVisible(false);
            }}
            onDeleteAccount={onDeleteAccount}
          />
        </>
      ) : (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        {mainTab === "home" ? (
          <>
          <DashboardHeader
            displayName={displayName}
            onSettings={handleSettings}
            testID="home-dashboard-header"
          />

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

          {activities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIconCircle,
                  { backgroundColor: isDefault ? "#E3F2FD" : "rgba(84, 166, 255, 0.1)" },
                ]}
              >
                <Ionicons
                  name="calendar-clear-outline"
                  size={Math.min(60, Math.max(40, Math.round(48 * scale)))}
                  color={titleAccent}
                />
              </View>
              <Text
                style={{
                  fontFamily: fontBold,
                  fontSize: Math.min(24, Math.max(18, Math.round(20 * scale))),
                  color: palette.text,
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                Tudo calmo por aqui
              </Text>
              <Text
                style={{
                  fontFamily: fontRegular,
                  fontSize: bodySize,
                  color: palette.textMuted,
                  textAlign: "center",
                  lineHeight: bodySize * 1.4,
                  paddingHorizontal: 20,
                }}
              >
                Que tal planejar as atividades do seu dia?
              </Text>
            </View>
          ) : (
            <>
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
            </>
          )}
        </ScrollView>
          </>
        ) : (
          <AgendaScreen
            userDisplayName={displayName}
            activities={activities}
            onActivityPress={handleActivityPress}
            onSettings={handleSettings}
          />
        )}

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
              <Pressable
                onPress={handleOpenHomeTab}
                style={styles.navItem}
                accessibilityRole="button"
                accessibilityLabel="Início"
              >
                <Ionicons
                  name="home"
                  size={24}
                  color={mainTab === "home" ? ringActive : palette.textMuted}
                />
                <Text
                  style={{
                    fontFamily: mainTab === "home" ? fontBold : fontRegular,
                    fontSize: bottomNavLabel,
                    color: mainTab === "home" ? ringActive : palette.textMuted,
                    marginTop: 4,
                  }}
                >
                  Início
                </Text>
              </Pressable>
              <Pressable
                onPress={handleAgenda}
                style={styles.navItem}
                accessibilityRole="button"
                accessibilityLabel="Agenda"
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={mainTab === "agenda" ? ringActive : palette.textMuted}
                />
                <Text
                  style={{
                    fontFamily: mainTab === "agenda" ? fontBold : fontRegular,
                    fontSize: bottomNavLabel,
                    color: mainTab === "agenda" ? ringActive : palette.textMuted,
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
      )}
      {mainOverlay === "none" ? (
        <StatusBar style={preference === "high_contrast" ? "light" : "dark"} />
      ) : null}
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
        onOpenSettings={handleOpenSettingsFromAddTask}
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
    paddingBottom: 24,
    gap: 10,
  },
  emptyContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
    marginTop: 10,
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
