import type { SettingsRepository } from "../repositories/SettingsRepository";

/** Volta ao passo de tamanho da letra (mantém tema e passo 1). */
export class RevertToFontSizeOnboardingUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(): Promise<void> {
    return this.settingsRepository.save({ fontSizeOnboardingCompleted: false });
  }
}
