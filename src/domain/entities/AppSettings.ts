import { FONT_SCALE_DEFAULT } from "./fontScale";
import type { ThemePreference } from "./ThemePreference";

export interface AppSettings {
  themePreference: ThemePreference;
  /** Tela inicial (boas-vindas) já vista */
  welcomeScreenCompleted: boolean;
  /** Passo 1 (conforto visual) concluído */
  visualOnboardingCompleted: boolean;
  /** Passo 2 (tamanho da letra) concluído */
  fontSizeOnboardingCompleted: boolean;
  fontScaleMultiplier: number;
}

export const defaultAppSettings: AppSettings = {
  themePreference: "default",
  welcomeScreenCompleted: false,
  visualOnboardingCompleted: false,
  fontSizeOnboardingCompleted: false,
  fontScaleMultiplier: FONT_SCALE_DEFAULT,
};
