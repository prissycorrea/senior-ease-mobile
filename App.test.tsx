import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, fireEvent, type RenderAPI } from "@testing-library/react-native";
import App from "./App";

beforeEach(async () => {
  await AsyncStorage.clear();
});

/** Welcome → login (2 etapas) → app principal (protótipo sem API real). */
async function completeLoginFromWelcome(screen: RenderAPI): Promise<void> {
  fireEvent.press(await screen.findByTestId("welcome-secondary-button"));
  expect(await screen.findByTestId("login-step-1-screen")).toBeTruthy();
  fireEvent.changeText(
    await screen.findByTestId("login-email-input"),
    "teste@seniorease.app",
  );
  fireEvent.press(await screen.findByTestId("login-email-next"));
  expect(await screen.findByTestId("login-step-2-screen")).toBeTruthy();
  fireEvent.changeText(
    await screen.findByTestId("login-password-input"),
    "Senha123",
  );
  fireEvent.press(await screen.findByTestId("login-password-submit"));
  expect(await screen.findByText("Senior Ease")).toBeTruthy();
}

describe("App", () => {
  describe("Tela de conforto visual", () => {
    it("exibe título e texto de apoio na primeira abertura", async () => {
      const screen = render(<App />);
      expect(
        await screen.findByTestId("onboarding-title-conforto", {
          includeHiddenElements: true,
        }),
      ).toBeTruthy();
      expect(
        await screen.findByText("visual", { includeHiddenElements: true }),
      ).toBeTruthy();
      expect(
        await screen.findByText(
          "Selecione a opção que é melhor para os seus olhos.",
          { includeHiddenElements: true },
        ),
      ).toBeTruthy();
    });
  });

  describe("Fluxo completo de onboarding", () => {
    it("percorre conforto visual → fonte → boas-vindas → cadastro (3 etapas) → app principal", async () => {
      const screen = render(<App />);
      await screen.findByTestId("onboarding-title-conforto", {
        includeHiddenElements: true,
      });

      fireEvent.press(await screen.findByText("Próximo"));

      expect(
        await screen.findByText("está bom?", { includeHiddenElements: true }),
      ).toBeTruthy();

      fireEvent.press(await screen.findByText("Próximo"));

      expect(await screen.findByTestId("welcome-screen")).toBeTruthy();

      fireEvent.press(await screen.findByTestId("welcome-primary-button"));

      expect(await screen.findByTestId("sign-up-step-1-screen")).toBeTruthy();
      fireEvent.changeText(
        await screen.findByTestId("sign-up-name-input"),
        "Maria Silva",
      );
      fireEvent.press(await screen.findByTestId("sign-up-name-next"));

      expect(await screen.findByTestId("sign-up-step-2-screen")).toBeTruthy();
      fireEvent.changeText(
        await screen.findByTestId("sign-up-email-input"),
        "maria@example.com",
      );
      fireEvent.press(await screen.findByTestId("sign-up-email-next"));

      expect(await screen.findByTestId("sign-up-step-3-screen")).toBeTruthy();
      fireEvent.changeText(
        await screen.findByTestId("sign-up-password-input"),
        "senha12",
      );
      fireEvent.changeText(
        await screen.findByTestId("sign-up-password-confirm-input"),
        "senha12",
      );
      fireEvent.press(await screen.findByTestId("sign-up-password-next"));

      expect(await screen.findByText("Senior Ease")).toBeTruthy();
      expect(
        await screen.findByText(
          "O tema escolhido está ativo em todo o aplicativo.",
        ),
      ).toBeTruthy();
    });

    it("permite escolher alto contraste e concluir até a tela principal", async () => {
      const screen = render(<App />);
      await screen.findByTestId("onboarding-title-conforto", {
        includeHiddenElements: true,
      });

      fireEvent.press(
        await screen.findByText("Alto Contraste", {
          includeHiddenElements: true,
        }),
      );
      fireEvent.press(await screen.findByText("Próximo"));

      expect(
        await screen.findByText("está bom?", { includeHiddenElements: true }),
      ).toBeTruthy();

      fireEvent.press(await screen.findByText("Próximo"));
      expect(await screen.findByTestId("welcome-screen")).toBeTruthy();
      await completeLoginFromWelcome(screen);
    });
  });

  describe("Navegação com voltar", () => {
    it("na welcome, voltar retorna à tela de tamanho da letra", async () => {
      const screen = render(<App />);
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByText("Próximo"));
      expect(await screen.findByTestId("welcome-screen")).toBeTruthy();

      fireEvent.press(await screen.findByTestId("welcome-back-button"));

      expect(
        await screen.findByText("está bom?", { includeHiddenElements: true }),
      ).toBeTruthy();
    });

    it("na fonte, voltar retorna ao conforto visual", async () => {
      const screen = render(<App />);
      fireEvent.press(await screen.findByText("Próximo"));
      expect(
        await screen.findByText("está bom?", { includeHiddenElements: true }),
      ).toBeTruthy();

      fireEvent.press(await screen.findByLabelText("Voltar"));

      expect(
        await screen.findByTestId("onboarding-title-conforto", {
          includeHiddenElements: true,
        }),
      ).toBeTruthy();
    });

    it("no app principal, voltar retorna à welcome (criar conta / já tenho conta)", async () => {
      const screen = render(<App />);
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByText("Próximo"));
      await completeLoginFromWelcome(screen);

      fireEvent.press(await screen.findByLabelText("Voltar"));

      expect(await screen.findByTestId("welcome-screen")).toBeTruthy();
    });

    it("login etapa 1: voltar retorna à boas-vindas", async () => {
      const screen = render(<App />);
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByTestId("welcome-secondary-button"));
      await screen.findByTestId("login-step-1-screen");

      fireEvent.press(await screen.findByTestId("login-email-back"));

      expect(await screen.findByTestId("welcome-screen")).toBeTruthy();
    });

    it("cadastro etapa 1: voltar retorna à boas-vindas", async () => {
      const screen = render(<App />);
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByTestId("welcome-primary-button"));
      await screen.findByTestId("sign-up-step-1-screen");

      fireEvent.press(await screen.findByTestId("sign-up-name-back"));

      expect(await screen.findByTestId("welcome-screen")).toBeTruthy();
    });

    it("cadastro etapa 2: voltar retorna à etapa 1 (nome)", async () => {
      const screen = render(<App />);
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByTestId("welcome-primary-button"));
      fireEvent.changeText(
        await screen.findByTestId("sign-up-name-input"),
        "João",
      );
      fireEvent.press(await screen.findByTestId("sign-up-name-next"));
      await screen.findByTestId("sign-up-step-2-screen");

      fireEvent.press(await screen.findByTestId("sign-up-email-back"));

      expect(await screen.findByTestId("sign-up-step-1-screen")).toBeTruthy();
    });

    it("cadastro etapa 3: voltar retorna à etapa 2 (e-mail)", async () => {
      const screen = render(<App />);
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByTestId("welcome-primary-button"));
      fireEvent.changeText(
        await screen.findByTestId("sign-up-name-input"),
        "João",
      );
      fireEvent.press(await screen.findByTestId("sign-up-name-next"));
      fireEvent.changeText(
        await screen.findByTestId("sign-up-email-input"),
        "joao@example.com",
      );
      fireEvent.press(await screen.findByTestId("sign-up-email-next"));
      await screen.findByTestId("sign-up-step-3-screen");

      fireEvent.press(await screen.findByTestId("sign-up-password-back"));

      expect(await screen.findByTestId("sign-up-step-2-screen")).toBeTruthy();
    });
  });
});
