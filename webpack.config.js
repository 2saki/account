var path = require('path')
var webpack = require('webpack')

module.exports = {
  main: {
    devtool: 'cheap-module-eval-source-map',
    entry: [
      './public/javascripts/main'
    ],
    debug:true,
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'main.js',
      publicPath: '/static/'
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          include: __dirname,
          query: {
            presets:['react','es2015']
          }
        }
      ]
    }
  },
  users: {
    devtool: 'cheap-module-eval-source-map',
    entry: [
      './public/javascripts/users'
    ],
    debug:true,
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'users.js',
      publicPath: '/static/'
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          include: __dirname,
          query: {
            presets:['react','es2015']
          }
        }
      ]
    }
  }
}
