import type { ThemePreference } from "../entities/ThemePreference";
import type { SettingsRepository } from "../repositories/SettingsRepository";

export class SubmitVisualComfortOnboardingUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(theme: ThemePreference): Promise<void> {
    return this.settingsRepository.save({
      themePreference: theme,
      visualOnboardingCompleted: true,
    });
  }
}
