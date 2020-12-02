module.exports = {
  // pages: {
  //   app: {
  //     entry: 'src/renderer.js',
  //     template: 'src/renderer/public/index.html',
  //   },
  // },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/renderer/preload.js',
      customFileProtocol: 'lst://./',
      mainProcessFile: 'src/main.js',
      rendererProcessFile: 'src/renderer.js',
    },
  },
};
