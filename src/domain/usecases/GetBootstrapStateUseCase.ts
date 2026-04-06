import type { AppSettings } from "../entities/AppSettings";
import type { SettingsRepository } from "../repositories/SettingsRepository";

export class GetBootstrapStateUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(): Promise<AppSettings> {
    return this.settingsRepository.load();
  }
}
