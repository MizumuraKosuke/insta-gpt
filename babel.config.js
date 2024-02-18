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
  ]
  if (babelEnv === 'production') {
    plugins.push([
      'transform-remove-console', { exclude: [ 'error', 'warn' ]},
    ])
  }
  return {
    presets: [ 'babel-preset-expo' ],
    plugins,
  }
}
