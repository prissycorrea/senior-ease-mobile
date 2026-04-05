import type { SettingsRepository } from "../repositories/SettingsRepository";

/** Volta da tela principal para a welcome (criar conta / já tenho conta), sem desfazer tema nem fonte. */
export class RevertToWelcomeScreenUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(): Promise<void> {
    return this.settingsRepository.save({
      welcomeScreenCompleted: false,
      registrationStep: 0,
      registrationDraftFullName: "",
      registrationDraftEmail: "",
    });
  }
}
