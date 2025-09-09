// // craco.config.js
// module.exports = {
//   webpack: {
//     configure: (webpackConfig) => {
//       // face-api.js source map warning-г алгасах
//       webpackConfig.module.rules.push({
//         test: /\.js$/,
//         enforce: "pre",
//         use: ["source-map-loader"],
//         exclude: /node_modules\/face-api\.js/,
//       });

//       // Бүх source map warning-г алгасах, мөн fs warning-г алгасах
//       webpackConfig.ignoreWarnings = [
//         (warning) =>
//           warning.message.includes("Failed to parse source map") &&
//           (/face-api\.js/.test(warning.module?.resource || "") ||
//             /@tensorflow-models/.test(warning.module?.resource || "")),

//         (warning) =>
//           warning.message.includes("Can't resolve 'fs'") &&
//           /face-api\.js/.test(warning.module?.resource || ""),
//       ];

//       return webpackConfig;
//     },
//   },
// };
