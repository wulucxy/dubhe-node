const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const fs = require('fs-extra')
const yaml = require('js-yaml')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const baseConfig = require('./webpack.config.base')

const root = path.join(__dirname, '../')
const isProd = process.env.NODE_ENV === 'production'

const appConfigPath = path.join(root, 'config/app.yaml')
const appConfig = yaml.load(fs.readFileSync(appConfigPath)) || {}
const pkgJSON = require('../package.json')

const appName = appConfig.appCode.toLowerCase()
const buildPath = path.join(root, `build/${appName}/static`)
const publicPath = `/${appName}/static/`

const config = {
  mode: 'production',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: buildPath,
    publicPath: publicPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    hashDigestLength: 22
  },
  plugins: [
     // 每次 build 清空 output 目录
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      chunksSortMode: 'none'
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash:22].css'
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all' // todo:
    }
  }
}
module.exports = merge(baseConfig, config)
