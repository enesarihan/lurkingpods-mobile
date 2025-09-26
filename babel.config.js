module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated v3 no longer requires worklets plugin; ensure only this plugin is present
      'react-native-reanimated/plugin',
    ],
  };
};


