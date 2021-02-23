require('app-module-path/register')

const Koa = require('koa')
const path = require('path')
const nunjucks = require('koa-nunjucks-2')
const Promise = require('bluebird')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')

const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')

const axiosMiddleware = require('./middleware/axios')
const errorMiddleware = require('./middleware/error')
const router = require('./router')

Promise.config({
  warnings: false,
  longStackTraces: true,
})

global.Promise = Promise

const app = new Koa()

const config = require('./utils/config')
const isDev = app.env === 'development'
const port = config.server.port

app.name = 'koa2'
app.keys = ['koa2 boilerplate']

registerApp()

async function registerApp() {
  app.use(errorMiddleware())
  app.use(bodyParser())
  app.use(axiosMiddleware())

  app.use(
    nunjucks({
      ext: 'html',
      path: path.join(__dirname, 'views'),
      nunjucksConfig: {
        noCache: isDev,
        autoescape: true,
      },
    })
  )
  // cache
  app.use(serve(path.join(__dirname, '../build')))

  app.use(
    historyApiFallback({
      htmlAcceptHeaders: ['text/html'],
      index: '/',
      whiteList: ['/api'],
      verbose: !!isDev,
    })
  )
  // 路由配置
  app.use(router.routes(), router.allowedMethods())

  // 监听端口
  app.listen(port, () => {
    console.info(`server started at localhost: ${port}`)
  })
}
