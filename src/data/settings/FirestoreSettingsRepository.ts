import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import {
  type AppSettings,
  defaultAppSettings,
} from "../../domain/entities/AppSettings";
import { clampFontScale } from "../../domain/entities/fontScale";
import type {
  SettingsPatch,
  SettingsRepository,
} from "../../domain/repositories/SettingsRepository";
import { getFirebaseFirestore } from "../firebase/firebaseApp";

const COLLECTION_CONFIGS = "user_configs";
const COLLECTION_PROFILE = "profile";
const BASE_FONT_SIZE = 16;

/**
 * Mapeia o estado interno do Mobile para o esquema esperado pela Web no Firestore.
 */
function mapToConfigs(patch: SettingsPatch) {
  const result: Record<string, unknown> = {};

  if (patch.fontScaleMultiplier !== undefined) {
    result.fontSize = String(Math.round(BASE_FONT_SIZE * patch.fontScaleMultiplier));
  }

  if (patch.themePreference !== undefined) {
    result.theme = patch.themePreference === "high_contrast" ? "dark-theme" : "light-theme";
  }

  result.updatedAt = serverTimestamp();
  return result;
}

/**
 * Mapeia o documento do Firestore (configs) para o estado interno do Mobile.
 */
function mapFromConfigs(data: Record<string, unknown>): SettingsPatch {
  const patch: SettingsPatch = {};

  if (typeof data.fontSize === "string") {
    const px = parseInt(data.fontSize, 10);
    if (!Number.isNaN(px)) {
      patch.fontScaleMultiplier = clampFontScale(px / BASE_FONT_SIZE);
    }
  }

  if (data.theme === "dark-theme") {
    patch.themePreference = "high_contrast";
  } else if (data.theme === "light-theme") {
    patch.themePreference = "default";
  }

  return patch;
}

export class FirestoreSettingsRepository implements SettingsRepository {
  constructor(private readonly userId: string) {}

  async load(): Promise<AppSettings> {
    const db = getFirebaseFirestore();
    const configRef = doc(db, COLLECTION_CONFIGS, this.userId);
    const profileRef = doc(db, COLLECTION_PROFILE, this.userId);

    const [configSnap, profileSnap] = await Promise.all([
      getDoc(configRef),
      getDoc(profileRef),
    ]);

    let patch: SettingsPatch = {};

    if (configSnap.exists()) {
      patch = { ...patch, ...mapFromConfigs(configSnap.data()) };
    }

    if (profileSnap.exists()) {
      const profileData = profileSnap.data();
      if (typeof profileData.displayName === "string") {
        patch.userDisplayName = profileData.displayName;
      }
    }

    return {
      ...defaultAppSettings,
      ...patch,
    };
  }

  async save(patch: SettingsPatch): Promise<void> {
    const db = getFirebaseFirestore();
    const batch: Promise<void>[] = [];

    // 1. Configurações de Acessibilidade
    const configData = mapToConfigs(patch);
    if (Object.keys(configData).length > 1) { // Mais do que apenas o updatedAt
      const configRef = doc(db, COLLECTION_CONFIGS, this.userId);
      console.log(`[FirestoreSync] Salvando em ${COLLECTION_CONFIGS}:`, configData);
      batch.push(setDoc(configRef, configData, { merge: true }));
    }

    // 2. Perfil (Nome)
    if (patch.userDisplayName !== undefined) {
      const profileRef = doc(db, COLLECTION_PROFILE, this.userId);
      const profileData = { displayName: patch.userDisplayName };
      console.log(`[FirestoreSync] Salvando em ${COLLECTION_PROFILE}:`, profileData);
      batch.push(setDoc(profileRef, profileData, { merge: true }));
    }

    await Promise.all(batch);
  }

  subscribe(userId: string, onUpdate: (patch: SettingsPatch) => void): () => void {
    const db = getFirebaseFirestore();
    const configRef = doc(db, COLLECTION_CONFIGS, userId);
    const profileRef = doc(db, COLLECTION_PROFILE, userId);

    const unsubConfigs = onSnapshot(configRef, (snap) => {
      if (snap.exists()) {
        const patch = mapFromConfigs(snap.data());
        console.log(`[FirestoreSync] Mudança em ${COLLECTION_CONFIGS}:`, patch);
        onUpdate(patch);
      }
    });

    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (typeof data.displayName === "string") {
          console.log(`[FirestoreSync] Mudança em ${COLLECTION_PROFILE}:`, data.displayName);
          onUpdate({ userDisplayName: data.displayName });
        }
      }
    });

    return () => {
      unsubConfigs();
      unsubProfile();
    };
  }
}
