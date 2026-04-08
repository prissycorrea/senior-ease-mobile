import { Ionicons } from "@expo/vector-icons";
import { type ReactElement, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/ThemeContext";
import { useFontScaleMultiplier } from "../theme/FontScaleContext";

type SeniorTimePickerProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (hours: number, minutes: number) => void;
  initialHours?: number;
  initialMinutes?: number;
};

export function SeniorTimePicker({
  visible,
  onClose,
  onConfirm,
  initialHours = 12,
  initialMinutes = 0
}: SeniorTimePickerProps): ReactElement {
  const { preference, palette } = useAppTheme();
  const scale = useFontScaleMultiplier();
  const insets = useSafeAreaInsets();
  
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);

  const isDefault = preference === "default";
  
  const adjustHours = (delta: number) => {
    setHours(prev => (prev + delta + 24) % 24);
  };

  const adjustMinutes = (delta: number) => {
    // Round to nearest 5 when jumping or just allow 1? 
    // Usually 5 is better for scheduling. 
    setMinutes(prev => (prev + delta + 60) % 60);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: palette.surface, paddingBottom: 20 + insets.bottom }]}>
          <Text style={[styles.title, { color: palette.text, fontSize: 22 * scale }]}>
            Escolha o Horário
          </Text>

          <View style={styles.pickerRow}>
            {/* Hours */}
            <View style={styles.column}>
              <Pressable onPress={() => adjustHours(1)} style={styles.arrowBtn} accessibilityLabel="Aumentar hora">
                <Ionicons name="chevron-up" size={48} color={palette.primary} />
              </Pressable>
              <View style={[styles.digitBox, { backgroundColor: isDefault ? '#F1F4F7' : palette.background }]}>
                <Text style={[styles.digit, { color: palette.text, fontSize: 44 * scale }]}>
                  {String(hours).padStart(2, '0')}
                </Text>
              </View>
              <Pressable onPress={() => adjustHours(-1)} style={styles.arrowBtn} accessibilityLabel="Diminuir hora">
                <Ionicons name="chevron-down" size={48} color={palette.primary} />
              </Pressable>
              <Text style={[styles.label, { color: palette.textMuted }]}>Horas</Text>
            </View>

            <Text style={[styles.separator, { color: palette.text, fontSize: 44 * scale }]}>:</Text>

            {/* Minutes */}
            <View style={styles.column}>
              <Pressable onPress={() => adjustMinutes(5)} style={styles.arrowBtn} accessibilityLabel="Aumentar minutos">
                <Ionicons name="chevron-up" size={48} color={palette.primary} />
              </Pressable>
              <View style={[styles.digitBox, { backgroundColor: isDefault ? '#F1F4F7' : palette.background }]}>
                <Text style={[styles.digit, { color: palette.text, fontSize: 44 * scale }]}>
                  {String(minutes).padStart(2, '0')}
                </Text>
              </View>
              <Pressable onPress={() => adjustMinutes(-5)} style={styles.arrowBtn} accessibilityLabel="Diminuir minutos">
                <Ionicons name="chevron-down" size={48} color={palette.primary} />
              </Pressable>
              <Text style={[styles.label, { color: palette.textMuted }]}>Minutos</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable 
              onPress={() => onConfirm(hours, minutes)} 
              style={[styles.confirmBtn, { backgroundColor: palette.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Confirmar horário"
            >
              <Text style={[styles.confirmBtnText, { color: palette.onPrimary, fontSize: 18 * scale }]}>
                Confirmar Horário
              </Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.cancelBtn} accessibilityRole="button" accessibilityLabel="Cancelar">
              <Text style={[styles.cancelBtnText, { color: palette.textMuted, fontSize: 18 * scale }]}>
                Cancelar
              </Text>
            </Pressable>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Lexend_700Bold',
    marginBottom: 30,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  column: {
    alignItems: 'center',
  },
  digitBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  digit: {
    fontFamily: 'Lexend_700Bold',
  },
  arrowBtn: {
    padding: 10,
  },
  separator: {
    marginHorizontal: 15,
    fontFamily: 'Lexend_700Bold',
    paddingBottom: 40, // Offset due to digit labels
  },
  label: {
    marginTop: 8,
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
  },
  footer: {
    width: '100%',
    gap: 12,
  },
  confirmBtn: {
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontFamily: 'Lexend_700Bold',
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Lexend_400Regular',
  }
});
