const { configure } = require("@testing-library/react-native");

// CI costuma ser mais lenta; o bootstrap (AsyncStorage + estado) pode estourar o
// timeout padrão (~1000 ms) do findBy*, gerando falso negativo mesmo com a UI correta.
configure({ asyncUtilTimeout: 10_000 });

jest.setTimeout(15_000);
