const Router = require('koa-router')
const { apiPrefix } = require('config')
const { proxy } = require('components')

const home = require('controllers/home')
const customRouter = require('./router')
const apiMap = require('lib/api-map')

const router = new Router()

const apiProxy = proxy({ map: apiMap })

router
  .get('/', home)
  .use(customRouter.routes())
  // api 自动代理到 java
  .all(`${apiPrefix}/(.*)`, async (ctx, next) => {
    const path = ctx.path
    // 自动代理
    if (path !== apiPrefix) {
      await apiProxy(ctx, next)
    }
  })

module.exports = router
