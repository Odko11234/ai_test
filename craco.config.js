module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // source map loader-г face-api.js-г алгасах
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/face-api\.js/,
      });

      // Бүх source map warning-г алгасах
      webpackConfig.ignoreWarnings = [
        (warning) =>
          warning.message.includes("Failed to parse source map") &&
          /face-api\.js/.test(warning.module.resource),
      ];

      return webpackConfig;
    },
  },
};
