import type { AppSettings } from "../entities/AppSettings";
import type { ThemePreference } from "../entities/ThemePreference";

export type SettingsPatch = Partial<
  Pick<
    AppSettings,
    | "themePreference"
    | "welcomeScreenCompleted"
    | "visualOnboardingCompleted"
    | "fontSizeOnboardingCompleted"
    | "fontScaleMultiplier"
    | "registrationStep"
    | "registrationDraftFullName"
    | "registrationDraftEmail"
    | "loginStep"
    | "loginDraftEmail"
    | "userDisplayName"
    | "lastRegisteredDisplayName"
  >
>;

export interface SettingsRepository {
  load(): Promise<AppSettings>;
  save(patch: SettingsPatch): Promise<void>;
}

export type { ThemePreference };
