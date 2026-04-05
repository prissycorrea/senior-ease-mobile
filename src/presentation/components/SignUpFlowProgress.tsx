import { StyleSheet, View, type ViewStyle } from "react-native";

type Props = {
  currentStep: 1 | 2 | 3;
  activeColor: string;
  inactiveColor: string;
  style?: ViewStyle;
  /** 2 = login (e-mail → senha); 3 = cadastro (padrão). */
  totalSteps?: 2 | 3;
};

/** Cadastro (3): etapa 1 barra + 2 pontos; 2: ponto + barra + ponto; 3: 2 pontos + barra. Login (2): etapa 1 barra + ponto; 2: ponto + barra. */
export function SignUpFlowProgress({
  currentStep,
  activeColor,
  inactiveColor,
  style,
  totalSteps = 3,
}: Props) {
  if (totalSteps === 2) {
    if (currentStep === 1) {
      return (
        <View style={[styles.row, style]}>
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
          style={[styles.longBar, { backgroundColor: activeColor }]}
        />
      </View>
    );
  }

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
