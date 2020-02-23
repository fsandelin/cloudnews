var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  output: {
    path: path.resolve(__dirname, './build/dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  plugins: [
	new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: './src/assets/meta-info-europe-countries.min.json', to: 'meta-info-europe-countries.min.json' },
      { from: './src/assets/meta-info-sweden-counties.min.json', to: 'meta-info-sweden-counties.min.json' },
      { from: './src/assets/meta-info-sweden-municipalities.min.json', to: 'meta-info-sweden-municipalities.min.json' },
      { from: './src/assets/meta-info-sweden-cities.min.json', to: 'meta-info-sweden-cities.min.json' }
    ])
  ],
  module: {
    rules: [
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
      { test: /\.scss$/, use: ['vue-style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.sass$/, use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'] },
      { test: /\.vue$/, loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
        }
      },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.ANALYSE === 'true') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new BundleAnalyzerPlugin()
  ])
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'source-map';
  module.exports.mode = 'production';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new CopyWebpackPlugin([
      { from: './index.html', to: '../index.html' },
      { from: './static/favicon.png', to: '../static/favicon.png' }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        SOCKET_CONNECTION: '"true"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
