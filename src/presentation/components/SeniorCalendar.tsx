import { Ionicons } from "@expo/vector-icons";
import { type ReactElement, useState, useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/ThemeContext";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";

type SeniorCalendarProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate?: Date;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function SeniorCalendar({
  visible,
  onClose,
  onSelect,
  initialDate
}: SeniorCalendarProps): ReactElement {
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const insets = useSafeAreaInsets();
  
  const [currentViewDate, setCurrentViewDate] = useState(initialDate || new Date());
  const selectedDate = initialDate || new Date();

  const isDefault = preference === "default";
  
  const monthDays = useMemo(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }
    return days;
  }, [currentViewDate]);

  const changeMonth = (delta: number) => {
    setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: palette.surface, paddingBottom: 20 + insets.bottom }]}>
          <View style={styles.header}>
            <Pressable onPress={() => changeMonth(-1)} style={styles.navBtn} accessibilityLabel="Mês anterior">
              <Ionicons name="chevron-back" size={32} color={palette.text} />
            </Pressable>
            <Text style={[styles.monthTitle, { color: palette.text, fontSize: 22 * scale }]}>
              {MONTHS_PT[currentViewDate.getMonth()]} {currentViewDate.getFullYear()}
            </Text>
            <Pressable onPress={() => changeMonth(1)} style={styles.navBtn} accessibilityLabel="Próximo mês">
              <Ionicons name="chevron-forward" size={32} color={palette.text} />
            </Pressable>
          </View>

          <View style={styles.weekHeader}>
            {WEEKDAYS.map((w, i) => (
              <Text key={i} style={[styles.weekDay, { color: palette.textMuted }]}>{w}</Text>
            ))}
          </View>

          <View style={styles.grid}>
            {monthDays.map((day, i) => (
              <View key={i} style={styles.dayCol}>
                {day ? (
                  <Pressable
                    onPress={() => onSelect(day)}
                    style={[
                      styles.dayBtn,
                      isSelected(day) && { backgroundColor: palette.primary },
                      isToday(day) && !isSelected(day) && { borderWidth: 2, borderColor: palette.primary }
                    ]}
                    accessibilityLabel={`${day.getDate()} de ${MONTHS_PT[day.getMonth()]}`}
                  >
                    <Text style={[
                      styles.dayText,
                      { fontSize: 18 * scale },
                      isSelected(day) ? { color: palette.onPrimary, fontWeight: 'bold' } : { color: palette.text }
                    ]}>
                      {day.getDate()}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>

          <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDefault ? '#F0F4F8' : palette.background }]}>
             <Text style={[styles.closeBtnText, { color: palette.text, fontSize: 18 * scale }]}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navBtn: {
    padding: 10,
  },
  monthTitle: {
    fontFamily: 'Lexend_700Bold',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dayCol: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
  },
  dayBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  dayText: {
    fontFamily: 'Lexend_400Regular',
  },
  closeBtn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    fontFamily: 'Lexend_700Bold',
  }
});
