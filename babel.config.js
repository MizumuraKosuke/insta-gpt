module.exports = function(api) {
  const babelEnv = api.env()
  api.cache(true)
  const plugins = [
    [
      'module-resolver',
      {
        'root': [
          './',
        ],
        'alias': {
          '@': './src',
          '@assets': './assets',
        },
      }, 
    ],
    'react-native-reanimated/plugin',
    '@babel/plugin-proposal-export-namespace-from',
    require.resolve('expo-router/babel'),
  ]
  if (babelEnv === 'production') {
    plugins.push([
      'transform-remove-console', { exclude: [ 'error', 'warn' ]},
      'react-native-reanimated/plugin',
    ])
  }
  return {
    presets: [ 'babel-preset-expo' ],
    plugins,
  }
}
