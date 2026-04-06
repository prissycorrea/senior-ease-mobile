import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AsyncStorageSettingsRepository } from "../data/settings/AsyncStorageSettingsRepository";
import {
  DEMO_LOGIN_EMAIL,
  DEMO_LOGIN_PASSWORD,
  DEMO_USER_DISPLAY_NAME,
  demoLoginHelpMessage,
  isDemoLoginValid,
} from "../domain/constants/demoLoginCredentials";
import type { AppSettings } from "../domain/entities/AppSettings";
import { clampFontScale } from "../domain/entities/fontScale";
import type { ThemePreference } from "../domain/entities/ThemePreference";
import { CompleteFontSizeOnboardingUseCase } from "../domain/usecases/CompleteFontSizeOnboardingUseCase";
import { GetBootstrapStateUseCase } from "../domain/usecases/GetBootstrapStateUseCase";
import { PersistSettingsUseCase } from "../domain/usecases/PersistSettingsUseCase";
import { RevertToFontSizeOnboardingUseCase } from "../domain/usecases/RevertToFontSizeOnboardingUseCase";
import { RevertToVisualComfortOnboardingUseCase } from "../domain/usecases/RevertToVisualComfortOnboardingUseCase";
import { RevertToWelcomeScreenUseCase } from "../domain/usecases/RevertToWelcomeScreenUseCase";
import { SubmitVisualComfortOnboardingUseCase } from "../domain/usecases/SubmitVisualComfortOnboardingUseCase";
import { CreateAccountEmailScreen } from "../presentation/screens/CreateAccountEmailScreen";
import { CreateAccountNameScreen } from "../presentation/screens/CreateAccountNameScreen";
import { CreateAccountPasswordScreen } from "../presentation/screens/CreateAccountPasswordScreen";
import { FontSizeOnboardingScreen } from "../presentation/screens/FontSizeOnboardingScreen";
import { LoginEmailScreen } from "../presentation/screens/LoginEmailScreen";
import { LoginPasswordScreen } from "../presentation/screens/LoginPasswordScreen";
import { MainAppScreen } from "../presentation/screens/MainAppScreen";
import { VisualComfortOnboardingScreen } from "../presentation/screens/VisualComfortOnboardingScreen";
import { WelcomeScreen } from "../presentation/screens/WelcomeScreen";
import { FontScaleProvider } from "../presentation/theme/FontScaleContext";
import { ThemeProvider } from "../presentation/theme/ThemeContext";
import { brandNavy } from "../presentation/theme/themePalette";

