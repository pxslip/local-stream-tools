module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      customFileProtocol: 'lst://./',
    },
  },
};
