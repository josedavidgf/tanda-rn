const { getDefaultConfig } = require('@expo/metro-config');

const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  util: require.resolve('util'),
  buffer: require.resolve('buffer/'),
  process: require.resolve('process/browser'),
  events: require.resolve('events/'), // 👈 AÑADIDO
};

module.exports = config;