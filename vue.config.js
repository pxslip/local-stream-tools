module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/renderer/preload.js',
      customFileProtocol: 'lst://./',
      mainProcessFile: 'src/main.js',
      rendererProcessFile: 'src/renderer.js',
      externals: ['keytar'],
      mainProcessWatch: ['src/main/**/*.js', 'src/lib/**/*.js'],
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@r': './src/renderer',
        '@m': './src/main',
        '@m.ipc': './src/main/ipc',
        '@components': './src/renderer/components',
      },
    },
  },
};
