import { Platform, StatusBar } from "react-native";

/** Respiro abaixo da barra de status / entalhe. */
const GAP_BELOW_SAFE_INSET = 14;

/**
 * Padding superior para cabeçalho (voltar, progresso): respeita área segura e,
 * no Android com edge-to-edge, usa a altura da status bar se `insets.top` vier 0.
 */
export function screenHeaderPaddingTop(insetsTop: number): number {
  const statusBarFallback =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;
  return Math.max(insetsTop, statusBarFallback) + GAP_BELOW_SAFE_INSET;
}

/**
 * Cabeçalho de telas de fluxo (login/cadastro, onboarding).
 *
 * Com `android.edgeToEdgeEnabled` (Expo), `insets.top` costuma vir 0 e o `SafeAreaView`
 * não empurra o conteúdo — a barra de progresso fica sob a câmera/recorte.
 * Por isso, no Android aplicamos um piso mínimo além da altura da status bar.
 */
const ANDROID_FLOW_HEADER_MIN_TOP = 52;

export function flowHeaderPaddingTop(insetsTop: number): number {
  const statusBarFallback =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;
  let effective = Math.max(insetsTop, statusBarFallback);
  if (Platform.OS === "android") {
    effective = Math.max(effective, ANDROID_FLOW_HEADER_MIN_TOP);
  }
  return effective + GAP_BELOW_SAFE_INSET;
}
