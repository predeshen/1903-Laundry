const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// metro.config.js
module.exports = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs','mjs','wasm','html'],
    assetExts: ['glb', 'gltf', 'png', 'jpg' , 'jpeg', 'svg', 'ttf', 'otf', 'woff', 'woff2','mjs','wasm','html'],
  },
}
module.exports = config;
