import { StyleSheet, View } from "react-native";

import { AppRoot } from "./src/app/AppRoot";

export default function App() {
  return (
    <View style={styles.root}>
      <AppRoot />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
