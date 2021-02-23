/* eslint-disable no-console */
'use strict'

const path = require('path')
const fs = require('fs-extra')
const ip = require('dev-ip')
const yaml = require('js-yaml')
const webpack = require('webpack')
const Promise = require('bluebird')

Promise.promisifyAll(fs)

console.log('start building...')

const startTime = Date.now()
let env = process.env.NODE_ENV || 'development'

console.log(`using ${env} config`)

const devIp = ip()[0]
const root = path.join(__dirname, '..')
const viewsPath = path.join(root, 'server/views')
const configPath = path.join(root, `config/webpack.config.${env}`)
const appConfigPath = path.join(root, 'config/app.yaml')

const config = require(configPath)
const appConfig = yaml.load(fs.readFileSync(appConfigPath))
const serverConfig = appConfig.server

const buildPath = config.output.path

Promise.resolve()
  .then(() => {
    console.log('clean views and build path')

    // 清理 views && output.path
    return Promise.all([fs.remove(viewsPath), fs.remove(buildPath)])
  })
  .then(() => {
    console.log('webpack building...')

    const devPort = serverConfig.devPort

    if (env === 'development') {
      config.output.publicPath = `http://${devIp}:${devPort}/build/`
    }

    // webpack 编译
    return new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
          console.log(
            stats.toString({
              colors: true,
              timings: true,
              hash: true,
              version: true,
              errorDetails: true,
              assets: false,
              chunks: false,
              children: false,
              modules: false,
              chunkModules: false,
            })
          )

          return reject(err)
        }

        const time = (stats.endTime - stats.startTime) / 1000
        console.log('webpack stats:')
        const statsInfo = stats.toString({
          colors: true,
          timings: true,
          hash: true,
          version: true,
          assets: true,
          chunks: false,
          children: false,
          modules: false,
          chunkModules: false,
        })
        console.log(statsInfo)
        console.log(`webpack build success in ${time.toFixed(2)} s`)
        resolve()
      })
    })
  })
  .then(() => {
    const time = (Date.now() - startTime) / 1000
    console.log(`build success in ${time.toFixed(2)} s`)
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
