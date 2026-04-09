import { AppSettings } from "../../domain/entities/AppSettings";
import {
  SettingsPatch,
  SettingsRepository,
} from "../../domain/repositories/SettingsRepository";

export class DelegatingSettingsRepository implements SettingsRepository {
  constructor(private delegate: SettingsRepository) {}

  setDelegate(delegate: SettingsRepository) {
    this.delegate = delegate;
  }

  load(): Promise<AppSettings> {
    return this.delegate.load();
  }

  save(patch: SettingsPatch): Promise<void> {
    return this.delegate.save(patch);
  }

  subscribe(userId: string, onUpdate: (patch: SettingsPatch) => void): (() => void) | undefined {
    return this.delegate.subscribe?.(userId, onUpdate);
  }
}
