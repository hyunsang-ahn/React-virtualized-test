// Webpack uses this to work with directories
const path = require("path");
const webpack = require("webpack");
// This is main configuration object.
// Here you write different options and tell Webpack what to do
var ManifestPlugin = require("webpack-manifest-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  // Path to your entry point. From this file Webpack will begin his work
  // entry: path.resolve(__dirname, './app/assets/scripts/index.jsx'),
  entry: {
    vendor: ["react", "react-dom", "react-router-dom"],
    app: "./app/assets/scripts/index.jsx",
  },
  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve("./app/assets/build/"),
    filename: "[name].js",
    // chunkFilename: '[name].js',
    publicPath: "/",
    //filename: 'bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          enforce: true,
        },
      },
    },
  },

  // plugins: [
  //   new ManifestPlugin({
  //     fileName: 'assets.json',
  //     basePath: '/'
  //   }),
  // ],
  resolve: {
    //modules: ['./node_modules'],
    modules: [path.resolve(__dirname, "app"), "node_modules"],
    alias: {
      components: path.resolve(__dirname, "./app/assets/scripts/components"),
      utils: path.resolve(__dirname, "./app/assets/scripts/utils"),
      styles: path.resolve(__dirname, "./app/assets/styles"),
      node_modules: path.resolve(__dirname, "./node_modules"),
      jquery: "jquery/src/jquery",
    },
    extensions: [".js", ".jsx", ".json", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/transform-react-inline-elements",
              "@babel/transform-react-constant-elements",
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
      // {
      //   test: /\.s[ac]ss$/i,
      //   use: [
      //     // Creates `style` nodes from JS strings
      //     'style-loader',
      //     // Translates CSS into CommonJS
      //     'css-loader',
      //     // Compiles Sass to CSS
      //     'sass-loader',
      //   ],
      // },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: 'css-loader',
      //       options : {
      //         sourceMap : true
      //       }
      //     },
      //     {
      //       loader: 'stlye-loader',
      //       options : {
      //         sourceMap : true
      //       }
      //     },
      //   ],
      // },
      {
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {
            loader: "css-loader",
            options: {url: false}, // tell css-loader to not package images referenced in css. perhaps re-activate this for base64 injection
          },
        ], // use
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts",
            },
          },
        ],
      },
    ],
  },

  mode: "development",
};
