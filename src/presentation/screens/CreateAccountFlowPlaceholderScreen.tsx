import type { ReactElement } from "react";

import { CreateAccountPasswordScreen } from "./CreateAccountPasswordScreen";

type Props = {
  step: 2 | 3;
  onBack: () => Promise<void>;
  onNext: () => Promise<void>;
};

/**
 * Compatibilidade: import antigo do AppRoot. A etapa 3 real é CreateAccountPasswordScreen.
 * `onNext` corresponde ao `onComplete` da tela de senha.
 */
export function CreateAccountFlowPlaceholderScreen({
  step,
  onBack,
  onNext,
}: Props): ReactElement {
  void step;
  return (
    <CreateAccountPasswordScreen onBack={onBack} onComplete={onNext} />
  );
}