export function AppRoot(): ReactElement {
  const {
    getBootstrap,
    persistSettings,
    submitVisualStep,
    completeFontStep,
    revertToVisualStep,
    revertToFontStep,
    revertToWelcomeStep,
  } = useMemo(() => {
    const settingsRepository = new AsyncStorageSettingsRepository();
    return {
      getBootstrap: new GetBootstrapStateUseCase(settingsRepository),
      persistSettings: new PersistSettingsUseCase(settingsRepository),
      submitVisualStep: new SubmitVisualComfortOnboardingUseCase(
        settingsRepository,
      ),
      completeFontStep: new CompleteFontSizeOnboardingUseCase(
        settingsRepository,
      ),
      revertToVisualStep: new RevertToVisualComfortOnboardingUseCase(
        settingsRepository,
      ),
      revertToFontStep: new RevertToFontSizeOnboardingUseCase(
        settingsRepository,
      ),
      revertToWelcomeStep: new RevertToWelcomeScreenUseCase(settingsRepository),
    };
  }, []);

  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getBootstrap.execute().then((loaded) => {
      if (!cancelled) {
        setSettings(loaded);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [getBootstrap]);

  if (!settings) {
    return (
      <View style={styles.root}>
        <View style={styles.boot}>
          <ActivityIndicator size="large" color={brandNavy} />
          <StatusBar style="dark" />
        </View>
      </View>
    );
  }

  const handleCreateAccount = async () => {
    await persistSettings.execute({
      registrationStep: 1,
      loginStep: 0,
      loginDraftEmail: "",
      userDisplayName: "",
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            registrationStep: 1,
            loginStep: 0,
            loginDraftEmail: "",
            userDisplayName: "",
          }
        : prev,
    );
  };

  const handleAlreadyHaveAccount = async () => {
    await persistSettings.execute({
      loginStep: 1,
      loginDraftEmail: "",
      registrationStep: 0,
      registrationDraftFullName: "",
      registrationDraftEmail: "",
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            loginStep: 1,
            loginDraftEmail: "",
            registrationStep: 0,
            registrationDraftFullName: "",
            registrationDraftEmail: "",
          }
        : prev,
    );
  };

  const handleLoginEmailBack = async () => {
    await persistSettings.execute({ loginStep: 0, loginDraftEmail: "" });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            loginStep: 0,
            loginDraftEmail: "",
          }
        : prev,
    );
  };

  const handleLoginEmailNext = async (email: string) => {
    await persistSettings.execute({
      loginDraftEmail: email,
      loginStep: 2,
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            loginDraftEmail: email,
            loginStep: 2,
          }
        : prev,
    );
  };

  const handleLoginPasswordBack = async () => {
    await persistSettings.execute({ loginStep: 1 });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            loginStep: 1,
          }
        : prev,
    );
  };

  const handleLoginComplete = async (password: string): Promise<boolean> => {
    const email = settings.loginDraftEmail ?? "";
    if (!isDemoLoginValid(email, password)) {
      Alert.alert(
        "Não foi possível entrar",
        `E-mail ou senha incorretos.\n\n${demoLoginHelpMessage()}`,
      );
      return false;
    }
    const registered = settings.lastRegisteredDisplayName.trim();
    const displayName =
      registered.length >= 2 ? registered : DEMO_USER_DISPLAY_NAME;
    await persistSettings.execute({
      welcomeScreenCompleted: true,
      loginStep: 0,
      loginDraftEmail: "",
      registrationStep: 0,
      registrationDraftFullName: "",
      registrationDraftEmail: "",
      userDisplayName: displayName,
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            welcomeScreenCompleted: true,
            loginStep: 0,
            loginDraftEmail: "",
            registrationStep: 0,
            registrationDraftFullName: "",
            registrationDraftEmail: "",
            userDisplayName: displayName,
          }
        : prev,
    );
    return true;
  };

  const handleSignUpStep1Back = async () => {
    await persistSettings.execute({
      registrationStep: 0,
      registrationDraftFullName: "",
      registrationDraftEmail: "",
      loginStep: 0,
      loginDraftEmail: "",
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            registrationStep: 0,
            registrationDraftFullName: "",
            registrationDraftEmail: "",
            loginStep: 0,
            loginDraftEmail: "",
          }
        : prev,
    );
  };

  const handleSignUpStep1Next = async (fullName: string) => {
    await persistSettings.execute({
      registrationDraftFullName: fullName,
      registrationStep: 2,
      loginStep: 0,
      loginDraftEmail: "",
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            registrationDraftFullName: fullName,
            registrationStep: 2,
            loginStep: 0,
            loginDraftEmail: "",
          }
        : prev,
    );
  };

  const handleSignUpStep2Back = async () => {
    await persistSettings.execute({
      registrationStep: 1,
      registrationDraftEmail: "",
      loginStep: 0,
      loginDraftEmail: "",
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            registrationStep: 1,
            registrationDraftEmail: "",
            loginStep: 0,
            loginDraftEmail: "",
          }
        : prev,
    );
  };

  const handleSignUpStep2Next = async (draftEmail: string) => {
    await persistSettings.execute({
      registrationDraftEmail: draftEmail,
      registrationStep: 3,
      loginStep: 0,
      loginDraftEmail: "",
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            registrationDraftEmail: draftEmail,
            registrationStep: 3,
            loginStep: 0,
            loginDraftEmail: "",
          }
        : prev,
    );
  };

  const handleSignUpStep3Back = async () => {
    await persistSettings.execute({ registrationStep: 2 });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            registrationStep: 2,
          }
        : prev,
    );
  };

  const handleSignUpComplete = async () => {
    const name =
      settings.registrationDraftFullName.trim() || "Usuário";
    await persistSettings.execute({
      welcomeScreenCompleted: true,
      registrationStep: 0,
      registrationDraftFullName: "",
      registrationDraftEmail: "",
      loginStep: 0,
      loginDraftEmail: "",
      userDisplayName: name,
      lastRegisteredDisplayName: name,
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            welcomeScreenCompleted: true,
            registrationStep: 0,
            registrationDraftFullName: "",
            registrationDraftEmail: "",
            loginStep: 0,
            loginDraftEmail: "",
            userDisplayName: name,
            lastRegisteredDisplayName: name,
          }
        : prev,
    );
  };

  const handleVisualStepComplete = async (theme: ThemePreference) => {
    await submitVisualStep.execute(theme);
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            themePreference: theme,
            visualOnboardingCompleted: true,
          }
        : prev,
    );
  };

  const handleFontStepComplete = async (multiplier: number) => {
    const clamped = clampFontScale(multiplier);
    await completeFontStep.execute(clamped);
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            fontScaleMultiplier: clamped,
            fontSizeOnboardingCompleted: true,
          }
        : prev,
    );
  };

  const handleFontStepBack = async () => {
    await revertToVisualStep.execute();
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            visualOnboardingCompleted: false,
          }
        : prev,
    );
  };

  /** Volta da welcome para o passo de tamanho da letra. */
  const handleBackToFontSizeStep = async () => {
    await revertToFontStep.execute();
    await persistSettings.execute({
      registrationStep: 0,
      registrationDraftFullName: "",
      registrationDraftEmail: "",
      loginStep: 0,
      loginDraftEmail: "",
      userDisplayName: "",
    });
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            fontSizeOnboardingCompleted: false,
            registrationStep: 0,
            registrationDraftFullName: "",
            registrationDraftEmail: "",
            loginStep: 0,
            loginDraftEmail: "",
            userDisplayName: "",
          }
        : prev,
    );
  };

  /** Volta da tela principal para a welcome (mantém tema e fonte já escolhidos). */
  const handleBackFromMainAppToWelcome = async () => {
    await revertToWelcomeStep.execute();
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            welcomeScreenCompleted: false,
            registrationStep: 0,
            registrationDraftFullName: "",
            registrationDraftEmail: "",
            loginStep: 0,
            loginDraftEmail: "",
            userDisplayName: "",
          }
        : prev,
    );
  };

  const handleUpdateThemePreference = async (next: ThemePreference) => {
    await persistSettings.execute({ themePreference: next });
    setSettings((prev) =>
      prev ? { ...prev, themePreference: next } : prev,
    );
  };

  const handleUpdateFontScaleFromSettings = async (multiplier: number) => {
    const clamped = clampFontScale(multiplier);
    await persistSettings.execute({ fontScaleMultiplier: clamped });
    setSettings((prev) =>
      prev ? { ...prev, fontScaleMultiplier: clamped } : prev,
    );
  };

  const onboardingBody = (() => {
    if (!settings.visualOnboardingCompleted) {
      return (
        <VisualComfortOnboardingScreen
          initialPreference={settings.themePreference}
          onComplete={handleVisualStepComplete}
        />
      );
    }
    if (!settings.fontSizeOnboardingCompleted) {
      return (
        <FontSizeOnboardingScreen
          themePreference={settings.themePreference}
          initialFontScaleMultiplier={settings.fontScaleMultiplier}
          onComplete={handleFontStepComplete}
          onBack={handleFontStepBack}
        />
      );
    }
    if (!settings.welcomeScreenCompleted) {
      if (settings.registrationStep === 1) {
        return (
          <CreateAccountNameScreen
            initialFullName={settings.registrationDraftFullName}
            onBack={handleSignUpStep1Back}
            onNext={handleSignUpStep1Next}
          />
        );
      }
      if (settings.registrationStep === 2) {
        return (
          <CreateAccountEmailScreen
            initialEmail={settings.registrationDraftEmail}
            onBack={handleSignUpStep2Back}
            onNext={handleSignUpStep2Next}
          />
        );
      }
      if (settings.registrationStep === 3) {
        return (
          <CreateAccountPasswordScreen
            onBack={handleSignUpStep3Back}
            onComplete={handleSignUpComplete}
          />
        );
      }
      if (settings.loginStep === 1) {
        return (
          <LoginEmailScreen
            initialEmail={settings.loginDraftEmail}
            onBack={handleLoginEmailBack}
            onNext={handleLoginEmailNext}
          />
        );
      }
      if (settings.loginStep === 2) {
        return (
          <LoginPasswordScreen
            accountEmail={settings.loginDraftEmail}
            onBack={handleLoginPasswordBack}
            onComplete={handleLoginComplete}
          />
        );
      }
      return (
        <WelcomeScreen
          onCreateAccount={handleCreateAccount}
          onAlreadyHaveAccount={handleAlreadyHaveAccount}
          onBack={handleBackToFontSizeStep}
          onHelpPress={() => {
            Alert.alert(
              "Preciso de ajuda",
              "Em breve você poderá falar com o suporte por aqui.",
            );
          }}
        />
      );
    }
    return (
      <MainAppScreen
        userDisplayName={settings.userDisplayName}
        onBack={handleBackFromMainAppToWelcome}
        onLogout={handleBackFromMainAppToWelcome}
        onUpdateThemePreference={handleUpdateThemePreference}
        onUpdateFontScale={handleUpdateFontScaleFromSettings}
      />
    );
  })();

  return (
    <View style={styles.root}>
      <ThemeProvider preference={settings.themePreference}>
        <FontScaleProvider multiplier={settings.fontScaleMultiplier}>
          <SafeAreaProvider>
            <View style={styles.root}>{onboardingBody}</View>
          </SafeAreaProvider>
        </FontScaleProvider>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  boot: {
    flex: 1,
    backgroundColor: "#F1F4F7",
    alignItems: "center",
    justifyContent: "center",
  },
});
