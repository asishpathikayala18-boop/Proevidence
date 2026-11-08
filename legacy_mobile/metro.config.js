const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for Providence
 * https://facebook.github.io/metro/docs/configuration
 */
const config = {
  resolver: {
    assetExts: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'ttf', 'otf', 'woff', 'woff2'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
