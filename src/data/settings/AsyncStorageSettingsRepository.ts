import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  defaultAppSettings,
  type AppSettings,
  type RegistrationStep,
} from "../../domain/entities/AppSettings";
import { clampFontScale } from "../../domain/entities/fontScale";
import type { ThemePreference } from "../../domain/entities/ThemePreference";
import type {
  SettingsPatch,
  SettingsRepository,
} from "../../domain/repositories/SettingsRepository";
import { SETTINGS_STORAGE_KEY } from "./storageKeys";

type StoredSettings = {
  themePreference?: ThemePreference;
  welcomeScreenCompleted?: boolean;
  visualOnboardingCompleted?: boolean;
  fontSizeOnboardingCompleted?: boolean;
  fontScaleMultiplier?: number;
  registrationStep?: number;
  registrationDraftFullName?: string;
  registrationDraftEmail?: string;
};

function clampRegistrationStep(n: number | undefined): RegistrationStep {
  if (n === 1 || n === 2 || n === 3) return n;
  return 0;
}

function parseStored(json: string | null): AppSettings {
  if (!json) {
    return { ...defaultAppSettings };
  }
  try {
    const parsed = JSON.parse(json) as StoredSettings;
    const visualDone = Boolean(parsed.visualOnboardingCompleted);
    let fontStepDone = Boolean(parsed.fontSizeOnboardingCompleted);
    if (visualDone && parsed.fontSizeOnboardingCompleted === undefined) {
      fontStepDone = true;
    }
    const welcomeDone =
      parsed.welcomeScreenCompleted !== undefined
        ? Boolean(parsed.welcomeScreenCompleted)
        : visualDone && fontStepDone;
    const rawScale =
      typeof parsed.fontScaleMultiplier === "number"
        ? parsed.fontScaleMultiplier
        : defaultAppSettings.fontScaleMultiplier;
    const draftName =
      typeof parsed.registrationDraftFullName === "string"
        ? parsed.registrationDraftFullName
        : "";
    const draftEmail =
      typeof parsed.registrationDraftEmail === "string"
        ? parsed.registrationDraftEmail
        : "";
    return {
      themePreference:
        parsed.themePreference === "high_contrast"
          ? "high_contrast"
          : "default",
      welcomeScreenCompleted: welcomeDone,
      visualOnboardingCompleted: visualDone,
      fontSizeOnboardingCompleted: fontStepDone,
      fontScaleMultiplier: clampFontScale(rawScale),
      registrationStep: clampRegistrationStep(parsed.registrationStep),
      registrationDraftFullName: draftName,
      registrationDraftEmail: draftEmail,
    };
  } catch {
    return { ...defaultAppSettings };
  }
}

export class AsyncStorageSettingsRepository implements SettingsRepository {
  async load(): Promise<AppSettings> {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return parseStored(raw);
  }

  async save(patch: SettingsPatch): Promise<void> {
    const current = await this.load();
    const next: AppSettings = { ...current, ...patch };
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  }
}
