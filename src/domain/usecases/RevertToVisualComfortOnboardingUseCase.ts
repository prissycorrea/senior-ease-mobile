import type { SettingsRepository } from "../repositories/SettingsRepository";

/** Volta ao passo 1 mantendo o tema já escolhido. */
export class RevertToVisualComfortOnboardingUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(): Promise<void> {
    return this.settingsRepository.save({ visualOnboardingCompleted: false });
  }
}
