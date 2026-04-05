import type { AppSettings } from "../entities/AppSettings";
import type { ThemePreference } from "../entities/ThemePreference";

export type SettingsPatch = Partial<
  Pick<
    AppSettings,
    | "themePreference"
    | "visualOnboardingCompleted"
    | "fontSizeOnboardingCompleted"
    | "fontScaleMultiplier"
  >
>;

export interface SettingsRepository {
  load(): Promise<AppSettings>;
  save(patch: SettingsPatch): Promise<void>;
}

export type { ThemePreference };
