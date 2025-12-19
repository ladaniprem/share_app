const { getDefaultConfig } = require('expo/metro-config');

// Start from Expo's default Metro config
const config = getDefaultConfig(__dirname);

// If you need to support additional asset types (e.g., TLS certs)
config.resolver.assetExts = [...config.resolver.assetExts, 'pem', 'p12'];

// Note: SVG transformer removed. Add back only if you import .svg as components.
// Expo supports react-native-svg by default without a custom transformer.

module.exports = config;