import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, fireEvent } from "@testing-library/react-native";
import App from "./App";

beforeEach(async () => {
  await AsyncStorage.clear();
});

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
    it("percorre conforto visual → fonte → boas-vindas → app principal", async () => {
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
      fireEvent.press(await screen.findByTestId("welcome-secondary-button"));

      expect(await screen.findByText("Senior Ease")).toBeTruthy();
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

    it("no app principal, voltar retorna à tela de tamanho da letra", async () => {
      const screen = render(<App />);
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByText("Próximo"));
      fireEvent.press(await screen.findByTestId("welcome-primary-button"));
      expect(await screen.findByText("Senior Ease")).toBeTruthy();

      fireEvent.press(await screen.findByLabelText("Voltar"));

      expect(
        await screen.findByText("está bom?", { includeHiddenElements: true }),
      ).toBeTruthy();
    });
  });
});
