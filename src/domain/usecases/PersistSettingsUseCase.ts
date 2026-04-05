import type {
  SettingsPatch,
  SettingsRepository,
} from "../repositories/SettingsRepository";

export class PersistSettingsUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(patch: SettingsPatch): Promise<void> {
    return this.settingsRepository.save(patch);
  }
}
