# Senior Ease Mobile

Aplicativo mobile pensado para **apoiar pessoas idosas** no dia a dia: visual confortável, letras ajustáveis, rotinas e agenda em linguagem simples. Projeto desenvolvido no contexto do **Hackaton (FIAP)** — Fase 5 da pós graduação em Front End Engineering.

### Neste documento

1. [O que é o app](#o-que-é-o-app)  
2. [Jornada no app — etapa por etapa](#jornada-no-app--etapa-por-etapa)  
3. [Funcionalidades e público idoso](#funcionalidades-e-facilidades-público-idoso)  
4. [Arquitetura](#arquitetura)  
5. [Testes](#testes)  
6. [Tecnologias](#tecnologias-utilizadas)  
7. [Pipelines (CI/CD)](#pipelines-e-etapas-github-actions)  
8. [Como rodar](#como-rodar-o-app)  

---

## O que é o app

O **Senior Ease** é um protótipo de app **React Native (Expo)** que simula uma experiência completa: da primeira abertura até o uso cotidiano com **lista de atividades**, **agenda por dia**, **criação de tarefas** e **ajustes de acessibilidade**.

---

## Jornada no app — etapa por etapa

| Etapa | O que acontece |
|--------|----------------|
| **1. Conforto visual** | Escolha entre tema padrão (cores suaves) ou **alto contraste**, com explicação clara do propósito. |
| **2. Tamanho da letra** | Ajuste do **multiplicador de fonte** com pré-visualização; valor é salvo e aplicado em todo o app. |
| **3. Boas-vindas** | Tela de entrada com **Criar conta** ou **Já tenho conta**. |
| **4. Cadastro (3 passos)** | Nome → e-mail → senha e confirmação; ao concluir, entra no app com o nome cadastrado. |
| **5. Login (2 passos)** | E-mail e senha — no protótipo há **credenciais de demonstração** (veja `src/domain/constants/demoLoginCredentials.ts`). |
| **6. App principal — Início** | Lista **“Próximas atividades”**, **progresso diário**, detalhe da tarefa, **adicionar tarefa** (fluxo guiado com data/horário). |
| **7. App principal — Agenda** | Faixa de **dias rolável** com o dia atual centralizado; lista filtrada por data; mesma linha visual da home. |
| **8. Ajustes** | Perfil resumido, **tamanho da letra** (reabre o fluxo de ajuste), **interruptor de alto contraste**, placeholders para voz/privacidade e **Sair da conta** (volta à boas-vindas). |

> O **voltar** na barra superior da home retorna à boas-vindas **sem** apagar tema nem tamanho da fonte já escolhidos no onboarding.

---

## Funcionalidades e facilidades (público idoso)

- **Tipografia Lexend** e tamanhos que **escalam** com o multiplicador global, reduzindo esforço de leitura.
- **Alto contraste** persistente, com paleta dedicada (cores, bordas e componentes adaptados).
- **Botões e áreas de toque** amplas, textos diretos e hierarquia visual clara (títulos em destaque, cartões com bordas suaves).
- **Rotina visível**: progresso do dia e lista de atividades com estado concluído/pendente explícito.
- **Agenda por dia**: seleção de data em “pílulas”, data por extenso em português e lista do dia.
- **Criação de tarefa passo a passo** (título → dia/horário), com confirmação de sucesso amigável.
- **Ajustes centralizados** para alterar contraste e letra sem refazer o onboarding inteiro.

---

## Arquitetura

Organização em camadas, alinhada a **separação de responsabilidades** e testabilidade:

```
src/
├── app/                 # Raiz da aplicação (composição de fluxos)
├── domain/              # Entidades, repositórios (interfaces), casos de uso
├── data/                # Implementações
└── presentation/        # Telas, tema, layout, tipos de UI
```

- **Domain**: regras e contratos (`AppSettings`, `ThemePreference`, use cases como persistência, bootstrap, conclusão de onboarding, logout).
- **Data**: `AsyncStorageSettingsRepository` — leitura/gravação de configurações em JSON.
- **Presentation**: telas React Native, **ThemeContext** e **FontScaleContext** para tema e escala global.
- **App (`AppRoot`)**: orquestra o estado carregado do storage e decide qual tela exibir (onboarding → welcome → main).

---

## Testes

- **Framework**: [Jest](https://jestjs.io/) com [`jest-expo`](https://github.com/expo/expo/tree/main/packages/jest-expo).
- **Componentes / fluxo**: [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/).
- **Arquivo principal**: `App.test.tsx` — testes de **integração** renderizando `<App />`, cobrindo onboarding, cadastro, login demo, home, agenda, detalhe de tarefa, adicionar tarefa e navegação com voltar.
- **Armazenamento**: `beforeEach` com `AsyncStorage.clear()` para isolamento entre testes.

### Comandos

| Comando | Descrição |
|---------|-----------|
| `npm test` | Testes em modo não interativo (`--watchAll=false`). |
| `npm run test:ci` | CI: testes + **cobertura** (`--ci --coverage`). |

---

## Tecnologias utilizadas

| Área | Tecnologia |
|------|------------|
| Runtime / UI | React 19, React Native 0.81 |
| Plataforma | [Expo](https://expo.dev/) ~54 (SDK), **Nova Arquitetura** habilitada (`newArchEnabled`) |
| Linguagem | TypeScript |
| Fontes | `@expo-google-fonts/lexend` |
| Ícones | `@expo/vector-icons` (Ionicons) |
| Gráficos | `react-native-svg` |
| Persistência | `@react-native-async-storage/async-storage` |
| Área segura / layout | `react-native-safe-area-context` |
| Qualidade | ESLint (`eslint-config-expo`) |

---

## Pipelines e etapas (GitHub Actions)

### CI — Integração contínua (`.github/workflows/ci.yaml`)

**Gatilho:** *pull request* para qualquer branch.

1. Checkout do código  
2. Node.js **20** (cache npm)  
3. `npm ci`  
4. `npm run lint`  
5. `npm run test:ci`  
6. Validação **`expo prebuild` Android** (`--no-install`, não interativo) — garante que o projeto nativo Android continua gerável  

### CD — Entrega contínua (`.github/workflows/cd.yaml`)

**Gatilho:** *push* nas branches **`main`** e **`development`**.

**Fase 1 — Quality checks (sempre antes do build)**  
Mesmo núcleo do CI: `npm ci` → lint → testes com cobertura.

**Fase 2 — Build (condicional ao branch)**  

| Branch | Job | Resultado |
|--------|-----|-----------|
| `development` | `build-development` | APK **debug** Gradle → artefato `android-debug-development` (`app-debug.apk`) |
| `main` | `build-production` | **AAB release** Gradle → artefato `android-release-main` (bundle para Play Store) |

Ambos usam JDK **17**, Android SDK configurado no workflow e `npx expo prebuild --platform android` antes do Gradle.

> Os ambientes **Development** e **Production** no GitHub podem exigir secrets (assinatura release, etc.) conforme a configuração do repositório.

---

## Como rodar o app

### Pré-requisitos

- **Node.js 20** (recomendado; alinhado ao CI)  
- **npm**  
- Para dispositivo físico: app **Expo Go** ou build nativo  
- Para Android local: Android Studio / SDK (se usar `expo run:android`)

### Instalação

```bash
git clone <url-do-repositório>
cd senior-ease-mobile
npm ci
```

### Desenvolvimento

```bash
npm start
```

Abre o **Expo Dev Tools**. Escaneie o QR code com o Expo Go (Android/iOS) ou pressione `a` / `i` para emulador.

### Outros scripts

| Script | Uso |
|--------|-----|
| `npm run android` | Compila e roda no Android (`expo run:android`) |
| `npm run ios` | Roda no simulador iOS (macOS) |
| `npm run web` | Versão web (`expo start --web`) |
| `npm run lint` | ESLint |

### Login de demonstração

No fluxo **Já tenho conta**, use as credenciais definidas em `src/domain/constants/demoLoginCredentials.ts` (e-mail e senha de demo). Após um cadastro bem-sucedido, o login demo pode exibir o **último nome cadastrado** na home.

---
