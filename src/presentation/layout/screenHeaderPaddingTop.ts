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
