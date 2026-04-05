import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AsyncStorageSettingsRepository } from "../data/settings/AsyncStorageSettingsRepository";
import type { AppSettings } from "../domain/entities/AppSettings";
import { clampFontScale } from "../domain/entities/fontScale";
import type { ThemePreference } from "../domain/entities/ThemePreference";
import { CompleteFontSizeOnboardingUseCase } from "../domain/usecases/CompleteFontSizeOnboardingUseCase";
import { CompleteWelcomeScreenUseCase } from "../domain/usecases/CompleteWelcomeScreenUseCase";
import { GetBootstrapStateUseCase } from "../domain/usecases/GetBootstrapStateUseCase";
import { RevertToFontSizeOnboardingUseCase } from "../domain/usecases/RevertToFontSizeOnboardingUseCase";
import { RevertToVisualComfortOnboardingUseCase } from "../domain/usecases/RevertToVisualComfortOnboardingUseCase";
import { SubmitVisualComfortOnboardingUseCase } from "../domain/usecases/SubmitVisualComfortOnboardingUseCase";
import { FontSizeOnboardingScreen } from "../presentation/screens/FontSizeOnboardingScreen";
import { MainAppScreen } from "../presentation/screens/MainAppScreen";
import { VisualComfortOnboardingScreen } from "../presentation/screens/VisualComfortOnboardingScreen";
import { WelcomeScreen } from "../presentation/screens/WelcomeScreen";
import { FontScaleProvider } from "../presentation/theme/FontScaleContext";
import { ThemeProvider } from "../presentation/theme/ThemeContext";
import { brandNavy } from "../presentation/theme/themePalette";

export function AppRoot(): ReactElement {
  const {
    getBootstrap,
    completeWelcomeStep,
    submitVisualStep,
    completeFontStep,
    revertToVisualStep,
    revertToFontStep,
  } = useMemo(() => {
    const settingsRepository = new AsyncStorageSettingsRepository();
    return {
      getBootstrap: new GetBootstrapStateUseCase(settingsRepository),
      completeWelcomeStep: new CompleteWelcomeScreenUseCase(
        settingsRepository,
      ),
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

  const handleWelcomeComplete = async () => {
    await completeWelcomeStep.execute();
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            welcomeScreenCompleted: true,
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

  /** Volta ao passo de tamanho da letra (tela inicial pós-onboarding e app principal). */
  const handleBackToFontSizeStep = async () => {
    await revertToFontStep.execute();
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            fontSizeOnboardingCompleted: false,
          }
        : prev,
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
      return (
        <WelcomeScreen
          onContinue={handleWelcomeComplete}
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
    return <MainAppScreen onBack={handleBackToFontSizeStep} />;
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
