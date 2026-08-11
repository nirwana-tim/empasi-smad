const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('mpeg')) {
  config.resolver.assetExts.push('mpeg');
}

module.exports = config;
