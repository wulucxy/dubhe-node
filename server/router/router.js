const Router = require('koa-router')
const appConfig = require('config')

const { apiPrefix } = appConfig

// 路由定义
const router = new Router({ prefix: apiPrefix })
router.get('/export', require('controllers/export'))

module.exports = router
