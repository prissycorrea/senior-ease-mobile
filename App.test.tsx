import { render } from "@testing-library/react-native";
import App from "./App";

describe("App", () => {
  it("renderiza sem erro", () => {
    render(<App />);
  });
});