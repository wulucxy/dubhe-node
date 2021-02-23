const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const baseConfig = require('./webpack.config.base')

const root = path.join(__dirname, '../')
const buildPath = path.join(root, 'build')
const isProd = process.env.NODE_ENV === 'production'

const config = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    app: ['./src/main.js']
  },
  output: {
    pathinfo: true,
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 开启热重载
    new webpack.optimize.ModuleConcatenationPlugin(), // 开启作用域提升
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html'
    }),
  ]
}

module.exports = merge(baseConfig, config)
