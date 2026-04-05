import { FONT_SCALE_DEFAULT } from "./fontScale";
import type { ThemePreference } from "./ThemePreference";

export interface AppSettings {
  themePreference: ThemePreference;
  /** Passo 1 (conforto visual) concluído */
  visualOnboardingCompleted: boolean;
  /** Passo 2 (tamanho da letra) concluído */
  fontSizeOnboardingCompleted: boolean;
  fontScaleMultiplier: number;
}

export const defaultAppSettings: AppSettings = {
  themePreference: "default",
  visualOnboardingCompleted: false,
  fontSizeOnboardingCompleted: false,
  fontScaleMultiplier: FONT_SCALE_DEFAULT,
};
