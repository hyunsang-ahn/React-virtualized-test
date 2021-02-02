const path = require('path');
const webpack = require('webpack');
const extractCommons = new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: 'common.js',
});

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[name].bundle.css');
module.exports = {
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    // ignored: ['files/**/*.js', 'node_modules/**']
    aggregateTimeout: 300,
    poll: 1000,
  },
  entry: {
    //dev: 'react-error-overlay',
    vendor: ['react', 'react-dom', 'react-router-dom'],
    app: ['./app/assets/scripts/index.jsx'],
    // Account: ['./app/assets/scripts/components/Account/Account.jsx'],
    // Cashcowuse: ['./app/assets/scripts/components/Cashcowuse/Cashcowuse.jsx'],
    // Donation: ['./app/assets/scripts/components/Donation/Donation.jsx'],
    // Event: ['./app/assets/scripts/components/Event/Event.jsx'],
    // Favorite: ['./app/assets/scripts/components/Favorite/Favorite.jsx'],
    // MyCowPage: ['./app/assets/scripts/components/MyCowPage/MyCowPage.jsx'],
    // MyCowPageNotLogin: ['./app/assets/scripts/components/MyCowPageNotLogin/MyCowPageNotLogin.jsx'],
    // Notice: ['./app/assets/scripts/components/Notice/Notice.jsx'],
    // Notification: ['./app/assets/scripts/components/Notification/Notification.jsx'],
    // Question: ['./app/assets/scripts/components/Question/Question.jsx'],
    // Terms: ['./app/assets/scripts/components/Terms/Terms.jsx'],
    // Version: ['./app/assets/scripts/components/Version/Version.jsx'],
  },
  //app에 vendor에 들어있는 공통된 모듈들을 제거해주기위해 CommonsChunkPlugin 플러그인을 이용했습니다.
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({
  //     names: ['vendor', 'Cashcowuse', 'Donation', 'Event', 'Favorite', 'MyCowPage', 'MyCowPageNotLogin', 'Notice', 'Notification', 'Question', 'Terms', 'Version'],
  //     minChunks: 1
  //   }),

  // ],
  //   plugins: [
  //     new webpack.optimize.CommonsChunkPlugin({
  //       name: 'vendor',
  //       filename: 'vendor.bundle.js',
  //     }),
  //   ],
  output: {
    path: path.resolve('./app/assets/build/'),
    filename: '[name].bundle.js',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  module: {
    // apply loaders to files that meet given conditions
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, '/client/src'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1', '"stage-3"'],
          plugins: ["transform-class-properties", "syntax-dynamic-import"],
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },
  resolve: {
    root: [
      path.resolve('./app/assets/scripts/components/'),
      path.resolve('./app/assets/scripts/utils/'),
      path.resolve('./app/assets/styles/'),
    ],
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-react-inline-elements', 'transform-react-constant-elements',"transform-class-properties"],
          env: {
            production: {
              presets: ['react-optimize'],
            },
          },
        },
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
    ],
    noParse: [/html2canvas/],
  },
};
