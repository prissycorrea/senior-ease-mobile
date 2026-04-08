import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { screenHeaderPaddingTop } from "../layout/screenHeaderPaddingTop";
import type { HomeActivity } from "../types/homeActivity";
import { DashboardHeader } from "../components/DashboardHeader";
import {
  buildDayStrip,
  formatAgendaLongDate,
  localISODate,
  parseISODateToLocal,
} from "../utils/agendaDates";
import { brandNavy, highContrastActionBlue } from "../theme/themePalette";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";
import { useAppTheme } from "../theme/ThemeContext";

const LEXEND_BOLD = "Lexend_700Bold";
const LEXEND_REGULAR = "Lexend_400Regular";

const PROFILE_PILL_DEFAULT = "#DCE8F2";
const COMPLETED_GREEN = "#2E7D32";
const COMPLETED_GREEN_HC = "#69F0AE";
const DATE_PILL_IDLE = "#DCE8F2";

/** Metade da largura mínima da pílula (estimativa) para padding lateral e centralização nas bordas. */
const DAY_PILL_HALF_ESTIMATE = 42;

export type AgendaScreenProps = {
  userDisplayName: string;
  activities: HomeActivity[];
  onActivityPress: (id: string) => void;
  onSettings: () => void;
};

export function AgendaScreen({
  userDisplayName,
  activities,
  onActivityPress,
  onSettings,
}: AgendaScreenProps): ReactElement {
  const insets = useSafeAreaInsets();
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  const fontBold = fontsLoaded ? LEXEND_BOLD : undefined;
  const fontRegular = fontsLoaded ? LEXEND_REGULAR : undefined;

  const [selectedDayKey, setSelectedDayKey] = useState(() =>
    localISODate(new Date()),
  );

  const dayStripScrollRef = useRef<ScrollView | null>(null);
  const pillLayoutsRef = useRef<
    Partial<Record<string, { x: number; width: number }>>
  >({});
  const dayStripContentWidthRef = useRef(0);
  const selectedDayKeyRef = useRef(selectedDayKey);
  selectedDayKeyRef.current = selectedDayKey;

  const [dayStripViewportW, setDayStripViewportW] = useState(0);

  const isDefault = preference === "default";
  const displayName =
    userDisplayName.trim().length > 0 ? userDisplayName.trim() : "Usuário";
  const profilePillBg = isDefault ? PROFILE_PILL_DEFAULT : palette.surface;
  const agendaTitleColor = isDefault ? brandNavy : highContrastActionBlue;
  const cardBg = isDefault ? "#FFFFFF" : palette.surface;
  const cardBorder = isDefault ? "#C9D5DE" : palette.border;
  const completedColor = isDefault ? COMPLETED_GREEN : COMPLETED_GREEN_HC;
  const chevronColor = isDefault ? "#8FA3B3" : palette.textMuted;
  const primaryNav = isDefault ? brandNavy : palette.primary;

  const nameSize = Math.min(20, Math.max(14, Math.round(16 * scale)));
  const agendaTitleSize = Math.min(42, Math.max(30, Math.round(36 * scale)));
  const dateLineSize = Math.min(18, Math.max(14, Math.round(16 * scale)));
  const bodySize = Math.min(20, Math.max(14, Math.round(15 * scale)));
  const smallMeta = Math.min(17, Math.max(12, Math.round(13 * scale)));
  const dayPillWeekSize = Math.min(14, Math.max(11, Math.round(12 * scale)));
  const dayPillNumSize = Math.min(20, Math.max(15, Math.round(17 * scale)));
  const iconTop = Math.min(34, Math.max(22, Math.round(26 * scale)));

  const selectedDate = useMemo(() => {
    const d = parseISODateToLocal(selectedDayKey);
    return d ?? new Date();
  }, [selectedDayKey]);

  const longDateLabel = useMemo(
    () => formatAgendaLongDate(selectedDate),
    [selectedDate],
  );

  const dayStrip = useMemo(() => buildDayStrip(new Date(), 10, 10), []);

  const dayStripHorizontalPad =
    dayStripViewportW > 0
      ? Math.max(0, dayStripViewportW / 2 - DAY_PILL_HALF_ESTIMATE)
      : 0;

  const centerDayStripOnKey = useCallback(
    (key: string) => {
      const vw = dayStripViewportW;
      const cw = dayStripContentWidthRef.current;
      const pill = pillLayoutsRef.current[key];
      if (vw <= 0 || cw <= 0 || !pill) return;
      const pillCenter = pill.x + pill.width / 2;
      let sx = pillCenter - vw / 2;
      const maxScroll = Math.max(0, cw - vw);
      sx = Math.max(0, Math.min(sx, maxScroll));
      dayStripScrollRef.current?.scrollTo({ x: sx, animated: false });
    },
    [dayStripViewportW],
  );

  const scheduleCenterDayStrip = useCallback(() => {
    const key = selectedDayKeyRef.current;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerDayStripOnKey(key);
      });
    });
  }, [centerDayStripOnKey]);

  useLayoutEffect(() => {
    scheduleCenterDayStrip();
  }, [selectedDayKey, dayStripViewportW, scheduleCenterDayStrip]);

  const filtered = useMemo(
    () => activities.filter((a) => a.scheduleDate === selectedDayKey),
    [activities, selectedDayKey],
  );

  return (
    <View style={styles.flex}>
      <DashboardHeader
        displayName={displayName}
        onSettings={onSettings}
        testID="agenda-dashboard-header"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 28 + insets.bottom + 88 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontFamily: fontBold,
            fontSize: agendaTitleSize,
            lineHeight: agendaTitleSize * 1.05,
            letterSpacing: -0.5,
            color: agendaTitleColor,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Agenda
        </Text>
        <Text
          style={{
            fontFamily: fontRegular,
            fontSize: dateLineSize,
            lineHeight: dateLineSize * 1.35,
            color: palette.text,
            marginBottom: 16,
          }}
        >
          {longDateLabel}
        </Text>

        <View
          style={[
            styles.agendaSheet,
            {
              backgroundColor: cardBg,
              borderWidth: isDefault ? 0 : 1,
              borderColor: palette.border,
              ...(isDefault
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 10,
                    elevation: 3,
                  }
                : {}),
            },
          ]}
        >
          <ScrollView
            ref={dayStripScrollRef}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.dayStripContent,
              {
                paddingLeft: dayStripHorizontalPad,
                paddingRight: dayStripHorizontalPad,
              },
            ]}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              setDayStripViewportW((prev) => (prev === w ? prev : w));
            }}
            onContentSizeChange={(w) => {
              dayStripContentWidthRef.current = w;
              scheduleCenterDayStrip();
            }}
          >
            {dayStrip.map((d) => {
              const selected = d.key === selectedDayKey;
              return (
                <Pressable
                  key={d.key}
                  testID={`agenda-day-${d.key}`}
                  onLayout={(e) => {
                    const { x, width } = e.nativeEvent.layout;
                    pillLayoutsRef.current[d.key] = { x, width };
                    if (d.key === selectedDayKeyRef.current) {
                      scheduleCenterDayStrip();
                    }
                  }}
                  onPress={() => setSelectedDayKey(d.key)}
                  style={[
                    styles.dayPill,
                    {
                      backgroundColor: selected
                        ? primaryNav
                        : isDefault
                          ? DATE_PILL_IDLE
                          : palette.surface,
                      borderWidth: selected ? 0 : isDefault ? 1 : 1,
                      borderColor: selected
                        ? "transparent"
                        : isDefault
                          ? "#E3ECF3"
                          : palette.border,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={d.label}
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={{
                      fontFamily: fontBold,
                      fontSize: dayPillWeekSize,
                      lineHeight: dayPillWeekSize * 1.2,
                      color: selected
                        ? isDefault
                          ? "#FFFFFF"
                          : palette.onPrimary
                        : palette.text,
                      opacity: selected ? 1 : 0.85,
                    }}
                  >
                    {d.weekShort}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontBold,
                      fontSize: dayPillNumSize,
                      lineHeight: dayPillNumSize * 1.1,
                      marginTop: 2,
                      color: selected
                        ? isDefault
                          ? "#FFFFFF"
                          : palette.onPrimary
                        : palette.text,
                    }}
                  >
                    {d.dayOfMonth}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.listGap}>
            {filtered.length === 0 ? (
              <Text
                style={{
                  fontFamily: fontRegular,
                  fontSize: bodySize,
                  color: palette.textMuted,
                  marginTop: 8,
                  paddingBottom: 8,
                }}
              >
                Nenhuma atividade neste dia.
              </Text>
            ) : (
              filtered.map((item) => (
                <Pressable
                  key={item.id}
                  testID={`agenda-activity-${item.id}`}
                  onPress={() => onActivityPress(item.id)}
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
                          {
                            borderColor: isDefault
                              ? "#7EB8E8"
                              : palette.border,
                          },
                        ]}
                      />
                    )}
                    <View style={styles.activityTexts}>
                      <Text
                        style={{
                          fontFamily: fontBold,
                          fontSize: bodySize,
                          color: item.done ? completedColor : palette.text,
                          textDecorationLine: item.done
                            ? "line-through"
                            : "none",
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
                        {item.subtitle.replace(/—/g, "-")}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color={chevronColor}
                    />
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerRowAgenda: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  agendaSheet: {
    marginHorizontal: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  dayStripContent: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 20,
  },
  dayPill: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 20,
    minWidth: 58,
    minHeight: 78,
    alignItems: "center",
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
});
