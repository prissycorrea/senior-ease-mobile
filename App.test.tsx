import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, fireEvent, type RenderAPI, within, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import App from "./App";

// Resolve Alert.alert issues in tests
jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
  if (buttons) {
    const deleteBtn = buttons.find((b) => b.text === "Excluir" || b.style === "destructive");
    if (deleteBtn && typeof deleteBtn.onPress === "function") {
      deleteBtn.onPress();
    }
  }
});


beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

/** Avança do Onboarding até a Welcome Screen */
async function passOnboarding(screen: RenderAPI): Promise<void> {
  await screen.findByTestId("onboarding-title-conforto", { includeHiddenElements: true });
  fireEvent.press(await screen.findByText("Próximo"));
  await screen.findByText("está bom?", { includeHiddenElements: true });
  fireEvent.press(await screen.findByText("Próximo"));
  await screen.findByTestId("welcome-screen");
}

/** Welcome → login (2 etapas) → app principal. */
async function completeLoginFromWelcome(screen: RenderAPI): Promise<void> {
  const welcome = await screen.findByTestId("welcome-screen");
  fireEvent.press(within(welcome).getByTestId("welcome-secondary-button"));
  
  await screen.findByTestId("login-step-1-screen");
  fireEvent.changeText(await screen.findByTestId("login-email-input"), "teste@seniorease.app");
  fireEvent.press(await screen.findByTestId("login-email-next"));
  
  await screen.findByTestId("login-step-2-screen");
  fireEvent.changeText(await screen.findByTestId("login-password-input"), "Senha123");
  fireEvent.press(await screen.findByTestId("login-password-submit"));
  
  await screen.findByTestId("home-screen");
}

describe("App", () => {
  describe("Tela de conforto visual", () => {
    it("exibe título na primeira abertura", async () => {
      const screen = render(<App />);
      expect(
        await screen.findByTestId("onboarding-title-conforto", {
          includeHiddenElements: true,
        }),
      ).toBeTruthy();
    });
  });

  describe("Fluxo completo de onboarding e cadastro", () => {
    it("percorre conforto visual → fonte → boas-vindas → cadastro (3 etapas) → tela de sucesso → app principal", async () => {
      const screen = render(<App />);
      await passOnboarding(screen);

      fireEvent.press(await screen.findByTestId("welcome-primary-button"));

      expect(await screen.findByTestId("sign-up-step-1-screen")).toBeTruthy();
      fireEvent.changeText(await screen.findByTestId("sign-up-name-input"), "Maria Silva");
      fireEvent.press(await screen.findByTestId("sign-up-name-next"));

      expect(await screen.findByTestId("sign-up-step-2-screen")).toBeTruthy();
      fireEvent.changeText(await screen.findByTestId("sign-up-email-input"), "maria@example.com");
      fireEvent.press(await screen.findByTestId("sign-up-email-next"));

      expect(await screen.findByTestId("sign-up-step-3-screen")).toBeTruthy();
      fireEvent.changeText(await screen.findByTestId("sign-up-password-input"), "senha123");
      fireEvent.changeText(await screen.findByTestId("sign-up-password-confirm-input"), "senha123");
      fireEvent.press(await screen.findByTestId("sign-up-password-next"));

      // Tela de sucesso após cadastro
      await screen.findByTestId("registration-success-screen");
      fireEvent.press(await screen.findByTestId("success-skip"));

      await screen.findByTestId("home-screen");
      
      // Usa waitFor para garantir que o estado de configurações foi atualizado
      await waitFor(async () => {
        const nameEl = await screen.findByTestId("home-user-name");
        expect(nameEl).toHaveTextContent("Maria Silva");
      }, { timeout: 5000 });
    });

    it("adicionar tarefa inclui novo item na lista", async () => {
      const screen = render(<App />);
      await passOnboarding(screen);
      await completeLoginFromWelcome(screen);
      
      fireEvent.press(await screen.findByLabelText("Adicionar atividade"));
      
      await screen.findByTestId("add-task-screen");
      fireEvent.changeText(await screen.findByTestId("add-task-title-input"), "Nova tarefa teste");
      fireEvent.press(await screen.findByTestId("add-task-step1-next"));
      
      fireEvent.press(await screen.findByTestId("add-task-day-tomorrow"));
      fireEvent.press(await screen.findByTestId("add-task-pick-time-row"));
      
      // SeniorTimePicker
      fireEvent.press(await screen.findByLabelText("Aumentar hora"));
      fireEvent.press(await screen.findByLabelText("Confirmar horário"));
      
      fireEvent.press(await screen.findByTestId("add-task-submit"));
      
      await screen.findByTestId("add-task-success-screen");
      fireEvent.press(await screen.findByTestId("add-task-success-home"));
      
      await screen.findByText("Nova tarefa teste");
    });
  });

  describe("Dashboard e Agenda", () => {
    it("exibe estado vazio quando todas as tarefas são removidas", async () => {
      const screen = render(<App />);
      await passOnboarding(screen);
      await completeLoginFromWelcome(screen);
      
      // Delete existing seed tasks (4 by default)
      for (let i = 1; i <= 4; i++) {
        const activity = await screen.findByTestId(`home-activity-${i}`);
        fireEvent.press(activity);
        await screen.findByTestId("task-detail-screen");
        fireEvent.press(await screen.findByTestId("task-detail-delete"));
      }
      
      await screen.findByText("Tudo calmo por aqui");
    });

    it("navega entre as abas", async () => {
      const screen = render(<App />);
      await passOnboarding(screen);
      await completeLoginFromWelcome(screen);
      
      fireEvent.press(await screen.findByLabelText("Agenda"));
      await screen.findByTestId("agenda-screen");
      
      fireEvent.press(await screen.findByLabelText("Início"));
      await screen.findByTestId("home-screen");
    });
  });

  describe("Navegação com voltar", () => {
    it("na fonte, voltar retorna ao conforto visual", async () => {
      const screen = render(<App />);
      await screen.findByTestId("onboarding-title-conforto", { includeHiddenElements: true });
      fireEvent.press(await screen.findByText("Próximo"));
      
      await screen.findByText("está bom?", { includeHiddenElements: true });
      fireEvent.press(await screen.findByLabelText("Voltar"));

      await screen.findByTestId("onboarding-title-conforto", { includeHiddenElements: true });
    });

    it("nos fluxos de cadastro/login, voltar retorna às telas anteriores", async () => {
      const screen = render(<App />);
      await passOnboarding(screen);

      // Login voltar
      fireEvent.press(await screen.findByTestId("welcome-secondary-button"));
      await screen.findByTestId("login-step-1-screen");
      fireEvent.press(await screen.findByTestId("login-email-back"));
      await screen.findByTestId("welcome-screen");

      // Cadastro voltar
      fireEvent.press(await screen.findByTestId("welcome-primary-button"));
      await screen.findByTestId("sign-up-step-1-screen");
      fireEvent.press(await screen.findByTestId("sign-up-name-back"));
      await screen.findByTestId("welcome-screen");
    });
  });
});
