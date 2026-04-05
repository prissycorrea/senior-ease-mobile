import { FONT_SCALE_DEFAULT } from "./fontScale";
import type { ThemePreference } from "./ThemePreference";

/** 0 = fora do cadastro; 1–3 = etapas do fluxo “criar conta”. */
export type RegistrationStep = 0 | 1 | 2 | 3;

export interface AppSettings {
  themePreference: ThemePreference;
  /** Tela inicial (boas-vindas) já vista */
  welcomeScreenCompleted: boolean;
  /** Passo 1 (conforto visual) concluído */
  visualOnboardingCompleted: boolean;
  /** Passo 2 (tamanho da letra) concluído */
  fontSizeOnboardingCompleted: boolean;
  fontScaleMultiplier: number;
  registrationStep: RegistrationStep;
  /** Nome na etapa 1 (persistido ao avançar). */
  registrationDraftFullName: string;
  /** E-mail na etapa 2 (persistido ao avançar). */
  registrationDraftEmail: string;
}

export const defaultAppSettings: AppSettings = {
  themePreference: "default",
  welcomeScreenCompleted: false,
  visualOnboardingCompleted: false,
  fontSizeOnboardingCompleted: false,
  fontScaleMultiplier: FONT_SCALE_DEFAULT,
  registrationStep: 0,
  registrationDraftFullName: "",
  registrationDraftEmail: "",
};
