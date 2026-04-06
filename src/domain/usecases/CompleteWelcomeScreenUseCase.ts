import type { SettingsRepository } from "../repositories/SettingsRepository";

/** Marca a tela inicial de boas-vindas como vista; segue para o onboarding. */
export class CompleteWelcomeScreenUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(): Promise<void> {
    return this.settingsRepository.save({ welcomeScreenCompleted: true });
  }
}
