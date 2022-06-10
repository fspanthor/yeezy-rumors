const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  //webpack serve is only used in development
  const ESLintPlugin = env.WEBPACK_SERVE && require("eslint-webpack-plugin");
  return {
    mode: "none",
    entry: "./src/index.js",
    output: {
      path: __dirname + "/public",
      filename: "bundle.js",
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 9000,
      open: true,
    },
    ...(env.WEBPACK_SERVE === true && { devtool: "eval-cheap-source-map" }),
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
    plugins: [
      //if webpack serve is true set fake NODE_ENV accordingly
      new webpack.DefinePlugin({
        "process.env.NODE_ENV":
          env.WEBPACK_SERVE === true
            ? JSON.stringify("development")
            : JSON.stringify("production"),
      }),
      //if webpack serve is true, uses ESLint
      ...(env.WEBPACK_SERVE === true && [new ESLintPlugin()]),
    ],
  };
};
