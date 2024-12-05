const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add support for path aliases
config.resolver.alias = {
  "@": "./src", // Alias `@` points to `src`
};

module.exports = withNativeWind(config, { input: "./global.css" });
