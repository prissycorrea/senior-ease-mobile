import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";

const FontScaleContext = createContext<number>(1);

export function FontScaleProvider({
  multiplier,
  children,
}: PropsWithChildren<{ multiplier: number }>) {
  return (
    <FontScaleContext.Provider value={multiplier}>
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScaleMultiplier(): number {
  return useContext(FontScaleContext);
}
