process.env.EXPO_PUBLIC_USE_FIREBASE = "false";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((_auth, cb) => {
    cb(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(() => jest.fn()),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("react-native-safe-area-context", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("react-native-safe-area-context/jest/mock").default,
);

jest.mock("expo-system-ui", () => ({
  setBackgroundColorAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Passthrough = ({ children, ...rest }) =>
    React.createElement(View, rest, children);
  return {
    __esModule: true,
    default: Passthrough,
    Svg: Passthrough,
    G: Passthrough,
    Circle: Passthrough,
  };
});

jest.mock("expo-blur", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    BlurView: ({ children, ...rest }) =>
      React.createElement(View, rest, children),
  };
});

jest.mock("@expo-google-fonts/lexend", () => ({
  useFonts: () => [true],
  Lexend_400Regular: 1,
  Lexend_700Bold: 1,
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Ionicons: ({ name, ...rest }) =>
      React.createElement(View, { ...rest, testID: `ionicon-${String(name)}` }),
  };
});
