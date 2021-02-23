'use strict'

const path = require('path')
const fs = require('fs-extra')
const ip = require('dev-ip')
const yaml = require('js-yaml')
const Promise = require('bluebird')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

Promise.promisifyAll(fs)

const env = process.env.NODE_ENV || 'development'

const devIp = ip()[0]
const root = path.join(__dirname, '..')
const viewsPath = path.join(root, 'server/views')
const configPath = path.join(root, `config/webpack.config.${env}`)
const appConfigPath = path.join(root, 'config/app.yaml')

const config = require(configPath)
const appConfig = yaml.load(fs.readFileSync(appConfigPath))

const devPort = appConfig.server.devPort
const publicPath = (config.output.publicPath = `http://${devIp}:${devPort}/build/`)

fs.removeSync(viewsPath)

// 添加 webpack-dev-server 热启动入口
config.entry.app.unshift(
  `webpack-dev-server/client?http://localhost:${devPort}/`,
  'webpack/hot/dev-server'
)

const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {
  quiet: true,
  noInfo: true,
  compress: true,
  hot: true, // 启动 webpack-hot-middleware
  inline: true,
  disableHostCheck: true,
  publicPath,
  watchOptions: {
    aggregateTimeout: 300,
  },

  // 请求重定向：
  // http://${devIp}:${devPort}/build/* =>
  // http://${devIp}:${devPort}/webpack-dev-server/*
  proxy: {
    '/build': {
      target: `http://${devIp}:${devPort}/`,
      rewrite: req => {
        req.url = '/webpack-dev-server'
      },
    },
  },

  // 允许跨域
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'x-requested-with, content-type, Authorization',
  },
})

// 编译 webpack config 中。。。
compiler.plugin('compile', () => {
  console.log('webpack building...')
})

// webpack config 编译完成
compiler.plugin('done', stats => {
  const time = (stats.endTime - stats.startTime) / 1000

  // 编译出错
  if (stats.hasErrors()) {
    console.log('webpack build error')

    return console.log(
      stats.toString({
        colors: true,
        timings: false,
        hash: false,
        version: false,
        assets: false,
        reasons: false,
        chunks: false,
        children: false,
        chunkModules: false,
        modules: false,
      })
    )
  }

  const outputPath = config.output.path
  const assets = stats.compilation.assets

  // 将 html 的模板文件打包到 viewsPath 的目录下
  Promise.map(Object.keys(assets), file => {
    const asset = assets[file]
    const filePath = path.relative(outputPath, asset.existsAt)

    if (path.extname(filePath) === '.html') {
      const content = asset.source()
      const distPath = path.join(viewsPath, filePath)

      return fs.outputFileAsync(distPath, content)
    }
  }).then(() => {
    console.log(`webpack build success in ${time.toFixed(2)} s`)
  })
})

server.listen(devPort, null, () => {
  console.log(`webpack-dev-server started at localhost:${devPort}`)
})
