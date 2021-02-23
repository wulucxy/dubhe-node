// 代理中间件
const assert = require('assert')
const request = require('./request')

module.exports = options => {
  assert(options, 'arguments options is required!')
  const { map } = options
  assert(typeof map === 'function', 'arguments map must be function!')
  return async (ctx, next) => {
    const { axios } = ctx
    assert(typeof axios === 'function', 'ctx.axios invaild')
    const opts = {
      url: map(ctx.path),
      axios,
    }
    ctx.body = await request(opts)(ctx)
    if (typeof next === 'function') {
      await next()
    }
  }
}
