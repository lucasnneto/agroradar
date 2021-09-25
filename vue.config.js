module.exports = {
  configureWebpack: {
    mode: process.env.NODE_ENV,
  },
  transpileDependencies: ["vuetify"],
};
