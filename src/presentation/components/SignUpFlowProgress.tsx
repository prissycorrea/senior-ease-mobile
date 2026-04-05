import { StyleSheet, View, type ViewStyle } from "react-native";

type Props = {
  currentStep: 1 | 2 | 3;
  activeColor: string;
  inactiveColor: string;
  style?: ViewStyle;
};

/** Etapa 1: barra ativa à esquerda + dois pontos; 2: ponto + barra + ponto; 3: dois pontos + barra. */
export function SignUpFlowProgress({
  currentStep,
  activeColor,
  inactiveColor,
  style,
}: Props) {
  if (currentStep === 1) {
    return (
      <View style={[styles.row, style]}>
        <View
          style={[styles.longBar, { backgroundColor: activeColor }]}
        />
        <View
          style={[styles.dot, { backgroundColor: inactiveColor }]}
        />
        <View
          style={[styles.dot, { backgroundColor: inactiveColor }]}
        />
      </View>
    );
  }

  if (currentStep === 2) {
    return (
      <View style={[styles.row, style]}>
        <View
          style={[styles.dot, { backgroundColor: inactiveColor }]}
        />
        <View
          style={[styles.longBar, { backgroundColor: activeColor }]}
        />
        <View
          style={[styles.dot, { backgroundColor: inactiveColor }]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.row, style]}>
      <View
        style={[styles.dot, { backgroundColor: inactiveColor }]}
      />
      <View
        style={[styles.dot, { backgroundColor: inactiveColor }]}
      />
      <View
        style={[styles.longBar, { backgroundColor: activeColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  /** Largura fixa: só indica a etapa atual, sem ocupar quase toda a linha. */
  longBar: {
    width: 52,
    height: 6,
    borderRadius: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
