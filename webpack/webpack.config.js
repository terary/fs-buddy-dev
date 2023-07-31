const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
   mode: "production",
   // devtool: "source-map",
   devtool: "inline-source-map",
   entry: {
      formstackApi: path.resolve(__dirname, "..", "src", "chrome-extension", "formstackApi.ts"),
      content: path.resolve(__dirname, "..", "src", "chrome-extension", "content.ts"),
   },
   output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [{from: ".", to: ".", context: path.resolve(__dirname, "..", "src", "chrome-extension", "public")}]
         // patterns: [{from: ".", to: ".", context: "public"}]
      }),
   ],
};