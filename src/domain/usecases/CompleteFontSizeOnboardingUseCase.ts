import { clampFontScale } from "../entities/fontScale";
import type { SettingsRepository } from "../repositories/SettingsRepository";

export class CompleteFontSizeOnboardingUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(fontScaleMultiplier: number): Promise<void> {
    return this.settingsRepository.save({
      fontScaleMultiplier: clampFontScale(fontScaleMultiplier),
      fontSizeOnboardingCompleted: true,
    });
  }
}
