import { render } from "@testing-library/react-native";
import App from "./App";

describe("App", () => {
  it("exibe onboarding de conforto visual na primeira abertura", async () => {
    const { findByText, findByTestId } = render(<App />);
    expect(
      await findByTestId("onboarding-title-conforto", {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
    expect(
      await findByText("visual", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      await findByText("Selecione a opção que é melhor para os seus olhos.", {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
  });
});