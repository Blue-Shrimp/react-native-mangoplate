module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        global: ['./'],
        extensions: ['.js', '.json'],
        alias: {
          '@root': './',
          '@common': './src/common',
          '@stores': './src/store',
          '@network': './src/network',
          '@screens': './src/screen',
          '@extensions': './src/extension',
          '@components': './src/components',
          '@images': './assets/images',
        },
      },
    ],
  ],
}
