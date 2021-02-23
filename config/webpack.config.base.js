const path = require('path')
const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const root = path.join(__dirname, '../')
const srcPath = path.join(root, 'client')
const buildPath = path.join(root, 'build')
const env = process.env.NODE_ENV || 'development'

const isProd = env === 'production'

let webpackConfig = {
  context: srcPath,
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(srcPath, 'src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) && !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.less$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 小于8k的图片自动转成base64格式
              outputPath: 'images/' //图片打包后的文件夹
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 处理 .vue
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all' // todo:
    }
  }
}

module.exports = webpackConfig