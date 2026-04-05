// Metro prioriza o campo "react-native" de react-native-svg, que aponta para src/
// e pode falhar na resolução. Forçamos o entry compilado em lib/commonjs.
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const upstream = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-svg") {
    return {
      filePath: require.resolve("react-native-svg/lib/commonjs/index.js"),
      type: "sourceFile",
    };
  }
  if (upstream) {
    return upstream(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
