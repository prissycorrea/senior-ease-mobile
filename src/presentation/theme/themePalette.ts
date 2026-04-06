import type { ThemePreference } from "../../domain/entities/ThemePreference";

export interface ThemePalette {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  border: string;
  onPrimary: string;
}

/** Azul-marinho: botões, cartão escuro, barra de progresso ativa */
export const brandNavy = "#003366";
/** Azul de destaque: tema claro, selos nos cartões */
export const accentBlue = "#0056B3";
/** Botão primário e progresso ativo no alto contraste (Figma) */
export const highContrastActionBlue = "#54A6FF";

const primaryBlue = brandNavy;

export function createThemePalette(preference: ThemePreference): ThemePalette {
  if (preference === "high_contrast") {
    return {
      background: "#030810",
      surface: "#001B3D",
      text: "#FFFFFF",
      textMuted: "#E8EEF2",
      primary: highContrastActionBlue,
      border: "#FFFFFF",
      onPrimary: "#000000",
    };
  }

  return {
    background: "#F1F4F7",
    surface: "#FFFFFF",
    text: "#1A1A1A",
    textMuted: "#5C6B7A",
    primary: brandNavy,
    border: "#003366",
    onPrimary: "#FFFFFF",
  };
}

export { primaryBlue };
